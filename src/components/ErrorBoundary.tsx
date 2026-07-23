import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isOffline: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isOffline: !navigator.onLine, error: null };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => this.setState({ isOffline: false });

  handleOffline = () => this.setState({ isOffline: true });

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, isOffline: false, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service in production
    if (import.meta.env.PROD) {
      // Could integrate with Sentry, LogRocket, etc.
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.isOffline) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-night-50 to-night-100 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
              <WifiOff className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-night-900 mb-3">Sei offline</h1>
            <p className="text-night-500 mb-6">
              Controlla la tua connessione internet e riprova.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-6 py-3 rounded-xl bg-sage-500 text-white font-medium flex items-center gap-2 mx-auto hover:bg-sage-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Riprova
            </button>
          </div>
        </div>
      );
    }

    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-night-50 to-night-100 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-night-900 mb-3">Qualcosa e andato storto</h1>
            <p className="text-night-500 mb-6">
              Si e verificato un errore imprevisto. Il nostro team e stato notificato.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-6 py-3 rounded-xl bg-sage-500 text-white font-medium flex items-center gap-2 mx-auto hover:bg-sage-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Riprova
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
