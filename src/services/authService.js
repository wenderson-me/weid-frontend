import apiClient from '../config/axios'

class AuthService {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and tokens
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password })

      if (response.data && response.data.data) {

        const { tokens } = response.data.data
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)

        return response.data.data
      } else {
        throw new Error('Unexpected response format from server')
      }
    } catch (error) {
      if (error.response) {

        const message = error.response.data?.message || 'Authentication failed'
        throw new Error(message)
      } else if (error.request) {

        throw new Error('No response from server. Please check your connection.')
      } else {

        throw error
      }
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user and tokens
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData)

      if (response.data && response.data.data) {

        const { tokens } = response.data.data
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)

        return response.data.data
      } else {
        throw new Error('Unexpected response format from server')
      }
    } catch (error) {
      if (error.response) {

        if (error.response.status === 409) {
          throw new Error('Email is already in use')
        }

        const message = error.response.data?.message || 'Registration failed'
        throw new Error(message)
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.')
      } else {
        throw error
      }
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile() {
    try {
      const response = await apiClient.get('/users/profile')

      if (response.data && response.data.data) {
        return response.data.data
      } else {
        throw new Error('Unexpected response format from server')
      }
    } catch (error) {
      if (error.response) {

        if (error.response.status === 401) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          throw new Error('Session expired. Please login again.')
        }

        const message = error.response.data?.message || 'Failed to fetch user profile'
        throw new Error(message)
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.')
      } else {
        throw error
      }
    }
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Success message
   */
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || 'Failed to send password reset email'
        throw new Error(message)
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.')
      } else {
        throw error
      }
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   * @param {string} confirmPassword - Confirm new password
   * @returns {Promise<Object>} Success message
   */
  async resetPassword(token, newPassword, confirmPassword) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
        confirmPassword
      })
      return response.data
    } catch (error) {
      if (error.response) {

        if (error.response.status === 400) {
          throw new Error('Invalid or expired token')
        }

        const message = error.response.data?.message || 'Failed to reset password'
        throw new Error(message)
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.')
      } else {
        throw error
      }
    }
  }

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @param {string} confirmPassword - Confirm new password
   * @returns {Promise<Object>} Success message
   */
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      })
      return response.data
    } catch (error) {
      if (error.response) {

        if (error.response.status === 400) {
          throw new Error('Current password is incorrect or new password does not meet requirements')
        }

        const message = error.response.data?.message || 'Failed to change password'
        throw new Error(message)
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.')
      } else {
        throw error
      }
    }
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New tokens
   */
  async refreshToken(refreshToken) {
    try {
      const response = await apiClient.post('/auth/refresh-token', { refreshToken })

      if (response.data && response.data.data) {
        return response.data.data
      } else {
        throw new Error('Unexpected response format from server')
      }
    } catch (error) {
      if (error.response) {

        if (error.response.status === 401) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }

        const message = error.response.data?.message || 'Failed to refresh token'
        throw new Error(message)
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.')
      } else {
        throw error
      }
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!localStorage.getItem('accessToken')
  }
}

export default new AuthService()