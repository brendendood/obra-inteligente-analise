
import { useState, useEffect } from 'react';
import { ReportFilters, ReportData } from '@/types/adminReports';
import { useReportDataLoader } from '@/hooks/useReportDataLoader';
import { generateAdminPDFReport, generateAdminCSVReport } from '@/utils/reportExportUtils';
import { useToast } from '@/hooks/use-toast';

export function useAdminReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date()
    },
    userPlan: 'all',
    projectType: 'all',
    aiUsage: false
  });

  const { loading, loadReportData } = useReportDataLoader();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      const data = await loadReportData(filters);
      setReportData(data);
    } catch (error) {
      console.error('❌ REPORTS: Erro ao carregar dados:', error);
      toast({
        title: "Erro ao carregar relatórios",
        description: "Não foi possível carregar os dados dos relatórios",
        variant: "destructive",
      });
    }
  };

  const updateFilters = (newFilters: Partial<ReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const exportReport = async (format: 'pdf' | 'csv', type: string, currentFilters: ReportFilters) => {
    try {
      console.log('📄 EXPORT: Iniciando exportação...', { format, type });

      if (format === 'pdf') {
        await generateAdminPDFReport(reportData, type, currentFilters);
      } else {
        await generateAdminCSVReport(reportData, type, currentFilters);
      }

      toast({
        title: "Relatório exportado",
        description: `Relatório ${format.toUpperCase()} gerado com sucesso`,
      });
    } catch (error) {
      console.error('❌ EXPORT: Erro na exportação:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o relatório",
        variant: "destructive",
      });
    }
  };

  return {
    reportData,
    loading,
    filters,
    updateFilters,
    exportReport,
    refreshData: loadData
  };
}
