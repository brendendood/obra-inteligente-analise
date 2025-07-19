
import { Project } from '@/types/project';

export interface BudgetItem {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  preco_unitario: number;
  total: number;
  categoria: string;
  ambiente: string;
  isAiGenerated: boolean;
  isCustom: boolean;
}

export interface BudgetData {
  data_referencia: string;
  total: number;
  bdi: number;
  total_com_bdi: number;
  totalArea: number;
  items: BudgetItem[];
}

export const generateAutomaticBudget = (project: Project): BudgetData => {
  const area = project.total_area || 100;
  const complexity = area > 200 ? 'alta' : area > 100 ? 'média' : 'baixa';
  
  const items: BudgetItem[] = [
    {
      id: crypto.randomUUID(),
      codigo: 'SINAPI-73935',
      descricao: 'Alvenaria de vedação de blocos cerâmicos furados',
      unidade: 'm²',
      quantidade: Math.ceil(area * 0.8),
      preco_unitario: 85.50,
      total: 0,
      categoria: 'Alvenaria',
      ambiente: 'Geral',
      isAiGenerated: true,
      isCustom: false
    },
    {
      id: crypto.randomUUID(),
      codigo: 'SINAPI-88489',
      descricao: 'Concreto estrutural para laje',
      unidade: 'm³',
      quantidade: Math.ceil(area * 0.15),
      preco_unitario: 320.00,
      total: 0,
      categoria: 'Estrutura',
      ambiente: 'Geral',
      isAiGenerated: true,
      isCustom: false
    },
    {
      id: crypto.randomUUID(),
      codigo: 'SINAPI-74209',
      descricao: 'Revestimento cerâmico para piso',
      unidade: 'm²',
      quantidade: Math.ceil(area * 0.9),
      preco_unitario: 45.80,
      total: 0,
      categoria: 'Revestimentos',
      ambiente: 'Geral',
      isAiGenerated: true,
      isCustom: false
    },
    {
      id: crypto.randomUUID(),
      codigo: 'SINAPI-88309',
      descricao: 'Pintura interna com tinta látex acrílica',
      unidade: 'm²',
      quantidade: Math.ceil(area * 2.5),
      preco_unitario: 12.50,
      total: 0,
      categoria: 'Pintura',
      ambiente: 'Geral',
      isAiGenerated: true,
      isCustom: false
    },
    {
      id: crypto.randomUUID(),
      codigo: 'SINAPI-74166',
      descricao: 'Instalação elétrica completa',
      unidade: 'm²',
      quantidade: Math.round(area),
      preco_unitario: 95.00,
      total: 0,
      categoria: 'Instalações',
      ambiente: 'Geral',
      isAiGenerated: true,
      isCustom: false
    },
    {
      id: crypto.randomUUID(),
      codigo: 'SINAPI-74158',
      descricao: 'Instalação hidráulica completa',
      unidade: 'm²',
      quantidade: Math.round(area),
      preco_unitario: 110.00,
      total: 0,
      categoria: 'Instalações',
      ambiente: 'Geral',
      isAiGenerated: true,
      isCustom: false
    }
  ];

  // Calcular totais
  const itemsWithTotals = items.map(item => ({
    ...item,
    total: item.quantidade * item.preco_unitario
  }));

  const subtotal = itemsWithTotals.reduce((acc, item) => acc + item.total, 0);
  const bdi = 0.28; // 28% de BDI padrão
  const totalComBdi = subtotal * (1 + bdi);

  return {
    data_referencia: new Date().toLocaleDateString('pt-BR'),
    total: subtotal,
    bdi,
    total_com_bdi: totalComBdi,
    totalArea: area,
    items: itemsWithTotals
  };
};
