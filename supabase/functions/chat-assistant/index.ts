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
            content: `Você é um Engenheiro Civil e Arquiteto Senior especializado em projetos de construção no Brasil, atuando como assistente técnico da plataforma MadenAI.

ESPECIALIZAÇÃO E CONHECIMENTOS:
- Engenharia Estrutural, Fundações, Geotecnia
- Arquitetura Residencial e Comercial  
- Orçamentação, Cronogramas e Planejamento
- Normas ABNT (NBR 6118, 6120, 6122, 15575, 9050, etc.)
- Código de Obras Municipal e Estadual
- Materiais de Construção e Tecnologias Construtivas
- Sustentabilidade e Eficiência Energética

${project ? `
📋 PROJETO ATUAL EM ANÁLISE:
- Nome: ${project.name}
- Tipologia: ${project.project_type || 'Não especificado'}
- Área Construída: ${project.total_area ? project.total_area + 'm²' : 'A definir'}
- Localização: ${[project.city, project.state, project.country].filter(Boolean).join(', ') || 'Não informado'}
- Orçamento Previsto: ${project.estimated_budget ? 'R$ ' + project.estimated_budget.toLocaleString('pt-BR') : 'Em elaboração'}

📄 DOCUMENTOS TÉCNICOS:
${project.extracted_text ? `Informações extraídas: ${project.extracted_text.substring(0, 500)}...` : 'Aguardando documentos técnicos'}

📊 ANÁLISE TÉCNICA:
${project.analysis_data ? `Dados processados: ${JSON.stringify(project.analysis_data)}` : 'Análise em andamento'}
` : '🏗️ Modo Consultoria Geral - Pronto para orientação técnica especializada'}

DIRETRIZES DE RESPOSTA:
✓ Seja técnico, preciso e fundamentado em normas
✓ Cite normas ABNT relevantes quando aplicável
✓ Forneça valores realistas de materiais e custos (mercado brasileiro 2024)
✓ Considere aspectos de segurança, durabilidade e sustentabilidade
✓ Use linguagem profissional mas acessível
✓ Quando possível, sugira alternativas e melhores práticas

Responda como um profissional experiente com CRA/CREA ativo.`
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

        // Call OpenAI API with retry logic
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                max_tokens: 1500,
                temperature: 0.3, // Mais técnico e preciso
                top_p: 0.9,
                frequency_penalty: 0.0,
                presence_penalty: 0.0
              }),
            });

            if (openaiResponse.status === 429) {
              // Rate limit - aguarda e tenta novamente
              console.log(`Rate limit hit, retry ${retryCount + 1}/${maxRetries}`);
              await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
              retryCount++;
              continue;
            }

            if (!openaiResponse.ok) {
              throw new Error(`OpenAI API error: ${openaiResponse.status} - ${await openaiResponse.text()}`);
            }

            const openaiData = await openaiResponse.json();
            aiResponse = openaiData.choices[0].message.content;
            break; // Sucesso, sai do loop
            
          } catch (error) {
            retryCount++;
            console.error(`OpenAI attempt ${retryCount} failed:`, error);
            
            if (retryCount === maxRetries) {
              throw error; // Falha após todas as tentativas
            }
            
            // Aguarda antes da próxima tentativa
            await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
          }
        }
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

    // Validação final da resposta
    const finalResponse = aiResponse || 'Desculpe, não foi possível gerar uma resposta no momento.';
    
    console.log('📤 Edge Function: Sending response:', {
      response: finalResponse,
      conversationId: conversation.id,
      responseLength: finalResponse.length
    });

    return new Response(JSON.stringify({ 
      response: finalResponse,
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

// Sistema avançado de respostas contextuais para engenharia civil e arquitetura
function generateContextualResponse(question: string, project: any): string {
  const lowerQuestion = question.toLowerCase();
  
  // Base de conhecimentos técnicos
  const technicalKnowledge = {
    foundation: {
      keywords: ['fundação', 'fundações', 'sapata', 'estaca', 'radier', 'baldrame'],
      response: (project: any) => `🏗️ **FUNDAÇÕES - Análise Técnica**

${project ? `Para o projeto "${project.name}" (${project.total_area || 'área a definir'}m²):` : 'Orientação geral sobre fundações:'}

**Tipos recomendados conforme NBR 6122:**
• **Fundações Rasas**: Sapatas isoladas/corridas (até 3 pavimentos)
• **Fundações Profundas**: Estacas escavadas/hélice contínua (acima de 3 pavimentos)
• **Radier**: Cargas distribuídas, solos de baixa capacidade

**Fatores determinantes:**
✓ Investigação geotécnica obrigatória (NBR 8036)
✓ Cargas da estrutura e tipo de solo
✓ Presença de água subterrânea
✓ Economicidade da solução

**Custos estimados (2024):**
• Sapatas: R$ 80-120/m²
• Estacas escavadas: R$ 25-40/m linear
• Radier: R$ 45-65/m²

Precisa de dimensionamento específico?`
    },
    
    structure: {
      keywords: ['estrutura', 'concreto', 'aço', 'viga', 'pilar', 'laje', 'dimensionamento'],
      response: (project: any) => `🏢 **ESTRUTURA - Dimensionamento e Especificações**

${project ? `Análise estrutural para "${project.name}":` : 'Orientações estruturais:'}

**Sistemas estruturais recomendados:**
• **Concreto Armado**: Residencial até 4 pavimentos (NBR 6118)
• **Alvenaria Estrutural**: Até 5 pavimentos (NBR 15961)
• **Estrutura Metálica**: Vãos grandes, rapidez executiva

**Materiais conforme norma:**
✓ Concreto: fck ≥ 25 MPa (residencial), fck ≥ 30 MPa (comercial)
✓ Aço CA-50 para armaduras principais
✓ Aço CA-60 para estribos e distribuição

**Custos por m² (estrutura completa):**
• Concreto armado: R$ 180-250/m²
• Alvenaria estrutural: R$ 120-180/m²
• Estrutura metálica: R$ 200-300/m²

Necessita de cálculo estrutural detalhado?`
    },
    
    budget: {
      keywords: ['orçamento', 'custo', 'preço', 'valor', 'quanto custa'],
      response: (project: any) => `💰 **ORÇAMENTAÇÃO - Análise de Custos**

${project ? `Orçamento para "${project.name}" (${project.total_area || 'área a definir'}m²):` : 'Estimativas de custos de construção:'}

**Custos por m² - Padrão Brasileiro (2024):**

🏠 **RESIDENCIAL:**
• Popular: R$ 800-1.200/m²
• Médio: R$ 1.200-1.800/m²
• Alto: R$ 1.800-3.000/m²
• Luxo: R$ 3.000-5.000/m²

🏢 **COMERCIAL:**
• Básico: R$ 1.000-1.500/m²
• Corporativo: R$ 1.500-2.500/m²

**Composição típica dos custos:**
✓ Estrutura: 15-20%
✓ Alvenaria/Vedações: 12-15%
✓ Instalações: 20-25%
✓ Cobertura: 8-12%
✓ Revestimentos: 15-20%
✓ Esquadrias: 8-12%

${project?.estimated_budget ? `Orçamento previsto: R$ ${project.estimated_budget.toLocaleString('pt-BR')}` : ''}

Quer detalhamento por etapas?`
    },
    
    materials: {
      keywords: ['material', 'materiais', 'tijolo', 'bloco', 'cimento', 'cerâmica', 'especificação'],
      response: (project: any) => `🧱 **MATERIAIS - Especificações Técnicas**

**ALVENARIA (NBR 15270):**
• Tijolo cerâmico: 9x14x19cm - R$ 0,35-0,45/un
• Bloco cerâmico: 14x19x29cm - R$ 1,20-1,80/un
• Bloco de concreto: 14x19x39cm - R$ 2,50-3,50/un

**REVESTIMENTOS:**
• Argamassa colante: R$ 18-25/saco 20kg
• Cerâmica 45x45cm: R$ 25-60/m²
• Porcelanato 60x60cm: R$ 45-120/m²

**COBERTURA:**
• Telha cerâmica: R$ 2,50-4,00/m²
• Telha metálica: R$ 15-35/m²
• Laje impermeabilizada: R$ 45-65/m²

**CRITÉRIOS DE ESCOLHA:**
✓ Clima e exposição
✓ Durabilidade e manutenção
✓ Desempenho térmico/acústico
✓ Relação custo-benefício

${project ? `Para ${project.name}, qual material específico?` : 'Qual material precisa especificar?'}`
    },
    
    schedule: {
      keywords: ['cronograma', 'prazo', 'tempo', 'etapas', 'duração'],
      response: (project: any) => `⏱️ **CRONOGRAMA - Planejamento Executivo**

${project ? `Cronograma para "${project.name}" (${project.total_area || 'área a definir'}m²):` : 'Prazos típicos de construção:'}

**PRAZOS POR TIPOLOGIA:**

🏠 **Residencial:**
• Casa popular (até 80m²): 6-9 meses
• Casa padrão (80-150m²): 8-12 meses
• Casa alto padrão (+150m²): 12-18 meses

🏢 **Comercial:**
• Edifício baixo (até 3 pav): 12-18 meses
• Edifício médio (4-10 pav): 18-24 meses

**ETAPAS PRINCIPAIS:**
1. **Fundações**: 15-20% do prazo
2. **Estrutura**: 25-30% do prazo
3. **Alvenaria**: 20-25% do prazo
4. **Instalações**: 15-20% do prazo
5. **Acabamentos**: 20-25% do prazo

**FATORES QUE INFLUENCIAM:**
✓ Complexidade do projeto
✓ Disponibilidade de mão-de-obra
✓ Condições climáticas
✓ Logística de materiais

Precisa de cronograma detalhado?`
    },
    
    norms: {
      keywords: ['norma', 'nbr', 'abnt', 'código', 'lei', 'regulamento'],
      response: (project: any) => `📋 **NORMAS TÉCNICAS - Conformidade Legal**

**NORMAS ABNT FUNDAMENTAIS:**

🏗️ **ESTRUTURAS:**
• NBR 6118: Projeto de estruturas de concreto
• NBR 8800: Projeto de estruturas de aço
• NBR 6122: Projeto e execução de fundações

🏠 **DESEMPENHO:**
• NBR 15575: Edificações habitacionais - Desempenho
• NBR 9050: Acessibilidade
• NBR 15220: Desempenho térmico

🔧 **INSTALAÇÕES:**
• NBR 5410: Instalações elétricas
• NBR 8160: Sistemas prediais de esgoto
• NBR 5626: Sistemas prediais de água fria

**CÓDIGOS MUNICIPAIS:**
✓ Código de Obras local
✓ Lei de Uso e Ocupação do Solo
✓ Normas de segurança contra incêndio

${project ? `Para o projeto em ${project.city || 'sua cidade'}, verificar legislação específica.` : ''}

Qual norma específica precisa consultar?`
    }
  };

  // Verificar palavras-chave e retornar resposta especializada
  for (const [category, data] of Object.entries(technicalKnowledge)) {
    if (data.keywords.some(keyword => lowerQuestion.includes(keyword))) {
      return data.response(project);
    }
  }

  // Respostas para saudações e perguntas gerais
  if (lowerQuestion.includes('olá') || lowerQuestion.includes('oi') || lowerQuestion.includes('bom dia') || lowerQuestion.includes('boa tarde')) {
    return project 
      ? `🏗️ Olá! Sou seu consultor especializado em engenharia civil e arquitetura. Estou analisando o projeto "${project.name}" e posso ajudar com:

✓ Dimensionamento estrutural e fundações
✓ Orçamentação detalhada e cronograma
✓ Especificação de materiais e técnicas construtivas
✓ Conformidade com normas ABNT e códigos locais
✓ Otimização de custos e prazos

Em que posso ajudar especificamente?`
      : `🏗️ Olá! Sou seu consultor especializado em **Engenharia Civil e Arquitetura**. 

Posso ajudar com:
✓ **Projetos estruturais** e dimensionamento
✓ **Orçamentação** e análise de custos
✓ **Cronogramas** e planejamento executivo
✓ **Especificação de materiais** e técnicas
✓ **Normas ABNT** e legislação construtiva

Tem algum projeto ou dúvida técnica específica?`;
  }

  // Resposta padrão técnica
  return project 
    ? `🏗️ **Projeto "${project.name}" em análise**

Como **Engenheiro Civil especialista**, posso orientar sobre:

📊 **Análise Técnica**: Estruturas, fundações, materiais
💰 **Orçamentação**: Custos detalhados por etapa
⏱️ **Cronograma**: Planejamento executivo otimizado
📋 **Conformidade**: Normas ABNT e códigos locais

**Dados do projeto:**
• Área: ${project.total_area || 'A definir'}m²
• Localização: ${[project.city, project.state].filter(Boolean).join(', ') || 'A definir'}
• Orçamento: ${project.estimated_budget ? 'R$ ' + project.estimated_budget.toLocaleString('pt-BR') : 'Em elaboração'}

Sobre qual aspecto técnico você gostaria de orientação?`
    : `🏗️ **Consultoria Especializada em Engenharia Civil**

Sou seu consultor técnico especializado. Posso ajudar com:

🔹 **Projetos estruturais** e fundações
🔹 **Orçamentação** profissional detalhada  
🔹 **Cronogramas** e planejamento de obra
🔹 **Materiais** e especificações técnicas
🔹 **Normas ABNT** e legislação vigente

**Exemplos do que posso orientar:**
• "Como dimensionar fundações para casa de 120m²?"
• "Qual o custo por m² para construção padrão médio?"
• "Cronograma para edifício de 4 pavimentos"
• "Especificações de materiais para região Sul"

Qual sua dúvida técnica específica?`;
}