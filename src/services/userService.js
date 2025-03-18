import apiClient from '../config/axios'

class UserService {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const response = await apiClient.get('/users/profile')
      return response.data.data
    } catch (error) {
      this._handleError(error, 'Failed to fetch user profile')
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/users/profile', profileData)
      return response.data.data
    } catch (error) {
      throw this._handleError(error, 'Failed to update profile')
    }
  }

  /**
   * Update user preferences
   * @param {Object} preferencesData - Preferences data to update
   * @returns {Promise<Object>} Updated user data
   */
  async updatePreferences(preferencesData) {
    try {
      const response = await apiClient.put('/users/profile/preferences', preferencesData)
      return response.data.data
    } catch (error) {
      throw this._handleError(error, 'Failed to update preferences')
    }
  }

  /**
   * Update user avatar
   * @param {string} avatarUrl - URL or base64 image data
   * @returns {Promise<Object>} Updated user data
   */
  async updateAvatar(avatarUrl) {
    try {
      const response = await apiClient.put('/users/profile/avatar', { avatar: avatarUrl })
      return response.data.data
    } catch (error) {
      throw this._handleError(error, 'Failed to update avatar')
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @returns {Promise<Object>} Success message
   */
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post('/auth/change-password', passwordData)
      return response.data
    } catch (error) {
      throw this._handleError(error, 'Failed to change password')
    }
  }

  /**
   * Deactivate current user's account
   * @returns {Promise<boolean>} Success indicator
   */
  async deactivateAccount() {
    try {
      await apiClient.patch('/users/profile/deactivate')
      return true
    } catch (error) {
      throw this._handleError(error, 'Failed to deactivate account')
    }
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  async getUserStatistics() {
    try {
      const response = await apiClient.get('/users/profile/statistics')
      return response.data.data
    } catch (error) {
      throw this._handleError(error, 'Failed to fetch user statistics')
    }
  }

  /**
   * Get a user by ID (admin/manager only)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`)
      return response.data.data
    } catch (error) {
      throw this._handleError(error, 'Failed to fetch user')
    }
  }

  /**
   * Get all users with filters (admin/manager only)
   * @param {Object} filters - Filters for the user list
   * @returns {Promise<Object>} Users list with pagination
   */
  async getUsers(filters = {}) {
    try {
      const response = await apiClient.get('/users', { params: filters })
      return response.data.data
    } catch (error) {
      throw this._handleError(error, 'Failed to fetch users')
    }
  }

  /**
   * Helper to handle errors
   * @private
   * @param {Error} error - The caught error
   * @param {string} defaultMessage - Default error message
   * @returns {Error} Processed error
   */
  _handleError(error, defaultMessage) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || defaultMessage
      return new Error(message)
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('No response from server. Please check your connection.')
    } else {
      // Something happened in setting up the request that triggered an Error
      return error
    }
  }
}

export default new UserService()