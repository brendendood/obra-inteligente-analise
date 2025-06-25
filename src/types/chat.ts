
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  message: string;
  timestamp: Date;
  metadata?: {
    type?: 'suggestion' | 'calculation' | 'timeline';
    data?: any;
  };
}

export interface ProjectAssistantChatProps {
  project: any;
  onGenerateBudget?: () => void;
  onGenerateSchedule?: () => void;
  onViewDocuments?: () => void;
}
