import { Link } from 'react-router-dom'
import {
  FiCalendar,
  FiClock,
  FiMessageSquare,
  FiAlertTriangle,
  FiPaperclip,
} from 'react-icons/fi'

const TaskCard = ({ task, isDragging }) => {
  const formatDueDate = (dateString) => {
    if (!dateString) return null

    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const dueDate = new Date(date)
    dueDate.setHours(0, 0, 0, 0)

    if (dueDate.getTime() === today.getTime()) {
      return 'Today'
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  const isOverdue = () => {
    if (!task.dueDate) return false

    const dueDate = new Date(task.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const taskDate = new Date(dueDate)
    taskDate.setHours(0, 0, 0, 0)

    return taskDate < today && task.status !== 'done'
  }

  const priorityDotColors = {
    low: 'bg-gray-400',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500'
  }

  return (
    <div className={`
      group relative bg-white rounded-xl shadow-sm border
      ${isDragging ? 'border-violet-300 shadow-md' : 'border-gray-200 hover:shadow-md'}
      transition-shadow p-4 cursor-grab active:cursor-grabbing touch-manipulation
    `}>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-70 transition-opacity text-gray-400">

      </div>

      <div className="font-medium text-gray-900 mb-1 pr-6">
        <Link
          to={`/tasks/${task._id}`}
          className="hover:text-violet-600"
          onClick={(e) => isDragging && e.preventDefault()}
        >
          {task.title}
        </Link>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-y-2 gap-x-3 text-xs text-gray-500">
        {task.dueDate && (
          <div className={`flex items-center ${isOverdue() ? 'text-red-600' : ''}`}>
            <FiCalendar className="mr-1" />
            <span>{formatDueDate(task.dueDate)}</span>
            {isOverdue() && (
              <span className="ml-1">
                <FiAlertTriangle className="text-red-600" />
              </span>
            )}
          </div>
        )}

        {task.estimatedHours && (
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{task.estimatedHours}h</span>
          </div>
        )}

        {task.attachments?.length > 0 && (
          <div className="flex items-center">
            <FiPaperclip className="mr-1" />
            <span>{task.attachments.length}</span>
          </div>
        )}

        {task.comments?.length > 0 && (
          <div className="flex items-center">
            <FiMessageSquare className="mr-1" />
            <span>{task.comments.length}</span>
          </div>
        )}
      </div>

      {task.progress !== undefined && task.progress > 0 && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-violet-600 h-1.5 rounded-full"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="mt-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className={`h-2.5 w-2.5 rounded-full ${priorityDotColors[task.priority] || 'bg-gray-400'} mr-1.5`}></div>
          <span className="text-xs capitalize">{task.priority}</span>
        </div>

        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-2">
            {task.assignees.slice(0, 3).map((assignee, idx) => (
              <div
                key={idx}
                className="h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center text-xs text-violet-700 ring-2 ring-white"
                title={assignee.name}
              >
                {assignee.avatar ? (
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  assignee.name.charAt(0)
                )}
              </div>
            ))}
            {task.assignees.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-700 ring-2 ring-white">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCard