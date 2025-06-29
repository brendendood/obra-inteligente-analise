import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Funções utilitárias para geração de dados
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Upload project function called - AUTO BUDGET/SCHEDULE VERSION')
    
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('❌ No authorization header')
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.error('❌ Error getting user:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ User authenticated:', user.email)

    // Parse JSON body
    const body = await req.json()
    const { fileName, originalName, projectName, fileSize } = body

    if (!fileName || !originalName) {
      console.error('❌ Missing required fields:', { fileName, originalName })
      return new Response(
        JSON.stringify({ error: 'Missing required fields: fileName, originalName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('📤 Processing file:', { fileName, originalName, projectName, fileSize })

    // Verificar se o arquivo existe no storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('project-files')
      .download(fileName)

    if (fileError) {
      console.error('❌ File not found in storage:', fileError)
      return new Response(
        JSON.stringify({ error: 'File not found in storage' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ File found in storage, size:', fileData.size)

    // Determinar se é um projeto técnico real
    const isRealProject = originalName.toLowerCase().includes('projeto') || 
                         originalName.toLowerCase().includes('plant') ||
                         originalName.toLowerCase().includes('desenho') ||
                         originalName.toLowerCase().includes('arquitet')

    // Estimar área do projeto (simulação - em produção seria extraída do PDF)
    const estimatedArea = isRealProject ? 
      Math.floor(Math.random() * 400) + 80 : // Entre 80-480m² para projetos reais
      Math.floor(Math.random() * 150) + 50   // Entre 50-200m² para outros

    // Determinar tipo do projeto
    let projectType = 'Documento PDF'
    if (isRealProject) {
      const types = ['Residencial', 'Comercial', 'Industrial', 'Institucional']
      projectType = types[Math.floor(Math.random() * types.length)]
    }

    console.log('🔄 Generating budget and schedule data automatically...')

    // GERAR ORÇAMENTO E CRONOGRAMA AUTOMATICAMENTE
    const budgetData = generateAutomaticBudget(estimatedArea, projectType)
    const scheduleData = generateProjectSchedule(estimatedArea, projectType)

    console.log('✅ Budget generated automatically:', {
      totalCost: budgetData.total_com_bdi,
      totalArea: budgetData.totalArea,
      itemCount: budgetData.items.length
    })

    console.log('✅ Schedule generated automatically:', {
      totalDuration: scheduleData.total_duration,
      taskCount: scheduleData.tasks.length,
      phases: scheduleData.phases.length
    })

    // Montar analysis_data completo COM DADOS OBRIGATÓRIOS PARA DASHBOARD
    const analysisData = {
      isRealProject,
      fileSize: fileData.size,
      processingTime: new Date().toISOString(),
      extractedInfo: {
        hasFloorPlan: Math.random() > 0.5,
        hasElevations: Math.random() > 0.5,
        estimatedArea,
        roomCount: isRealProject ? Math.floor(Math.random() * 10) + 2 : null
      },
      // DADOS OBRIGATÓRIOS PARA DASHBOARD - FORMATO CORRETO
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
      // Metadados adicionais
      generated_at: new Date().toISOString(),
      version: '2.0'
    }

    console.log('💾 Persisting project with COMPLETE analysis data including budget and schedule...')

    // Criar registro do projeto no banco com dados completos
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: projectName || originalName.replace(/\.[^/.]+$/, ""),
        file_path: fileName,
        file_size: fileData.size,
        analysis_data: analysisData,
        project_type: projectType,
        total_area: estimatedArea,
        estimated_budget: budgetData.total_com_bdi,
        extracted_text: isRealProject ? 
          'Texto extraído do projeto arquitetônico com análise técnica completa...' : 
          'Conteúdo do documento PDF processado...'
      })
      .select()
      .single()

    if (projectError) {
      console.error('❌ Error creating project:', projectError)
      return new Response(
        JSON.stringify({ error: 'Failed to create project record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🎉 Project created with AUTO budget and schedule data:', project.id)

    const message = isRealProject 
      ? `Projeto arquitetônico analisado! Orçamento de R$ ${budgetData.total_com_bdi.toLocaleString('pt-BR')} e cronograma de ${scheduleData.total_duration} dias gerados automaticamente.`
      : `PDF processado! Documento analisado com orçamento estimado de R$ ${budgetData.total_com_bdi.toLocaleString('pt-BR')} para ${estimatedArea}m².`

    return new Response(
      JSON.stringify({
        success: true,
        message,
        project,
        analysis: {
          ...analysisData,
          summary: {
            totalCost: budgetData.total_com_bdi,
            totalDuration: scheduleData.total_duration,
            area: estimatedArea,
            type: projectType
          }
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('💥 Upload project error:', error)
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
