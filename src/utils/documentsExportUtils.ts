
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProjectDocument } from '@/types/document';
import { supabase } from '@/integrations/supabase/client';
import { createPDFWithMadenAIBrand, createStyledTable } from './pdfExportUtils';

export const exportDocumentsReport = async (
  documents: ProjectDocument[],
  projectName: string
) => {
  try {
    const doc = createPDFWithMadenAIBrand({
      title: 'RELATÓRIO DE DOCUMENTOS',
      subtitle: 'Inventário completo dos documentos técnicos do projeto',
      projectName: projectName,
    });

    // Resumo por categoria
    const categories = documents.reduce((acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = { count: 0, totalSize: 0 };
      }
      acc[doc.category].count += 1;
      acc[doc.category].totalSize += doc.file_size;
      return acc;
    }, {} as Record<string, { count: number; totalSize: number }>);

    // Informações básicas
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total de Documentos: ${documents.length}`, 20, 90);
    
    const totalSize = documents.reduce((sum, doc) => sum + doc.file_size, 0);
    doc.text(`Tamanho Total: ${formatBytes(totalSize)}`, 120, 90);

    // Tabela de documentos
    const tableData = documents.map(doc => [
      doc.file_name,
      getCategoryLabel(doc.category),
      doc.file_type.toUpperCase(),
      formatBytes(doc.file_size),
      new Date(doc.uploaded_at).toLocaleDateString('pt-BR')
    ]);

    const finalY = createStyledTable(
      doc,
      ['Nome do Arquivo', 'Categoria', 'Tipo', 'Tamanho', 'Data Upload'],
      tableData,
      100
    );

    // Resumo por categoria
    const summaryData = Object.entries(categories).map(([category, data]) => ({
      label: `${getCategoryLabel(category)}:`,
      value: `${data.count} arquivo${data.count !== 1 ? 's' : ''} (${formatBytes(data.totalSize)})`
    }));

    if (summaryData.length > 0) {
      doc.addPage();
      doc.text('RESUMO POR CATEGORIA', 20, 50);
      
      let currentY = 70;
      summaryData.forEach(item => {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(item.label, 25, currentY);
        
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'bold');
        const valueWidth = doc.getTextWidth(item.value);
        doc.text(item.value, doc.internal.pageSize.width - valueWidth - 25, currentY);
        doc.setFont('helvetica', 'normal');
        
        currentY += 12;
      });
    }

    const filename = `Relatorio_Documentos_${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Erro ao exportar relatório de documentos:', error);
    return { success: false, error: 'Erro ao gerar relatório' };
  }
};

export const exportAllDocumentsAsZip = async (
  documents: ProjectDocument[],
  projectName: string
) => {
  try {
    const zip = new JSZip();
    
    // Criar pastas por categoria
    const folders = {
      plantas: zip.folder('01_Plantas_e_Desenhos'),
      rrts: zip.folder('02_RRTs_e_ARTs'),
      licencas: zip.folder('03_Licencas_e_Aprovacoes'),
      memoriais: zip.folder('04_Memoriais_Descritivos'),
      outros: zip.folder('05_Outros_Documentos')
    };

    // Download e organização dos arquivos
    for (const doc of documents) {
      try {
        const { data, error } = await supabase.storage
          .from('project-documents')
          .download(doc.file_path);

        if (error) throw error;

        const folder = folders[doc.category as keyof typeof folders];
        if (folder) {
          folder.file(doc.file_name, data);
        }
      } catch (error) {
        console.error(`Erro ao baixar ${doc.file_name}:`, error);
      }
    }

    // Gerar arquivo README
    const readmeContent = `
DOCUMENTOS DO PROJETO: ${projectName}
=====================================

Data de exportação: ${new Date().toLocaleDateString('pt-BR')}
Total de documentos: ${documents.length}

ESTRUTURA DE PASTAS:
-------------------
01_Plantas_e_Desenhos/     - Plantas baixas, cortes, fachadas
02_RRTs_e_ARTs/            - Registros de Responsabilidade Técnica
03_Licencas_e_Aprovacoes/  - Alvarás e licenças municipais  
04_Memoriais_Descritivos/  - Memoriais técnicos e especificações
05_Outros_Documentos/      - Contratos e documentos diversos

RESUMO POR CATEGORIA:
-------------------
${Object.entries(documents.reduce((acc, doc) => {
  if (!acc[doc.category]) acc[doc.category] = 0;
  acc[doc.category]++;
  return acc;
}, {} as Record<string, number>)).map(([category, count]) => 
  `${getCategoryLabel(category)}: ${count} arquivo${count !== 1 ? 's' : ''}`
).join('\n')}

Exportado com tecnologia MadenAI
`;

    zip.file('README.txt', readmeContent);

    // Gerar e baixar o ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    const filename = `Documentos_${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.zip`;
    saveAs(content, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Erro ao exportar documentos como ZIP:', error);
    return { success: false, error: 'Erro ao gerar arquivo ZIP' };
  }
};

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getCategoryLabel = (category: string): string => {
  const labels = {
    plantas: 'Plantas e Desenhos',
    rrts: 'RRTs e ARTs',
    licencas: 'Licenças e Aprovações',
    memoriais: 'Memoriais Descritivos',
    outros: 'Outros Documentos'
  };
  return labels[category as keyof typeof labels] || category;
};
