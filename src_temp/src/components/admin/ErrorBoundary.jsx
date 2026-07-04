import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 border border-red-200 rounded-3xl bg-red-50 text-red-950 shadow-md">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">System Error</p>
          <h2 className="text-2xl font-serif font-bold mt-2 mb-3">Something went wrong.</h2>
          <p className="text-sm text-stone-600 mb-6 bg-white/50 p-4 rounded-2xl border border-stone-200 font-mono">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <div className="flex gap-3">
            <button 
              className="rounded-full bg-red-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-900"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
            <button 
              className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-bold text-stone-700 transition hover:bg-stone-50"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
