import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000
const REQUEST_TIMEOUT = 30000 // 30 seconds

// Track last activity for session management
let lastActivityTime = Date.now()

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Update activity timestamp
const updateActivity = () => {
  lastActivityTime = Date.now()
}

// Check if session has expired
const isSessionExpired = () => {
  return Date.now() - lastActivityTime > SESSION_TIMEOUT
}

// Clear session data
const clearSession = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  window.dispatchEvent(new CustomEvent('session-expired'))
}

apiClient.interceptors.request.use(
  (config) => {
    // Check session expiration before each request
    if (isSessionExpired()) {
      clearSession()
      window.location.href = '/login?reason=session-expired'
      return Promise.reject(new Error('Session expired'))
    }

    // Get token from localStorage
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Update activity timestamp
    updateActivity()

    // Add request timestamp for debugging
    config.metadata = { startTime: Date.now() }

    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    // Update activity on successful response
    updateActivity()

    // Log request duration in development
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime
      console.debug(`API Request: ${response.config.method.toUpperCase()} ${response.config.url} - ${duration}ms`)
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
      return Promise.reject(new Error('Network error. Please check your connection.'))
    }

    const { status } = error.response

    // Handle 401 Unauthorized - attempt token refresh
    if (status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Attempt to refresh token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data.data

        // Store new tokens
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Update authorization header
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

        // Retry original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        clearSession()
        window.location.href = '/login?reason=session-expired'
        return Promise.reject(refreshError)
      }
    }

    // Handle 403 Forbidden
    if (status === 403) {
      console.error('Access forbidden:', error.response.data)
      window.dispatchEvent(new CustomEvent('access-denied', {
        detail: error.response.data
      }))
    }

    // Handle 429 Too Many Requests
    if (status === 429) {
      const retryAfter = error.response.headers['retry-after']
      console.warn(`Rate limit exceeded. Retry after ${retryAfter} seconds`)
    }

    // Handle 500 Server Error
    if (status >= 500) {
      console.error('Server error:', error.response.data)
      window.dispatchEvent(new CustomEvent('server-error', {
        detail: error.response.data
      }))
    }

    return Promise.reject(error)
  }
)

export default apiClient

// Export utility functions
export const securityUtils = {
  /**
   * Check if user session is still valid
   */
  isSessionValid: () => !isSessionExpired(),

  /**
   * Get time remaining until session expires (in milliseconds)
   */
  getSessionTimeRemaining: () => {
    const remaining = SESSION_TIMEOUT - (Date.now() - lastActivityTime)
    return Math.max(0, remaining)
  },

  /**
   * Manually update activity timestamp (e.g., on user interaction)
   */
  updateActivity,

  /**
   * Clear all session data
   */
  clearSession,

  /**
   * Get sanitized error message for display
   */
  getSafeErrorMessage: (error) => {
    if (!error) return 'An unknown error occurred'

    if (error.response?.data?.message) {
      return error.response.data.message
    }

    if (error.message) {
      // Don't expose internal error details in production
      if (import.meta.env.PROD) {
        return 'An error occurred. Please try again.'
      }
      return error.message
    }

    return 'An unknown error occurred'
  }
}