import { createContext, useState, useEffect, useCallback } from 'react'
import taskService from '../services/taskService'
import { useAuth } from '../hooks/useAuth'

const TaskContext = createContext(null)

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [tasks, setTasks] = useState([])
  const [taskCache, setTaskCache] = useState({})
  const [tasksByStatus, setTasksByStatus] = useState({
    todo: [],
    inProgress: [],
    inReview: [],
    done: []
  })
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async (filters = {}) => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      const response = await taskService.getTasks(filters)

      // Set all tasks
      setTasks(response.tasks || [])

      // Group tasks by status
      const grouped = {
        todo: [],
        inProgress: [],
        inReview: [],
        done: []
      }

      // Make sure we handle the response structure correctly
      const tasksArray = Array.isArray(response.tasks) ? response.tasks : [];
      tasksArray.forEach(task => {
        if (grouped[task.status]) {
          grouped[task.status].push(task);
        } else {
          grouped.todo.push(task);
        }
      });

      Object.keys(grouped).forEach(status => {
        grouped[status].sort((a, b) => (a.position || 0) - (b.position || 0));
      });

      setTasksByStatus(grouped)
      setError(null)
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError(err.message || 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const fetchStatistics = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      const stats = await taskService.getTaskStatistics()
      setStatistics(stats)
    } catch (err) {
      console.error("Error fetching task statistics:", err)
      // Don't set error state here to avoid blocking the UI
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks()
      fetchStatistics()
    }
  }, [isAuthenticated, fetchTasks, fetchStatistics])

  const getTaskById = async (taskId) => {
    try {
      // Return cached task if it exists and we're not in loading state
      if (taskCache[taskId] && !loading) {
        return taskCache[taskId]
      }

      setLoading(true)
      setError(null)

      const task = await taskService.getTaskById(taskId)

      // Update the cache with the new task
      setTaskCache(prev => ({
        ...prev,
        [taskId]: task
      }))

      return task
    } catch (err) {
      console.error(`Failed to fetch task with ID: ${taskId}`, err)
      const errorMessage = err.response?.data?.message ||
                           err.message ||
                           `Failed to fetch task with ID: ${taskId}`
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData) => {
    try {
      setLoading(true)
      const newTask = await taskService.createTask(taskData)

      // Update local state
      setTasks(prev => [...prev, newTask])
      setTasksByStatus(prev => ({
        ...prev,
        [newTask.status]: [...prev[newTask.status], newTask]
      }))

      // Refresh statistics
      fetchStatistics()

      return newTask
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create task'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (taskId, taskData) => {
    try {
      setLoading(true)
      const updatedTask = await taskService.updateTask(taskId, taskData)

      // Update local state
      setTasks(prev => prev.map(task =>
        task._id === taskId ? updatedTask : task
      ))

      // Update tasks by status if status changed
      setTasksByStatus(prev => {
        const oldTask = tasks.find(t => t._id === taskId)
        const newStatus = updatedTask.status
        const oldStatus = oldTask?.status

        if (oldStatus && newStatus && oldStatus !== newStatus) {
          // Remove from old status array
          const updatedOldStatusArray = prev[oldStatus].filter(t => t._id !== taskId)

          // Add to new status array
          const updatedNewStatusArray = [...prev[newStatus], updatedTask]

          return {
            ...prev,
            [oldStatus]: updatedOldStatusArray,
            [newStatus]: updatedNewStatusArray
          }
        } else {
          // Just update the task in its current status array
          return {
            ...prev,
            [newStatus]: prev[newStatus].map(t =>
              t._id === taskId ? updatedTask : t
            )
          }
        }
      })

      // Refresh statistics
      fetchStatistics()

      return updatedTask
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to update task with ID: ${taskId}`
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      setLoading(true)
      await taskService.deleteTask(taskId)

      // Find the task to get its status before removing
      const taskToDelete = tasks.find(t => t._id === taskId)

      // Update local state
      setTasks(prev => prev.filter(task => task._id !== taskId))

      // Update tasks by status
      if (taskToDelete && taskToDelete.status) {
        setTasksByStatus(prev => ({
          ...prev,
          [taskToDelete.status]: prev[taskToDelete.status].filter(t => t._id !== taskId)
        }))
      }

      // Refresh statistics
      fetchStatistics()
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to delete task with ID: ${taskId}`
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const archiveTask = async (taskId) => {
    try {
      setLoading(true)
      await taskService.archiveTask(taskId)

      // Refresh task list and statistics
      fetchTasks()
      fetchStatistics()
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to archive task with ID: ${taskId}`
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const restoreTask = async (taskId) => {
    try {
      setLoading(true)
      await taskService.restoreTask(taskId)

      // Refresh task list and statistics
      fetchTasks()
      fetchStatistics()
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to restore task with ID: ${taskId}`
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const assignUser = async (taskId, userId) => {
    try {
      setLoading(true)
      const updatedTask = await taskService.assignUser(taskId, userId)

      // Update task in state
      setTasks(prev => prev.map(task =>
        task._id === taskId ? updatedTask : task
      ))

      setTasksByStatus(prev => ({
        ...prev,
        [updatedTask.status]: prev[updatedTask.status].map(t =>
          t._id === taskId ? updatedTask : t
        )
      }))

      return updatedTask
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to assign user to task with ID: ${taskId}`
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const unassignUser = async (taskId, userId) => {
    try {
      setLoading(true)
      const updatedTask = await taskService.unassignUser(taskId, userId)

      // Update task in state
      setTasks(prev => prev.map(task =>
        task._id === taskId ? updatedTask : task
      ))

      setTasksByStatus(prev => ({
        ...prev,
        [updatedTask.status]: prev[updatedTask.status].map(t =>
          t._id === taskId ? updatedTask : t
        )
      }))

      return updatedTask
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to unassign user from task with ID: ${taskId}`
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    tasks,
    tasksByStatus,
    statistics,
    loading,
    error,
    fetchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    archiveTask,
    restoreTask,
    assignUser,
    unassignUser,
    fetchStatistics,
    clearError
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export default TaskContext