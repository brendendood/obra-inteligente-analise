export type AgentType = 'general' | 'project' | 'budget' | 'schedule' | 'analysis';

export interface BaseContext {
  user_id?: string;
  timestamp: string;
}

export interface UserContext {
  id: string;
  plan: string;
  location?: string;
  specialization?: string;
  preferences?: Record<string, any>;
}

export interface ProjectContext {
  id: string;
  name: string;
  type?: string;
  area?: number;
  location?: string;
  analysis_data?: Record<string, any>;
  current_phase?: string;
}

export interface TechnicalContext {
  regional_codes?: string[];
  materials?: Record<string, any>;
  quantitativos?: Record<string, any>;
  normas_aplicaveis?: string[];
}

export interface RichAgentContext extends BaseContext {
  message: string;
  agent_type: AgentType;
  user_context?: UserContext;
  project_context?: ProjectContext;
  technical_context?: TechnicalContext;
  conversation_context?: {
    conversation_id?: string;
    last_messages?: string[];
    intent?: string;
  };
}

export interface AgentResponse {
  response: string;
  metadata?: Record<string, any>;
  actions?: string[];
}

export interface AgentConfig {
  webhookUrl: string;
  timeout: number;
  retryAttempts: number;
  fallbackGenerator: (message: string, context: RichAgentContext) => string;
}