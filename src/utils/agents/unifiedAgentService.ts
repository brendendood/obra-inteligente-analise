import { User } from '@supabase/supabase-js';
import { Project } from '@/types/project';
import { AgentType, RichAgentContext, AgentResponse, UserContext, ProjectContext, TechnicalContext } from './agentTypes';
import { AGENT_CONFIGS } from './agentConfig';

interface SendMessageContext {
  user?: User | null;
  project?: Project | null;
  conversationId?: string;
  intent?: string;
}

/**
 * Constrói contexto rico do usuário
 */
const buildUserContext = (user?: User | null): UserContext | undefined => {
  if (!user) return undefined;
  
  const metadata = user.user_metadata || {};
  return {
    id: user.id,
    plan: metadata.plan || 'free',
    location: [metadata.city, metadata.state, metadata.country].filter(Boolean).join(', ') || undefined,
    specialization: metadata.cargo || undefined,
    preferences: metadata.preferences || {},
  };
};

/**
 * Constrói contexto rico do projeto
 */
const buildProjectContext = (project?: Project | null): ProjectContext | undefined => {
  if (!project) return undefined;
  
  return {
    id: project.id,
    name: project.name,
    type: project.project_type || undefined,
    area: project.total_area || undefined,
    location: undefined, // TODO: Add location field to Project type if needed
    analysis_data: project.analysis_data || undefined,
    current_phase: 'projeto', // TODO: Add current_phase field to Project type if needed
  };
};

/**
 * Constrói contexto técnico baseado no projeto
 */
const buildTechnicalContext = (project?: Project | null, agentType?: AgentType): TechnicalContext => {
  const baseContext: TechnicalContext = {
    regional_codes: ['NBR 6118', 'NBR 8800', 'NBR 9050'],
    normas_aplicaveis: ['Código de Obras Local', 'Lei de Zoneamento'],
  };
  
  if (!project) return baseContext;
  
  const analysisData = project.analysis_data || {};
  
  return {
    ...baseContext,
    materials: analysisData.materials || {},
    quantitativos: analysisData.quantitativos || {},
    regional_codes: analysisData.regional_codes || baseContext.regional_codes,
  };
};

/**
 * Envia mensagem para agente especializado via N8N
 */
const sendToN8NAgent = async (
  agentType: AgentType,
  context: RichAgentContext
): Promise<string> => {
  const config = AGENT_CONFIGS[agentType];
  
  console.log(`🤖 Enviando para agente ${agentType}:`, {
    message: context.message.substring(0, 50) + '...',
    project: context.project_context?.name,
    user: context.user_context?.id
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(context),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.response) {
      throw new Error('Resposta inválida do agente N8N');
    }

    console.log(`✅ Resposta recebida do agente ${agentType}`);
    return data.response;

  } catch (error) {
    console.error(`❌ Erro na comunicação com agente ${agentType}:`, error);
    
    if (error.name === 'AbortError') {
      throw new Error('timeout');
    }
    
    throw new Error('network');
  }
};

/**
 * Função principal para comunicação com agentes especializados
 */
export const sendMessageToAgent = async (
  message: string,
  agentType: AgentType,
  context: SendMessageContext = {}
): Promise<string> => {
  const config = AGENT_CONFIGS[agentType];
  
  // Construir contexto rico
  const richContext: RichAgentContext = {
    message: message.trim(),
    agent_type: agentType,
    user_id: context.user?.id,
    timestamp: new Date().toISOString(),
    user_context: buildUserContext(context.user),
    project_context: buildProjectContext(context.project),
    technical_context: buildTechnicalContext(context.project, agentType),
    conversation_context: {
      conversation_id: context.conversationId,
      intent: context.intent,
    }
  };

  // Primeira tentativa
  try {
    const response = await sendToN8NAgent(agentType, richContext);
    return response;
  } catch (error) {
    console.log(`🔄 Primeira tentativa falhou para agente ${agentType}, tentando novamente...`);
    
    // Segunda tentativa (retry)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await sendToN8NAgent(agentType, richContext);
      return response;
    } catch (retryError) {
      console.error(`🆘 Ambas tentativas falharam para agente ${agentType}, usando fallback`);
      
      // Usar fallback específico do agente
      return config.fallbackGenerator(message, richContext);
    }
  }
};