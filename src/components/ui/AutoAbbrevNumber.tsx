
import React from 'react';

interface AutoAbbrevNumberProps {
  value: number;
  decimals?: number; // number of decimals for abbreviated form
  alwaysFullFrom?: 'sm' | 'md' | 'lg' | 'xl'; // breakpoint where full number is forced
  className?: string;
}

// Shows full number by default; on very small screens (below the breakpoint), shows a compact "k" format
export const AutoAbbrevNumber: React.FC<AutoAbbrevNumberProps> = ({
  value,
  decimals = 1,
  alwaysFullFrom = 'sm',
  className,
}) => {
  const full = new Intl.NumberFormat('pt-BR').format(value);

  const abbreviated = React.useMemo(() => {
    if (Math.abs(value) < 1000) return full;
    const k = value / 1000;
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(k * factor) / factor;
    // format with locale using the given decimals as max
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: rounded % 1 === 0 ? 0 : decimals,
      maximumFractionDigits: decimals,
    }).format(rounded);
    return `${formatted}k`;
  }, [value, decimals, full]);

  // Tailwind responsive classes to switch visibility
  const fullCls = `hidden ${alwaysFullFrom}:inline`;
  const shortCls = `${alwaysFullFrom}:hidden inline`;

  return (
    <span className={className}>
      <span className={fullCls}>{full}</span>
      <span className={shortCls}>{abbreviated}</span>
    </span>
  );
};

export default AutoAbbrevNumber;
