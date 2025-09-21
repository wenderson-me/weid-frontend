import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
  FiFilter,
  FiPlus,
  FiChevronDown,
  FiSearch,
} from 'react-icons/fi'
import { useTasks } from '../../hooks/useTasks'
import TaskColumn from '../../components/tasks/TaskColumn'
import TaskCard from '../../components/tasks/TaskCard'
import TaskFilters from '../../components/tasks/TaskFilters'

const TaskBoard = () => {
  const {
    tasksByStatus,
    loading,
    fetchTasks,
    updateTask
  } = useTasks()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    priority: [],
    assignee: [],
    dueDate: null,
    tags: []
  })
  const [currentDate] = useState(new Date())


  const [localTasksByStatus, setLocalTasksByStatus] = useState({
    todo: [],
    inProgress: [],
    inReview: [],
    done: []
  })


  const [activeId, setActiveId] = useState(null)
  const [activeTask, setActiveTask] = useState(null)


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {

    setLocalTasksByStatus(tasksByStatus)
  }, [tasksByStatus])

  useEffect(() => {

    const apiFilters = {}

    if (selectedFilters.status.length > 0) {
      apiFilters.status = selectedFilters.status
    }

    if (selectedFilters.priority.length > 0) {
      apiFilters.priority = selectedFilters.priority
    }

    if (selectedFilters.assignee.length > 0) {
      apiFilters.assignee = selectedFilters.assignee[0]
    }

    if (selectedFilters.dueDate) {
      if (selectedFilters.dueDate.startDate) {
        apiFilters.dueStart = selectedFilters.dueDate.startDate
      }
      if (selectedFilters.dueDate.endDate) {
        apiFilters.dueEnd = selectedFilters.dueDate.endDate
      }
    }

    if (selectedFilters.tags.length > 0) {
      apiFilters.tags = selectedFilters.tags
    }

    if (searchTerm) {
      apiFilters.search = searchTerm
    }


    apiFilters.isArchived = false


    fetchTasks(apiFilters)
  }, [fetchTasks, selectedFilters, searchTerm])


  const findContainer = (id) => {
    const allStatuses = Object.keys(localTasksByStatus)


    if (allStatuses.includes(id)) {
      return id
    }


    return allStatuses.find(status =>
      localTasksByStatus[status].some(task => task._id === id)
    )
  }


  const handleDragStart = (event) => {
    const { active } = event
    const id = active.id


    const container = findContainer(id)
    const task = localTasksByStatus[container]?.find(t => t._id === id)

    setActiveId(id)
    setActiveTask(task)
  }


  const handleDragOver = (event) => {
    const { active, over } = event


    if (!over || active.id === over.id) {
      return
    }

    const activeContainer = findContainer(active.id)
    const overContainer = findContainer(over.id)


    if (activeContainer !== overContainer) {
      setLocalTasksByStatus(prev => {
        const activeItems = [...prev[activeContainer]]
        const overItems = [...prev[overContainer]]


        const activeIndex = activeItems.findIndex(t => t._id === active.id)
        const overIndex = over.id !== overContainer
          ? overItems.length
          : overItems.findIndex(t => t._id === over.id)

        let newIndex


        if (over.id === overContainer) {
          newIndex = overItems.length
        } else {

          const isBelowOverItem = active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height / 2

          newIndex = isBelowOverItem
            ? overIndex + 1
            : overIndex
        }


        const updatedTask = { ...activeItems[activeIndex], status: overContainer }


        return {
          ...prev,
          [activeContainer]: activeItems.filter(t => t._id !== active.id),
          [overContainer]: [
            ...overItems.slice(0, newIndex),
            updatedTask,
            ...overItems.slice(newIndex)
          ]
        }
      })
    }
  }


  const handleDragEnd = async (event) => {

    setActiveId(null);
    setActiveTask(null);


    const { active, over } = event;
    if (!active || !over) return;


    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);


    if (activeContainer !== overContainer) {
      try {

        const updatedTask = await updateTask(active.id, {
          status: overContainer,

        });


        if (updatedTask.status !== overContainer) {
          console.warn('O status da tarefa não foi atualizado corretamente no servidor');
          fetchTasks();
        }
      } catch (error) {
        console.error('Falha ao atualizar status da tarefa:', error);

        fetchTasks();
      }
    }
  }


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }


  const clearFilters = () => {
    setSelectedFilters({
      status: [],
      priority: [],
      assignee: [],
      dueDate: null,
      tags: []
    })
    setSearchTerm('')
  }


  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }


  const totalTasks = Object.values(localTasksByStatus).reduce(
    (sum, tasks) => sum + tasks.length,
    0
  )

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>• Daily Tasks</span>
              <FiChevronDown size={16} className="ml-1" />
            </div>
          </div>
          <p className="text-gray-600 mt-1">{formatDate(currentDate)}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              className="appearance-none block w-full pl-10 pr-3 py-3.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Filter Button */}
          <button
            type="button"
            className={`inline-flex items-center justify-center px-4 py-3.5 border ${
              filtersOpen ? 'bg-violet-600 text-white border-transparent' : 'border-gray-300 text-gray-700 bg-white'
            } rounded-xl font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <FiFilter className="mr-2" />
            <span>Filters</span>
            {Object.values(selectedFilters).some(
              filter => Array.isArray(filter) ? filter.length > 0 : !!filter
            ) && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                Active
              </span>
            )}
          </button>

          {/* Create Task Button */}
          <Link
            to="/tasks/new"
            className="inline-flex items-center justify-center px-4 py-3.5 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <FiPlus className="mr-2" />
            <span>Create task</span>
          </Link>
        </div>
      </div>

      {/* Filters panel */}
      {filtersOpen && (
        <TaskFilters
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          clearFilters={clearFilters}
        />
      )}

      {/* Tasks count and sorting */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          {loading ? (
            <span>Loading tasks...</span>
          ) : (
            <span>{totalTasks} tasks</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort:</span>
          <select className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-gray-700 sm:text-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500">
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created date</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Task Board with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-6 pb-6 overflow-auto">
          {/* To Do Column */}
          <TaskColumn
            id="todo"
            title="Todo list"
            tasks={localTasksByStatus.todo || []}
            status="todo"
            color="gray"
            loading={loading}
          />

          {/* In Progress Column */}
          <TaskColumn
            id="inProgress"
            title="In Progress"
            tasks={localTasksByStatus.inProgress || []}
            status="inProgress"
            color="blue"
            loading={loading}
          />

          {/* In Review Column */}
          <TaskColumn
            id="inReview"
            title="In Review"
            tasks={localTasksByStatus.inReview || []}
            status="inReview"
            color="amber"
            loading={loading}
          />

          {/* Done Column */}
          <TaskColumn
            id="done"
            title="Done"
            tasks={localTasksByStatus.done || []}
            status="done"
            color="green"
            loading={loading}
          />

          {/* Drag Overlay - shows the task being dragged */}
          <DragOverlay>
            {activeId && activeTask ? (
              <div className="w-72 opacity-80">
                <TaskCard task={activeTask} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  )
}

export default TaskBoard