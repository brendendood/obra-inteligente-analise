import { AgentType, AgentConfig, RichAgentContext } from './agentTypes';
import { getGeneralFallback } from './fallbacks/generalFallback';
import { getProjectFallback } from './fallbacks/projectFallback';
import { getBudgetFallback } from './fallbacks/budgetFallback';
import { getScheduleFallback } from './fallbacks/scheduleFallback';
import { getAnalysisFallback } from './fallbacks/analysisFallback';

const BASE_N8N_URL = 'https://madeai-br.app.n8n.cloud/webhook';

export const AGENT_CONFIGS: Record<AgentType, AgentConfig> = {
  general: {
    webhookUrl: `${BASE_N8N_URL}/chat-geral`,
    timeout: 30000,
    retryAttempts: 2,
    fallbackGenerator: getGeneralFallback,
  },
  project: {
    webhookUrl: `${BASE_N8N_URL}/projeto-chat`,
    timeout: 30000,
    retryAttempts: 2,
    fallbackGenerator: getProjectFallback,
  },
  budget: {
    webhookUrl: `${BASE_N8N_URL}/orcamento-ia`,
    timeout: 45000,
    retryAttempts: 1,
    fallbackGenerator: getBudgetFallback,
  },
  schedule: {
    webhookUrl: `${BASE_N8N_URL}/cronograma-ia`,
    timeout: 45000,
    retryAttempts: 1,
    fallbackGenerator: getScheduleFallback,
  },
  analysis: {
    webhookUrl: `${BASE_N8N_URL}/analise-tecnica`,
    timeout: 60000,
    retryAttempts: 1,
    fallbackGenerator: getAnalysisFallback,
  },
};