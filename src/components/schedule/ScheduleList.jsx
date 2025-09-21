import { useMemo } from 'react'
import {
  FiClock,
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiClock as FiClockIcon,
  FiChevronRight
} from 'react-icons/fi'
import { getDateStatus, isTaskOverdue } from '../../utils/calenderUtils'

const ScheduleList = ({ currentDate, tasks, onTaskClick }) => {

  const tasksByDate = useMemo(() => {
    if (!tasks.length) return []


    const sortedTasks = [...tasks].sort((a, b) => {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1

      return new Date(a.dueDate) - new Date(b.dueDate)
    })


    const grouped = {}

    sortedTasks.forEach(task => {
      if (!task.dueDate) return

      const date = new Date(task.dueDate)
      date.setHours(0, 0, 0, 0)
      const dateKey = date.toISOString()

      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }

      grouped[dateKey].push(task)
    })


    return Object.entries(grouped).map(([dateKey, dateTasks]) => ({
      date: new Date(dateKey),
      tasks: dateTasks
    }))
  }, [tasks])


  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }


  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
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


  const getStatusLabel = (status) => {
    switch (status) {
      case 'todo':
        return 'To Do'
      case 'inProgress':
        return 'In Progress'
      case 'inReview':
        return 'In Review'
      case 'done':
        return 'Done'
      default:
        return status
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {tasksByDate.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-24 w-24 mx-auto mb-4 text-gray-400">
            <FiCalendar className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming tasks</h3>
          <p className="text-gray-500 mb-6">
            You don't have any scheduled tasks coming up.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {tasksByDate.map(({ date, tasks }) => {
            const dateStatus = getDateStatus(date)

            return (
              <div key={date.toISOString()}>
                {/* Date header */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dateStatus.class} mr-2`}>
                      {dateStatus.label}
                    </span>
                    <h2 className="text-lg font-medium text-gray-900">
                      {formatDate(date)}
                    </h2>
                  </div>
                  <div className="ml-auto text-sm text-gray-500">
                    {tasks.length} tasks
                  </div>
                </div>

                {/* Task list */}
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div
                      key={task._id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onTaskClick(task)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start gap-3">
                          {/* Status indicator */}
                          <div className="flex-shrink-0 mt-1">
                            {task.status === 'done' ? (
                              <FiCheckCircle className="h-5 w-5 text-green-500" />
                            ) : isTaskOverdue(task) ? (
                              <FiAlertTriangle className="h-5 w-5 text-red-500" />
                            ) : (
                              <FiClockIcon className="h-5 w-5 text-blue-500" />
                            )}
                          </div>

                          {/* Task details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className={`text-lg font-medium ${isTaskOverdue(task) && task.status !== 'done' ? 'text-red-600' : 'text-gray-900'}`}>
                                {task.title}
                              </h3>

                              {/* Status badge */}
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                task.status === 'todo' ? 'bg-gray-100 text-gray-800' :
                                task.status === 'inProgress' ? 'bg-blue-100 text-blue-800' :
                                task.status === 'inReview' ? 'bg-amber-100 text-amber-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {getStatusLabel(task.status)}
                              </span>

                              {/* Priority badge */}
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                task.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                                task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                                task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {task.priority}
                              </span>
                            </div>

                            {/* Task description */}
                            {task.description && (
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            {/* Task meta information */}
                            <div className="mt-2 flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                              {/* Due time */}
                              <div className="flex items-center">
                                <FiClock className="mr-1 h-4 w-4" />
                                <span>{formatTime(new Date(task.dueDate))}</span>
                              </div>

                              {/* Estimated hours */}
                              {task.estimatedHours && (
                                <div className="flex items-center">
                                  <FiClockIcon className="mr-1 h-4 w-4" />
                                  <span>{formatDuration(task.estimatedHours)}</span>
                                </div>
                              )}

                              {/* Tags */}
                              {task.tags && task.tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                  {task.tags.slice(0, 2).map((tag, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                                      {tag}
                                    </span>
                                  ))}
                                  {task.tags.length > 2 && (
                                    <span className="text-xs text-gray-500">
                                      +{task.tags.length - 2} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Arrow indicator */}
                          <div className="flex-shrink-0 self-center ml-2">
                            <FiChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ScheduleList