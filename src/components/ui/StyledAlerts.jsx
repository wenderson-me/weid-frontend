// src/components/ui/StyledAlerts.jsx
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from './Alert';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { cn } from '../../utils/cn';

/**
 * Alerta de erro com ícone e estilo consistente
 */
export const ErrorAlert = ({ title = 'Error', children, className, ...props }) => (
  <Alert
    variant="destructive"
    className={cn("border-red-500 dark:border-red-700", className)}
    {...props}
  >
    <div className="flex items-start">
      <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 text-red-600 dark:text-red-400" />
      <div>
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>
          {children}
        </AlertDescription>
      </div>
    </div>
  </Alert>
);

/**
 * Alerta de sucesso com ícone e estilo consistente
 */
export const SuccessAlert = ({ title = 'Success', children, className, ...props }) => (
  <Alert
    className={cn("border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300", className)}
    {...props}
  >
    <div className="flex items-start">
      <FiCheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600 dark:text-green-400" />
      <div>
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>
          {children}
        </AlertDescription>
      </div>
    </div>
  </Alert>
);

/**
 * Alerta informativo com ícone e estilo consistente
 */
export const InfoAlert = ({ title = 'Information', children, className, ...props }) => (
  <Alert
    className={cn("border-blue-500 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300", className)}
    {...props}
  >
    <div className="flex items-start">
      <FiInfo className="h-5 w-5 mr-2 mt-0.5 text-blue-600 dark:text-blue-400" />
      <div>
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>
          {children}
        </AlertDescription>
      </div>
    </div>
  </Alert>
);

/**
 * Alerta de aviso com ícone e estilo consistente
 */
export const WarningAlert = ({ title = 'Warning', children, className, ...props }) => (
  <Alert
    className={cn("border-amber-500 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300", className)}
    {...props}
  >
    <div className="flex items-start">
      <FiAlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-amber-600 dark:text-amber-400" />
      <div>
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>
          {children}
        </AlertDescription>
      </div>
    </div>
  </Alert>
);

/**
 * Componente que pode exibir qualquer tipo de alerta com base no tipo
 */
export const DynamicAlert = ({ type = 'info', title, children, className, ...props }) => {
  switch (type.toLowerCase()) {
    case 'error':
      return <ErrorAlert title={title} className={className} {...props}>{children}</ErrorAlert>;
    case 'success':
      return <SuccessAlert title={title} className={className} {...props}>{children}</SuccessAlert>;
    case 'warning':
      return <WarningAlert title={title} className={className} {...props}>{children}</WarningAlert>;
    case 'info':
    default:
      return <InfoAlert title={title} className={className} {...props}>{children}</InfoAlert>;
  }
};