
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuotes } from '@/hooks/useQuotes';

export const QuoteRotator = () => {
  const { currentQuote, getRandomQuote } = useQuotes();

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full opacity-30 transform translate-x-16 -translate-y-16"></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💭</span>
            <h3 className="text-lg font-semibold text-indigo-900">Pensamento do Dia</h3>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={getRandomQuote}
            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <blockquote className="text-gray-700 text-lg leading-relaxed mb-4 italic">
          "{currentQuote.text}"
        </blockquote>
        
        <div className="flex items-center space-x-2">
          <div className="w-1 h-8 bg-indigo-400 rounded-full"></div>
          <div>
            <p className="font-semibold text-indigo-900">{currentQuote.author}</p>
            <p className="text-sm text-indigo-600">{currentQuote.profession}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
