import React from 'react';
import { ToastContainer } from './ToastContext';

// Este componente centraliza todos os providers que os componentes Shadcn/UI precisam
export const ShadcnProvider = ({ children }) => {
  return (
    <ToastContainer>
      {children}
    </ToastContainer>
  );
};

export default ShadcnProvider;