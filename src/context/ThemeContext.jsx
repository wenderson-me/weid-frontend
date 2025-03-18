import { createContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [theme, setTheme] = useState(() => {
    // First check if there's a theme saved in localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme

    // Then check if the user has saved preferences
    if (currentUser?.preferences?.theme) {
      return currentUser.preferences.theme
    }

    // Default is 'system'
    return 'system'
  })

  // Create theme transition overlay
  const createThemeOverlay = useCallback(() => {
    const overlay = document.createElement('div')
    overlay.className = 'theme-transition-overlay'
    document.body.appendChild(overlay)
    return overlay
  }, [])

  // Effect to apply the class to the html element when the theme changes
  useEffect(() => {
    const root = window.document.documentElement
    const overlay = createThemeOverlay()

    // Clear old classes
    root.classList.remove('light-theme', 'dark-theme')

    // Show overlay
    overlay.classList.add('active')

    // Apply theme after a short delay to allow transition
    setTimeout(() => {
      if (theme === 'system') {
        // Check system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.add(systemPrefersDark ? 'dark-theme' : 'light-theme')
      } else {
        // Apply specific theme
        root.classList.add(`${theme}-theme`)
      }

      // Hide overlay
      overlay.classList.remove('active')
    }, 50)

    // Cleanup overlay after transition
    setTimeout(() => {
      overlay.remove()
    }, 300)

    // Save to localStorage
    localStorage.setItem('theme', theme)
  }, [theme, createThemeOverlay])

  // Effect to update the theme when system preference changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleChange = () => {
        const root = window.document.documentElement
        root.classList.remove('light-theme', 'dark-theme')
        root.classList.add(mediaQuery.matches ? 'dark-theme' : 'light-theme')
      }

      // Call handler immediately to set initial state
      handleChange()

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  // Effect to update the theme when user preferences are loaded/changed
  useEffect(() => {
    if (currentUser?.preferences?.theme && !localStorage.getItem('theme')) {
      setTheme(currentUser.preferences.theme)
    }
  }, [currentUser])

  // Function to toggle between themes
  const toggleTheme = useCallback((newTheme) => {
    setTheme(newTheme)
  }, [])

  // Function to get current effective theme (light/dark)
  const getEffectiveTheme = useCallback(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, getEffectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext