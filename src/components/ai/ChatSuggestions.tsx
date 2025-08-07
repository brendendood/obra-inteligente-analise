import React from 'react';
import { cn } from '@/lib/utils';

interface ChatSuggestionsProps {
  onSuggestionClick: (prompt: string) => void;
  isMobile?: boolean;
}

const suggestions = [
  { 
    icon: "🏗️", 
    text: "Como calcular estruturas?", 
    prompt: "Como calcular a estrutura de uma laje?" 
  },
  { 
    icon: "🧱", 
    text: "Materiais para fundação", 
    prompt: "Quais materiais são melhores para fundação?" 
  },
  { 
    icon: "📅", 
    text: "Cronograma de obra", 
    prompt: "Como fazer um cronograma de obra?" 
  },
  { 
    icon: "💰", 
    text: "Estimativa de custos", 
    prompt: "Como estimar custos de construção?" 
  }
];

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ 
  onSuggestionClick, 
  isMobile = false 
}) => {
  return (
    <div className={cn(
      "grid gap-3",
      isMobile ? "grid-cols-1 max-w-sm mx-auto" : "grid-cols-2 max-w-2xl mx-auto"
    )}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion.prompt)}
          className={cn(
            "group relative p-4 text-left bg-card hover:bg-muted/50 rounded-xl border border-border/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-sm",
            isMobile ? "w-full" : ""
          )}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">{suggestion.icon}</span>
            </div>
            <span className={cn(
              "font-medium text-foreground",
              isMobile ? "text-sm" : "text-sm"
            )}>
              {suggestion.text}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};