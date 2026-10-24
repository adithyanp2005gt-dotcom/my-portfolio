import { Component, ErrorInfo, ReactNode } from 'react';
import { Container } from '../layout/LayoutPrimitives';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg text-primary flex items-center justify-center font-sans">
          <Container className="max-w-xl text-center py-12">
            <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-surface border border-neutral-border">
              <svg
                className="w-8 h-8 text-accent animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-medium tracking-tight mb-4 uppercase">
              Engine Failure (Exception)
            </h1>
            <p className="text-secondary font-light text-sm mb-6 leading-relaxed">
              The application encountered an unexpected runtime error. System logs have recorded the occurrence.
            </p>
            {this.state.error && (
              <div className="bg-surface border border-neutral-border text-left rounded-[20px] p-5 font-mono text-[11px] text-secondary overflow-x-auto max-h-48 mb-8">
                <span className="text-accent font-semibold block mb-1">
                  {this.state.error.toString()}
                </span>
                {this.state.errorInfo?.componentStack}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center font-sans font-medium text-xs tracking-wider uppercase bg-primary text-bg px-6 py-3 rounded-[20px] border border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
            >
              Restart Environment
            </button>
          </Container>
        </div>
      );
    }

    return this.props.children;
  }
}
