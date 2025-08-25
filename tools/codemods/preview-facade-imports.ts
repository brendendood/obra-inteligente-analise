/**
 * Codemod Preview - Facade Imports Transformation
 * MODO: PREVIEW-ONLY (dry-run, nenhuma mudança aplicada)
 * 
 * Este script analisa arquivos e mostra quais imports seriam transformados
 * para usar facades e barrels, sem aplicar as mudanças.
 */

import { Project, SyntaxKind, ImportDeclaration, SourceFile } from 'ts-morph';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface TransformationPreview {
  filePath: string;
  currentImport: string;
  newImport: string;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}

interface PreviewSummary {
  totalFiles: number;
  totalTransformations: number;
  byPhase: Record<string, number>;
  byConfidence: Record<string, number>;
  transformations: TransformationPreview[];
}

class FacadeImportsPreview {
  private project: Project;
  private summary: PreviewSummary;

  constructor() {
    this.project = new Project({
      tsConfigFilePath: './tsconfig.json',
    });
    
    this.summary = {
      totalFiles: 0,
      totalTransformations: 0,
      byPhase: {},
      byConfidence: { high: 0, medium: 0, low: 0 },
      transformations: [],
    };
  }

  /**
   * Executa preview completo de todas as fases
   */
  async runFullPreview(): Promise<PreviewSummary> {
    console.log('🔍 Iniciando preview de transformações...\n');

    // Carregar arquivos fonte
    this.project.addSourceFilesAtPaths('src/**/*.{ts,tsx}');
    const sourceFiles = this.project.getSourceFiles();
    this.summary.totalFiles = sourceFiles.length;

    console.log(`📁 Analisando ${sourceFiles.length} arquivos...\n`);

    // Executar preview por fase
    await this.previewPhase1_UI(sourceFiles);
    await this.previewPhase2_Libs(sourceFiles);
    await this.previewPhase3_Agents(sourceFiles);
    await this.previewPhase4_Projects(sourceFiles);

    // Gerar relatório
    this.generateReport();
    
    return this.summary;
  }

  /**
   * Fase 1: UI Components → Barrel
   */
  private async previewPhase1_UI(sourceFiles: SourceFile[]): Promise<void> {
    console.log('🎨 === FASE 1: UI COMPONENTS → BARREL ===');
    
    const uiImportPatterns = [
      { pattern: /@\/components\/ui\/button/, newImport: '@/components/ui', exports: ['Button'] },
      { pattern: /@\/components\/ui\/card/, newImport: '@/components/ui', exports: ['Card', 'CardContent', 'CardDescription', 'CardFooter', 'CardHeader', 'CardTitle'] },
      { pattern: /@\/components\/ui\/input/, newImport: '@/components/ui', exports: ['Input'] },
      { pattern: /@\/components\/ui\/dialog/, newImport: '@/components/ui', exports: ['Dialog', 'DialogContent', 'DialogDescription', 'DialogFooter', 'DialogHeader', 'DialogTitle', 'DialogTrigger'] },
      { pattern: /@\/components\/ui\/table/, newImport: '@/components/ui', exports: ['Table', 'TableBody', 'TableCaption', 'TableCell', 'TableHead', 'TableHeader', 'TableRow'] },
    ];

    let phaseCount = 0;
    
    for (const sourceFile of sourceFiles) {
      const imports = sourceFile.getImportDeclarations();
      
      for (const importDecl of imports) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();
        
        for (const pattern of uiImportPatterns) {
          if (pattern.pattern.test(moduleSpecifier)) {
            const namedImports = importDecl.getNamedImports().map(imp => imp.getName());
            
            this.summary.transformations.push({
              filePath: sourceFile.getFilePath(),
              currentImport: importDecl.getText(),
              newImport: `import { ${namedImports.join(', ')} } from '${pattern.newImport}';`,
              confidence: 'high',
              reasoning: `Componente shadcn/ui bem estabelecido, barrel existe e foi testado`
            });
            
            phaseCount++;
            this.summary.byConfidence.high++;
          }
        }
      }
    }
    
