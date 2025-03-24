// src/components/auth/AuthThemeToggle.jsx
import React from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';

/**
 * Componente para alternar entre os temas (claro, escuro, sistema)
 * Versão otimizada para as páginas de autenticação
 */
const AuthThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, getEffectiveTheme } = useTheme();

  // Determinar qual ícone e texto mostrar com base no tema atual
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return { icon: <FiSun className="h-5 w-5" />, label: 'Light' };
      case 'dark':
        return { icon: <FiMoon className="h-5 w-5" />, label: 'Dark' };
      case 'system':
      default:
        return { icon: <FiMonitor className="h-5 w-5" />, label: 'System' };
    }
  };

  // Alternar entre os temas em um ciclo: light -> dark -> system -> light
  const handleClick = () => {
    let newTheme;
    switch (theme) {
      case 'light':
        newTheme = 'dark';
        break;
      case 'dark':
        newTheme = 'system';
        break;
      case 'system':
      default:
        newTheme = 'light';
        break;
    }
    toggleTheme(newTheme);
  };

  const { icon, label } = getThemeIcon();
  const effectiveTheme = getEffectiveTheme();

  return (
    <Button
      className={`flex items-center space-x-2 ${
        effectiveTheme === 'dark' ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100'
      } border border-gray-300 dark:border-gray-700 ${className}`}
      onClick={handleClick}
      size="sm"
      variant="outline"
    >
      {icon}
      <span className="sr-only md:not-sr-only">{label}</span>
    </Button>
  );
};

export default AuthThemeToggle;