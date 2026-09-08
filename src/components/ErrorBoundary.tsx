import React, { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
  };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('JOUR J ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080808] text-[#F7F3EA] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full rounded-3xl border border-[#D7B45A]/40 bg-[#141414] p-8 space-y-6 shadow-2xl">
            <div className="w-14 h-14 rounded-full border border-[#D7B45A]/60 bg-[#1e1e1e] flex items-center justify-center mx-auto text-[#D7B45A] text-xl font-bold shadow-lg shadow-[#D7B45A]/20">
              ♛
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-bold font-serif text-[#F7F3EA]">
                JOUR <span className="text-[#D7B45A]">J</span>
              </h1>
              <p className="text-sm text-[#A0A0A0]">
                حدث خطأ غير متوقع أثناء عرض الصفحة، يرجى إعادة التحميل للمتابعة.
              </p>
              {this.state.error?.message && (
                <p className="text-[11px] text-[#ff6b6b] bg-[#221313] p-2.5 rounded-xl border border-[#ff6b6b]/30 font-mono text-left overflow-x-auto max-h-24">
                  {this.state.error.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] text-[#111] font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-md"
              >
                إعادة تحميل الصفحة
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-2.5 rounded-xl bg-[#1e1e1e] text-[#aaa] hover:text-white border border-[#333] text-xs transition-colors cursor-pointer"
              >
                مسح التخزين المؤقت وإعادة البدء
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