    this.summary.byPhase['Fase 1: UI Components'] = phaseCount;
    console.log(`✅ Encontradas ${phaseCount} transformações UI\n`);
  }

  /**
   * Fase 2: Libs e Utils → Barrels
   */
  private async previewPhase2_Libs(sourceFiles: SourceFile[]): Promise<void> {
    console.log('📚 === FASE 2: LIBS E UTILS → BARRELS ===');
    
    const libPatterns = [
      { pattern: /@\/lib\/utils/, newImport: '@/lib', commonExports: ['cn'] },
      { pattern: /@\/hooks\/use-toast/, newImport: '@/hooks', commonExports: ['useToast'] },
      { pattern: /@\/hooks\/useProjectNavigation/, newImport: '@/hooks', commonExports: ['useProjectNavigation'] },
    ];

    let phaseCount = 0;
    
    for (const sourceFile of sourceFiles) {
      const imports = sourceFile.getImportDeclarations();
      
      for (const importDecl of imports) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();
        
        for (const pattern of libPatterns) {
          if (pattern.pattern.test(moduleSpecifier)) {
            const namedImports = importDecl.getNamedImports().map(imp => imp.getName());
            
            // Verificar se todos os imports estão disponíveis no barrel
            const confidence = namedImports.every(imp => pattern.commonExports.includes(imp)) ? 'high' : 'medium';
            
            this.summary.transformations.push({
              filePath: sourceFile.getFilePath(),
              currentImport: importDecl.getText(),
              newImport: `import { ${namedImports.join(', ')} } from '${pattern.newImport}';`,
              confidence,
              reasoning: confidence === 'high' 
                ? `Função bem conhecida, barrel re-exporta corretamente`
                : `Verificar se barrel re-exporta: ${namedImports.join(', ')}`
            });
            
            phaseCount++;
            this.summary.byConfidence[confidence]++;
          }
        }
      }
    }
    
    this.summary.byPhase['Fase 2: Libs e Utils'] = phaseCount;
    console.log(`✅ Encontradas ${phaseCount} transformações Libs/Utils\n`);
  }

  /**
   * Fase 3: Agents e Integrations → Facades
   */
  private async previewPhase3_Agents(sourceFiles: SourceFile[]): Promise<void> {
    console.log('🤖 === FASE 3: AGENTS E INTEGRATIONS → FACADES ===');
    
    const agentPatterns = [
      { pattern: /@\/utils\/agents\/unifiedAgentService/, newImport: '@/facades/agents', commonExports: ['sendMessageToAgent'] },
      { pattern: /@\/utils\/agents\/agentTypes/, newImport: '@/facades/agents', commonExports: ['AgentType', 'AgentResponse', 'RichAgentContext'] },
      { pattern: /@\/utils\/secureN8NService/, newImport: '@/facades/agents', commonExports: ['SecureN8NService'] },
      { pattern: /@\/integrations\/supabase\/client/, newImport: '@/facades/integrations', commonExports: ['supabase'] },
      { pattern: /@\/integrations\/supabase\/types/, newImport: '@/facades/integrations', commonExports: ['Database'] },
    ];

    let phaseCount = 0;
    
    for (const sourceFile of sourceFiles) {
      const imports = sourceFile.getImportDeclarations();
      
      for (const importDecl of imports) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();
        
        for (const pattern of agentPatterns) {
          if (pattern.pattern.test(moduleSpecifier)) {
            const namedImports = importDecl.getNamedImports().map(imp => imp.getName());
            const defaultImport = importDecl.getDefaultImport()?.getName();
            
            // Para agents, ser mais conservador
            const confidence = 'medium';
            
            let newImportText = '';
            if (namedImports.length > 0) {
              newImportText = `import { ${namedImports.join(', ')} } from '${pattern.newImport}';`;
            }
            if (defaultImport) {
              newImportText = `import ${defaultImport} from '${pattern.newImport}';`;
            }
            
            this.summary.transformations.push({
              filePath: sourceFile.getFilePath(),
              currentImport: importDecl.getText(),
              newImport: newImportText,
              confidence,
              reasoning: `API crítica - requer validação extensa pós-transformação`
            });
            
            phaseCount++;
            this.summary.byConfidence[confidence]++;
          }
        }
      }
    }
    
    this.summary.byPhase['Fase 3: Agents e Integrations'] = phaseCount;
    console.log(`✅ Encontradas ${phaseCount} transformações Agents/Integrations\n`);
  }

  /**
   * Fase 4: Projects → Facades (Crítica)
   */
  private async previewPhase4_Projects(sourceFiles: SourceFile[]): Promise<void> {
    console.log('📂 === FASE 4: PROJECTS → FACADES (CRÍTICA) ===');
    
    const projectPatterns = [
      { pattern: /@\/stores\/unifiedProjectStore/, newImport: '@/facades/projects', commonExports: ['useUnifiedProjectStore'] },
      { pattern: /@\/types\/project/, newImport: '@/facades/projects', commonExports: ['Project'] },
    ];

    let phaseCount = 0;
    
    for (const sourceFile of sourceFiles) {
      const imports = sourceFile.getImportDeclarations();
      
      for (const importDecl of imports) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();
        
        for (const pattern of projectPatterns) {
          if (pattern.pattern.test(moduleSpecifier)) {
            const namedImports = importDecl.getNamedImports().map(imp => imp.getName());
            
            // Fase crítica - sempre low confidence para review manual
            const confidence = 'low';
            
            this.summary.transformations.push({
              filePath: sourceFile.getFilePath(),
              currentImport: importDecl.getText(),
              newImport: `import { ${namedImports.join(', ')} } from '${pattern.newImport}';`,
              confidence,
              reasoning: `CRÍTICO: Core business logic - requer review manual obrigatório`
            });
            
            phaseCount++;
            this.summary.byConfidence[confidence]++;
          }
        }
      }
    }
    
    this.summary.byPhase['Fase 4: Projects (Crítica)'] = phaseCount;
    console.log(`✅ Encontradas ${phaseCount} transformações Projects (CRÍTICAS)\n`);
  }

  /**
   * Gera relatório detalhado
   */
  private generateReport(): void {
    this.summary.totalTransformations = this.summary.transformations.length;

    // Relatório no console
    console.log('📊 === SUMMARY REPORT ===');
    console.log(`📁 Total de arquivos analisados: ${this.summary.totalFiles}`);
    console.log(`🔄 Total de transformações encontradas: ${this.summary.totalTransformations}`);
    console.log('');
    console.log('📋 Por fase:');
    Object.entries(this.summary.byPhase).forEach(([phase, count]) => {
      console.log(`  ${phase}: ${count} transformações`);
    });
    console.log('');
    console.log('🎯 Por confiança:');
    console.log(`  🟢 Alta (high): ${this.summary.byConfidence.high} - Seguras para aplicar`);
    console.log(`  🟡 Média (medium): ${this.summary.byConfidence.medium} - Requer validação`);
    console.log(`  🔴 Baixa (low): ${this.summary.byConfidence.low} - Review manual obrigatório`);

    // Salvar relatório em arquivo
    const reportPath = join(__dirname, '../../docs/refactor', `codemod-preview-${new Date().toISOString().split('T')[0]}.json`);
    writeFileSync(reportPath, JSON.stringify(this.summary, null, 2));
    
    console.log(`\n📄 Relatório detalhado salvo em: ${reportPath}`);
    console.log(`\n🚀 Para aplicar transformações: npm run codemod:apply <fase>`);
    console.log(`🔙 Para rollback: npm run codemod:rollback <fase>`);
  }
}

// Executar preview se chamado diretamente
if (require.main === module) {
  const preview = new FacadeImportsPreview();
  
  preview.runFullPreview()
    .then(() => {
      console.log('\n✅ Preview concluído com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erro durante preview:', error);
      process.exit(1);
    });
}

export { FacadeImportsPreview, TransformationPreview, PreviewSummary };