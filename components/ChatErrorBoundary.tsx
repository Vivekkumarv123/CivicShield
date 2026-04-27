"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ChatErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== "test") {
      console.error("Uncaught error:", error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Something went wrong</h2>
          <p className="text-sm text-red-600 mb-4 text-center">
            {this.state.error?.message || "An unexpected error occurred in the chat."}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
