
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { question, projectId } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get project data
    const { data: project } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return new Response(
        JSON.stringify({ error: 'Project not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Save user message
    await supabaseClient
      .from('project_conversations')
      .insert({
        project_id: projectId,
        message: question,
        sender: 'user'
      })

    // Generate AI response based on project context
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    let aiResponse = ''

    if (openaiApiKey) {
      const systemPrompt = `Você é um assistente IA especializado em engenharia civil e arquitetura. 
      Responda baseado nos dados do projeto específico fornecido.
      
      DADOS DO PROJETO:
      ${project.extracted_text}
      
      ANÁLISES DISPONÍVEIS:
      ${JSON.stringify(project.analysis_data, null, 2)}
      
      Responda de forma técnica e precisa, sempre referenciando os dados específicos do projeto.
      Use emojis e formatação markdown para melhor visualização.`

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: question }
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        })

        const data = await response.json()
        aiResponse = data.choices[0].message.content
      } catch (error) {
        console.error('OpenAI API error:', error)
        // Fallback to contextual responses
        aiResponse = generateContextualResponse(question, project)
      }
    } else {
      // Generate contextual response based on project data
      aiResponse = generateContextualResponse(question, project)
    }

    // Save AI response
    await supabaseClient
      .from('project_conversations')
      .insert({
        project_id: projectId,
        message: aiResponse,
        sender: 'assistant'
      })

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateContextualResponse(question: string, project: any): string {
  const lowerQuestion = question.toLowerCase()
  const analysisData = project.analysis_data || {}
  const rooms = analysisData.rooms || []
  const materials = analysisData.materials || {}

  if (lowerQuestion.includes('área') || lowerQuestion.includes('m²')) {
    if (lowerQuestion.includes('total')) {
      return `📐 **Área total do projeto:** ${project.total_area}m²\n\n**Distribuição por ambiente:**\n${rooms.map(room => `• ${room.name}: ${room.area}m²`).join('\n')}\n\n💡 **Dica:** Área bem distribuída para projeto residencial.`
    }
    
    if (lowerQuestion.includes('banheiro')) {
      const bathrooms = rooms.filter(room => room.name.includes('Banheiro'))
      return `🚿 **Banheiros identificados:**\n${bathrooms.map(room => `• ${room.name}: ${room.area}m²`).join('\n')}\n\n🎨 **Recomendação:** Usar cerâmica antiderrapante no piso.`
    }
    
    if (lowerQuestion.includes('quarto') || lowerQuestion.includes('dormitório')) {
      const bedrooms = rooms.filter(room => room.name.includes('Dormitório') || room.name.includes('Suíte'))
      return `🛏️ **Dormitórios do projeto:**\n${bedrooms.map(room => `• ${room.name}: ${room.area}m²`).join('\n')}\n\n📋 **Análise:** Suíte com área adequada, dormitórios secundários bem dimensionados.`
    }
  }

  if (lowerQuestion.includes('material') || lowerQuestion.includes('quantidade')) {
    if (lowerQuestion.includes('alvenaria')) {
      const alvenaria = materials.alvenaria
      return `🧱 **Alvenaria:** ${alvenaria?.quantity}${alvenaria?.unit} - ${alvenaria?.description}\n\n💡 **Dica:** Adicionar 5% para perdas e recortes.`
    }
    
    if (lowerQuestion.includes('concreto')) {
      const concreto = materials.concreto
      return `🏗️ **Concreto:** ${concreto?.quantity}${concreto?.unit} - ${concreto?.description}\n\n⚠️ **Importante:** Volume para fundações e estrutura. Considerar bombeamento se necessário.`
    }
    
    if (lowerQuestion.includes('ferro') || lowerQuestion.includes('aço')) {
      const aco = materials.aco
      return `🔩 **Aço estrutural:** ${aco?.quantity}${aco?.unit} - ${aco?.description}\n\n📋 **Especificação:** Inclui barras longitudinais e estribos conforme projeto estrutural.`
    }
  }

  if (lowerQuestion.includes('estrutura') || lowerQuestion.includes('fundação')) {
    return `🏗️ **Sistema estrutural identificado:**\n• **Fundações:** Sapatas isoladas\n• **Estrutura:** Concreto armado\n• **Cobertura:** Estrutura de madeira com telha cerâmica\n\n⚠️ **Importante:** Verificar características do solo local.`
  }

  if (lowerQuestion.includes('instalação') || lowerQuestion.includes('hidráulica') || lowerQuestion.includes('elétrica')) {
    return `⚡ **Instalações previstas:**\n• **Elétrica:** Padrão residencial 220V\n• **Hidráulica:** Água fria e quente\n• **Esgoto:** Conexão rede pública\n• **Gás:** Sistema GLP\n\n🔧 **Recomendação:** Prever quadro de distribuição adequado.`
  }

  // Resposta genérica contextualizada
  return `📋 **Baseado no seu projeto (${project.name}):**\n\nIdentifiquei um projeto residencial de ${project.total_area}m² com ${rooms.length} ambientes.\n\n🔍 **Para análises específicas, pergunte sobre:**\n• Áreas e dimensões\n• Quantitativos de materiais\n• Especificações técnicas\n• Instalações e estrutura\n\n💡 **Dica:** Seja mais específico para respostas detalhadas!`
}
