import React, { useState, useEffect } from 'react';

interface AlternatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

export const AlternatingText: React.FC<AlternatingTextProps> = ({ 
  words, 
  interval = 2500, 
  className = "" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsVisible(true);
      }, 150); // Half of transition duration
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span 
      className={`inline-block transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
      aria-live="polite"
      aria-label={`Alternating between: ${words.join(', ')}`}
    >
      {words[currentIndex]}
    </span>
  );
};