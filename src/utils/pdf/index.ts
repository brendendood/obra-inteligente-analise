
import { BudgetPDFGenerator } from './BudgetPDFGenerator';
import { SchedulePDFGenerator } from './SchedulePDFGenerator';
import { CombinedPDFGenerator } from './CombinedPDFGenerator';
import { PDFExportOptions } from './BasePDFGenerator';
import { BudgetData } from '../budgetGenerator';
import { ScheduleData } from '@/types/project';

export { PDFExportOptions } from './BasePDFGenerator';

export const generateProjectPDF = async (
  type: 'budget' | 'schedule' | 'combined',
  data: { budget?: BudgetData; schedule?: ScheduleData },
  options: PDFExportOptions
): Promise<void> => {
  let pdfBuffer: Uint8Array;

  try {
    switch (type) {
      case 'budget':
        if (!data.budget) throw new Error('Budget data is required');
        const budgetGenerator = new BudgetPDFGenerator();
        pdfBuffer = await budgetGenerator.generateBudgetPDF(data.budget, options);
        break;
      case 'schedule':
        if (!data.schedule) throw new Error('Schedule data is required');
        const scheduleGenerator = new SchedulePDFGenerator();
        pdfBuffer = await scheduleGenerator.generateSchedulePDF(data.schedule, options);
        break;
      case 'combined':
        if (!data.budget || !data.schedule) throw new Error('Both budget and schedule data are required');
        const combinedGenerator = new CombinedPDFGenerator();
        pdfBuffer = await combinedGenerator.generateCombinedProjectReport(data.budget, data.schedule, options);
        break;
      default:
        throw new Error('Invalid PDF type');
    }

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

    console.log(`✅ PDF ${type} gerado com sucesso para ${options.projectName}`);
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    throw error;
  }
};
