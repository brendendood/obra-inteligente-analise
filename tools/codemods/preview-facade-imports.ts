#!/usr/bin/env npx ts-node

/**
 * Preview Facade Imports Transformation (DRY-RUN ONLY)
 * 
 * Analisa arquivos TypeScript e mostra quais imports seriam migrados para facades,
 * sem fazer alterações reais. Gera relatório detalhado para revisão manual.
 */

import { promises as fs } from 'fs';
import { join } from 'path';

interface ImportCandidate {
  file: string;
  line: number;
  currentImport: string;
  suggestedImport: string;
  confidence: 'high' | 'medium' | 'low';
  risk: 'low' | 'medium' | 'high';
  category: 'utils' | 'validation' | 'sanitization' | 'plans' | 'budget' | 'agents' | 'security';
  exports: string[];
}

interface DryRunReport {
  timestamp: string;
  scope: string;
  totalFiles: number;
  totalImports: number;
  candidates: ImportCandidate[];
  summary: {
    byCategory: Record<string, number>;
    byConfidence: Record<string, number>;
    byRisk: Record<string, number>;
  };
  top10Frequent: Array<{
    pattern: string;
    count: number;
    files: string[];
  }>;
}

// Patterns para detectar imports candidatos a migração
const UTILS_PATTERNS = [
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/utils\/authValidation['"]/g,
    target: '@/facades/core',
    category: 'validation' as const,
    confidence: 'high' as const,
    risk: 'low' as const
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/utils\/contentSanitizer['"]/g,
    target: '@/facades/core',
    category: 'sanitization' as const,
    confidence: 'high' as const,
    risk: 'low' as const
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/utils\/planUtils['"]/g,
    target: '@/facades/core',
    category: 'plans' as const,
    confidence: 'high' as const,
    risk: 'low' as const
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/utils\/budgetGenerator['"]/g,
    target: '@/facades/projects',
    category: 'budget' as const,
    confidence: 'high' as const,
    risk: 'low' as const
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/utils\/securityValidation['"]/g,
    target: '@/facades/core',
    category: 'security' as const,
    confidence: 'high' as const,
    risk: 'low' as const
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/utils\/agents\/([^'"]+)['"]/g,
    target: '@/facades/agents',
    category: 'agents' as const,
    confidence: 'medium' as const,
    risk: 'medium' as const
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/utils\/secureN8NService['"]/g,
    target: '@/facades/agents',
    category: 'agents' as const,
    confidence: 'high' as const,
    risk: 'low' as const
  }
];

async function findTypescriptFiles(baseDir: string): Promise<string[]> {
  try {
    const result: string[] = [];
    
    async function scanDir(dir: string) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await scanDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          result.push(fullPath);
        }
      }
    }
    
    await scanDir(baseDir);
    return result;
  } catch (error) {
    console.error('❌ Erro ao buscar arquivos:', error);
    return [];
  }
}

async function analyzeFile(filePath: string): Promise<ImportCandidate[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const candidates: ImportCandidate[] = [];

    lines.forEach((line, index) => {
      UTILS_PATTERNS.forEach(({ pattern, target, category, confidence, risk }) => {
        const matches = [...line.matchAll(pattern)];
        
        matches.forEach(match => {
          const [fullMatch, exports] = match;
          const exportList = exports.split(',').map(e => e.trim());
          
          candidates.push({
            file: filePath,
            line: index + 1,
            currentImport: fullMatch.trim(),
            suggestedImport: `import { ${exports} } from '${target}';`,
            confidence,
            risk,
            category,
            exports: exportList
          });
        });
      });
    });

    return candidates;
  } catch (error) {
    console.error(`❌ Erro ao analisar ${filePath}:`, error);
    return [];
  }
}

function generateTop10Frequent(candidates: ImportCandidate[]): Array<{
  pattern: string;
  count: number;
  files: string[];
}> {
  const patterns = new Map<string, { count: number; files: Set<string> }>();
  
  candidates.forEach(candidate => {
    const basePattern = candidate.currentImport.replace(/import\s*{\s*[^}]+\s*}/, 'import { ... }');
    
    if (!patterns.has(basePattern)) {
      patterns.set(basePattern, { count: 0, files: new Set() });
    }
    
    const entry = patterns.get(basePattern)!;
    entry.count++;
    entry.files.add(candidate.file);
  });
  
  return Array.from(patterns.entries())
    .map(([pattern, data]) => ({
      pattern,
      count: data.count,
      files: Array.from(data.files)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function generateSummary(candidates: ImportCandidate[]) {
  const byCategory: Record<string, number> = {};
  const byConfidence: Record<string, number> = {};
  const byRisk: Record<string, number> = {};
  
  candidates.forEach(candidate => {
    byCategory[candidate.category] = (byCategory[candidate.category] || 0) + 1;
    byConfidence[candidate.confidence] = (byConfidence[candidate.confidence] || 0) + 1;
    byRisk[candidate.risk] = (byRisk[candidate.risk] || 0) + 1;
  });
  
  return { byCategory, byConfidence, byRisk };
}

async function generateMarkdownReport(report: DryRunReport): Promise<string> {
  const date = new Date().toLocaleDateString('pt-BR');
  const time = new Date().toLocaleTimeString('pt-BR');
  
  let markdown = `# 🔍 PILOTO UTILS - DRY-RUN REPORT\n\n`;
  markdown += `**Data:** ${date} às ${time}\n`;
  markdown += `**Escopo:** \`${report.scope}\`\n`;
  markdown += `**Modo:** 🔒 **READ-ONLY** (nenhum arquivo alterado)\n\n`;
  
  markdown += `## 📊 Resumo Executivo\n\n`;
  markdown += `- **Arquivos analisados:** ${report.totalFiles}\n`;
  markdown += `- **Imports encontrados:** ${report.totalImports}\n`;
  markdown += `- **Candidatos a migração:** ${report.candidates.length}\n\n`;
  
  markdown += `### 📋 Distribuição por Categoria\n`;
  Object.entries(report.summary.byCategory).forEach(([category, count]) => {
    markdown += `- **${category}**: ${count} imports\n`;
  });
  
  markdown += `\n### 🎯 Distribuição por Confiança\n`;
  Object.entries(report.summary.byConfidence).forEach(([confidence, count]) => {
    const emoji = confidence === 'high' ? '🟢' : confidence === 'medium' ? '🟡' : '🔴';
    markdown += `- ${emoji} **${confidence}**: ${count} imports\n`;
  });
  
  markdown += `\n### ⚠️ Distribuição por Risco\n`;
  Object.entries(report.summary.byRisk).forEach(([risk, count]) => {
    const emoji = risk === 'low' ? '🟢' : risk === 'medium' ? '🟡' : '🔴';
    markdown += `- ${emoji} **${risk}**: ${count} imports\n`;
  });
  
  markdown += `\n## 🏆 TOP 10 IMPORTS MAIS FREQUENTES\n\n`;
  report.top10Frequent.forEach((item, index) => {
    markdown += `### ${index + 1}. ${item.pattern}\n`;
    markdown += `- **Ocorrências:** ${item.count}\n`;
    markdown += `- **Arquivos:** ${item.files.length}\n\n`;
    
    if (item.files.length <= 5) {
      markdown += `**Arquivos envolvidos:**\n`;
      item.files.forEach(file => {
        markdown += `- \`${file}\`\n`;
      });
    } else {
      markdown += `**Primeiros arquivos:**\n`;
      item.files.slice(0, 5).forEach(file => {
        markdown += `- \`${file}\`\n`;
      });
      markdown += `- ... e mais ${item.files.length - 5} arquivos\n`;
    }
    markdown += `\n`;
  });
  
  markdown += `## 📝 DIFFS SIMULADOS (TOP 5)\n\n`;
  
  const top5Candidates = report.candidates
    .filter(c => c.confidence === 'high')
    .slice(0, 5);
    
  top5Candidates.forEach((candidate, index) => {
    markdown += `### ${index + 1}. \`${candidate.file}:${candidate.line}\`\n\n`;
    markdown += `**Categoria:** ${candidate.category} | **Confiança:** ${candidate.confidence} | **Risco:** ${candidate.risk}\n\n`;
    markdown += `\`\`\`diff\n`;
    markdown += `- ${candidate.currentImport}\n`;
    markdown += `+ ${candidate.suggestedImport}\n`;
    markdown += `\`\`\`\n\n`;
    markdown += `**Exports migrados:** \`${candidate.exports.join(', ')}\`\n\n`;
  });
  
  markdown += `## 📂 ORDEM SUGERIDA DE APLICAÇÃO\n\n`;
  
  markdown += `### 🟢 **Fase 1: High Confidence + Low Risk (Recomendado iniciar)**\n`;
  const phase1 = report.candidates.filter(c => c.confidence === 'high' && c.risk === 'low');
  markdown += `- **Candidatos:** ${phase1.length}\n`;
  markdown += `- **Categorias:** ${[...new Set(phase1.map(c => c.category))].join(', ')}\n`;
  markdown += `- **Risco estimado:** 🟢 Muito baixo\n\n`;
  
  markdown += `### 🟡 **Fase 2: Medium Confidence (Após validação)**\n`;
  const phase2 = report.candidates.filter(c => c.confidence === 'medium');
  markdown += `- **Candidatos:** ${phase2.length}\n`;
  markdown += `- **Categorias:** ${[...new Set(phase2.map(c => c.category))].join(', ')}\n`;
  markdown += `- **Risco estimado:** 🟡 Baixo a médio\n\n`;
  
  markdown += `### 🔴 **Fase 3: High Risk (Requer revisão manual)**\n`;
  const phase3 = report.candidates.filter(c => c.risk === 'high');
  markdown += `- **Candidatos:** ${phase3.length}\n`;
  markdown += `- **Categorias:** ${[...new Set(phase3.map(c => c.category))].join(', ')}\n`;
  markdown += `- **Risco estimado:** 🔴 Alto\n\n`;
  
  markdown += `## ✅ CHECKLIST PÓS-ANÁLISE\n\n`;
  markdown += `- [x] ✅ **Nenhum arquivo de produção alterado**\n`;
  markdown += `- [x] ✅ **Modo read-only confirmado**\n`;
  markdown += `- [x] ✅ **Nenhuma dependência adicionada**\n`;
  markdown += `- [x] ✅ **Relatório gerado com sucesso**\n\n`;
  
  markdown += `## 🚀 PRÓXIMOS PASSOS\n\n`;
  markdown += `1. **Revisar** este relatório e aprovar as migrações de maior confiança\n`;
  markdown += `2. **Executar** Fase 1 (high confidence + low risk) primeiro\n`;
  markdown += `3. **Validar** que tudo funciona antes de prosseguir\n`;
  markdown += `4. **Aplicar** fases subsequentes gradualmente\n\n`;
  
  markdown += `---\n\n`;
  markdown += `*Gerado automaticamente pelo sistema de codemods MadenAI em ${date} às ${time}*\n`;
  
  return markdown;
}

async function main() {
  console.log('🔍 Iniciando análise dry-run do domínio utils...\n');
  
  const scope = 'src/**/*.{ts,tsx} (exceto src/utils)';
  const files = await findTypescriptFiles('src');
  
  // Filtrar para excluir arquivos de src/utils (analisamos apenas importadores)
  const filteredFiles = files.filter(file => !file.includes('src/utils/'));
  
  console.log(`📁 Encontrados ${filteredFiles.length} arquivos TypeScript para análise`);
  
  const allCandidates: ImportCandidate[] = [];
  
  for (const file of filteredFiles) {
    const candidates = await analyzeFile(file);
    allCandidates.push(...candidates);
    
    if (candidates.length > 0) {
      console.log(`   📄 ${file} - ${candidates.length} imports candidatos`);
    }
  }
  
  console.log(`\n✅ Análise concluída! ${allCandidates.length} candidatos encontrados\n`);
  
  const report: DryRunReport = {
    timestamp: new Date().toISOString(),
    scope,
    totalFiles: filteredFiles.length,
    totalImports: allCandidates.length,
    candidates: allCandidates,
    summary: generateSummary(allCandidates),
    top10Frequent: generateTop10Frequent(allCandidates)
  };
  
  // Gerar relatório em markdown
  const markdownReport = await generateMarkdownReport(report);
  const reportPath = `docs/refactor/PILOT_UTILS_DRYRUN_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.md`;
  
  await fs.writeFile(reportPath, markdownReport, 'utf-8');
  
  console.log(`📋 Relatório gerado: ${reportPath}`);
  console.log('🔒 Modo READ-ONLY: nenhum arquivo de produção foi alterado');
  
  // Exibir resumo no console
  console.log('\n📊 RESUMO RÁPIDO:');
  console.log(`   📁 Arquivos: ${report.totalFiles}`);
  console.log(`   📝 Imports: ${report.totalImports}`);
  console.log(`   🎯 Candidatos: ${report.candidates.length}`);
  console.log(`   🟢 Alta confiança: ${report.summary.byConfidence.high || 0}`);
  console.log(`   🟡 Média confiança: ${report.summary.byConfidence.medium || 0}`);
  console.log(`   🔴 Baixa confiança: ${report.summary.byConfidence.low || 0}`);
}

if (require.main === module) {
  main().catch(console.error);
}

export { main as previewFacadeImports };