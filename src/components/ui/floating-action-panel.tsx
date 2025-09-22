'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type PanelMode = 'actions' | 'note';

interface FloatingActionPanelContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mode: PanelMode | null;
  setMode: (mode: PanelMode | null) => void;
  triggerRef: React.RefObject<HTMLElement>;
}

const FloatingActionPanelContext = createContext<FloatingActionPanelContextType | null>(null);

function useFloatingActionPanel() {
  const context = useContext(FloatingActionPanelContext);
  if (!context) {
    throw new Error('useFloatingActionPanel must be used within a FloatingActionPanelRoot');
  }
  return context;
}

interface FloatingActionPanelRootProps {
  children: (props: { mode: PanelMode | null }) => ReactNode;
}

export function FloatingActionPanelRoot({ children }: FloatingActionPanelRootProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<PanelMode | null>(null);
  const triggerRef = useRef<HTMLElement>(null);

  return (
    <FloatingActionPanelContext.Provider value={{ isOpen, setIsOpen, mode, setMode, triggerRef }}>
      <div className="relative">
        {children({ mode })}
      </div>
    </FloatingActionPanelContext.Provider>
  );
}

interface FloatingActionPanelTriggerProps {
  children: ReactNode;
  mode: PanelMode;
  title?: string;
  className?: string;
}

export function FloatingActionPanelTrigger({ 
  children, 
  mode, 
  title, 
  className 
}: FloatingActionPanelTriggerProps) {
  const { isOpen, setIsOpen, mode: currentMode, setMode, triggerRef } = useFloatingActionPanel();

  const handleClick = () => {
    if (isOpen && currentMode === mode) {
      setIsOpen(false);
      setMode(null);
    } else {
      setMode(mode);
      setIsOpen(true);
    }
  };

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={handleClick}
      title={title}
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors',
        isOpen && currentMode === mode && 'bg-gray-100 text-gray-900',
        className
      )}
    >
      {children}
    </button>
  );
}

interface FloatingActionPanelContentProps {
  children: ReactNode;
}

export function FloatingActionPanelContent({ children }: FloatingActionPanelContentProps) {
  const { isOpen, setIsOpen, triggerRef } = useFloatingActionPanel();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contentRef.current && 
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen, triggerRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute top-full left-0 z-50 mt-2 min-w-48 rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FloatingActionPanelButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export function FloatingActionPanelButton({ 
  children, 
  onClick, 
  className 
}: FloatingActionPanelButtonProps) {
  const { setIsOpen } = useFloatingActionPanel();

  const handleClick = () => {
    onClick();
    setIsOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 transition-colors',
        className
      )}
    >
      {children}
    </button>
  );
}

interface FloatingActionPanelFormProps {
  children: ReactNode;
  onSubmit: (value: string) => void;
  className?: string;
}

export function FloatingActionPanelForm({ 
  children, 
  onSubmit, 
  className 
}: FloatingActionPanelFormProps) {
  const { setIsOpen } = useFloatingActionPanel();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const textarea = event.currentTarget.querySelector('textarea');
    if (textarea) {
      onSubmit(textarea.value);
      setIsOpen(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('min-w-64', className)}>
      {children}
    </form>
  );
}

interface FloatingActionPanelTextareaProps {
  className?: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
}

export function FloatingActionPanelTextarea({ 
  className, 
  id, 
  placeholder = 'Digite sua nota...',
  defaultValue = ''
}: FloatingActionPanelTextareaProps) {
  return (
    <textarea
      id={id}
      name="note"
      placeholder={placeholder}
      defaultValue={defaultValue}
      className={cn(
        'w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
        className
      )}
    />
  );
}