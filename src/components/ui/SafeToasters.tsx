
import React from "react";
import { Toaster as RadixToaster } from "./toaster";
import { Toaster as SonnerToaster } from "./sonner";

const SafeToasters: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Defer render dos toasts para após o primeiro commit
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <RadixToaster />
      <SonnerToaster />
    </>
  );
};

export default SafeToasters;
