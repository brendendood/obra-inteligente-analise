import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, projectId } = await req.json();
    
    // Initialize Supabase client with request authorization
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single();
      
      if (error || !data) {
        return new Response(JSON.stringify({ error: 'Conversation not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      conversation = data;
    } else {
      // Create new conversation
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          project_id: projectId,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : '')
        })
        .select()
        .single();
      
      if (error || !data) {
        return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      conversation = data;
    }

    // Save user message
    await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversation.id,
        content: message,
        role: 'user'
      });

    // Get project data if projectId is provided
    let project = null;
    if (projectId) {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      if (!projectError && projectData) {
        project = projectData;
      }
    }

    // Get conversation history for context
    const { data: messageHistory } = await supabase
      .from('ai_messages')
      .select('content, role')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(10);

    let aiResponse: string;

    // Check if OpenAI API key is available
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (openaiApiKey) {
      try {
        // Prepare messages for OpenAI
        const messages = [
          {
            role: 'system',
            content: `Você é um assistente especializado em projetos de engenharia civil e arquitetura da plataforma MadenAI.

${project ? `
Dados do projeto atual:
- Nome: ${project.name}
- Tipo: ${project.project_type || 'Não especificado'}
- Área total: ${project.total_area ? project.total_area + 'm²' : 'Não especificado'}
- Localização: ${[project.city, project.state, project.country].filter(Boolean).join(', ') || 'Não especificado'}
- Orçamento estimado: ${project.estimated_budget ? 'R$ ' + project.estimated_budget.toLocaleString('pt-BR') : 'Não calculado'}

Texto extraído: ${project.extracted_text || 'Nenhum texto disponível'}
Análise técnica: ${project.analysis_data ? JSON.stringify(project.analysis_data) : 'Análise não disponível'}
` : 'Contexto geral de engenharia civil e arquitetura.'}

Seja técnico, preciso e útil. Foque em soluções práticas para construção, materiais, custos e cronogramas. Use as normas brasileiras quando relevante.`
          }
        ];

        // Add conversation history
        if (messageHistory && messageHistory.length > 1) {
          messageHistory.slice(0, -1).forEach(msg => {
            messages.push({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            });
          });
        }

        // Add current message
        messages.push({
          role: 'user',
          content: message
        });

        // Call OpenAI API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7
          }),
        });

        if (!openaiResponse.ok) {
          throw new Error(`OpenAI API error: ${openaiResponse.status}`);
        }

        const openaiData = await openaiResponse.json();
        aiResponse = openaiData.choices[0].message.content;
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        aiResponse = generateContextualResponse(message, project);
      }
    } else {
      // Fallback to contextual response
      aiResponse = generateContextualResponse(message, project);
    }

    // Save AI response
    await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversation.id,
        content: aiResponse,
        role: 'assistant'
      });

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: conversation.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Contextual response generator when OpenAI is not available
function generateContextualResponse(question: string, project: any): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('área') || lowerQuestion.includes('tamanho')) {
    return project 
      ? `Com base no projeto "${project.name}", a área total é de ${project.total_area || 'valor não especificado'}m². Esta informação é fundamental para calcular materiais e custos.`
      : 'Para calcular áreas, preciso de informações específicas do projeto. Você pode compartilhar as plantas ou dimensões?';
  }
  
  if (lowerQuestion.includes('orçamento') || lowerQuestion.includes('custo')) {
    return project 
      ? `Para o projeto "${project.name}", o orçamento estimado é ${project.estimated_budget ? 'R$ ' + project.estimated_budget.toLocaleString('pt-BR') : 'ainda não calculado'}. Posso ajudar a detalhar os custos por categoria.`
      : 'Para estimar custos, preciso conhecer o tipo de obra, área, localização e padrão de acabamento. Você pode fornecer essas informações?';
  }
  
  if (lowerQuestion.includes('cronograma') || lowerQuestion.includes('prazo')) {
    return project 
      ? `Para o projeto "${project.name}", o cronograma depende da complexidade e recursos disponíveis. Posso ajudar a criar um cronograma detalhado baseado nas etapas da obra.`
      : 'Para criar um cronograma, preciso entender o escopo do projeto. Que tipo de obra você está planejando?';
  }
  
  if (lowerQuestion.includes('material') || lowerQuestion.includes('especificação')) {
    return 'Posso ajudar com especificações de materiais baseadas no tipo de projeto, clima local e orçamento. Sobre qual material específico você gostaria de saber?';
  }
  
  return project 
    ? `Sobre o projeto "${project.name}": Como especialista em engenharia civil, posso ajudar com análises técnicas, materiais, custos e cronogramas. Em que posso ajudar especificamente?`
    : 'Olá! Sou seu assistente especializado em engenharia civil e arquitetura. Posso ajudar com projetos, materiais, custos, cronogramas e normas técnicas. Como posso ajudar você hoje?';
}