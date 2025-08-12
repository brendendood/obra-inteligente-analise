import * as React from "react";

const RadixToaster = React.lazy(() => import("./toaster").then(m => ({ default: m.Toaster })));
const SonnerToaster = React.lazy(() => import("./sonner").then(m => ({ default: m.Toaster })));

// Isola erros dos sistemas de toast para não quebrar a aplicação inteira
class ToasterErrorBoundary extends React.Component<{ children: React.ReactNode; onError?: (e: Error) => void }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error("Toast system failed to mount:", error);
    this.props.onError?.(error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const SafeToasters: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  const [radixEnabled, setRadixEnabled] = React.useState(true);

  React.useEffect(() => {
    // Defer render dos toasts para após o primeiro commit
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <React.Suspense fallback={null}>
      {radixEnabled && (
        <ToasterErrorBoundary onError={() => setRadixEnabled(false)}>
          <RadixToaster />
        </ToasterErrorBoundary>
      )}
      <ToasterErrorBoundary>
        <SonnerToaster />
      </ToasterErrorBoundary>
    </React.Suspense>
  );
};

export default SafeToasters;
