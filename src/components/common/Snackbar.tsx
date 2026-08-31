import { useEffect } from "react";

export interface ToastItem {
  id: string;
  message: string;
}

interface SnackbarProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
  duration?: number;
}

function SnackbarItem({
  toast,
  onRemove,
  duration = 3000,
}: {
  toast: ToastItem;
  onRemove: (id: string) => void;
  duration?: number;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onRemove(toast.id);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [toast.id, duration, onRemove]);

  return (
    <div
      role="status"
      className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#0F172A] text-white text-xs rounded-xl shadow-2xl border border-slate-800 group transition-all animate-in fade-in slide-in-from-bottom-3 w-auto max-w-[calc(100vw-32px)] sm:max-w-md"
    >
      <div className="flex items-center gap-2 min-w-0">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span className="font-medium truncate">{toast.message}</span>
      </div>
      <button
        type="button"
        aria-label="Close notification"
        onClick={() => onRemove(toast.id)}
        className="p-1 rounded-md text-[#94A3B8] hover:text-white hover:bg-white/10 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 focus:opacity-100 transition-opacity cursor-pointer ml-1.5 flex-shrink-0"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function Snackbar({ toasts, onRemove, duration = 3000 }: SnackbarProps) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col gap-2 pointer-events-none items-end"
    >
      {toasts.map((toast) => (
        <SnackbarItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
          duration={duration}
        />
      ))}
    </div>
  );
}
