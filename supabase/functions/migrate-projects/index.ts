
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mesmas funções utilitárias da upload-project
const generateAutomaticBudget = (area: number, projectType: string) => {
  const complexity = area > 200 ? 'alta' : area > 100 ? 'média' : 'baixa';
  
  const baseCosts = {
    baixa: { foundation: 150, structure: 320, masonry: 85.50, installations: 205, finishes: 180 },
    média: { foundation: 180, structure: 380, masonry: 95.50, installations: 245, finishes: 220 },
    alta: { foundation: 220, structure: 450, masonry: 110.50, installations: 290, finishes: 280 }
  };
  
  const costs = baseCosts[complexity];
  
  const items = [
    {
      id: crypto.randomUUID(),
      codigo: 'SINAPI-73935',
      descricao: 'Fundação e movimentação de terra',
      unidade: 'm²',
      quantidade: area * 0.8,
      preco_unitario: costs.foundation,
      categoria: 'Fundação',
      ambiente: 'Geral'
    },
    {
      id: crypto.randomUUID(),
      codigo: 'SINAPI-88489',
      descricao: 'Estrutura de concreto armado',
      unidade: 'm³',
      quantidade: area * 0.15,
      preco_unitario: costs.structure,
      categoria: 'Estrutura',
      ambiente: 'Geral'
    },
    {
      id: crypto.randomUUID(),
      codigo: 'SINAPI-74209',
      descricao: 'Alvenaria de vedação',
      unidade: 'm²',
      quantidade: area * 0.9,
      preco_unitario: costs.masonry,
      categoria: 'Alvenaria',
      ambiente: 'Geral'
    },
    {
      id: crypto.randomUUID(),
      codigo: 'SINAPI-88309',
      descricao: 'Instalações completas',
      unidade: 'm²',
      quantidade: area,
      preco_unitario: costs.installations,
      categoria: 'Instalações',
      ambiente: 'Geral'
    },
    {
      id: crypto.randomUUID(),
      codigo: 'SINAPI-74158',
      descricao: 'Acabamentos e revestimentos',
      unidade: 'm²',
      quantidade: area,
      preco_unitario: costs.finishes,
      categoria: 'Acabamentos',
      ambiente: 'Geral'
    }
  ];

  const itemsWithTotals = items.map(item => ({
    ...item,
    total: item.quantidade * item.preco_unitario
  }));

  const subtotal = itemsWithTotals.reduce((acc, item) => acc + item.total, 0);
  const bdi = 0.28;
  const totalComBdi = subtotal * (1 + bdi);

  return {
    data_referencia: new Date().toLocaleDateString('pt-BR'),
    total: subtotal,
    total_com_bdi: totalComBdi,
    bdi,
    totalArea: area,
    items: itemsWithTotals
  };
};

const generateProjectSchedule = (area: number, projectType: string) => {
  const complexity = area > 200 ? 'alta' : area > 100 ? 'média' : 'baixa';
  
  const baseDurations = {
    baixa: { fundacao: 14, estrutura: 21, alvenaria: 18, instalacoes: 15, acabamento: 20 },
    média: { fundacao: 18, estrutura: 28, alvenaria: 24, instalacoes: 21, acabamento: 28 },
    alta: { fundacao: 25, estrutura: 35, alvenaria: 30, instalacoes: 28, acabamento: 35 }
  };
  
  const durations = baseDurations[complexity];
  let currentDate = new Date();
  
  const tasks = [];
  
  // Fundação
  const fundacaoStart = new Date(currentDate);
  const fundacaoEnd = new Date(currentDate.getTime() + durations.fundacao * 24 * 60 * 60 * 1000);
  tasks.push({
    id: '1',
    name: 'Fundação e Movimentação de Terra',
    startDate: fundacaoStart.toISOString().split('T')[0],
    endDate: fundacaoEnd.toISOString().split('T')[0],
    duration: durations.fundacao,
    category: 'estrutura',
    progress: 0
  });
  
  // Estrutura
  currentDate = new Date(fundacaoEnd);
  const estruturaEnd = new Date(currentDate.getTime() + durations.estrutura * 24 * 60 * 60 * 1000);
  tasks.push({
    id: '2',
    name: 'Estrutura e Lajes',
    startDate: currentDate.toISOString().split('T')[0],
    endDate: estruturaEnd.toISOString().split('T')[0],
    duration: durations.estrutura,
    category: 'estrutura',
    progress: 0,
    dependencies: ['1']
  });
  
  // Alvenaria
  currentDate = new Date(estruturaEnd);
  const alvenariaEnd = new Date(currentDate.getTime() + durations.alvenaria * 24 * 60 * 60 * 1000);
  tasks.push({
    id: '3',
    name: 'Alvenaria e Vedação',
    startDate: currentDate.toISOString().split('T')[0],
    endDate: alvenariaEnd.toISOString().split('T')[0],
    duration: durations.alvenaria,
    category: 'alvenaria',
    progress: 0,
    dependencies: ['2']
  });
  
  // Instalações
  const instalacaoStart = new Date(currentDate.getTime() + (durations.alvenaria * 0.7) * 24 * 60 * 60 * 1000);
  const instalacaoEnd = new Date(instalacaoStart.getTime() + durations.instalacoes * 24 * 60 * 60 * 1000);
  tasks.push({
    id: '4',
    name: 'Instalações Hidráulicas e Elétricas',
    startDate: instalacaoStart.toISOString().split('T')[0],
    endDate: instalacaoEnd.toISOString().split('T')[0],
    duration: durations.instalacoes,
    category: 'instalacoes',
    progress: 0,
    dependencies: ['3']
  });
  
  // Acabamentos
  const acabamentoStart = new Date(Math.max(alvenariaEnd.getTime(), instalacaoEnd.getTime()));
  const acabamentoEnd = new Date(acabamentoStart.getTime() + durations.acabamento * 24 * 60 * 60 * 1000);
  tasks.push({
    id: '5',
    name: 'Acabamentos e Pintura',
    startDate: acabamentoStart.toISOString().split('T')[0],
    endDate: acabamentoEnd.toISOString().split('T')[0],
    duration: durations.acabamento,
    category: 'acabamento',
    progress: 0,
    dependencies: ['3', '4']
  });
  
  const totalDuration = Object.values(durations).reduce((sum, dur) => sum + dur, 0);
  
  return {
    projectArea: area,
    total_duration: totalDuration,
    start_date: tasks[0].startDate,
    end_date: tasks[tasks.length - 1].endDate,
    tasks,
    phases: [
      { name: 'Fundação', duration: durations.fundacao, status: 'planned' },
      { name: 'Estrutura', duration: durations.estrutura, status: 'planned' },
      { name: 'Alvenaria', duration: durations.alvenaria, status: 'planned' },
      { name: 'Instalações', duration: durations.instalacoes, status: 'planned' },
      { name: 'Acabamentos', duration: durations.acabamento, status: 'planned' }
    ]
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔄 Migrate projects function called')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ User authenticated:', user.email)

    // Buscar projetos que NÃO têm budget_data ou schedule_data
    const { data: projectsToMigrate, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)

    if (fetchError) {
      console.error('❌ Error fetching projects:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch projects' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const projectsNeedingMigration = projectsToMigrate.filter(project => {
      const analysisData = project.analysis_data || {};
      const hasBudget = analysisData.budget_data && analysisData.budget_data.total_com_bdi;
      const hasSchedule = analysisData.schedule_data && analysisData.schedule_data.total_duration;
      return !hasBudget || !hasSchedule;
    });

    console.log(`📊 Found ${projectsNeedingMigration.length} projects needing migration`);

    const results = [];

    for (const project of projectsNeedingMigration) {
      console.log(`🔄 Migrating project: ${project.name}`);
      
      const area = project.total_area || 100;
      const projectType = project.project_type || 'Residencial';
      
      // Gerar dados de orçamento e cronograma
      const budgetData = generateAutomaticBudget(area, projectType);
      const scheduleData = generateProjectSchedule(area, projectType);
      
      // Manter dados existentes e adicionar os novos
      const existingAnalysisData = project.analysis_data || {};
      const updatedAnalysisData = {
        ...existingAnalysisData,
        budget_data: {
          data_referencia: budgetData.data_referencia,
          total: budgetData.total,
          total_com_bdi: budgetData.total_com_bdi,
          bdi: budgetData.bdi,
          totalArea: budgetData.totalArea,
          items: budgetData.items
        },
        schedule_data: {
          projectArea: scheduleData.projectArea,
          total_duration: scheduleData.total_duration,
          start_date: scheduleData.start_date,
          end_date: scheduleData.end_date,
          tasks: scheduleData.tasks,
          phases: scheduleData.phases
        },
        migrated_at: new Date().toISOString(),
        migration_version: '2.0'
      };

      // Atualizar projeto
      const { data: updatedProject, error: updateError } = await supabase
        .from('projects')
        .update({
          analysis_data: updatedAnalysisData,
          estimated_budget: budgetData.total_com_bdi
        })
        .eq('id', project.id)
        .select()
        .single();

      if (updateError) {
        console.error(`❌ Error updating project ${project.name}:`, updateError);
        results.push({
          projectId: project.id,
          projectName: project.name,
          success: false,
          error: updateError.message
        });
      } else {
        console.log(`✅ Successfully migrated project: ${project.name}`);
        results.push({
          projectId: project.id,
          projectName: project.name,
          success: true,
          budgetTotal: budgetData.total_com_bdi,
          scheduleDuration: scheduleData.total_duration
        });
      }
    }

    console.log('🎉 Migration completed');

    return new Response(
      JSON.stringify({
        success: true,
        message: `Migration completed for ${projectsNeedingMigration.length} projects`,
        results,
        summary: {
          totalProjectsFound: projectsToMigrate.length,
          projectsMigrated: projectsNeedingMigration.length,
          successfulMigrations: results.filter(r => r.success).length,
          failedMigrations: results.filter(r => !r.success).length
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('💥 Migration error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
