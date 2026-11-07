import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCcw, AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Antigravity Caught Runtime Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleHardReset = () => {
    try {
      localStorage.removeItem('the-group-project-save');
      localStorage.removeItem('the-group-project-store');
      sessionStorage.clear();
    } catch (e) {
      console.error('Storage clear error:', e);
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0c1a',
          color: '#ffffff',
          padding: '24px',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            background: 'linear-gradient(145deg, #241731, #161122)',
            border: '1px solid rgba(255, 92, 146, 0.35)',
            borderRadius: '24px',
            padding: '36px 28px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.8)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 20px',
              borderRadius: '16px',
              background: 'rgba(255, 71, 126, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff5c92'
            }}>
              <AlertTriangle size={36} />
            </div>

            <span style={{
              display: 'inline-block',
              color: '#ffd77f',
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '0.15em',
              marginBottom: '10px'
            }}>
              APPLICATION RECOVERY
            </span>

            <h1 style={{
              fontSize: '28px',
              fontWeight: 1000,
              margin: '0 0 12px',
              letterSpacing: '-0.03em'
            }}>
              Something encountered a glitch.
            </h1>

            <p style={{
              color: '#cbbcd9',
              fontSize: '15px',
              lineHeight: 1.5,
              margin: '0 0 24px'
            }}>
              The group project crashed into an unexpected state. You can reload the game or reset to a fresh campaign.
            </p>

            {this.state.error && (
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px 14px',
                textAlign: 'left',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#ff94b8',
                marginBottom: '24px',
                maxHeight: '140px',
                overflowY: 'auto'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '12px',
              flexDirection: 'column'
            }}>
              <button
                onClick={this.handleReload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  minHeight: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ffe48d, #ff5c91)',
                  color: '#210e1b',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={18} /> RELOAD GAME
              </button>

              <button
                onClick={this.handleHardReset}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  minHeight: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#e4d6ee',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={16} /> RESET SAVED DATA & START FRESH
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
