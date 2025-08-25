/**
 * Agents Facades - Sistema de agentes de IA
 * Re-exports para facilitar importação e estabilizar API pública
 */

// Serviço principal de agentes
export { sendMessageToAgent } from '@/utils/agents/unifiedAgentService';

// Tipos de agentes
export type { 
  AgentType, 
  AgentResponse, 
  RichAgentContext, 
  UserContext, 
  ProjectContext, 
  TechnicalContext 
} from '@/utils/agents/agentTypes';

// Schemas de resposta
export { 
  ProjectAgentResponseSchema,
  ProjectsUpdateSchema,
  BudgetItemSchema,
  ScheduleTaskSchema,
  ProjectAnalysesSchema
} from '@/utils/agents/schemas/projectAgentResponse';

export type { ProjectAgentResponse } from '@/utils/agents/schemas/projectAgentResponse';

// Configurações de agentes
export { AGENT_CONFIGS } from '@/utils/agents/agentConfig';

// Serviço seguro N8N
export { SecureN8NService } from '@/utils/secureN8NService';