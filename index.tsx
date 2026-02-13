
import React, { ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicitly declare state and props to resolve 'property does not exist' errors.
  // This is required in some TypeScript configurations to ensure the compiler recognizes 
  // these properties on the ErrorBoundary class instance despite inheritance.
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Initialize state within the constructor as per standard React class component patterns.
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App Crashed:", error, errorInfo);
  }

  render() {
    // Destructuring state and props from 'this' to help TypeScript's type inference engine 
    // and resolve issues where properties are not correctly identified on the class instance.
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full border border-red-100">
            <h1 className="text-2xl font-bold text-red-600 mb-4">糟糕，網頁發生錯誤</h1>
            <p className="text-stone-600 mb-4">請嘗試重新整理頁面。如果問題持續發生，請截圖以下訊息回報給管理員。</p>
            <div className="bg-stone-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed">
              <p className="font-bold border-b border-stone-700 pb-2 mb-2">{error?.message}</p>
              <pre>{error?.stack}</pre>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition"
            >
              重新整理
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
