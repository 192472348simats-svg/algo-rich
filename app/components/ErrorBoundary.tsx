"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in ${this.props.componentName || "Component"}:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
          <div className="p-3 rounded-full bg-red-500/10 text-red-500">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Something went wrong</h3>
            <p className="text-sm text-white/60 max-w-xs mx-auto">
              We encountered an error while rendering {this.props.componentName || "the interface"}.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh to try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
