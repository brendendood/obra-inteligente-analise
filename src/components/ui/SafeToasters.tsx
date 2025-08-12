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

class SafeToasters extends React.Component<{}, { mounted: boolean; radixEnabled: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { mounted: false, radixEnabled: true };
  }
  componentDidMount() {
    // Defer render dos toasts para após o primeiro commit
    this.setState({ mounted: true });
  }
  render() {
    if (!this.state.mounted) return null;

    return (
      <React.Suspense fallback={null}>
        {this.state.radixEnabled && (
          <ToasterErrorBoundary onError={() => this.setState({ radixEnabled: false })}>
            <RadixToaster />
          </ToasterErrorBoundary>
        )}
        <ToasterErrorBoundary>
          <SonnerToaster />
        </ToasterErrorBoundary>
      </React.Suspense>
    );
  }
}

export default SafeToasters;
