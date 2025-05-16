import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, X } from "lucide-react";

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (state) => {
      setToasts(state.toasts);
    };
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg ${
            toast.variant === "error"
              ? "bg-red-600 text-white"
              : toast.variant === "success"
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-white"
          }`}
        >
          {toast.variant === "success" && (
            <CheckCircle className="h-5 w-5 mr-2" />
          )}
          {toast.variant === "error" && <XCircle className="h-5 w-5 mr-2" />}
          {toast.variant === "loading" && (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          )}
          <div className="flex-1">{toast.message}</div>
          <button
            onClick={toast.onDismiss}
            className="ml-2 p-1 rounded-full hover:bg-black/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
