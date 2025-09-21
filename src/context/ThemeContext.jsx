import { createContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [theme, setTheme] = useState(() => {

    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme


    if (currentUser?.preferences?.theme) {
      return currentUser.preferences.theme
    }


    return 'system'
  })


  const createThemeOverlay = useCallback(() => {
    const overlay = document.createElement('div')
    overlay.className = 'theme-transition-overlay'
    document.body.appendChild(overlay)
    return overlay
  }, [])


  useEffect(() => {
    const root = window.document.documentElement
    const overlay = createThemeOverlay()


    root.classList.remove('light-theme', 'dark-theme')


    overlay.classList.add('active')


    setTimeout(() => {
      if (theme === 'system') {

        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.add(systemPrefersDark ? 'dark-theme' : 'light-theme')
      } else {

        root.classList.add(`${theme}-theme`)
      }


      overlay.classList.remove('active')
    }, 50)


    setTimeout(() => {
      overlay.remove()
    }, 300)


    localStorage.setItem('theme', theme)
  }, [theme, createThemeOverlay])


  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleChange = () => {
        const root = window.document.documentElement
        root.classList.remove('light-theme', 'dark-theme')
        root.classList.add(mediaQuery.matches ? 'dark-theme' : 'light-theme')
      }


      handleChange()

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])


  useEffect(() => {
    if (currentUser?.preferences?.theme && !localStorage.getItem('theme')) {
      setTheme(currentUser.preferences.theme)
    }
  }, [currentUser])


  const toggleTheme = useCallback((newTheme) => {
    setTheme(newTheme)
  }, [])


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