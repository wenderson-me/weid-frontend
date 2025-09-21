import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiX,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiTag,
  FiUser,
  FiMessageSquare
} from 'react-icons/fi'
import { useTasks } from '../../hooks/useTasks'

const EventModal = ({ isOpen, onClose, task, isCreating, selectedDate }) => {
  const { updateTask, deleteTask } = useTasks()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: selectedDate ? formatDateForInput(selectedDate) : '',
    dueTime: selectedDate ? formatTimeForInput(selectedDate) : '',
    estimatedHours: '',
  })


  useEffect(() => {
    if (task) {
      const taskDate = task.dueDate ? new Date(task.dueDate) : null

      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: taskDate ? formatDateForInput(taskDate) : '',
        dueTime: taskDate ? formatTimeForInput(taskDate) : '',
        estimatedHours: task.estimatedHours || '',
      })
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        dueDate: formatDateForInput(selectedDate),
        dueTime: formatTimeForInput(selectedDate)
      }))
    }
  }, [task, selectedDate])


  function formatDateForInput(date) {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }


  function formatTimeForInput(date) {
    const d = new Date(date)
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }


  function formatDate(dateString) {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }


  function formatTime(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }


  function isOverdue(task) {
    if (!task?.dueDate || task.status === 'done') return false

    const dueDate = new Date(task.dueDate)
    const now = new Date()

    return dueDate < now
  }


  const statusLabels = {
    'todo': 'To Do',
    'inProgress': 'In Progress',
    'inReview': 'In Review',
    'done': 'Done'
  }


  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800',
    'inProgress': 'bg-blue-100 text-blue-800',
    'inReview': 'bg-amber-100 text-amber-800',
    'done': 'bg-green-100 text-green-800'
  }


  const priorityColors = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-orange-100 text-orange-800',
    'urgent': 'bg-red-100 text-red-800'
  }


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }


  const handleCreate = () => {
    if (isCreating) {

      const dateTime = combineDateTime(formData.dueDate, formData.dueTime)


      const searchParams = new URLSearchParams()
      searchParams.append('status', formData.status)
      if (dateTime) {
        searchParams.append('dueDate', dateTime.toISOString())
      }


      navigate(`/tasks/new?${searchParams.toString()}`)
    } else if (task) {

      navigate(`/tasks/${task._id}/edit`)
    }

    onClose()
  }


  const handleDelete = async () => {
    if (!task) return

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true)
        setError(null)
        await deleteTask(task._id)
        onClose()
      } catch (err) {
        setError('Failed to delete task. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }


  function combineDateTime(dateStr, timeStr) {
    if (!dateStr) return null

    const date = new Date(dateStr)

    if (timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number)
      date.setHours(hours, minutes, 0, 0)
    } else {
      date.setHours(0, 0, 0, 0)
    }

    return date
  }


  const viewTaskDetails = () => {
    if (task) {
      navigate(`/tasks/${task._id}`)
      onClose()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div
          className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {isCreating ? 'Create New Task' : 'Task Details'}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Modal content */}
          <div className="px-6 py-4">
            {isCreating ? (
              /* Create Task Form Preview */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Task title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiClock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        name="dueTime"
                        value={formData.dueTime}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="inProgress">In Progress</option>
                      <option value="inReview">In Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Hours
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiClock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="estimatedHours"
                      value={formData.estimatedHours}
                      onChange={handleChange}
                      min="0"
                      step="0.5"
                      placeholder="0"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Add description..."
                  ></textarea>
                </div>
              </div>
            ) : (
              /* View Task Details */
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertTriangle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  {/* Title with status badge */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {task?.title}
                    </h2>

                    {task?.status && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                        {statusLabels[task.status]}
                      </span>
                    )}

                    {task?.priority && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    )}

                    {isOverdue(task) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FiAlertTriangle className="mr-1 h-3 w-3" />
                        Overdue
                      </span>
                    )}
                  </div>

                  {/* Task description */}
                  {task?.description ? (
                    <p className="text-gray-700 whitespace-pre-line mt-2">
                      {task.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic mt-2">
                      No description provided
                    </p>
                  )}
                </div>

                {/* Task meta information */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {/* Due date */}
                  {task?.dueDate && (
                    <div className="flex items-center">
                      <FiCalendar className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Due Date
                        </div>
                        <div className={`text-sm ${isOverdue(task) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {formatDate(task.dueDate)} at {formatTime(task.dueDate)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Estimated hours */}
                  {task?.estimatedHours && (
                    <div className="flex items-center">
                      <FiClock className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Estimated Time
                        </div>
                        <div className="text-sm text-gray-900">
                          {task.estimatedHours} hours
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assignees */}
                  {task?.assignees && task.assignees.length > 0 && (
                    <div className="flex items-center">
                      <FiUser className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Assigned to
                        </div>
                        <div className="text-sm text-gray-900">
                          {task.assignees.map(assignee => assignee.name).join(', ')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {task?.tags && task.tags.length > 0 && (
                    <div className="flex items-start">
                      <FiTag className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Tags
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {task.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comments count */}
                  {task?.comments && task.comments.length > 0 && (
                    <div className="flex items-center">
                      <FiMessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Comments
                        </div>
                        <div className="text-sm text-gray-900">
                          {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal footer with actions */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            {!isCreating && task && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={loading}
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
            )}

            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Cancel
              </button>

              {!isCreating && task && (
                <button
                  type="button"
                  onClick={viewTaskDetails}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  View Details
                </button>
              )}

              <button
                type="button"
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                disabled={loading}
              >
                <FiEdit2 className="mr-2 h-4 w-4" />
                {isCreating ? 'Continue Creating' : 'Edit Task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default EventModal