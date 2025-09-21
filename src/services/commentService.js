import apiClient from '../config/axios';

class CommentService {
  /**
   * Get comments for a specific task
   * @param {string} taskId - Task ID
   * @param {Object} filters - Optional filters (limit, page, etc.)
   * @returns {Promise<Object>} Comments and pagination data
   */
  async getTaskComments(taskId, filters = {}) {
    try {
      const params = { task: taskId, ...filters };
      const response = await apiClient.get('/comments', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching task comments:', error);
      throw this._handleError(error, `Failed to fetch comments for task: ${taskId}`);
    }
  }

  /**
   * Create a new comment
   * @param {Object} commentData - Comment data (content, task, parentComment)
   * @returns {Promise<Object>} Created comment
   */
  async createComment(commentData) {
    try {
      const response = await apiClient.post('/comments', commentData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw this._handleError(error, 'Failed to create comment');
    }
  }

  /**
   * Update an existing comment
   * @param {string} commentId - Comment ID
   * @param {Object} commentData - Updated comment data
   * @returns {Promise<Object>} Updated comment
   */
  async updateComment(commentId, commentData) {
    try {
      const response = await apiClient.put(`/comments/${commentId}`, commentData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw this._handleError(error, `Failed to update comment: ${commentId}`);
    }
  }

  /**
   * Delete a comment
   * @param {string} commentId - Comment ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteComment(commentId) {
    try {
      const response = await apiClient.delete(`/comments/${commentId}`);
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw this._handleError(error, `Failed to delete comment: ${commentId}`);
    }
  }

  /**
   * Toggle like on a comment
   * @param {string} commentId - Comment ID
   * @returns {Promise<Object>} Updated comment
   */
  async toggleLike(commentId) {
    try {
      const response = await apiClient.post(`/comments/${commentId}/like`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw this._handleError(error, `Failed to toggle like on comment: ${commentId}`);
    }
  }

  /**
   * Get replies to a comment
   * @param {string} commentId - Comment ID
   * @returns {Promise<Array>} Array of reply comments
   */
  async getCommentReplies(commentId) {
    try {
      const response = await apiClient.get(`/comments/${commentId}/replies`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching comment replies:', error);
      throw this._handleError(error, `Failed to fetch replies for comment: ${commentId}`);
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


      if (error.response.status === 400 && error.response.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).join(', ');
        return new Error(`Validation error: ${errorMessages}`);
      }


      return new Error(error.response.data?.message || defaultMessage);
    }


    if (error.request) {
      return new Error('No response from server. Please check your connection.');
    }


    return new Error(error.message || defaultMessage);
  }
}

export default new CommentService();