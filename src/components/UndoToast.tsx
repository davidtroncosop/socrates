import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { RotateCcw, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  actionText?: string;
  onUndo?: () => void;
  secondsRemaining: number;
}

interface ToastContextType {
  showToast: (message: string, onUndo?: () => void, actionText?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, onUndo?: () => void, actionText = 'Deshacer') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      id,
      message,
      actionText,
      onUndo,
      secondsRemaining: 10,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    const interval = setInterval(() => {
      setToasts((prev) =>
        prev
          .map((t) => ({ ...t, secondsRemaining: t.secondsRemaining - 1 }))
          .filter((t) => t.secondsRemaining > 0)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [toasts.length]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container at bottom-left per specification */}
      <aside
        aria-live="polite"
        aria-label="Notificaciones del sistema"
        className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            style={{ backgroundColor: '#EDEDED' }}
            className="pointer-events-auto rounded-xl p-3.5 border border-gray-200 flex items-center justify-between gap-3 text-[13px] text-gray-900 transition-all duration-200"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
              <span>{toast.message}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {toast.onUndo && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onUndo?.();
                    removeToast(toast.id);
                  }}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-500 hover:text-blue-600 px-3 py-1 rounded-full border border-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-200 focus-visible:ring-2 ring-blue-400"
                >
                  <RotateCcw size={14} strokeWidth={1.5} />
                  <span>{toast.actionText} ({toast.secondsRemaining}s)</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Cerrar notificación"
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full transition-colors focus-visible:ring-2 ring-blue-400"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
