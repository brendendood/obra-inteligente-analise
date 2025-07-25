
import { BudgetPDFGenerator } from './BudgetPDFGenerator';
import { SchedulePDFGenerator } from './SchedulePDFGenerator';
import { CombinedPDFGenerator } from './CombinedPDFGenerator';
import { PDFExportOptions } from './BasePDFGenerator';
import { BudgetData } from '../budgetGenerator';
import { ScheduleData } from '@/types/project';

export type { PDFExportOptions } from './BasePDFGenerator';

export const generateProjectPDF = async (
  type: 'budget' | 'schedule' | 'combined',
  data: { budget?: BudgetData; schedule?: ScheduleData },
  options: PDFExportOptions
): Promise<void> => {
  console.log('🔄 Iniciando geração de PDF...', { type, hasData: !!data, options });
  let pdfBuffer: Uint8Array;

  try {
    switch (type) {
      case 'budget':
        console.log('📊 Gerando PDF de orçamento...', { hasBudget: !!data.budget });
        if (!data.budget) throw new Error('Budget data is required');
        const budgetGenerator = new BudgetPDFGenerator();
        console.log('⚙️ Criando BudgetPDFGenerator...');
        pdfBuffer = await budgetGenerator.generateBudgetPDF(data.budget, options);
        console.log('✅ PDF de orçamento gerado com sucesso');
        break;
      case 'schedule':
        console.log('📅 Gerando PDF de cronograma...', { hasSchedule: !!data.schedule });
        if (!data.schedule) throw new Error('Schedule data is required');
        const scheduleGenerator = new SchedulePDFGenerator();
        console.log('⚙️ Criando SchedulePDFGenerator...');
        pdfBuffer = await scheduleGenerator.generateSchedulePDF(data.schedule, options);
        console.log('✅ PDF de cronograma gerado com sucesso');
        break;
      case 'combined':
        console.log('🔄 Gerando PDF combinado...', { hasBudget: !!data.budget, hasSchedule: !!data.schedule });
        if (!data.budget || !data.schedule) throw new Error('Both budget and schedule data are required');
        const combinedGenerator = new CombinedPDFGenerator();
        console.log('⚙️ Criando CombinedPDFGenerator...');
        pdfBuffer = await combinedGenerator.generateCombinedProjectReport(data.budget, data.schedule, options);
        console.log('✅ PDF combinado gerado com sucesso');
        break;
      default:
        throw new Error('Invalid PDF type');
    }

    console.log('📂 Iniciando download do PDF...', { bufferSize: pdfBuffer.length });
    
    // Download do arquivo
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${options.projectName}-${type}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log(`✅ PDF ${type} gerado e baixado com sucesso para ${options.projectName}`);
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    console.error('🔍 Detalhes do erro:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type,
      data: {
        hasBudget: !!data?.budget,
        hasSchedule: !!data?.schedule,
        budgetItemsCount: data?.budget?.items?.length || 0
      }
    });
    throw error;
  }
};
