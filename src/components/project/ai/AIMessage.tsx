
import { Bot, User, Table, FileText, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

interface AIMessageProps {
  message: ChatMessage;
}

export const AIMessage = ({ message }: AIMessageProps) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-blue-600' 
              : 'bg-gradient-to-r from-purple-600 to-blue-600'
          }`}>
            {isUser ? (
              <User className="h-5 w-5 text-white" />
            ) : (
              <Bot className="h-5 w-5 text-white" />
            )}
          </div>
          
          {/* Message Content */}
          <div className="flex-1">
            <div className={`rounded-2xl p-4 ${
              isUser 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              <div className="prose prose-sm max-w-none">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className={`mb-2 last:mb-0 ${
                    isUser ? 'text-white' : 'text-gray-900'
                  }`}>
                    {line.includes('**') ? (
                      <span dangerouslySetInnerHTML={{
                        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
              
              {/* Structured Data Cards */}
              {message.data && !isUser && (
                <div className="mt-4 space-y-3">
                  {message.data.rooms && (
                    <div className="grid grid-cols-2 gap-2">
                      {message.data.rooms.slice(0, 4).map((room: any, index: number) => (
                        <Card key={index} className="bg-gray-50">
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-2">
                              <Home className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="font-medium text-sm">{room.name}</p>
                                <p className="text-xs text-gray-600">{room.area}m²</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {message.data.materials && (
                    <Card className="bg-gray-50">
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Table className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">Materiais Identificados</span>
                        </div>
                        <div className="space-y-1">
                          {Object.entries(message.data.materials).slice(0, 3).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex justify-between text-xs">
                              <span className="capitalize">{key.replace('_', ' ')}</span>
                              <Badge variant="outline" className="text-xs">
                                {value.quantity} {value.unit}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
            
            <p className={`text-xs mt-2 ${
              isUser ? 'text-right text-gray-500' : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
