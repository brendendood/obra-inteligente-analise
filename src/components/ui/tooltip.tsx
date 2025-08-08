import * as React from "react"

import { cn } from "@/lib/utils"

// Lightweight Tooltip implementation compatible with existing API
// Exports: Tooltip, TooltipTrigger, TooltipContent, TooltipProvider

const TooltipProvider: React.FC<React.PropsWithChildren<{ delayDuration?: number }>> = ({ children }) => (
  <>{children}</>
);

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  delay: number;
  id: string;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

interface TooltipRootProps {
  children: React.ReactNode;
  delayDuration?: number;
}

const Tooltip: React.FC<TooltipRootProps> = ({ children, delayDuration = 200 }) => {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();

  return (
    <span className="relative inline-flex">
      <TooltipContext.Provider value={{ open, setOpen, delay: delayDuration, id }}>
        {children}
      </TooltipContext.Provider>
    </span>
  );
};

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: React.ReactElement;
}

const composeHandlers = <E extends React.SyntheticEvent>(
  theirs?: (e: E) => void,
  ours?: (e: E) => void
) => {
  return (e: E) => {
    theirs?.(e);
    if (!e.defaultPrevented) {
      ours?.(e);
    }
  };
};

const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ asChild = true, children, ...props }, ref) => {
    const ctx = React.useContext(TooltipContext);
    if (!ctx) return children;

    const child = React.Children.only(children) as React.ReactElement<any>;

    const onMouseEnter = () => {
      window.clearTimeout((onMouseEnter as any)._t);
      (onMouseEnter as any)._t = window.setTimeout(() => ctx.setOpen(true), ctx.delay);
    };
    const onMouseLeave = () => {
      window.clearTimeout((onMouseEnter as any)._t);
      ctx.setOpen(false);
    };

    const onFocus = () => ctx.setOpen(true);
    const onBlur = () => ctx.setOpen(false);

    const mergedProps = {
      'aria-describedby': ctx.open ? ctx.id : undefined,
      tabIndex: child.props.tabIndex ?? 0,
      onMouseEnter: composeHandlers(child.props.onMouseEnter, onMouseEnter),
      onMouseLeave: composeHandlers(child.props.onMouseLeave, onMouseLeave),
      onFocus: composeHandlers(child.props.onFocus, onFocus),
      onBlur: composeHandlers(child.props.onBlur, onBlur),
      ...props,
      ref: (node: HTMLElement) => {
        if (typeof ref === 'function') ref(node);
        else if (ref && 'current' in (ref as any)) (ref as any).current = node;
      },
    } as any;

    return React.cloneElement(child, mergedProps);
  }
);
TooltipTrigger.displayName = 'TooltipTrigger';

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end' | (string & {});
  avoidCollisions?: boolean;
  collisionPadding?: number | number[];
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side = 'top', sideOffset = 6, style, children, ...props }, ref) => {
    const ctx = React.useContext(TooltipContext);
    if (!ctx || !ctx.open) return null;

    const sideClass =
      side === 'top'
        ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
        : side === 'bottom'
        ? 'top-full left-1/2 -translate-x-1/2 mt-2'
        : side === 'left'
        ? 'right-full top-1/2 -translate-y-1/2 mr-2'
        : 'left-full top-1/2 -translate-y-1/2 ml-2';

    const offsetStyle =
      side === 'top'
        ? { marginBottom: sideOffset }
        : side === 'bottom'
        ? { marginTop: sideOffset }
        : side === 'left'
        ? { marginRight: sideOffset }
        : { marginLeft: sideOffset };

    return (
      <div
        id={ctx.id}
        role="tooltip"
        ref={ref}
        style={{ ...offsetStyle, ...style }}
        className={cn(
          'absolute z-50 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md',
          'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          sideClass,
          className
        )}
        data-side={side}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
