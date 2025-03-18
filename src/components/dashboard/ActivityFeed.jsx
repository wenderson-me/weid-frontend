// src/components/dashboard/ActivityFeed.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlusCircle, FiEdit, FiCheckCircle, FiClock, FiRefreshCw,
  FiArchive, FiUserPlus, FiUserMinus, FiTag, FiFileText, FiArrowRight
} from 'react-icons/fi';

const ActivityFeed = ({ activities, loading }) => {
  // Helper to get icon based on activity type
  const getActivityIcon = (type) => {
    const iconMap = {
      task_created: <FiPlusCircle className="h-5 w-5 text-green-500" />,
      task_updated: <FiEdit className="h-5 w-5 text-blue-500" />,
      task_status_changed: <FiRefreshCw className="h-5 w-5 text-amber-500" />,
      task_completed: <FiCheckCircle className="h-5 w-5 text-green-500" />,
      task_reopened: <FiRefreshCw className="h-5 w-5 text-red-500" />,
      task_archived: <FiArchive className="h-5 w-5 text-gray-500" />,
      task_assigned: <FiUserPlus className="h-5 w-5 text-violet-500" />,
      task_unassigned: <FiUserMinus className="h-5 w-5 text-red-500" />,
      due_date_changed: <FiClock className="h-5 w-5 text-amber-500" />,
      note_created: <FiFileText className="h-5 w-5 text-green-500" />,
      note_updated: <FiEdit className="h-5 w-5 text-blue-500" />,
      note_pinned: <FiTag className="h-5 w-5 text-violet-500" />,
      note_unpinned: <FiTag className="h-5 w-5 text-gray-500" />,
      comment_added: <FiPlusCircle className="h-5 w-5 text-blue-500" />,
    };

    return iconMap[type] || <FiRefreshCw className="h-5 w-5 text-gray-500" />;
  };

  // Format date relative to now
  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 30) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (diffDay > 1) {
      return `${diffDay} days ago`;
    } else if (diffDay === 1) {
      return 'Yesterday';
    } else if (diffHour >= 1) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMin >= 1) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  };

  // Generate loading skeletons
  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <div key={`activity-skeleton-${index}`} className="p-4 border-b border-gray-200 animate-pulse">
        <div className="flex">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0"></div>
          <div className="ml-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    ));
  };

  // Empty state when no activities and not loading
  if (!loading && (!activities || activities.length === 0)) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No recent activities to display.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Loading skeleton */}
      {loading ? (
        renderSkeletons()
      ) : (
        // Actual activity items
        activities.map((activity, index) => (
          <div key={index} className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
            <div className="flex">
              <div className="mr-3 flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatRelativeTime(activity.createdAt)}
                </p>

                {/* Activity detail links */}
                {activity.task && (
                  <Link to={`/tasks/${activity.task}`} className="mt-1 text-xs text-violet-600 hover:text-violet-800 flex items-center">
                    View task <FiArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                )}

                {activity.note && (
                  <Link to={`/notes/${activity.note}`} className="mt-1 text-xs text-violet-600 hover:text-violet-800 flex items-center">
                    View note <FiArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityFeed;