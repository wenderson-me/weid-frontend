import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi';

const TaskStatusBadge = ({ status }) => {
  const badgeClasses = {
    todo: 'bg-gray-100 text-gray-800',
    inProgress: 'bg-blue-100 text-blue-800',
    inReview: 'bg-amber-100 text-amber-800',
    done: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${badgeClasses[status] || badgeClasses.todo}`}>
      {status === 'inProgress' ? 'In Progress' :
       status === 'inReview' ? 'In Review' :
       status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const badgeClasses = {
    low: 'bg-gray-100 border-gray-400',
    medium: 'bg-blue-100 border-blue-400',
    high: 'bg-orange-100 border-orange-400',
    urgent: 'bg-red-100 border-red-400',
  };

  return (
    <span className={`inline-block h-2 w-2 rounded-full ${badgeClasses[priority] || badgeClasses.medium}`} />
  );
};

const RecentTasksCard = ({ tasks, loading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isTaskOverdue = (task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(23, 59, 59, 999);
    return dueDate < new Date() && task.status !== 'done';
  };

  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="border-b border-gray-200 p-4 animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-2 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    ));
  };

  if (!loading && (!tasks || tasks.length === 0)) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 mb-4">You don't have any tasks yet.</p>
        <Link to="/tasks/new" className="text-violet-600 hover:text-violet-800 font-medium flex items-center justify-center">
          Create your first task <FiArrowRight className="ml-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {loading ? (
        renderSkeletons()
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="p-4 hover:bg-gray-50 transition-colors">
            <Link to={`/tasks/${task._id}`} className="block">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-medium ${isTaskOverdue(task) ? 'text-red-600' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
                <TaskStatusBadge status={task.status} />
              </div>
              {task.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                  {task.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {/* Task assignees */}
                  {task.assignees && task.assignees.slice(0, 3).map((assignee, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                    >
                      {assignee.name ? assignee.name.charAt(0) : 'U'}
                    </div>
                  ))}
                  {task.assignees && task.assignees.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                      +{task.assignees.length - 3}
                    </div>
                  )}
                  {(!task.assignees || task.assignees.length === 0) && (
                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                      <FiUser className="text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Due date */}
                {task.dueDate && (
                  <div className={`flex items-center text-xs ${isTaskOverdue(task) ? 'text-red-600' : 'text-gray-500'}`}>
                    <FiClock className="mr-1" />
                    <span>Due {formatDate(task.dueDate)}</span>
                  </div>
                )}

                {/* Progress bar */}
                {task.progress !== undefined && (
                  <div className="w-20 h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className={`h-full ${task.status === 'done' ? 'bg-green-500' : 'bg-violet-500'}`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentTasksCard;