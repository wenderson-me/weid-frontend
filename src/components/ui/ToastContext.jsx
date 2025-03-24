import React, { createContext, useState, useContext, useCallback } from 'react';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose
} from '../../components/ui/Toast';

// Tipos de variantes disponíveis para o toast
const VARIANTS = {
  DEFAULT: 'default',
  DESTRUCTIVE: 'destructive',
  SUCCESS: 'success'
};

// Interface do contexto
const ToastContext = createContext({
  toast: (title, description, options) => {},
  success: (title, description, options) => {},
  error: (title, description, options) => {},
  info: (title, description, options) => {},
  dismiss: (id) => {}
});

export const useToast = () => useContext(ToastContext);

export const ToastContainer = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Gera um ID único para o toast
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Adiciona um novo toast à lista
  const addToast = useCallback((title, description, options = {}) => {
    const id = options.id || generateId();
    const variant = options.variant || VARIANTS.DEFAULT;
    const duration = options.duration || 5000;

    setToasts((prev) => [
      ...prev,
      { id, title, description, variant, duration }
    ]);

    // Auto-dismiss toast after duration if not infinite
    if (duration !== Infinity) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, []);

  // Remove um toast da lista
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // APIs específicas para diferentes tipos de toast
  const toast = useCallback((title, description, options = {}) => {
    return addToast(title, description, { ...options, variant: VARIANTS.DEFAULT });
  }, [addToast]);

  const success = useCallback((title, description, options = {}) => {
    return addToast(title, description, { ...options, variant: VARIANTS.SUCCESS });
  }, [addToast]);

  const error = useCallback((title, description, options = {}) => {
    return addToast(title, description, { ...options, variant: VARIANTS.DESTRUCTIVE });
  }, [addToast]);

  const info = useCallback((title, description, options = {}) => {
    return addToast(title, description, { ...options, variant: VARIANTS.DEFAULT });
  }, [addToast]);

  // Value para o provider
  const value = {
    toast,
    success,
    error,
    info,
    dismiss: dismissToast
  };

  return (
    <ToastContext.Provider value={value}>
      <ToastProvider>
        {children}
        <ToastViewport className="gap-2" />
        {toasts.map(({ id, title, description, variant }) => (
          <Toast
            key={id}
            variant={variant}
            onOpenChange={(open) => {
              if (!open) dismissToast(id);
            }}
          >
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
            <ToastClose />
          </Toast>
        ))}
      </ToastProvider>
    </ToastContext.Provider>
  );
};

export default ToastContext;