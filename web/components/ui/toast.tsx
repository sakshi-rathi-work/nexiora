'use client';

import * as React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const toastConfig: Record<
  ToastType,
  { icon: React.ReactNode; borderColor: string; iconColor: string }
> = {
  success: {
    icon: <CheckCircle size={18} />,
    borderColor: 'border-l-[var(--status-success)]',
    iconColor: 'text-[var(--status-success)]',
  },
  error: {
    icon: <AlertCircle size={18} />,
    borderColor: 'border-l-[var(--status-error)]',
    iconColor: 'text-[var(--status-error)]',
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    borderColor: 'border-l-[var(--status-warning)]',
    iconColor: 'text-[var(--status-warning)]',
  },
  info: {
    icon: <Info size={18} />,
    borderColor: 'border-l-[var(--status-info)]',
    iconColor: 'text-[var(--status-info)]',
  },
};

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full"
    >
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];
        return (
          <div
            key={toast.id}
            role="alert"
            className={clsx(
              'flex items-start gap-3 bg-white rounded-[var(--radius-card)] shadow-lg',
              'border border-[var(--nexiora-border)] border-l-4 px-4 py-3',
              config.borderColor,
            )}
          >
            <span className={clsx('mt-0.5 shrink-0', config.iconColor)}>
              {config.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--nexiora-navy)]">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-xs text-[var(--nexiora-slate)] mt-0.5">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 text-[var(--nexiora-slate-light)] hover:text-[var(--nexiora-navy)] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
