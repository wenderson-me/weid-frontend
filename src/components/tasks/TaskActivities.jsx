
import React, { useState, useEffect } from 'react';
import {
  FiActivity,
  FiEdit,
  FiArchive,
  FiRefreshCw,
  FiCheck,
  FiXCircle,
  FiMessageSquare,
  FiCalendar,
  FiClock,
  FiTag,
  FiLink,
  FiThumbsUp,
  FiUserPlus,
  FiUserMinus
} from 'react-icons/fi';
import activityService from '../../services/activityService';

const TaskActivities = ({ taskId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!taskId) {
      setError('Task ID is required');
      setLoading(false);
      return;
    }

    fetchTaskActivities();
  }, [taskId]);


  const fetchTaskActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const taskActivities = await activityService.getTaskHistory(taskId);
      setActivities(Array.isArray(taskActivities) ? taskActivities : []);
    } catch (err) {
      console.error('Error fetching task activities:', err);
      setError(err.message || 'Failed to load task activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const activityTypeConfig = {
    task_created: {
      icon: <FiActivity />,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    task_updated: {
      icon: <FiEdit />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    task_status_changed: {
      icon: <FiCheck />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    task_assigned: {
      icon: <FiUserPlus />,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100'
    },
    task_unassigned: {
      icon: <FiUserMinus />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    task_completed: {
      icon: <FiCheck />,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    task_reopened: {
      icon: <FiRefreshCw />,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    task_archived: {
      icon: <FiArchive />,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100'
    },
    attachment_added: {
      icon: <FiLink />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    due_date_changed: {
      icon: <FiCalendar />,
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    comment_added: {
      icon: <FiMessageSquare />,
      color: 'text-violet-500',
      bgColor: 'bg-violet-100'
    },
    default: {
      icon: <FiActivity />,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100'
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <FiActivity className="mr-2 h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-medium text-gray-900">Activity History</h3>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex">
              <div className="h-8 w-8 rounded-full bg-gray-200 mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <FiActivity className="mr-2 h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-medium text-gray-900">Activity History</h3>
        </div>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>{error}</p>
          <button
            className="mt-2 text-red-700 underline"
            onClick={fetchTaskActivities}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <FiActivity className="mr-2 h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-medium text-gray-900">Activity History</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>No activity recorded for this task yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <FiActivity className="mr-2 h-5 w-5 text-violet-600" />
        <h3 className="text-lg font-medium text-gray-900">Activity History</h3>
      </div>

      <div className="relative pl-8 before:absolute before:left-4 before:top-1 before:bottom-10 before:w-0.5 before:bg-gray-200">
        {activities.map((activity, index) => {
          const config = activityTypeConfig[activity.type] || activityTypeConfig.default;

          return (
            <div key={activity._id || index} className="mb-6 last:mb-0">
              {/* Activity Icon */}
              <div className={`absolute left-1.5 w-5 h-5 rounded-full flex items-center justify-center ${config.bgColor} ${config.color}`}>
                {config.icon}
              </div>

              {/* Activity Content */}
              <div>
                <div className="flex items-center">
                  <div className="font-medium text-gray-900">
                    {activity.user?.name || 'A user'}
                  </div>
                  <div className="ml-2 text-xs text-gray-500" title={formatDate(activity.createdAt)}>
                    {formatRelativeTime(activity.createdAt)}
                  </div>
                </div>

                <div className="mt-1 text-gray-700">
                  {activity.description}
                </div>

                {/* Activity metadata if available */}
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {activity.type === 'due_date_changed' && activity.metadata.newDueDate && (
                      activity.metadata.oldDueDate
                        ? `Changed due date from ${formatDate(activity.metadata.oldDueDate)} to ${formatDate(activity.metadata.newDueDate)}`
                        : `Set due date to ${formatDate(activity.metadata.newDueDate)}`
                    )}

                    {activity.type === 'task_status_changed' && activity.metadata.newStatus && (
                      activity.metadata.oldStatus
                        ? `Changed status from ${activity.metadata.oldStatus} to ${activity.metadata.newStatus}`
                        : `Set status to ${activity.metadata.newStatus}`
                    )}

                    {activity.metadata.changes && activity.metadata.changes.length > 0 && (
                      <div>Updated fields: {activity.metadata.changes.join(', ')}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskActivities;