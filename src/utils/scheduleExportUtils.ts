import * as XLSX from 'xlsx';
import { ScheduleData } from '@/types/project';

export const exportScheduleToExcel = (scheduleData: ScheduleData, projectName: string) => {
  try {
    const mainData = [
      ['CRONOGRAMA - MADEAI'],
      ['Projeto:', projectName],
      ['Duração:', `${scheduleData.totalDuration} dias`],
      [''],
      ['ID', 'Atividade', 'Categoria', 'Início', 'Fim', 'Duração'],
      ...scheduleData.tasks.map(task => [
        task.id, task.name, task.category, task.startDate, task.endDate, task.duration
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(mainData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cronograma');
    
    const filename = `Cronograma_${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    return { success: true, filename };
  } catch (error) {
    return { success: false, error: 'Erro ao gerar Excel' };
  }
};

export const exportScheduleToCSV = (scheduleData: ScheduleData, projectName: string) => {
  try {
    const BOM = '\uFEFF';
    const headers = ['ID', 'Atividade', 'Categoria', 'Início', 'Fim', 'Duração'];
    const rows = scheduleData.tasks.map(task => [
      task.id, `"${task.name}"`, task.category, task.startDate, task.endDate, task.duration
    ]);

    const csvContent = [
      `Cronograma - ${projectName};;;;;;`,
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Cronograma_${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    return { success: true, filename: link.download };
  } catch (error) {
    return { success: false, error: 'Erro ao gerar CSV' };
  }
};