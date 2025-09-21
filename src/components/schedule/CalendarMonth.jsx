import { useMemo } from 'react'
import { FiClock, FiAlertTriangle } from 'react-icons/fi'

const CalendarMonth = ({ currentDate, tasks, onTaskClick, onDateClick }) => {

  const calendarDays = useMemo(() => {
    const days = []
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)


    const firstDay = date.getDay()
    date.setDate(date.getDate() - firstDay)


    for (let i = 0; i < 42; i++) {
      const clonedDate = new Date(date)
      days.push(clonedDate)
      date.setDate(date.getDate() + 1)
    }

    return days
  }, [currentDate])


  const tasksByDate = useMemo(() => {
    const grouped = {}

    tasks.forEach(task => {
      if (!task.dueDate) return

      const dueDate = new Date(task.dueDate)
      const dateKey = dueDate.toISOString().split('T')[0]

      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }

      grouped[dateKey].push(task)
    })

    return grouped
  }, [tasks])


  const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }


  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth()
  }


  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0]
  }


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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


  const isOverdue = (task) => {
    if (!task.dueDate || task.status === 'done') return false

    const dueDate = new Date(task.dueDate)
    dueDate.setHours(23, 59, 59, 999)

    return dueDate < new Date()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={day} className="py-2 px-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 divide-x divide-y divide-gray-200">
        {calendarDays.map((date, index) => {
          const dateKey = formatDateKey(date)
          const dayTasks = tasksByDate[dateKey] || []
          const isCurrentMonthDay = isCurrentMonth(date)

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 ${isCurrentMonthDay ? 'bg-white' : 'bg-gray-50'}`}
              onClick={() => onDateClick(new Date(date))}
            >
              {/* Date number with today indicator */}
              <div className="flex justify-between items-center">
                <div
                  className={`text-sm font-medium mb-1 w-7 h-7 rounded-full flex items-center justify-center
                    ${isToday(date)
                      ? 'bg-violet-600 text-white'
                      : isCurrentMonthDay ? 'text-gray-900' : 'text-gray-400'
                    }`}
                >
                  {date.getDate()}
                </div>

                {/* Visual indicator for days with 3+ tasks */}
                {dayTasks.length >= 3 && (
                  <div className="text-xs text-gray-500 font-medium">
                    {dayTasks.length} tasks
                  </div>
                )}
              </div>

              {/* Task list for this day - showing up to 2 tasks and a "+X more" indicator */}
              <div className="mt-1 space-y-1">
                {dayTasks.slice(0, 2).map(task => (
                  <div
                    key={task._id}
                    className={`px-2 py-1 rounded-lg text-xs truncate cursor-pointer border-l-2 ${getStatusColor(task.status)}`}
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

                      {/* Title with overdue indicator */}
                      <div className="flex-1 truncate flex items-center">
                        {isOverdue(task) && (
                          <FiAlertTriangle className="text-red-500 mr-1 h-3 w-3 flex-shrink-0" />
                        )}
                        <span className={`truncate ${isOverdue(task) ? 'text-red-600' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* "More" indicator */}
                {dayTasks.length > 2 && (
                  <div
                    className="px-2 py-1 text-xs text-center text-gray-500 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation()

                    }}
                  >
                    + {dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarMonth