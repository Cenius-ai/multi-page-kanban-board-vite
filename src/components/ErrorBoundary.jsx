import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-state">
          <div className="error-state-title">Something went wrong</div>
          <div className="error-state-desc">
            An unexpected error occurred. Try refreshing the page.
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              this.setState({ hasError: false, error: null });
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
