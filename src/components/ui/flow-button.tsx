'use client';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FlowButtonProps {
  text?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'px-6 py-2 text-sm',
  md: 'px-8 py-3 text-sm',
  lg: 'px-10 py-4 text-base',
};

export function FlowButton({ 
  text = "Modern Button", 
  href,
  onClick,
  className,
  size = 'md'
}: FlowButtonProps) {
  const buttonClasses = cn(
    "group relative flex items-center gap-1 overflow-hidden rounded-[100px]",
    "border-[1.5px] border-primary/40 bg-transparent",
    "font-semibold text-primary cursor-pointer",
    "transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
    "hover:border-transparent hover:text-primary-foreground hover:rounded-[12px]",
    "active:scale-[0.95]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
    sizeClasses[size],
    className
  );

  const content = (
    <>
      {/* Left arrow (arr-2) */}
      <ArrowRight 
        className="absolute w-4 h-4 left-[-25%] stroke-primary fill-none z-[9] group-hover:left-4 group-hover:stroke-primary-foreground transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
      />

      {/* Text */}
      <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
        {text}
      </span>

      {/* Circle */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-[50%] opacity-0 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"></span>

      {/* Right arrow (arr-1) */}
      <ArrowRight 
        className="absolute w-4 h-4 right-4 stroke-primary fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-primary-foreground transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
      />
    </>
  );

  if (href) {
    return (
      <Link to={href} className={buttonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={buttonClasses}>
      {content}
    </button>
  );
}
