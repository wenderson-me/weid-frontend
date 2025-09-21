import { Link } from 'react-router-dom'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FiPlus } from 'react-icons/fi'
import SortableTaskCard from './SortableTaskCard'

const TaskColumn = ({ id, title, tasks, status, color, loading }) => {
  const { setNodeRef } = useDroppable({
    id,
  })

  const colorClasses = {
    gray: 'bg-gray-50 border-gray-300',
    blue: 'bg-blue-50 border-blue-300',
    amber: 'bg-amber-50 border-amber-300',
    green: 'bg-green-50 border-green-300',
  }

  const headerColorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    amber: 'bg-amber-100 text-amber-800',
    green: 'bg-green-100 text-green-800',
  }


  const taskIds = tasks.map(task => task._id)

  return (
    <div className={`flex-shrink-0 w-72 flex flex-col rounded-xl border ${colorClasses[color] || 'bg-gray-50 border-gray-300'} shadow-sm`}>
      {/* Column Header */}
      <div className={`p-4 rounded-t-xl border-b ${headerColorClasses[color] || 'bg-gray-100'}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{title}</h3>
          <span className="text-sm flex items-center justify-center h-6 w-6 rounded-full bg-white">{loading ? '...' : tasks.length}</span>
        </div>
      </div>

      {/* Task Cards */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 space-y-3 overflow-auto min-h-[200px]"
      >
        {loading ? (

          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
              <div className="flex justify-between">
                <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
                <div className="h-6 w-6 bg-gray-100 rounded-full"></div>
              </div>
            </div>
          ))
        ) : tasks.length > 0 ? (
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <SortableTaskCard key={task._id} task={task} />
            ))}
          </SortableContext>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-3 flex flex-col items-center justify-center text-gray-500 text-sm h-24">
            <p>No tasks yet</p>
            <Link
              to={`/tasks/new?status=${status}`}
              className="mt-2 inline-flex items-center text-violet-600 hover:text-violet-700"
            >
              <FiPlus className="mr-1" /> Add task
            </Link>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <div className="p-3 border-t">
        <Link
          to={`/tasks/new?status=${status}`}
          className="w-full flex items-center justify-center py-2.5 px-3 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-violet-600 hover:border-violet-400 hover:bg-violet-50 transition-colors"
        >
          <FiPlus className="mr-1" /> Add task
        </Link>
      </div>
    </div>
  )
}

export default TaskColumn