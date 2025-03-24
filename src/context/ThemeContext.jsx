// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

// Criando o contexto com valores padrão
const ThemeContext = createContext({
  theme: 'system',
  toggleTheme: () => {},
  getEffectiveTheme: () => 'light',
});

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [theme, setTheme] = useState(() => {
    // Primeiro verificamos se há um tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // Depois verificamos se o usuário tem preferências salvas
    if (currentUser?.preferences?.theme) {
      return currentUser.preferences.theme;
    }

    // Padrão é 'system'
    return 'system';
  });

  // Criar overlay para transição de tema (evita flash visual)
  const createThemeOverlay = useCallback(() => {
    const overlay = document.createElement('div');
    overlay.classList.add('fixed', 'inset-0', 'bg-white', 'dark:bg-gray-900', 'opacity-0', 'transition-opacity', 'duration-300', 'pointer-events-none', 'z-50');
    document.body.appendChild(overlay);
    return overlay;
  }, []);

  // Aplicar a classe correspondente ao tema no elemento <html> quando o tema muda
  useEffect(() => {
    const root = document.documentElement;
    const overlay = createThemeOverlay();

    // Limpar classes antigas
    root.classList.remove('light-theme', 'dark-theme');

    // Mostrar overlay para transição suave
    overlay.classList.add('active');
    overlay.style.opacity = '0.3';

    // Aplicar tema após um pequeno intervalo para permitir a transição
    setTimeout(() => {
      if (theme === 'system') {
        // Verificar preferência do sistema
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(systemPrefersDark ? 'dark-theme' : 'light-theme');

        // Atualizar atributo data-theme para o tailwind
        root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
      } else {
        // Aplicar tema específico
        root.classList.add(`${theme}-theme`);

        // Atualizar atributo data-theme para o tailwind
        root.setAttribute('data-theme', theme);
      }

      // Esconder overlay
      overlay.style.opacity = '0';

      // Limpar overlay após a transição
      setTimeout(() => {
        overlay.remove();
      }, 300);

      // Salvar no localStorage
      localStorage.setItem('theme', theme);
    }, 50);
  }, [theme, createThemeOverlay]);

  // Atualizar o tema quando a preferência do sistema muda
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const root = document.documentElement;
      root.classList.remove('light-theme', 'dark-theme');
      root.classList.add(mediaQuery.matches ? 'dark-theme' : 'light-theme');

      // Atualizar atributo data-theme para o tailwind
      root.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
    };

    // Chamar handler imediatamente para definir o estado inicial
    handleChange();

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Atualizar o tema quando as preferências do usuário são carregadas/alteradas
  useEffect(() => {
    if (currentUser?.preferences?.theme && !localStorage.getItem('theme')) {
      setTheme(currentUser.preferences.theme);
    }
  }, [currentUser]);

  // Função para alternar entre temas
  const toggleTheme = useCallback((newTheme) => {
    setTheme(newTheme);
  }, []);

  // Função para obter o tema efetivo atual (light/dark)
  const getEffectiveTheme = useCallback(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        getEffectiveTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;