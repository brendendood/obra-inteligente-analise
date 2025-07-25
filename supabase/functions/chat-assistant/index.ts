import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const REQUEST_TIMEOUT = 12000; // 12 segundos

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🚀 Chat Assistant: Iniciando processamento...');

  try {
    const { message, conversationId, projectId } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Processar com fallback robusto
    let aiResponse = generateEnhancedContextualResponse(message, null);
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (openaiApiKey) {
      try {
        const response = await Promise.race([
          fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: 'Você é um assistente especializado em engenharia civil e arquitetura brasileira. Responda sempre em português com informações técnicas precisas sobre normas ABNT, custos brasileiros e práticas nacionais.' },
                { role: 'user', content: message }
              ],
              max_tokens: 800,
              temperature: 0.7,
            }),
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), REQUEST_TIMEOUT))
        ]);

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.choices[0]?.message?.content || aiResponse;
          console.log('✅ OpenAI response received');
        }
      } catch (error) {
        console.log('⚠️ OpenAI failed, using fallback:', error);
      }
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: null,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error:', error);
    
    return new Response(JSON.stringify({ 
      response: generateEnhancedContextualResponse('Olá', null),
      conversationId: null,
      success: false
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateEnhancedContextualResponse(question: string, project: any): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('orçamento') || lowerQuestion.includes('custo') || lowerQuestion.includes('preço')) {
    return `**💰 Orçamento de Obra (Brasil 2024)**

**Custos médios por m²:**
• **Padrão Popular:** R$ 1.200 - R$ 1.800/m²
• **Padrão Normal:** R$ 1.800 - R$ 2.500/m²  
• **Padrão Médio:** R$ 2.500 - R$ 3.500/m²
• **Alto Padrão:** R$ 3.500 - R$ 5.000/m²

**Composição (%):**
• Estrutura: 30-35% | Vedações: 25-30%
• Instalações: 15-20% | Acabamentos: 20-25%

📋 **Dica:** Use planilhas SINAPI/TCPO para precisão.`;
  }

  if (lowerQuestion.includes('cronograma') || lowerQuestion.includes('prazo') || lowerQuestion.includes('tempo')) {
    return `**📅 Cronograma de Obra**

**Etapas principais:**
• **Projetos/Licenças:** 30-60 dias
• **Fundações:** 15-30 dias  
• **Estrutura:** 45-90 dias
• **Vedações:** 30-45 dias
• **Instalações:** 20-30 dias
• **Acabamentos:** 45-60 dias

⏱️ **Total:** 6-10 meses (depende do padrão)`;
  }

  return `**👋 MadenAI - Especialista em Engenharia Civil**

🔧 **Posso ajudar com:**
• Orçamentos detalhados (SINAPI/TCPO)
• Cronogramas e planejamento
• Normas ABNT (NBR 6118, 9050, 15575)
• Dimensionamento estrutural
• Especificações de materiais

💡 **Exemplos:**
• "Custo por m² padrão médio 2024"
• "Cronograma casa 150m²"
• "Dimensionar viga 4m vão"

Como posso ajudá-lo?`;
}