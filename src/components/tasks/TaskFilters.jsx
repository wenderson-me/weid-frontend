import { useState, useEffect, useCallback } from 'react'
import {
  FiX,
  FiFilter,
  FiCalendar,
  FiClock,
  FiTag,
  FiUser
} from 'react-icons/fi'

const TaskFilters = ({ selectedFilters, setSelectedFilters, clearFilters }) => {
  const [users, setUsers] = useState([])
  const [tags, setTags] = useState([])


  useEffect(() => {


    setUsers([
      { _id: 'user1', name: 'John Doe', avatar: null },
      { _id: 'user2', name: 'Jane Smith', avatar: null },
      { _id: 'user3', name: 'Bob Johnson', avatar: null },
    ])

    setTags([
      'frontend', 'backend', 'design', 'bug', 'feature', 'documentation', 'testing', 'maintenance'
    ])
  }, [])


  const handleStatusChange = (status) => {
    setSelectedFilters(prev => {
      const newStatus = [...prev.status]
      const statusIndex = newStatus.indexOf(status)

      if (statusIndex === -1) {
        newStatus.push(status)
      } else {
        newStatus.splice(statusIndex, 1)
      }

      return { ...prev, status: newStatus }
    })
  }


  const handlePriorityChange = (priority) => {
    setSelectedFilters(prev => {
      const newPriority = [...prev.priority]
      const priorityIndex = newPriority.indexOf(priority)

      if (priorityIndex === -1) {
        newPriority.push(priority)
      } else {
        newPriority.splice(priorityIndex, 1)
      }

      return { ...prev, priority: newPriority }
    })
  }


  const handleAssigneeChange = (userId) => {
    setSelectedFilters(prev => {
      const newAssignee = [...prev.assignee]
      const assigneeIndex = newAssignee.indexOf(userId)

      if (assigneeIndex === -1) {
        newAssignee.push(userId)
      } else {
        newAssignee.splice(assigneeIndex, 1)
      }

      return { ...prev, assignee: newAssignee }
    })
  }


  const handleDueDateChange = (e) => {
    const { name, value } = e.target

    setSelectedFilters(prev => {
      const newDueDate = { ...prev.dueDate || {} }
      newDueDate[name] = value ? new Date(value) : null


      if (!newDueDate.startDate && !newDueDate.endDate) {
        return { ...prev, dueDate: null }
      }

      return { ...prev, dueDate: newDueDate }
    })
  }


  const handleTagChange = (tag) => {
    setSelectedFilters(prev => {
      const newTags = [...prev.tags]
      const tagIndex = newTags.indexOf(tag)

      if (tagIndex === -1) {
        newTags.push(tag)
      } else {
        newTags.splice(tagIndex, 1)
      }

      return { ...prev, tags: newTags }
    })
  }


  const hasActiveFilters = Object.values(selectedFilters).some(
    filter => Array.isArray(filter) ? filter.length > 0 : !!filter
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FiFilter className="h-5 w-5 text-violet-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center"
          >
            <FiX className="mr-1" /> Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* Status filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Status</h4>
          <div className="space-y-2">
            {['todo', 'inProgress', 'inReview', 'done'].map(status => {
              const isSelected = selectedFilters.status.includes(status)
              return (
                <label
                  key={status}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                    checked={isSelected}
                    onChange={() => handleStatusChange(status)}
                  />
                  <span className="ml-3 text-sm text-gray-700 capitalize">
                    {status === 'todo' ? 'To Do' :
                     status === 'inProgress' ? 'In Progress' :
                     status === 'inReview' ? 'In Review' : 'Done'}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Priority filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Priority</h4>
          <div className="space-y-2">
            {['low', 'medium', 'high', 'urgent'].map(priority => {
              const isSelected = selectedFilters.priority.includes(priority)
              return (
                <label
                  key={priority}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                    checked={isSelected}
                    onChange={() => handlePriorityChange(priority)}
                  />
                  <span className="ml-3 text-sm text-gray-700 capitalize">
                    {priority}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Assignee filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Assignee</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {users.map(user => {
              const isSelected = selectedFilters.assignee.includes(user._id)
              return (
                <label
                  key={user._id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                    checked={isSelected}
                    onChange={() => handleAssigneeChange(user._id)}
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    {user.name}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Due date filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Due Date</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">From</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="startDate"
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 text-sm"
                  value={selectedFilters.dueDate?.startDate?.toISOString().split('T')[0] || ''}
                  onChange={handleDueDateChange}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">To</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="endDate"
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 text-sm"
                  value={selectedFilters.dueDate?.endDate?.toISOString().split('T')[0] || ''}
                  onChange={handleDueDateChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Tags</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tags.map(tag => {
              const isSelected = selectedFilters.tags.includes(tag)
              return (
                <label
                  key={tag}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                    checked={isSelected}
                    onChange={() => handleTagChange(tag)}
                  />
                  <span className="ml-3 flex items-center text-sm text-gray-700">
                    <FiTag className="mr-1 h-3 w-3" />
                    {tag}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskFilters