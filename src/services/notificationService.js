import apiClient from '../config/axios'

class NotificationService {
  /**
   * Get all notifications with optional filters
   * @param {Object} filters - Notification filters
   * @returns {Promise<Object>} Notifications and pagination data
   */
  async getNotifications(filters = {}) {
    try {
      const response = await apiClient.get('/notifications', { params: filters })

      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, 'Falha ao buscar notificações')
    }
  }

  /**
   * Get unread notifications count
   * @returns {Promise<number>} Unread count
   */
  async getUnreadCount() {
    try {
      const response = await apiClient.get('/notifications/unread-count')

      if (response.data && response.data.status === 'success') {
        return response.data.data.count
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, 'Falha ao buscar contador de notificações')
    }
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  async markAsRead(notificationId) {
    try {
      const response = await apiClient.patch(`/notifications/${notificationId}/read`)

      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, `Falha ao marcar notificação como lida: ${notificationId}`)
    }
  }

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>} Result
   */
  async markAllAsRead() {
    try {
      const response = await apiClient.patch('/notifications/mark-all-read')

      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, 'Falha ao marcar todas as notificações como lidas')
    }
  }

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Result
   */
  async deleteNotification(notificationId) {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`)

      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, `Falha ao remover notificação: ${notificationId}`)
    }
  }

  /**
   * Handle API errors
   * @private
   */
  _handleError(error, defaultMessage) {
    if (error.response) {

      const serverMessage = error.response.data?.message || error.response.data?.error
      return new Error(serverMessage || defaultMessage)
    } else if (error.request) {

      return new Error('Erro de conexão com o servidor')
    } else {

      return new Error(error.message || defaultMessage)
    }
  }
}

export default new NotificationService()