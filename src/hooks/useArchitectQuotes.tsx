import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
}

const ARCHITECT_QUOTES: Quote[] = [
  {
    text: "Menos é mais.",
    author: "Ludwig Mies van der Rohe"
  },
  {
    text: "A arquitetura começa onde termina a engenharia.",
    author: "Walter Gropius"
  },
  {
    text: "O espaço é o respiro da arte.",
    author: "Frank Lloyd Wright"
  },
  {
    text: "A forma segue a função.",
    author: "Louis Sullivan"
  },
  {
    text: "A arquitetura é o jogo sábio, correto e magnífico dos volumes dispostos sob a luz.",
    author: "Le Corbusier"
  },
  {
    text: "Toda construção é um reflexo da alma de quem a cria.",
    author: "Tadao Ando"
  },
  {
    text: "A simplicidade é a sofisticação máxima.",
    author: "Leonardo da Vinci"
  },
  {
    text: "A boa arquitetura é como música congelada.",
    author: "Johann Wolfgang von Goethe"
  }
];

export const useArchitectQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(ARCHITECT_QUOTES[0]);

  useEffect(() => {
    // Gerar um índice aleatório baseado na data atual para persistir durante a sessão
    const today = new Date().toDateString();
    const sessionKey = `architect-quote-${today}`;
    
    // Verificar se já existe uma frase salva para hoje
    const savedIndex = localStorage.getItem(sessionKey);
    
    let quoteIndex: number;
    
    if (savedIndex !== null) {
      quoteIndex = parseInt(savedIndex, 10);
    } else {
      // Gerar novo índice aleatório
      quoteIndex = Math.floor(Math.random() * ARCHITECT_QUOTES.length);
      localStorage.setItem(sessionKey, quoteIndex.toString());
    }
    
    // Garantir que o índice está dentro dos limites válidos
    if (quoteIndex >= 0 && quoteIndex < ARCHITECT_QUOTES.length) {
      setCurrentQuote(ARCHITECT_QUOTES[quoteIndex]);
    }
  }, []);

  return currentQuote;
};