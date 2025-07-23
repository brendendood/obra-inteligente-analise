import { useArchitectQuotes } from '@/hooks/useArchitectQuotes';

export const ArchitectQuote = () => {
  const quote = useArchitectQuotes();

  return (
    <div className="text-base sm:text-lg text-gray-600">
      <span className="italic">"{quote.text}"</span>
      <span className="text-gray-500 font-medium ml-2">– {quote.author}</span>
    </div>
  );
};