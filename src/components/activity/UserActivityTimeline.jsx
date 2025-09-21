import { useState, useEffect } from 'react';
import {
  FiActivity, FiRefreshCw, FiUser, FiUserPlus,
  FiSettings, FiLock, FiLogIn, FiLogOut,
  FiAlertCircle, FiInfo, FiMail, FiEdit
} from 'react-icons/fi';
import activityService from '../../services/activityService';
import { Link } from 'react-router-dom';

const UserActivityTimeline = ({ userId, showRelatedActivities = false, viewMode = 'list' }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    fetchUserActivities();
  }, [userId, showRelatedActivities]);

  const fetchUserActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      let userActivities;
      if (showRelatedActivities) {
        userActivities = await activityService.getUserRelatedActivities(userId);
      } else {
        userActivities = await activityService.getUserActivities(userId);
      }

      setActivities(Array.isArray(userActivities) ? userActivities : []);
    } catch (err) {
      console.error('Error fetching user activities:', err);
      setError(err.message || 'Failed to load user activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activityTypeConfig = {
    profile_updated: {
      icon: <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FiEdit className="h-4 w-4" />
            </div>,
      label: 'Profile Updated'
    },
    user_registered: {
      icon: <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <FiUserPlus className="h-4 w-4" />
            </div>,
      label: 'User Registered'
    },
    password_changed: {
      icon: <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <FiLock className="h-4 w-4" />
            </div>,
      label: 'Password Changed'
    },
    preferences_updated: {
      icon: <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <FiSettings className="h-4 w-4" />
            </div>,
      label: 'Preferences Updated'
    },
    avatar_changed: {
      icon: <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <FiUser className="h-4 w-4" />
            </div>,
      label: 'Avatar Changed'
    },
    email_changed: {
      icon: <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
              <FiMail className="h-4 w-4" />
            </div>,
      label: 'Email Changed'
    },
    user_login: {
      icon: <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <FiLogIn className="h-4 w-4" />
            </div>,
      label: 'User Login'
    },
    user_logout: {
      icon: <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              <FiLogOut className="h-4 w-4" />
            </div>,
      label: 'User Logout'
    }
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

  const renderActivityItem = (activity, isGridMode = false) => {
    const config = activityTypeConfig[activity.type] || {
      icon: <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              <FiActivity className="h-4 w-4" />
            </div>,
      label: activity.type
    };

    if (isGridMode) {
      return (
        <div key={activity._id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="p-4">
            <div className="flex items-start mb-3">
              <div className="mr-3 flex-shrink-0">
                {config.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.description || config.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatRelativeTime(activity.createdAt)}
                </p>
              </div>
            </div>

            {activity.user && (
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                {activity.user.avatar ? (
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="w-4 h-4 rounded-full mr-1"
                  />
                ) : (
                  <FiUser className="w-3 h-3 mr-1" />
                )}
                {activity.user.name}
              </p>
            )}

            {/* Show target user if in related activities mode */}
            {showRelatedActivities && activity.targetUser && activity.targetUser._id !== userId && (
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <FiUser className="w-3 h-3 mr-1" />
                Target: {activity.targetUser.name}
              </p>
            )}

            {/* Show actor if in related activities mode and the actor is not the current user */}
            {showRelatedActivities && activity.user && activity.user._id !== userId && (
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <FiUser className="w-3 h-3 mr-1" />
                Actor: {activity.user.name}
              </p>
            )}

            {/* Metadata summary (compact for grid view) */}
            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="mt-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
                {activity.type === 'profile_updated' && activity.metadata.changes && (
                  <p className="truncate">
                    Updated: {activity.metadata.changes.join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* Related task/note links */}
            <div className="mt-3 pt-2 border-t border-gray-100 flex space-x-2 text-xs">
              {activity.task && (
                <Link
                  to={`/tasks/${activity.task}`}
                  className="text-violet-600 hover:text-violet-800 font-medium"
                >
                  View task
                </Link>
              )}

              {activity.note && (
                <Link
                  to={`/notes/${activity.note}`}
                  className="text-violet-600 hover:text-violet-800 font-medium"
                >
                  View note
                </Link>
              )}
            </div>
          </div>
        </div>
      );
    }

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

          {/* Show target user if in related activities mode */}
          {showRelatedActivities && activity.targetUser && activity.targetUser._id !== userId && (
            <p className="text-xs text-gray-500 mt-1">
              Target: {activity.targetUser.name}
            </p>
          )}

          {/* Show actor if in related activities mode and the actor is not the current user */}
          {showRelatedActivities && activity.user && activity.user._id !== userId && (
            <p className="text-xs text-gray-500 mt-1">
              Actor: {activity.user.name}
            </p>
          )}

          {/* Regular user display (same as before) */}
          {!showRelatedActivities && activity.user && (
            <p className="text-xs text-gray-500 mt-1">
              {activity.user.name || 'Unknown user'}
            </p>
          )}

          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <div className="mt-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
              {activity.type === 'profile_updated' && activity.metadata.changes && (
                <p>
                  Updated fields: {activity.metadata.changes.join(', ')}
                </p>
              )}

              {activity.type === 'preferences_updated' && activity.metadata.preferences && (
                <p>
                  Updated preferences: {Object.keys(activity.metadata.preferences).join(', ')}
                </p>
              )}

              {activity.type === 'user_login' && activity.metadata.previousLogin && (
                <p>
                  Previous login: {formatDate(activity.metadata.previousLogin)}
                </p>
              )}
            </div>
          )}

          {/* Show related task/note links if available */}
          <div className="mt-2 flex space-x-2">
            {activity.task && (
              <Link
                to={`/tasks/${activity.task}`}
                className="text-xs font-medium text-violet-600 hover:text-violet-800"
              >
                View task
              </Link>
            )}

            {activity.note && (
              <Link
                to={`/notes/${activity.note}`}
                className="text-xs font-medium text-violet-600 hover:text-violet-800"
              >
                View note
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          {showRelatedActivities ? 'User Related Activities' : 'User Activities'}
        </h3>
        <button
          onClick={fetchUserActivities}
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
              onClick={fetchUserActivities}
            >
              <FiRefreshCw className="mr-1.5 h-4 w-4" /> Try Again
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center">
            <FiInfo className="h-10 w-10 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">No activities found for this user.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map(activity => renderActivityItem(activity, true))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activities.map(activity => renderActivityItem(activity, false))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityTimeline;