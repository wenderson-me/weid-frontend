import apiClient from '../config/axios'

class TaskService {
  /**
   * Get all tasks with optional filters
   * @param {Object} filters - Task filters
   * @returns {Promise<Object>} Tasks and pagination data
   */
  async getTasks(filters = {}) {
    try {
      const response = await apiClient.get('/tasks', { params: filters })


      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else if (response.data && response.data.data) {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, 'Falha ao buscar tarefas')
    }
  }

/**
 * Get a specific task by ID
 * @param {string} taskId - Task ID
 * @returns {Promise<Object>} Task data
 */
async getTaskById(taskId) {

  if (!taskId) {
    throw new Error('Task ID is required');
  }

  try {
    const response = await apiClient.get(`/tasks/${taskId}`);


    if (!response || !response.data) {
      throw new Error('Received empty response from server');
    }


    let taskData;
    if (response.data.status === 'success' && response.data.data) {
      taskData = response.data.data;
    } else if (response.data.data) {
      taskData = response.data.data;
    } else if (response.data) {

      taskData = response.data;
    } else {
      throw new Error('Formato de resposta inesperado do servidor');
    }


    if (!taskData || !taskData._id) {
      throw new Error(`Task with ID ${taskId} not found or has invalid format`);
    }


    taskData._fetchedAt = new Date().toISOString();

    return taskData;
  } catch (error) {

    console.error(`Error fetching task ${taskId}:`, error);


    if (error.message === 'Network Error') {
      throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão de internet.');
    }


    if (error.response && error.response.status === 404) {
      throw new Error(`Tarefa com ID ${taskId} não encontrada.`);
    }

    throw this._handleError(error, `Falha ao buscar tarefa com ID: ${taskId}`);
  }
}

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task
   */
  async createTask(taskData) {
    try {
      const response = await apiClient.post('/tasks', taskData)

      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else if (response.data && response.data.data) {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, 'Falha ao criar tarefa')
    }
  }

