import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { useAIChat } from '@/hooks/useAIChat';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';

export const ModernAIChat = () => {
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { currentProject } = useProject();
  const { 
    messages, 
    isLoading, 
    connectionStatus, 
    sendMessage: sendAIMessage,
    rateMessage 
  } = useAIChat({ 
    projectId: currentProject?.id 
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    await sendAIMessage(inputMessage);
    setInputMessage('');
  };

  const handleRegenerate = async () => {
    if (messages.length > 0) {
      const lastUserMessage = messages.find(msg => msg.role === 'user');
      if (lastUserMessage) {
        await sendAIMessage(lastUserMessage.content);
      }
    }
  };

  const handleRate = async (messageId: string, rating: number) => {
    await rateMessage(messageId, rating);
  };

  // Convert messages to the format expected by ChatMessages
  const formattedMessages = messages.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender: msg.role,
    timestamp: msg.timestamp
  }));

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white rounded-xl border border-gray-200 shadow-sm">
      <ChatHeader connectionStatus={connectionStatus} projectName={currentProject?.name} />
      <ChatMessages 
        messages={formattedMessages} 
        isLoading={isLoading} 
        onRegenerate={handleRegenerate}
        onRate={handleRate}
      />
      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
        isLoading={isLoading}
        projectName={currentProject?.name}
      />
    </div>
  );
};