import { createContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('accessToken')

        if (token) {
          const user = await authService.getUserProfile()
          setCurrentUser(user)
        }
      } catch (err) {
        console.error("Auth initialization error:", err)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setCurrentUser(null)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const { user, tokens } = await authService.login(email, password)

      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)

      setCurrentUser(user)
      setError(null)

      return user
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const { user, tokens } = await authService.register(userData)

      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)

      setCurrentUser(user)
      setError(null)

      return user
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await authService.logout()
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setCurrentUser(null)
      setLoading(false)
    }
  }

  const forgotPassword = async (email) => {
    try {
      setLoading(true)
      await authService.forgotPassword(email)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send password reset email')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token, newPassword, confirmPassword) => {
    try {
      setLoading(true)
      await authService.resetPassword(token, newPassword, confirmPassword)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const tokens = await authService.refreshToken(refreshToken)
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)

      return tokens
    } catch (err) {
      console.error("Token refresh error:", err)
      logout()
      throw err
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    refreshToken
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext