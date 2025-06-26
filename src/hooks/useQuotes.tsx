
import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
  profession: string;
}

const quotes: Quote[] = [
  {
    text: "A casa é uma máquina de viver.",
    author: "Le Corbusier",
    profession: "Arquiteto"
  },
  {
    text: "Não é o ângulo reto que me atrai, nem a linha reta, dura, inflexível, criada pelo homem. O que me atrai é a curva livre e sensual.",
    author: "Oscar Niemeyer",
    profession: "Arquiteto"
  },
  {
    text: "A arquitetura é a mãe de todas as artes.",
    author: "Frank Lloyd Wright",
    profession: "Arquiteto"
  },
  {
    text: "Menos é mais.",
    author: "Ludwig Mies van der Rohe",
    profession: "Arquiteto"
  },
  {
    text: "A simplicidade é a máxima sofisticação.",
    author: "Leonardo da Vinci",
    profession: "Inventor e Arquiteto"
  },
  {
    text: "O bom design é óbvio. O ótimo design é transparente.",
    author: "Joe Sparano",
    profession: "Designer"
  },
  {
    text: "A arquitetura é música congelada.",
    author: "Johann Wolfgang von Goethe",
    profession: "Filósofo"
  },
  {
    text: "Primeiro, resolva o problema. Depois, escreva o código.",
    author: "John Johnson",
    profession: "Engenheiro"
  }
];

export const useQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);

  useEffect(() => {
    // Seleciona uma frase baseada no dia para rotação diária
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const quoteIndex = dayOfYear % quotes.length;
    setCurrentQuote(quotes[quoteIndex]);
  }, []);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  return {
    currentQuote,
    getRandomQuote,
    allQuotes: quotes
  };
};
