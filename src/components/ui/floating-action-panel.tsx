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
  children: (props: { mode: PanelMode | null; setIsOpen: (open: boolean) => void; setMode: (mode: PanelMode | null) => void }) => ReactNode;
}

export function FloatingActionPanelRoot({ children }: FloatingActionPanelRootProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<PanelMode | null>(null);
  const triggerRef = useRef<HTMLElement>(null);

  return (
    <FloatingActionPanelContext.Provider value={{ isOpen, setIsOpen, mode, setMode, triggerRef }}>
      <div className="relative">
        {children({ mode, setIsOpen, setMode })}
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
    <motion.button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={handleClick}
      title={title}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'h-8 px-3 rounded-full border border-zinc-200 bg-white text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-800 transition-colors',
        isOpen && currentMode === mode && 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50',
        className
      )}
    >
      {children}
    </motion.button>
  );
}

interface FloatingActionPanelContentProps {
  children: ReactNode;
}

export function FloatingActionPanelContent({ children }: FloatingActionPanelContentProps) {
  const { isOpen, setIsOpen, triggerRef } = useFloatingActionPanel();
  const contentRef = useRef<HTMLDivElement>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTriggerRect(rect);
    }
  }, [isOpen, triggerRef]);

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

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setIsOpen, triggerRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed z-50 min-w-[280px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
            style={{
              left: triggerRect ? Math.max(8, triggerRect.left) : "50%",
              top: triggerRect ? triggerRect.bottom + 8 : "50%",
              transformOrigin: "top left",
            }}
          >
            {children}
          </motion.div>
        </>
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
        'block w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:bg-zinc-100 focus:text-zinc-900 transition-colors dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus:bg-zinc-800',
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
        'w-full resize-none rounded-md border border-zinc-200 bg-white text-zinc-900 px-3 py-2 text-sm placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600',
        className
      )}
    />
  );
}