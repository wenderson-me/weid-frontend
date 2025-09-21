import { useState, useEffect } from 'react';
import {
  FiActivity, FiRefreshCw, FiEdit, FiPlus, FiCheckCircle,
  FiUser, FiUserMinus, FiCalendar, FiMessageSquare,
  FiArchive, FiAlertCircle, FiInfo
} from 'react-icons/fi';
import activityService from '../../services/activityService';

const TaskActivityTimeline = ({ taskId }) => {
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
      icon: <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <FiPlus className="h-4 w-4" />
            </div>,
      label: 'Task Created'
    },
    task_updated: {
      icon: <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FiEdit className="h-4 w-4" />
            </div>,
      label: 'Task Updated'
    },
    task_status_changed: {
      icon: <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <FiRefreshCw className="h-4 w-4" />
            </div>,
      label: 'Status Changed'
    },
    task_assigned: {
      icon: <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <FiUser className="h-4 w-4" />
            </div>,
      label: 'Task Assigned'
    },
    task_unassigned: {
      icon: <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <FiUserMinus className="h-4 w-4" />
            </div>,
      label: 'User Unassigned'
    },
    comment_added: {
      icon: <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FiMessageSquare className="h-4 w-4" />
            </div>,
      label: 'Comment Added'
    },
    task_completed: {
      icon: <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <FiCheckCircle className="h-4 w-4" />
            </div>,
      label: 'Task Completed'
    },
    task_reopened: {
      icon: <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <FiRefreshCw className="h-4 w-4" />
            </div>,
      label: 'Task Reopened'
    },
    task_archived: {
      icon: <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              <FiArchive className="h-4 w-4" />
            </div>,
      label: 'Task Archived'
    },
    due_date_changed: {
      icon: <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <FiCalendar className="h-4 w-4" />
            </div>,
      label: 'Due Date Changed'
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';

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
      return `${diffMin}m ago`;
    } else if (diffHour < 24) {
      return `${diffHour}h ago`;
    } else if (diffDay < 7) {
      return `${diffDay}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Task History</h3>
        <button
          onClick={fetchTaskActivities}
          className="flex items-center text-sm text-violet-600 hover:text-violet-800"
        >
          <FiRefreshCw className="mr-1 h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="p-1">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-10 h-10 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="text-red-500 mb-2">
              <FiAlertCircle className="h-10 w-10 mx-auto" />
            </div>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              onClick={fetchTaskActivities}
            >
              <FiRefreshCw className="mr-1.5 h-4 w-4" /> Try Again
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center">
            <FiInfo className="h-10 w-10 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">No activity history found for this task.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activities.map((activity) => {
              const config = activityTypeConfig[activity.type] || {
                icon: <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <FiActivity className="h-4 w-4" />
                      </div>,
                label: activity.type
              };

              return (
                <div key={activity._id} className="p-4 hover:bg-gray-50 transition-colors flex">
                  <div className="mr-3 flex-shrink-0">
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description || config.label}
                      </p>
                      <span
                        className="text-xs text-gray-500 ml-2"
                        title={formatDate(activity.createdAt)}
                      >
                        {formatRelativeTime(activity.createdAt)}
                      </span>
                    </div>

                    {activity.user && (
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.user.name || 'Unknown user'}
                      </p>
                    )}

                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
                        {activity.type === 'task_status_changed' && (
                          <p>
                            Changed status from <span className="font-medium">{activity.metadata.oldStatus}</span> to{' '}
                            <span className="font-medium">{activity.metadata.newStatus}</span>
                          </p>
                        )}

                        {activity.type === 'due_date_changed' && (
                          <p>
                            {activity.metadata.oldDueDate
                              ? `Changed due date from ${formatDate(activity.metadata.oldDueDate)} to ${formatDate(activity.metadata.newDueDate)}`
                              : `Set due date to ${formatDate(activity.metadata.newDueDate)}`}
                          </p>
                        )}

                        {activity.type === 'task_updated' && activity.metadata.changes && (
                          <p>
                            Updated fields: {activity.metadata.changes.join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskActivityTimeline;