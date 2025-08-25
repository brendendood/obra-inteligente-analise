/**
 * Import Checker - Verificador de Referências para Candidatos ao Arquivamento
 * MODO: NON-INVASIVE (Apenas análise, sem alterações)
 * 
 * Este script verifica se arquivos candidatos ao arquivamento ainda são
 * referenciados no código, ajudando a decidir se é seguro movê-los.
 */

import { Project, SyntaxKind, ImportDeclaration } from 'ts-morph';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface ImportReference {
  importingFile: string;
  importedPath: string;
  importLine: number;
  importText: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  reasoning: string;
}

interface ArchiveCandidateStatus {
  candidatePath: string;
  category: string;
  totalReferences: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  safeToArchive: boolean;
  references: ImportReference[];
  alternativePath?: string;
}

interface CheckReport {
  summary: {
    totalCandidates: number;
    safeToArchive: number;
    requiresAnalysis: number;
    blockedByReferences: number;
  };
  candidatesByCategory: Record<string, ArchiveCandidateStatus[]>;
  detailedFindings: ArchiveCandidateStatus[];
}

class ImportChecker {
  private project: Project;
  private report: CheckReport;

  // Candidatos baseados em SOFT_ARCHIVE_CANDIDATES.md
  private archiveCandidates = [
    // Páginas Legacy (Alta Prioridade)
    { path: 'src/pages/Projects.tsx', category: 'legacy-pages', alternative: 'src/pages/Dashboard.tsx' },
    { path: 'src/pages/ProjectsPage.tsx', category: 'legacy-pages', alternative: 'src/pages/Dashboard.tsx' },
    { path: 'src/pages/ProjectsList.tsx', category: 'legacy-pages', alternative: 'src/pages/Dashboard.tsx' },
    
    // Componentes Duplicados
    { path: 'src/components/ui/glowing-effect-card.tsx', category: 'duplicate-components', alternative: 'src/components/ui/glowing-effect.tsx' },
    { path: 'src/components/ui/typewriter.tsx', category: 'unused-components', alternative: 'custom implementation if needed' },
    { path: 'src/components/ui/footer-section.tsx', category: 'unused-components', alternative: 'create new footer when needed' },
    
    // Hooks Removidos (CRÍTICO)
    { path: 'src/hooks/useProjectSync.ts', category: 'removed-hooks', alternative: 'useUnifiedProjectStore + React Query' },
    { path: 'src/hooks/useGeolocationCapture.tsx', category: 'removed-hooks', alternative: 'native browser geolocation' },
    { path: 'src/hooks/useProjectSyncManager.tsx', category: 'removed-hooks', alternative: 'simple sync patterns' },
    
    // Estrutura App/ (Template)
    { path: 'src/app', category: 'template-directories', alternative: 'src/pages/ structure' },
    { path: 'src/app/admin/crm/page.tsx', category: 'template-files', alternative: 'src/pages/AdminPanel.tsx' },
    { path: 'src/app/crm/page.tsx', category: 'duplicate-files', alternative: 'src/pages/CRMPage.tsx' },
    
    // Stores Legacy (CRÍTICO)
    { path: 'src/stores/projectStore.ts', category: 'legacy-stores', alternative: 'src/stores/unifiedProjectStore.ts' },
    
    // Componentes Suspeitos (Média Prioridade)
    { path: 'src/components/ui/menubar.tsx', category: 'suspicious-components', alternative: 'verify need before use' },
    { path: 'src/components/ui/navigation-menu.tsx', category: 'suspicious-components', alternative: 'implement proper navigation' },
    { path: 'src/components/ui/pagination.tsx', category: 'suspicious-components', alternative: 'implement when needed' },
    { path: 'src/components/ui/breadcrumb.tsx', category: 'suspicious-components', alternative: 'plan consistent navigation' },
    
    // Utilitários Especializados
    { path: 'src/components/ui/chart.tsx', category: 'specialized-utils', alternative: 'validate with real data' },
    { path: 'src/lib/constants.ts', category: 'low-usage-libs', alternative: 'verify current values' },
    { path: 'src/lib/validations.ts', category: 'potential-duplicates', alternative: 'consolidate with Zod schemas' },
  ];

  constructor() {
    this.project = new Project({
      tsConfigFilePath: './tsconfig.json',
    });
    
    this.report = {
      summary: {
        totalCandidates: 0,
        safeToArchive: 0,
        requiresAnalysis: 0,
        blockedByReferences: 0,
      },
      candidatesByCategory: {},
      detailedFindings: [],
    };
  }

  /**
   * Executa verificação completa de imports
   */
  async runImportCheck(): Promise<CheckReport> {
    console.log('🔍 Iniciando verificação de imports para candidatos ao arquivamento...\n');

    // Carregar arquivos fonte
    this.project.addSourceFilesAtPaths('src/**/*.{ts,tsx}');
    const sourceFiles = this.project.getSourceFiles();

    console.log(`📁 Analisando ${sourceFiles.length} arquivos...\n`);

    // Verificar cada candidato
    for (const candidate of this.archiveCandidates) {
      const status = await this.checkCandidateReferences(candidate, sourceFiles);
      this.report.detailedFindings.push(status);
      
      // Agrupar por categoria
      if (!this.report.candidatesByCategory[candidate.category]) {
        this.report.candidatesByCategory[candidate.category] = [];
      }
      this.report.candidatesByCategory[candidate.category].push(status);
    }

    // Calcular estatísticas
    this.calculateSummary();
    
    // Gerar relatório
    this.generateReport();
    
    return this.report;
  }

  /**
   * Verifica referências para um candidato específico
   */
  private async checkCandidateReferences(
    candidate: { path: string; category: string; alternative?: string },
    sourceFiles: any[]
  ): Promise<ArchiveCandidateStatus> {
    const references: ImportReference[] = [];
    
    // Padrões de import a procurar
    const importPatterns = [
      new RegExp(`from ['"]@/${candidate.path.replace('src/', '')}['"]`, 'g'),
      new RegExp(`from ['"]\\.\\.?/${candidate.path.split('/').pop()}['"]`, 'g'),
      new RegExp(`import.*${candidate.path.split('/').pop()?.replace(/\.(ts|tsx)$/, '')}`, 'g'),
    ];

    for (const sourceFile of sourceFiles) {
      const filePath = sourceFile.getFilePath();
      
      // Não verificar o próprio arquivo
      if (filePath.includes(candidate.path)) continue;
      
      const imports = sourceFile.getImportDeclarations();
      
      for (const importDecl of imports) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();
        const importText = importDecl.getText();
        const lineNumber = importDecl.getStartLineNumber();
        
        // Verificar se importa o candidato
        if (this.isImportingCandidate(moduleSpecifier, candidate.path)) {
          const riskLevel = this.assessImportRisk(candidate.category, moduleSpecifier);
          
          references.push({
            importingFile: filePath,
            importedPath: moduleSpecifier,
            importLine: lineNumber,
            importText: importText,
            riskLevel,
            reasoning: this.getImportRiskReasoning(candidate.category, riskLevel),
          });
        }
      }
    }

    const riskLevel = this.assessOverallRisk(candidate.category, references.length);
    const safeToArchive = references.length === 0 && riskLevel !== 'critical';

    return {
      candidatePath: candidate.path,
      category: candidate.category,
      totalReferences: references.length,
      riskLevel,
      safeToArchive,
      references,
      alternativePath: candidate.alternative,
    };
  }

  /**
   * Verifica se um import está referenciando o candidato
   */
  private isImportingCandidate(moduleSpecifier: string, candidatePath: string): boolean {
    const candidateFile = candidatePath.replace('src/', '').replace(/\.(ts|tsx)$/, '');
    
    // Verificar import direto
    if (moduleSpecifier.includes(candidateFile)) return true;
    
    // Verificar import de diretório (para src/app/)
    if (candidatePath.includes('src/app') && moduleSpecifier.includes('app/')) return true;
    
    return false;
  }

  /**
   * Avalia o risco de um import específico
   */
  private assessImportRisk(category: string, moduleSpecifier: string): 'critical' | 'high' | 'medium' | 'low' {
    // Hooks removidos são sempre críticos
    if (category === 'removed-hooks') return 'critical';
    
    // Stores legacy são críticos
    if (category === 'legacy-stores') return 'critical';
    
    // Páginas legacy são de risco alto
    if (category === 'legacy-pages') return 'high';
    
    // Duplicatas são de risco médio
    if (category.includes('duplicate')) return 'medium';
    
    // Templates e suspeitos são baixo risco
    return 'low';
  }

  /**
   * Avalia o risco geral de um candidato
   */
  private assessOverallRisk(category: string, referenceCount: number): 'critical' | 'high' | 'medium' | 'low' {
    // Qualquer referência a hooks removidos é crítica
    if (category === 'removed-hooks' && referenceCount > 0) return 'critical';
    
    // Store legacy com referências é crítico
    if (category === 'legacy-stores' && referenceCount > 0) return 'critical';
    
    // Muitas referências = alto risco
    if (referenceCount > 10) return 'high';
    if (referenceCount > 5) return 'medium';
    if (referenceCount > 0) return 'low';
    
    return 'low';
  }

  /**
   * Retorna explicação do risco
   */
  private getImportRiskReasoning(category: string, riskLevel: string): string {
    const reasons = {
      'removed-hooks': 'Hook foi removido por causar problemas - import pode quebrar funcionalidade',
      'legacy-stores': 'Store foi substituído - pode causar conflitos de estado',
      'legacy-pages': 'Página foi substituída - routing pode estar duplicado',
      'duplicate-components': 'Componente duplicado - consolidar em versão única',
      'template-files': 'Arquivo template não integrado - verificar necessidade',
      'unused-components': 'Componente não utilizado - confirmar se é necessário',
      'suspicious-components': 'Componente de baixo uso - verificar implementação',
      'specialized-utils': 'Utilitário especializado - validar integração',
    };
    
    return reasons[category as keyof typeof reasons] || 'Verificar uso e necessidade';
  }

  /**
   * Calcula estatísticas do relatório
   */
  private calculateSummary(): void {
    this.report.summary.totalCandidates = this.report.detailedFindings.length;
    
    for (const finding of this.report.detailedFindings) {
      if (finding.safeToArchive) {
        this.report.summary.safeToArchive++;
      } else if (finding.riskLevel === 'critical' || finding.totalReferences > 0) {
        this.report.summary.blockedByReferences++;
      } else {
        this.report.summary.requiresAnalysis++;
      }
    }
  }

  /**
   * Gera relatório detalhado
   */
  private generateReport(): void {
    console.log('📊 === IMPORT CHECK REPORT ===');
    console.log(`📁 Total de candidatos analisados: ${this.report.summary.totalCandidates}`);
    console.log(`✅ Seguros para arquivar: ${this.report.summary.safeToArchive}`);
    console.log(`⚠️ Requerem análise: ${this.report.summary.requiresAnalysis}`);
    console.log(`🚫 Bloqueados por referências: ${this.report.summary.blockedByReferences}`);
    console.log('');

    // Relatório por categoria
    console.log('📋 Por categoria:');
    Object.entries(this.report.candidatesByCategory).forEach(([category, candidates]) => {
      const safeCount = candidates.filter(c => c.safeToArchive).length;
      const totalCount = candidates.length;
      console.log(`  ${category}: ${safeCount}/${totalCount} seguros para arquivar`);
    });

    // Casos críticos
    const criticalCases = this.report.detailedFindings.filter(f => f.riskLevel === 'critical');
    if (criticalCases.length > 0) {
      console.log('\n🚨 CASOS CRÍTICOS:');
      criticalCases.forEach(c => {
        console.log(`  ${c.candidatePath}: ${c.totalReferences} referências críticas`);
      });
    }

    // Salvar relatório em arquivo
    const reportPath = join(__dirname, '../../docs/refactor', `import-check-report-${new Date().toISOString().split('T')[0]}.json`);
    writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
    
    console.log(`\n📄 Relatório detalhado salvo em: ${reportPath}`);
    console.log(`\n🚀 Para arquivar seguros: npm run archive:safe-candidates`);
    console.log(`🔍 Para analisar bloqueados: npm run analyze:blocked-candidates`);
  }
}

// Executar verificação se chamado diretamente
if (require.main === module) {
  const checker = new ImportChecker();
  
  checker.runImportCheck()
    .then(() => {
      console.log('\n✅ Verificação de imports concluída com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erro durante verificação:', error);
      process.exit(1);
    });
}

export { ImportChecker, ArchiveCandidateStatus, CheckReport };