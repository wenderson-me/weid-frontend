import { useMemo } from 'react'
import { FiClock, FiAlertTriangle } from 'react-icons/fi'

const CalendarWeek = ({ currentDate, tasks, onTaskClick, onDateClick }) => {

  const weekDays = useMemo(() => {
    const days = []
    const date = new Date(currentDate)


    const dayOfWeek = date.getDay()
    date.setDate(date.getDate() - dayOfWeek)


    for (let i = 0; i < 7; i++) {
      const clonedDate = new Date(date)
      days.push(clonedDate)
      date.setDate(date.getDate() + 1)
    }

    return days
  }, [currentDate])


  const hours = useMemo(() => {
    const hoursArray = []
    for (let i = 0; i < 24; i++) {
      hoursArray.push(i)
    }
    return hoursArray
  }, [])


  const tasksByDateTime = useMemo(() => {
    const grouped = {}

    tasks.forEach(task => {
      if (!task.dueDate) return

      const dueDate = new Date(task.dueDate)
      const dateKey = dueDate.toISOString().split('T')[0]
      const hour = dueDate.getHours()

      if (!grouped[dateKey]) {
        grouped[dateKey] = {}
      }

      if (!grouped[dateKey][hour]) {
        grouped[dateKey][hour] = []
      }

      grouped[dateKey][hour].push(task)
    })

    return grouped
  }, [tasks])


  const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }


  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0]
  }


  const getTasksForHour = (date, hour) => {
    const dateKey = formatDateKey(date)
    return (tasksByDateTime[dateKey] && tasksByDateTime[dateKey][hour]) || []
  }


  const getTasksForDate = (date) => {
    const dateKey = formatDateKey(date)
    if (!tasksByDateTime[dateKey]) return []

    const allTasks = []
    for (const hour in tasksByDateTime[dateKey]) {
      allTasks.push(...tasksByDateTime[dateKey][hour])
    }

    return allTasks
  }


  const isOverdue = (task) => {
    if (!task.dueDate || task.status === 'done') return false

    const dueDate = new Date(task.dueDate)
    dueDate.setHours(23, 59, 59, 999)

    return dueDate < new Date()
  }


  const formatHour = (hour) => {
    return hour === 0 ? '12 AM' :
           hour < 12 ? `${hour} AM` :
           hour === 12 ? '12 PM' :
           `${hour - 12} PM`
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


  const getStatusIcon = (task) => {
    if (isOverdue(task)) {
      return <FiAlertTriangle className="text-red-500 h-3 w-3" />
    }
    if (task.status === 'inProgress' || task.status === 'inReview') {
      return <FiClock className="text-amber-500 h-3 w-3" />
    }
    return null
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Week header with days */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        {/* Empty cell for hours column */}
        <div className="w-16 px-2 border-r border-gray-200"></div>

        {/* Day columns */}
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`py-2 flex-1 text-center ${isToday(day) ? 'bg-violet-50' : ''}`}
          >
            <div className="text-sm font-medium">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div
              className={`text-2xl font-semibold mt-1 ${isToday(day) ? 'text-violet-600' : 'text-gray-900'}`}
            >
              {day.getDate()}
            </div>
            <div className="text-xs text-gray-500">
              {day.toLocaleDateString('en-US', { month: 'short' })}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar body */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8 divide-x divide-gray-200">
          {/* Hours column */}
          <div className="w-16 divide-y divide-gray-200 border-r border-gray-200">
            {hours.map(hour => (
              <div key={hour} className="h-16 px-2 py-1">
                <div className="text-xs text-gray-500 text-right -mt-2">
                  {formatHour(hour)}
                </div>
              </div>
            ))}
          </div>

          {/* Day columns with hour cells */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="flex-1 divide-y divide-gray-200">
              {hours.map(hour => {
                const tasksForHour = getTasksForHour(day, hour)
                const hourDate = new Date(day.setHours(hour, 0, 0, 0))

                return (
                  <div
                    key={hour}
                    className={`h-16 relative p-0.5 ${isToday(day) ? 'bg-violet-50' : ''}`}
                    onClick={() => {
                      const clickedDate = new Date(day)
                      clickedDate.setHours(hour)
                      onDateClick(clickedDate)
                    }}
                  >
                    {/* Tasks */}
                    <div className="absolute inset-0 overflow-y-auto p-0.5">
                      {tasksForHour.map((task, taskIndex) => (
                        <div
                          key={task._id}
                          className={`mb-1 px-1.5 py-0.5 rounded text-xs truncate bg-white border-l-2 cursor-pointer ${getStatusColor(task.status)}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            onTaskClick(task)
                          }}
                        >
                          <div className="flex items-center">
                            {/* Priority dot */}
                            <span className={`h-2 w-2 rounded-full ${
                              task.priority === 'low' ? 'bg-gray-400' :
                              task.priority === 'medium' ? 'bg-blue-400' :
                              task.priority === 'high' ? 'bg-orange-500' :
                              'bg-red-500'
                            } mr-1`}></span>

                            {/* Status icon */}
                            {getStatusIcon(task) && (
                              <span className="mr-1">{getStatusIcon(task)}</span>
                            )}

                            {/* Title */}
                            <span className={`truncate ${isOverdue(task) ? 'text-red-600' : ''}`}>
                              {task.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarWeek