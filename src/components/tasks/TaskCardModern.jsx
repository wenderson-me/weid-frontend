import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  FiCalendar,
  FiClock,
  FiMessageSquare,
  FiAlertTriangle,
  FiPaperclip,
  FiCheckCircle,
} from 'react-icons/fi'
import { useHoverAnimation } from '../../hooks/useAnimations'

const TaskCardModern = ({ task, isDragging, index = 0 }) => {
  const { isHovering, onMouseEnter, onMouseLeave } = useHoverAnimation({
    duration: 250,
    scale: 1.01,
    y: -4,
    enableGlow: true
  })

  // Get card color based on priority
  const getCardColorClass = () => {
    const colors = {
      urgent: 'kanban-card pink',
      high: 'kanban-card orange',
      medium: 'kanban-card purple',
      low: 'kanban-card blue',
    }
    return colors[task.priority] || 'kanban-card blue'
  }

  // Get progress percentage
  const getProgress = () => {
    if (task.progress !== undefined) return task.progress
    if (task.status === 'done') return 100
    if (task.status === 'inReview') return 80
    if (task.status === 'inProgress') return 50
    return 0
  }

  const progressValue = getProgress()

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

  const priorityColors = {
    low: 'tag blue',
    medium: 'tag purple',
    high: 'tag orange',
    urgent: 'tag pink'
  }

  return (
    <div
      className={`
        ${getCardColorClass()}
        ${isDragging ? 'dragging' : ''}
        ${isHovering ? 'card-advanced-hover' : ''}
        cursor-grab active:cursor-grabbing touch-manipulation
        mb-3 entrance-fade
      `}
      style={{
        animationDelay: `${index * 50}ms`,
        ...(!isDragging && {
          transition: 'all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        })
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Tags/Categories */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={priorityColors[task.priority] || 'tag blue'}>
          {task.priority}
        </span>
        {task.tags && task.tags.slice(0, 1).map((tag, idx) => (
          <span key={idx} className="tag purple text-xs">
            #{tag}
          </span>
        ))}
      </div>

      {/* Task Title */}
      <div className="mb-2.5">
        <Link
          to={`/tasks/${task._id}`}
          className="text-sm font-semibold text-gray-800 hover:text-purple-600 transition-colors line-clamp-2 leading-snug"
          onClick={(e) => isDragging && e.preventDefault()}
        >
          {task.title}
        </Link>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 mb-3.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Progress Bar */}
      {progressValue > 0 && (
        <div className="mb-3.5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-gray-600">Progress</span>
            <span className="text-xs font-semibold text-gray-700">{progressValue}%</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-bar-fill ${
                progressValue === 100 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                progressValue >= 75 ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
                progressValue >= 50 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                'bg-gradient-to-r from-orange-400 to-orange-500'
              }`}
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Footer - Stats and Avatars */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {/* Stats */}
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <div className={`stats-badge ${isOverdue() ? 'text-red-500' : ''}`}>
              <FiCalendar />
              <span>{formatDueDate(task.dueDate)}</span>
              {isOverdue() && <FiAlertTriangle className="text-red-500" />}
            </div>
          )}

          {(task.comments?.length > 0 || task.attachments?.length > 0) && (
            <div className="stats-badge">
              {task.comments?.length > 0 && (
                <>
                  <FiMessageSquare />
                  <span>{task.comments.length}</span>
                </>
              )}
              {task.attachments?.length > 0 && (
                <>
                  <FiPaperclip className="ml-2" />
                  <span>{task.attachments.length}</span>
                </>
              )}
            </div>
          )}

          {task.estimatedHours && (
            <div className="stats-badge">
              <FiClock />
              <span>{task.estimatedHours}h</span>
            </div>
          )}
        </div>

        {/* Avatars */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="avatar-group">
            {task.assignees.slice(0, 3).map((assignee, idx) => {
              // Handle both string IDs and user objects
              const isObject = typeof assignee === 'object' && assignee !== null
              const userName = isObject ? assignee.name : 'User'
              const userAvatar = isObject ? assignee.avatar : null

              return (
                <div
                  key={idx}
                  className="avatar"
                  title={userName}
                  style={{
                    backgroundColor: userAvatar ? 'transparent' : '#e9d5ff'
                  }}
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-purple-700">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )
            })}
            {task.assignees.length > 3 && (
              <div
                className="avatar flex items-center justify-center text-xs font-semibold bg-gray-200 text-gray-600"
              >
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCardModern
