import { useState, useEffect } from 'react';

interface RotatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

const RotatingText = ({ words, interval = 3000, className = "" }: RotatingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsVisible(true);
      }, 300); // Tempo para fade-out
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
      } ${className}`}
    >
      {words[currentIndex]}
    </span>
  );
};

export default RotatingText;