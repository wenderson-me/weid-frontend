import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiGrid,
  FiList,
  FiClock,
  FiPlus,
  FiFilter,
  FiX
} from 'react-icons/fi'
import useCalendar from '../../hooks/useCalendar'
import CalendarMonth from '../../components/schedule/CalendarMonth'
import CalendarWeek from '../../components/schedule/CalendarWeek'
import CalendarDay from '../../components/schedule/CalendarDay'
import ScheduleList from '../../components/schedule/ScheduleList'
import EventModal from '../../components/schedule/EventModal'

const VIEWS = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  LIST: 'list'
}

const SchedulePage = () => {
  const {
    currentDate,
    view,
    setView,
    filteredTasks,
    loading,
    filters,
    goToNext,
    goToPrevious,
    goToToday,
    getFormattedHeaderDate,
    updateFilters,
    clearFilters
  } = useCalendar()

  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedDateForNewEvent, setSelectedDateForNewEvent] = useState(null)
  const [showFilters, setShowFilters] = useState(false)


  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsCreating(false)
    setIsModalOpen(true)
  }


  const handleDateClick = (date) => {
    setSelectedDateForNewEvent(date)
    setIsCreating(true)
    setSelectedTask(null)
    setIsModalOpen(true)
  }


  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
    setIsCreating(false)
    setSelectedDateForNewEvent(null)
  }


  const handleFilterChange = (filterType, value) => {
    const currentValues = [...(filters[filterType] || [])]
    const valueIndex = currentValues.indexOf(value)

    let newValues = currentValues
    if (valueIndex === -1) {

      newValues = [...currentValues, value]
    } else {

      newValues = [...currentValues]
      newValues.splice(valueIndex, 1)
    }

    updateFilters({ [filterType]: newValues })
  }


  const hasActiveFilters = Object.values(filters).some(
    filterValues => filterValues && filterValues.length > 0
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header with navigation and view options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600">{getFormattedHeaderDate()}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Navigation buttons */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={goToPrevious}
              className="px-3 py-2 border-r border-gray-300 text-gray-700 hover:bg-gray-100"
              aria-label="Previous"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-2 border-r border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Today
            </button>
            <button
              onClick={goToNext}
              className="px-3 py-2 text-gray-700 hover:bg-gray-100"
              aria-label="Next"
            >
              <FiChevronRight />
            </button>
          </div>

          {/* View switcher */}
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setView(VIEWS.MONTH)}
              className={`p-2 rounded-md ${view === VIEWS.MONTH ? 'bg-white shadow-sm' : ''}`}
              title="Month view"
              aria-pressed={view === VIEWS.MONTH}
            >
              <FiCalendar className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView(VIEWS.WEEK)}
              className={`p-2 rounded-md ${view === VIEWS.WEEK ? 'bg-white shadow-sm' : ''}`}
              title="Week view"
              aria-pressed={view === VIEWS.WEEK}
            >
              <FiGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView(VIEWS.DAY)}
              className={`p-2 rounded-md ${view === VIEWS.DAY ? 'bg-white shadow-sm' : ''}`}
              title="Day view"
              aria-pressed={view === VIEWS.DAY}
            >
              <FiClock className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView(VIEWS.LIST)}
              className={`p-2 rounded-md ${view === VIEWS.LIST ? 'bg-white shadow-sm' : ''}`}
              title="List view"
              aria-pressed={view === VIEWS.LIST}
            >
              <FiList className="h-5 w-5" />
            </button>
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-3 py-2 border ${
              showFilters ? 'bg-violet-600 text-white border-transparent' : 'border-gray-300 text-gray-700 bg-white'
            } rounded-lg text-sm font-medium`}
          >
            <FiFilter className="mr-2 h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                Active
              </span>
            )}
          </button>

          {/* Create button */}
          <Link
            to="/tasks/new"
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            New Task
          </Link>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filter Tasks</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center"
              >
                <FiX className="mr-1" /> Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
              <div className="space-y-2">
                {['todo', 'inProgress', 'inReview', 'done'].map(status => {
                  const isSelected = filters.status?.includes(status)
                  const statusLabel =
                    status === 'todo' ? 'To Do' :
                    status === 'inProgress' ? 'In Progress' :
                    status === 'inReview' ? 'In Review' : 'Done'

                  return (
                    <label
                      key={status}
                      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                        checked={isSelected}
                        onChange={() => handleFilterChange('status', status)}
                      />
                      <span className="ml-2 text-sm text-gray-700">{statusLabel}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Priority filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
              <div className="space-y-2">
                {['low', 'medium', 'high', 'urgent'].map(priority => {
                  const isSelected = filters.priority?.includes(priority)

                  return (
                    <label
                      key={priority}
                      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                        checked={isSelected}
                        onChange={() => handleFilterChange('priority', priority)}
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{priority}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Tags filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Common Tags</h4>
              <div className="space-y-2">
                {['important', 'bug', 'feature', 'documentation', 'design'].map(tag => {
                  const isSelected = filters.tags?.includes(tag)

                  return (
                    <label
                      key={tag}
                      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                        checked={isSelected}
                        onChange={() => handleFilterChange('tags', tag)}
                      />
                      <span className="ml-2 text-sm text-gray-700">{tag}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
  </div>
)}

      {/* Calendar View */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <>
            {view === VIEWS.MONTH && (
              <CalendarMonth
                currentDate={currentDate}
                tasks={filteredTasks}
                onTaskClick={handleTaskClick}
                onDateClick={handleDateClick}
              />
            )}
            {view === VIEWS.WEEK && (
              <CalendarWeek
                currentDate={currentDate}
                tasks={filteredTasks}
                onTaskClick={handleTaskClick}
                onDateClick={handleDateClick}
              />
            )}
            {view === VIEWS.DAY && (
              <CalendarDay
                currentDate={currentDate}
                tasks={filteredTasks}
                onTaskClick={handleTaskClick}
                onDateClick={handleDateClick}
              />
            )}
            {view === VIEWS.LIST && (
              <ScheduleList
                currentDate={currentDate}
                tasks={filteredTasks}
                onTaskClick={handleTaskClick}
              />
            )}
          </>
        )}
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          task={selectedTask}
          isCreating={isCreating}
          selectedDate={selectedDateForNewEvent}
        />
      )}
    </div>
  )
}

export default SchedulePage