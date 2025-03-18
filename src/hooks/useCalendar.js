import { useState, useCallback, useMemo, useEffect } from 'react'
import { useTasks } from './useTasks'
import { formatDateToYYYYMMDD, getMonthDays, getWeekDays, getHoursArray } from '../utils/calenderUtils'

/**
 * Hook for handling calendar-specific operations
 */
export const useCalendar = () => {
  const { tasks, updateTask, fetchTasks, loading, error } = useTasks()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // 'month', 'week', 'day', 'list'
  const [dateRange, setDateRange] = useState({ start: null, end: null })
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    tags: []
  })

  // Calculate start and end dates based on current view and date
  const calculateDateRange = useCallback((date = currentDate, viewType = view) => {
    const start = new Date(date)
    const end = new Date(date)

    if (viewType === 'month') {
      // Set to first day of month
      start.setDate(1)
      // Set to first day of week containing first day of month
      const dayOfWeek = start.getDay()
      start.setDate(start.getDate() - dayOfWeek)

      // Set to last day of month
      end.setMonth(end.getMonth() + 1)
      end.setDate(0)
      // Set to last day of week containing last day of month
      const endDayOfWeek = end.getDay()
      end.setDate(end.getDate() + (6 - endDayOfWeek))
    } else if (viewType === 'week') {
      // Set to first day of week
      const dayOfWeek = start.getDay()
      start.setDate(start.getDate() - dayOfWeek)

      // Set to last day of week
      end.setDate(end.getDate() - end.getDay() + 6)
    } else if (viewType === 'day') {
      // Start and end are same day, just set hours
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
    } else if (viewType === 'list') {
      // For list view, show tasks from one month ago to two months ahead
      start.setMonth(start.getMonth() - 1)
      start.setDate(1)
      end.setMonth(end.getMonth() + 2)
      end.setDate(0)
    }

    return { start, end }
  }, [currentDate, view])

  // Update date range when view or current date changes
  useEffect(() => {
    const range = calculateDateRange(currentDate, view)
    setDateRange(range)
  }, [currentDate, view, calculateDateRange])

  // Load tasks for the current date range
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

  // Load tasks when date range or filters change
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      loadTasksForRange()
    }
  }, [dateRange, filters, loadTasksForRange])

  // Navigate to next period
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

  // Navigate to previous period
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

  // Go to today
  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  // Update a task with a new due date (for drag and drop)
  const updateTaskDueDate = useCallback(async (taskId, newDate) => {
    try {
      const dueDate = new Date(newDate)
      await updateTask(taskId, { dueDate: dueDate.toISOString() })
      // Refresh tasks after update
      await loadTasksForRange()
      return true
    } catch (error) {
      console.error('Failed to update task due date:', error)
      return false
    }
  }, [updateTask, loadTasksForRange])

  // Format a date for header display
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

      // If start and end are in same month and year
      if (startOfWeek.getMonth() === endOfWeek.getMonth() &&
          startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      }
      // If start and end are in same year but different months
      else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'long' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      }
      // If start and end are in different years
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

  // Format a date key for grouping (YYYY-MM-DD)
  const formatDateKey = useCallback((date) => {
    return formatDateToYYYYMMDD(date)
  }, [])

  // Get calendar days for current view
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

  // Get hours for day view
  const hours = useMemo(() => {
    return getHoursArray()
  }, [])

  // Filter tasks based on provided filters
  const filteredTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return []

    return tasks.filter(task => {
      if (!task.dueDate) return false

      // Apply status filters if any are selected
      if (filters.status.length > 0 && !filters.status.includes(task.status)) {
        return false
      }

      // Apply priority filters if any are selected
      if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
        return false
      }

      // Apply tag filters if any are selected
      if (filters.tags.length > 0) {
        // If task has no tags or none of its tags match the filter
        if (!task.tags || !task.tags.some(tag => filters.tags.includes(tag))) {
          return false
        }
      }

      return true
    })
  }, [tasks, filters])

  // Group tasks by date
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

  // Get tasks for a specific date
  const getTasksForDate = useCallback((date) => {
    const dateKey = formatDateKey(date)
    return tasksByDate[dateKey] || []
  }, [tasksByDate, formatDateKey])

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }))
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      status: [],
      priority: [],
      tags: []
    })
  }, [])

  // Check if a date is today
  const isToday = useCallback((date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }, [])

  // Check if a date is in the current month
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