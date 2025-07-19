
import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types/project';
import { generateAutomaticBudget, BudgetData, BudgetItem } from '@/utils/budgetGenerator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useBudgetLogic = (project: Project, onBudgetGenerated?: (budget: BudgetData) => void) => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Load persisted data from database
  useEffect(() => {
    if (project?.analysis_data?.budget_data) {
      console.log('💰 ORÇAMENTO: Carregando dados persistidos do projeto:', project.name);
      setBudgetData(project.analysis_data.budget_data);
      console.log('✅ ORÇAMENTO: Dados carregados do banco:', {
        total: project.analysis_data.budget_data.total_com_bdi,
        items: project.analysis_data.budget_data.items?.length || 0
      });
    }
  }, [project]);

  // Save budget to database
  const saveBudgetToDatabase = async (budget: BudgetData) => {
    try {
      console.log('💾 ORÇAMENTO: Salvando no banco de dados...');
      
      const updatedAnalysisData = {
        ...project.analysis_data,
        budget_data: budget,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('projects')
        .update({ 
          analysis_data: updatedAnalysisData,
          estimated_budget: budget.total_com_bdi
        })
        .eq('id', project.id);

      if (error) {
        console.error('❌ Erro ao salvar orçamento:', error);
      } else {
        console.log('✅ Orçamento salvo no banco com sucesso');
      }
    } catch (error) {
      console.error('💥 Erro ao persistir orçamento:', error);
    }
  };

  const generateBudget = useCallback(async () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate generation progress
    const steps = [
      { progress: 20, message: 'Analisando projeto...' },
      { progress: 40, message: 'Consultando tabela SINAPI...' },
      { progress: 60, message: 'Calculando quantitativos...' },
      { progress: 80, message: 'Aplicando preços...' },
      { progress: 100, message: 'Finalizando orçamento...' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Generate automatic budget
        const generatedBudget = generateAutomaticBudget(project);
        setBudgetData(generatedBudget);
        
        // Save to database
        saveBudgetToDatabase(generatedBudget);
        
        setIsGenerating(false);
        
        toast({
          title: "✅ Orçamento gerado e salvo!",
          description: `Orçamento baseado na tabela SINAPI criado para ${project.name} (${project.total_area}m²).`,
        });

        if (onBudgetGenerated) {
          onBudgetGenerated(generatedBudget);
        }
      }
    }, 500);
  }, [project, onBudgetGenerated, toast]);

  const updateItem = (id: string, updates: Partial<BudgetItem>) => {
    setBudgetData((prevData) => {
      if (!prevData) return null;
      
      const updatedItems = prevData.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          // Garantir que quantidade seja sempre inteira
          if (updatedItem.quantidade !== undefined) {
            updatedItem.quantidade = Math.round(updatedItem.quantidade);
          }
          updatedItem.total = updatedItem.quantidade * updatedItem.preco_unitario;
          return updatedItem;
        }
        return item;
      });
      
      const newTotal = updatedItems.reduce((acc, item) => acc + item.total, 0);
      const newTotalComBDI = newTotal * (1 + prevData.bdi);

      const updatedBudget = {
        ...prevData,
        total: newTotal,
        total_com_bdi: newTotalComBDI,
        items: updatedItems,
      };

      // Save changes to database
      saveBudgetToDatabase(updatedBudget);
      
      return updatedBudget;
    });
  };

  const removeItem = (id: string) => {
    setBudgetData((prevData) => {
      if (!prevData) return null;
      const updatedItems = prevData.items.filter((item) => item.id !== id);

      const newTotal = updatedItems.reduce((acc, item) => acc + item.total, 0);
      const newTotalComBDI = newTotal * (1 + prevData.bdi);

      const updatedBudget = {
        ...prevData,
        total: newTotal,
        total_com_bdi: newTotalComBDI,
        items: updatedItems,
      };

      // Save changes to database
      saveBudgetToDatabase(updatedBudget);

      return updatedBudget;
    });
  };

  const addNewItem = (newItem: Omit<BudgetItem, 'id' | 'total'>) => {
    setBudgetData((prevData) => {
      if (!prevData) return null;
      
      const newItemWithId: BudgetItem = {
        id: crypto.randomUUID(),
        ...newItem,
        // Garantir que quantidade seja sempre inteira
        quantidade: Math.round(newItem.quantidade),
        total: Math.round(newItem.quantidade) * newItem.preco_unitario,
      };
      
      const updatedItems = [...prevData.items, newItemWithId];
      const newTotal = updatedItems.reduce((acc, item) => acc + item.total, 0);
      const newTotalComBDI = newTotal * (1 + prevData.bdi);

      const updatedBudget = {
        ...prevData,
        total: newTotal,
        total_com_bdi: newTotalComBDI,
        items: updatedItems,
      };

      // Save changes to database
      saveBudgetToDatabase(updatedBudget);

      return updatedBudget;
    });
  };

  return {
    budgetData,
    isGenerating,
    progress,
    generateBudget,
    updateItem,
    removeItem,
    addNewItem
  };
};
