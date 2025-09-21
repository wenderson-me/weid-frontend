import { useMemo, useRef, useEffect } from 'react'
import { FiClock, FiAlertTriangle, FiChevronRight } from 'react-icons/fi'

const CalendarDay = ({ currentDate, tasks, onTaskClick, onDateClick }) => {
  const currentHourRef = useRef(null)

  const hours = useMemo(() => {
    const hoursArray = []
    for (let i = 0; i < 24; i++) {
      hoursArray.push(i)
    }
    return hoursArray
  }, [])

  const tasksForDay = useMemo(() => {
    if (!tasks.length) return []

    const selectedDate = new Date(currentDate)
    selectedDate.setHours(0, 0, 0, 0)

    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)

    return tasks.filter(task => {
      if (!task.dueDate) return false

      const taskDate = new Date(task.dueDate)
      return taskDate >= selectedDate && taskDate < nextDay
    }).sort((a, b) => {
      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)

      if (dateA.getHours() !== dateB.getHours()) {
        return dateA.getHours() - dateB.getHours()
      }

      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }, [currentDate, tasks])

  const tasksByHour = useMemo(() => {
    const grouped = {}

    tasksForDay.forEach(task => {
      const taskDate = new Date(task.dueDate)
      const hour = taskDate.getHours()

      if (!grouped[hour]) {
        grouped[hour] = []
      }

      grouped[hour].push(task)
    })

    return grouped
  }, [tasksForDay])

  const currentHour = new Date().getHours()

  useEffect(() => {
    if (currentHourRef.current) {
      setTimeout(() => {
        currentHourRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }, [])

  const isToday = useMemo(() => {
    const today = new Date()
    return currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
  }, [currentDate])

  const formatHour = (hour) => {
    return hour === 0 ? '12 AM' :
           hour < 12 ? `${hour} AM` :
           hour === 12 ? '12 PM' :
           `${hour - 12} PM`
  }

  const isOverdue = (task) => {
    if (!task.dueDate || task.status === 'done') return false

    const dueDate = new Date(task.dueDate)
    const now = new Date()

    return dueDate < now
  }

  const formatDuration = (hours) => {
    if (!hours) return ''
    return hours === 1 ? '1 hour' : `${hours} hours`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'border-gray-300'
      case 'inProgress':
        return 'border-blue-300'
      case 'inReview':
        return 'border-amber-300'
      case 'done':
        return 'border-green-300'
      default:
        return 'border-gray-300'
    }
  }

  return (
    <div className="h-full flex overflow-hidden">
      <div className="w-24 border-r border-gray-200 overflow-y-auto">
        {hours.map(hour => (
          <div
            key={hour}
            ref={isToday && hour === currentHour ? currentHourRef : null}
            className={`h-20 px-3 py-2 border-b border-gray-100 flex items-start ${
              isToday && hour === currentHour ? 'bg-violet-50' : ''
            }`}
          >
            <div className="text-sm font-medium text-gray-500">
              {formatHour(hour)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto relative">
        {isToday && (
          <div
            className="absolute left-0 right-0 border-t-2 border-red-400 z-10"
            style={{
              top: `${currentHour * 80 + (new Date().getMinutes() / 60) * 80}px`
            }}
          >
            <div className="absolute -top-2 -left-1 h-4 w-4 rounded-full bg-red-400"></div>
          </div>
        )}

        {hours.map(hour => {
          const hourTasks = tasksByHour[hour] || []

          return (
            <div
              key={hour}
              className={`h-20 border-b border-gray-100 relative ${
                isToday && hour === currentHour ? 'bg-violet-50' : ''
              }`}
              onClick={() => {
                const clickDate = new Date(currentDate)
                clickDate.setHours(hour, 0, 0, 0)
                onDateClick(clickDate)
              }}
            >
              <div className="absolute inset-x-0 top-0 p-2 space-y-2">
                {hourTasks.map(task => (
                  <div
                    key={task._id}
                    className={`px-3 py-2 rounded-lg bg-white shadow-sm border-l-2 ${getStatusColor(task.status)} cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onTaskClick(task)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`h-3 w-3 rounded-full flex-shrink-0 ${
                          task.priority === 'low' ? 'bg-gray-400' :
                          task.priority === 'medium' ? 'bg-blue-400' :
                          task.priority === 'high' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}></span>

                        <span className={`font-medium ${isOverdue(task) ? 'text-red-600' : 'text-gray-800'}`}>
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {task.estimatedHours && (
                          <span className="text-xs text-gray-500">
                            <FiClock className="inline h-3 w-3 mr-1" />
                            {formatDuration(task.estimatedHours)}
                          </span>
                        )}

                        {isOverdue(task) && (
                          <FiAlertTriangle className="h-4 w-4 text-red-500" />
                        )}

                        <FiChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {task.description && (
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {task.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarDay