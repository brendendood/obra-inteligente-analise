
import React from "react";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

// Removemos next-themes para evitar hooks de contexto fora de timing.
// A aplicação já força tema light pelo ThemeProvider, então usamos "light" aqui.
const Toaster = ({ theme, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      duration={1700}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

// Enforce 1.7s duration for all Sonner toasts
const toast: any = (message: any, options?: any) => {
  return sonnerToast(message as any, { ...(options || {}), duration: 1700 });
};

toast.success = (message: any, options?: any) =>
  sonnerToast.success(message, { ...(options || {}), duration: 1700 });

toast.error = (message: any, options?: any) =>
  sonnerToast.error(message, { ...(options || {}), duration: 1700 });

export { Toaster, toast };
