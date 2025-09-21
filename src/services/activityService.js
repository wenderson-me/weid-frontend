
import apiClient from '../config/axios';

class ActivityService {
  /**
   * Get activities for the current user
   * @param {number} limit - Maximum number of activities to retrieve
   * @returns {Promise<Array>} Array of activities
   */
  async getUserActivities(limit = 10) {
    try {
      const response = await apiClient.get('/activities/user/recent', {
        params: { limit }
      });

      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw this._handleError(error, 'Failed to fetch user activities');
    }
  }

  /**
   * Get activities for a specific task
   * @param {string} taskId - Task ID
   * @param {number} limit - Maximum number of activities to retrieve
   * @returns {Promise<Array>} Array of activities
   */
  async getTaskHistory(taskId, limit = 50) {
    try {
      const response = await apiClient.get(`/activities/task/${taskId}/history`, {
        params: { limit }
      });

      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching activities for task ${taskId}:`, error);
      throw this._handleError(error, `Failed to fetch activity history for task: ${taskId}`);
    }
  }

  /**
   * Get activities for a specific note
   * @param {string} noteId - Note ID
   * @param {number} limit - Maximum number of activities to retrieve
   * @returns {Promise<Array>} Array of activities
   */
  async getNoteHistory(noteId, limit = 50) {
    try {
      const response = await apiClient.get(`/activities/note/${noteId}/history`, {
        params: { limit }
      });

      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching activities for note ${noteId}:`, error);
      throw this._handleError(error, `Failed to fetch activity history for note: ${noteId}`);
    }
  }

  /**
   * Get activities related to the current user (as actor or target)
   * @param {number} limit - Maximum number of activities to retrieve
   * @returns {Promise<Array>} Array of activities
   */
  async getUserRelatedActivities(limit = 20) {
    try {
      const response = await apiClient.get('/activities/user/related', {
        params: { limit }
      });

      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching user related activities:', error);
      throw this._handleError(error, 'Failed to fetch related activities');
    }
  }

  /**
   * Get activities with filters and pagination
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Paginated activities
   */
  async getActivities(filters = {}) {
    try {
      const response = await apiClient.get('/activities', {
        params: filters
      });


      if (response.data.activities) {
        return {
          activities: response.data.activities,
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          pages: response.data.pages
        };
      }

      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw this._handleError(error, 'Failed to fetch activities');
    }
  }

  /**
   * Helper method to handle and standardize errors
   * @private
   */
  _handleError(error, defaultMessage) {

    if (error.response) {

      if (error.response.status === 403) {
        error.permissionDenied = true;
        return new Error(error.response.data?.message || 'You do not have permission to perform this operation');
      }

      if (error.response.status === 404) {
        return new Error(error.response.data?.message || 'Resource not found');
      }


      return new Error(error.response.data?.message || defaultMessage);
    }


    if (error.request) {
      return new Error('No response from server. Please check your connection.');
    }


    return new Error(error.message || defaultMessage);
  }
}

export default new ActivityService();