  /**
   * Update an existing task
   * @param {string} taskId - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise<Object>} Updated task
   */
  async updateTask(taskId, taskData) {
    try {

      console.log(`Atualizando tarefa ${taskId} com dados:`, taskData);

      const response = await apiClient.put(`/tasks/${taskId}`, taskData);


      console.log(`Resposta do servidor para tarefa ${taskId}:`, response.data);


      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }

      throw new Error(`Formato de resposta inesperado do servidor`);
    } catch (error) {
      console.error(`Erro ao atualizar tarefa ${taskId}:`, error);
      throw this._handleError(error, `Falha ao atualizar tarefa com ID: ${taskId}`);
    }
  }

  async updatePositions(positionUpdates) {
    try {
      const response = await apiClient.post('/tasks/positions', { updates: positionUpdates });
      return response.data;
    } catch (error) {
      console.error('Failed to update task positions:', error);
      throw this._handleError(error, 'Failed to update task positions');
    }
  }


  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @returns {Promise<boolean>} Success indicator
   */
  async deleteTask(taskId) {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}`)


      return response.data && response.data.status === 'success'
    } catch (error) {
      throw this._handleError(error, `Falha ao excluir tarefa com ID: ${taskId}`)
    }
  }

  /**
   * Archive a task
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} Updated task
   */
  async archiveTask(taskId) {
    try {
      const response = await apiClient.patch(`/tasks/${taskId}/archive`)

      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else if (response.data && response.data.data) {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, `Falha ao arquivar tarefa com ID: ${taskId}`)
    }
  }

  /**
   * Restore an archived task
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} Updated task
   */
  async restoreTask(taskId) {
    try {
      const response = await apiClient.patch(`/tasks/${taskId}/restore`)

      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else if (response.data && response.data.data) {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, `Falha ao restaurar tarefa com ID: ${taskId}`)
    }
  }

  /**
   * Assign a user to a task
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID to assign
   * @returns {Promise<Object>} Updated task
   */
  async assignUser(taskId, userId) {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/assignees/${userId}`)

      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else if (response.data && response.data.data) {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, `Falha ao atribuir usuário à tarefa`)
    }
  }

  /**
   * Unassign a user from a task
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID to unassign
   * @returns {Promise<Object>} Updated task
   */
  async unassignUser(taskId, userId) {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}/assignees/${userId}`)

      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else if (response.data && response.data.data) {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, `Falha ao remover usuário da tarefa`)
    }
  }

  /**
   * Get task statistics
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Task statistics
   */
  async getTaskStatistics(filters = {}) {
    try {
      const response = await apiClient.get('/tasks/statistics', { params: filters })

      if (response.data && response.data.status === 'success') {
        return response.data.data
      } else if (response.data && response.data.data) {
        return response.data.data
      } else {
        throw new Error('Formato de resposta inesperado do servidor')
      }
    } catch (error) {
      throw this._handleError(error, 'Falha ao buscar estatísticas das tarefas')
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
        return new Error(error.response.data?.message || 'Você não tem permissão para realizar esta operação');
      }

      if (error.response.status === 404) {
        return new Error(error.response.data?.message || 'Recurso não encontrado');
      }


      if (error.response.status === 400 && error.response.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).join(', ');
        return new Error(`Erro de validação: ${errorMessages}`);
      }


      return new Error(error.response.data?.message || defaultMessage);
    }


    if (error.request) {
      return new Error('Sem resposta do servidor. Verifique sua conexão.');
    }


    return error;
  }


/**
 * Get tasks by date range (for calendar views)
 * @param {Date} startDate - Start date for the range
 * @param {Date} endDate - End date for the range
 * @param {Object} additionalFilters - Additional filters to apply
 * @returns {Promise<Array>} Tasks within the date range
 */
async getTasksByDateRange(startDate, endDate, additionalFilters = {}) {
  try {
    const filters = {
      ...additionalFilters,
      dueStart: startDate.toISOString(),
      dueEnd: endDate.toISOString()
    };

    const response = await apiClient.get('/tasks', { params: filters });

    if (response.data && response.data.status === 'success') {
      return response.data.data.tasks || [];
    } else if (response.data && response.data.data) {
      return response.data.data.tasks || [];
    } else {
      throw new Error('Unexpected response format from server');
    }
  } catch (error) {
    throw this._handleError(error, 'Failed to fetch tasks for the specified date range');
  }
}

/**
 * Get tasks scheduled for a specific day
 * @param {Date} date - The specific date
 * @param {Object} additionalFilters - Additional filters to apply
 * @returns {Promise<Array>} Tasks for the specified day
 */
async getTasksForDay(date, additionalFilters = {}) {

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  return this.getTasksByDateRange(startDate, endDate, additionalFilters);
}

/**
 * Get tasks scheduled for the current week
 * @param {Date} date - A date within the week
 * @param {Object} additionalFilters - Additional filters to apply
 * @returns {Promise<Array>} Tasks for the current week
 */
async getTasksForWeek(date, additionalFilters = {}) {

  const startDate = new Date(date);
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);
  startDate.setHours(0, 0, 0, 0);


  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return this.getTasksByDateRange(startDate, endDate, additionalFilters);
}

/**
 * Get tasks scheduled for the current month
 * @param {Date} date - A date within the month
 * @param {Object} additionalFilters - Additional filters to apply
 * @returns {Promise<Array>} Tasks for the current month
 */
async getTasksForMonth(date, additionalFilters = {}) {

  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  startDate.setHours(0, 0, 0, 0);


  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  endDate.setHours(23, 59, 59, 999);

  return this.getTasksByDateRange(startDate, endDate, additionalFilters);
}

/**
 * Get upcoming tasks for a specified number of days
 * @param {number} days - Number of days to look ahead
 * @param {Object} additionalFilters - Additional filters to apply
 * @returns {Promise<Array>} Upcoming tasks
 */
async getUpcomingTasks(days = 30, additionalFilters = {}) {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);
  endDate.setHours(23, 59, 59, 999);

  return this.getTasksByDateRange(startDate, endDate, additionalFilters);
}

/**
 * Get overdue tasks
 * @param {Object} additionalFilters - Additional filters to apply
 * @returns {Promise<Array>} Overdue tasks
 */
async getOverdueTasks(additionalFilters = {}) {
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);


  const startDate = new Date(2000, 0, 1);


  const filters = {
    ...additionalFilters,
    status: ['todo', 'inProgress', 'inReview']
  };

  return this.getTasksByDateRange(startDate, endDate, filters);
}
}

export default new TaskService()