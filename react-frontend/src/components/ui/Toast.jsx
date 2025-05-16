import { useState, createContext, useContext, useEffect } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = (message, { variant = "default", duration = 5000 } = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((current) => [...current, { id, message, variant }]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(({ id, message, variant }) => (
          <div
            key={id}
            className={`flex items-center rounded-md p-4 text-sm 
              ${
                variant === "destructive"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
          >
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
