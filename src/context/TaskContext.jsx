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

      setTasks(response.tasks || [])

      const grouped = {
        todo: [],
        inProgress: [],
        inReview: [],
        done: []
      }

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
      if (taskCache[taskId] && !loading) {
        return taskCache[taskId]
      }

      setLoading(true)
      setError(null)

      const task = await taskService.getTaskById(taskId)

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

      setTasks(prev => [...prev, newTask])
      setTasksByStatus(prev => ({
        ...prev,
        [newTask.status]: [...prev[newTask.status], newTask]
      }))

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

      setTasks(prev => prev.map(task =>
        task._id === taskId ? updatedTask : task
      ))

      setTasksByStatus(prev => {
        const oldTask = tasks.find(t => t._id === taskId)
        const newStatus = updatedTask.status
        const oldStatus = oldTask?.status

        if (oldStatus && newStatus && oldStatus !== newStatus) {
          const updatedOldStatusArray = prev[oldStatus].filter(t => t._id !== taskId)

          const updatedNewStatusArray = [...prev[newStatus], updatedTask]

          return {
            ...prev,
            [oldStatus]: updatedOldStatusArray,
            [newStatus]: updatedNewStatusArray
          }
        } else {
          return {
            ...prev,
            [newStatus]: prev[newStatus].map(t =>
              t._id === taskId ? updatedTask : t
            )
          }
        }
      })

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

      const taskToDelete = tasks.find(t => t._id === taskId)

      setTasks(prev => prev.filter(task => task._id !== taskId))

      if (taskToDelete && taskToDelete.status) {
        setTasksByStatus(prev => ({
          ...prev,
          [taskToDelete.status]: prev[taskToDelete.status].filter(t => t._id !== taskId)
        }))
      }

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