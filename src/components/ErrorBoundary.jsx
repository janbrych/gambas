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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-slate-900 border border-red-500/50 rounded-3xl p-8 space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white">System Anomaly Detected</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              A quantum decoherence occurred in the application runtime.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left font-mono text-[10px] text-red-400 overflow-x-auto">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-purple-600/30"
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
