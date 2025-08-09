
import React, { lazy, Suspense } from "react";
const RadixToaster = lazy(() => import("./toaster").then(m => ({ default: m.Toaster })));
const SonnerToaster = lazy(() => import("./sonner").then(m => ({ default: m.Toaster })));


const SafeToasters: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Defer render dos toasts para após o primeiro commit
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <RadixToaster />
      <SonnerToaster />
    </Suspense>
  );
};

export default SafeToasters;
