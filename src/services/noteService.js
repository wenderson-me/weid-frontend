import apiClient from '../config/axios'

class NoteService {
  /**
   * Get all notes with optional filters
   * @param {Object} filters - Note filters
   * @returns {Promise<Object>} Notes and pagination data
   */
  async getNotes(filters = {}) {
    try {
      const response = await apiClient.get('/notes', { params: filters })

      // O backend retorna { status: 'success', data: { notes: [], total, page, limit, pages } }
      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      // Propagando o erro original para que o componente possa tratá-lo
      throw this._handleError(error, 'Falha ao buscar notas')
    }
  }

  /**
   * Get a specific note by ID
   * @param {string} noteId - Note ID
   * @returns {Promise<Object>} Note data
   */
  async getNoteById(noteId) {
    try {
      const response = await apiClient.get(`/notes/${noteId}`);

      // O backend retorna { status: 'success', data: {...} }
      if (response.data && response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error('Formato de resposta inesperado do servidor');
      }
    } catch (error) {
      // Propagando o erro original para que o componente possa tratá-lo
      throw this._handleError(error, `Falha ao buscar nota com ID: ${noteId}`)
    }
  }

  /**
   * Create a new note
   * @param {Object} noteData - Note data
   * @returns {Promise<Object>} Created note
   */
  async createNote(noteData) {
    try {
      // Ensure category is valid if provided
      if (noteData.category && !['general', 'personal', 'work', 'important', 'idea'].includes(noteData.category)) {
        noteData.category = 'general'; // Default to general if invalid
      }

      const response = await apiClient.post('/notes', noteData)

      // O backend retorna { status: 'success', message: '...', data: {...} }
      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, 'Falha ao criar nota')
    }
  }

  /**
   * Update an existing note
   * @param {string} noteId - Note ID
   * @param {Object} noteData - Updated note data
   * @returns {Promise<Object>} Updated note
   */
  async updateNote(noteId, noteData) {
    try {
      // Ensure category is valid if provided
      if (noteData.category && !['general', 'personal', 'work', 'important', 'idea'].includes(noteData.category)) {
        noteData.category = 'general'; // Default to general if invalid
      }

      const response = await apiClient.put(`/notes/${noteId}`, noteData)

      // O backend retorna { status: 'success', message: '...', data: {...} }
      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, `Falha ao atualizar nota com ID: ${noteId}`)
    }
  }

  /**
   * Delete a note
   * @param {string} noteId - Note ID
   * @returns {Promise<boolean>} Success indicator
   */
  async deleteNote(noteId) {
    try {
      const response = await apiClient.delete(`/notes/${noteId}`)

      // O backend retorna { status: 'success', message: '...' }
      return response.data.status === 'success'
    } catch (error) {
      throw this._handleError(error, `Falha ao excluir nota com ID: ${noteId}`)
    }
  }

  /**
   * Pin a note
   * @param {string} noteId - Note ID
   * @returns {Promise<Object>} Updated note
   */
  async pinNote(noteId) {
    try {
      const response = await apiClient.patch(`/notes/${noteId}/pin`)

      // O backend retorna { status: 'success', message: '...', data: {...} }
      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, `Falha ao fixar nota com ID: ${noteId}`)
    }
  }

  /**
   * Unpin a note
   * @param {string} noteId - Note ID
   * @returns {Promise<Object>} Updated note
   */
  async unpinNote(noteId) {
    try {
      const response = await apiClient.patch(`/notes/${noteId}/unpin`)

      // O backend retorna { status: 'success', message: '...', data: {...} }
      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, `Falha ao desafixar nota com ID: ${noteId}`)
    }
  }

  /**
   * Get note statistics
   * @returns {Promise<Object>} Note statistics
   */
  async getNoteStatistics() {
    try {
      const response = await apiClient.get('/notes/statistics')

      // O backend retorna { status: 'success', data: {...} }
      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, 'Falha ao buscar estatísticas das notas')
    }
  }

  /**
   * Helper method to handle and standardize errors
   * @private
   */
  _handleError(error, defaultMessage) {
    // Se o erro tiver uma resposta da API
    if (error.response) {
      // Verifica erros específicos
      if (error.response.status === 403) {
        error.permissionDenied = true; // Flag para identificar erros de permissão
        return new Error(error.response.data?.message || 'Você não tem permissão para realizar esta operação');
      }

      if (error.response.status === 404) {
        return new Error(error.response.data?.message || 'Recurso não encontrado');
      }

      // Erros de validação
      if (error.response.status === 400 && error.response.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).join(', ');
        return new Error(`Erro de validação: ${errorMessages}`);
      }

      // Usa a mensagem da API ou a mensagem padrão
      return new Error(error.response.data?.message || defaultMessage);
    }

    // Se o erro for de conexão
    if (error.request) {
      return new Error('Sem resposta do servidor. Verifique sua conexão.');
    }

    // Para outros erros
    return error;
  }
}

export default new NoteService()