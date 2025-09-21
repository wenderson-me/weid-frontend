import { useState, useCallback, useMemo, useEffect } from 'react'
import { useTasks } from './useTasks'
import { formatDateToYYYYMMDD, getMonthDays, getWeekDays, getHoursArray } from '../utils/calenderUtils'

/**
 * Hook for handling calendar-specific operations
 */
export const useCalendar = () => {
  const { tasks, updateTask, fetchTasks, loading, error } = useTasks()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month')
  const [dateRange, setDateRange] = useState({ start: null, end: null })
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    tags: []
  })


  const calculateDateRange = useCallback((date = currentDate, viewType = view) => {
    const start = new Date(date)
    const end = new Date(date)

    if (viewType === 'month') {

      start.setDate(1)

      const dayOfWeek = start.getDay()
      start.setDate(start.getDate() - dayOfWeek)


      end.setMonth(end.getMonth() + 1)
      end.setDate(0)

      const endDayOfWeek = end.getDay()
      end.setDate(end.getDate() + (6 - endDayOfWeek))
    } else if (viewType === 'week') {

      const dayOfWeek = start.getDay()
      start.setDate(start.getDate() - dayOfWeek)


      end.setDate(end.getDate() - end.getDay() + 6)
    } else if (viewType === 'day') {

      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
    } else if (viewType === 'list') {

      start.setMonth(start.getMonth() - 1)
      start.setDate(1)
      end.setMonth(end.getMonth() + 2)
      end.setDate(0)
    }

    return { start, end }
  }, [currentDate, view])


  useEffect(() => {
    const range = calculateDateRange(currentDate, view)
    setDateRange(range)
  }, [currentDate, view, calculateDateRange])


  const loadTasksForRange = useCallback(async () => {
    const { start, end } = dateRange
    if (!start || !end) return

    const apiFilters = {
      dueStart: start.toISOString(),
      dueEnd: end.toISOString(),
      ...filters
    }

    await fetchTasks(apiFilters)
  }, [fetchTasks, dateRange, filters])


  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      loadTasksForRange()
    }
  }, [dateRange, filters, loadTasksForRange])


  const goToNext = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)

      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() + 1)
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() + 7)
      } else {
        newDate.setDate(newDate.getDate() + 1)
      }

      return newDate
    })
  }, [view])


  const goToPrevious = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)

      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() - 7)
      } else {
        newDate.setDate(newDate.getDate() - 1)
      }

      return newDate
    })
  }, [view])


  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])


  const updateTaskDueDate = useCallback(async (taskId, newDate) => {
    try {
      const dueDate = new Date(newDate)
      await updateTask(taskId, { dueDate: dueDate.toISOString() })

      await loadTasksForRange()
      return true
    } catch (error) {
      console.error('Failed to update task due date:', error)
      return false
    }
  }, [updateTask, loadTasksForRange])


  const getFormattedHeaderDate = useCallback(() => {
    const options = { month: 'long', year: 'numeric' }
    if (view === 'month') {
      return currentDate.toLocaleDateString('en-US', options)
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate)
      const dayOfWeek = startOfWeek.getDay()
      startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(endOfWeek.getDate() + 6)


      if (startOfWeek.getMonth() === endOfWeek.getMonth() &&
          startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      }

      else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'long' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      }

      else {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      }
    } else if (view === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    } else {
      return 'Upcoming Tasks'
    }
  }, [currentDate, view])


  const formatDateKey = useCallback((date) => {
    return formatDateToYYYYMMDD(date)
  }, [])


  const calendarDays = useMemo(() => {
    if (view === 'month') {
      return getMonthDays(currentDate)
    } else if (view === 'week') {
      return getWeekDays(currentDate)
    } else if (view === 'day') {
      return [new Date(currentDate)]
    }
    return []
  }, [currentDate, view])


  const hours = useMemo(() => {
    return getHoursArray()
  }, [])


  const filteredTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return []

    return tasks.filter(task => {
      if (!task.dueDate) return false


      if (filters.status.length > 0 && !filters.status.includes(task.status)) {
        return false
      }


      if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
        return false
      }


      if (filters.tags.length > 0) {

        if (!task.tags || !task.tags.some(tag => filters.tags.includes(tag))) {
          return false
        }
      }

      return true
    })
  }, [tasks, filters])


  const tasksByDate = useMemo(() => {
    const grouped = {}

    filteredTasks.forEach(task => {
      if (!task.dueDate) return

      const dateKey = formatDateKey(new Date(task.dueDate))

      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }

      grouped[dateKey].push(task)
    })

    return grouped
  }, [filteredTasks, formatDateKey])


  const getTasksForDate = useCallback((date) => {
    const dateKey = formatDateKey(date)
    return tasksByDate[dateKey] || []
  }, [tasksByDate, formatDateKey])


  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }))
  }, [])


  const clearFilters = useCallback(() => {
    setFilters({
      status: [],
      priority: [],
      tags: []
    })
  }, [])


  const isToday = useCallback((date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }, [])


  const isCurrentMonth = useCallback((date) => {
    return date.getMonth() === currentDate.getMonth() &&
           date.getFullYear() === currentDate.getFullYear()
  }, [currentDate])

  return {
    currentDate,
    setCurrentDate,
    view,
    setView,
    dateRange,
    calendarDays,
    hours,
    filteredTasks,
    tasksByDate,
    loading,
    error,
    filters,
    goToNext,
    goToPrevious,
    goToToday,
    loadTasksForRange,
    updateTaskDueDate,
    getTasksForDate,
    getFormattedHeaderDate,
    formatDateKey,
    updateFilters,
    clearFilters,
    isToday,
    isCurrentMonth
  }
}

export default useCalendar