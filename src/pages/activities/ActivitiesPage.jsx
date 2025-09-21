import { useState, useEffect, useContext } from 'react';
import {
  FiRefreshCw, FiPlus, FiEdit, FiCheckCircle, FiUser,
  FiUserMinus, FiMessageSquare, FiArchive, FiPaperclip,
  FiCalendar, FiActivity, FiSearch, FiGrid, FiList, FiFilter
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/Tabs';
import AuthContext from '../../context/AuthContext';

import activityService from '../../services/activityService';
import ActivityFilter from '../../components/activity/ActivityFilter';
import ActivityFilters from '../../components/activity/ActivityFilter';
import UserActivityTimeline from '../../components/activity/UserActivityTimeline';
import Pagination from '../../components/common/Pagination';


const ACTIVITY_TYPES = [
  'task_created', 'task_updated', 'task_status_changed', 'task_assigned',
  'task_unassigned', 'task_completed', 'task_reopened', 'task_archived',
  'note_created', 'note_updated', 'note_pinned', 'note_unpinned', 'note_deleted',
  'comment_added', 'profile_updated', 'password_changed', 'avatar_changed',
  'preferences_updated', 'due_date_changed'
];

const ActivitiesPage = () => {

  const { currentUser } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });


  const [userActivities, setUserActivities] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const [userPagination, setUserPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });


  const [relatedActivities, setRelatedActivities] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [relatedError, setRelatedError] = useState(null);
  const [relatedPagination, setRelatedPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });


  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    users: [],
    dateRange: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);


  const fetchActivities = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);


      let params = {
        page,
        limit: pagination.limit
      };


      if (selectedFilters.type && selectedFilters.type.length > 0) {
        params.type = selectedFilters.type;
      }


      if (selectedFilters.users && selectedFilters.users.length > 0) {
        params.users = selectedFilters.users;
      }


      if (selectedFilters.dateRange) {
        if (selectedFilters.dateRange.createdStart) {
          params.createdStart = selectedFilters.dateRange.createdStart;
        }
        if (selectedFilters.dateRange.createdEnd) {
          params.createdEnd = selectedFilters.dateRange.createdEnd;
        }
      }


      if (searchQuery) {
        params.search = searchQuery;
      }


      const result = await activityService.getActivities(params);


      if (Array.isArray(result)) {

        setActivities(result);
        setPagination(prev => ({
          ...prev,
          page,
          total: result.length,
          pages: 1
        }));
      } else if (result && result.activities) {

        setActivities(result.activities);
        setPagination({
          page: result.page || 1,
          limit: result.limit || 20,
          total: result.total || 0,
          pages: result.pages || 1
        });
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err.message || 'Failed to load activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const fetchUserActivities = async (page = 1) => {
    if (!currentUser) return;

    try {
      setUserLoading(true);
      setUserError(null);


      let params = {
        page,
        limit: userPagination.limit
      };


      if (selectedFilters.type && selectedFilters.type.length > 0) {
        params.type = selectedFilters.type;
      }


      if (selectedFilters.dateRange) {
        if (selectedFilters.dateRange.createdStart) {
          params.createdStart = selectedFilters.dateRange.createdStart;
        }
        if (selectedFilters.dateRange.createdEnd) {
          params.createdEnd = selectedFilters.dateRange.createdEnd;
        }
      }


      if (searchQuery) {
        params.search = searchQuery;
      }

      const result = await activityService.getUserActivities(currentUser._id, params);


      if (Array.isArray(result)) {
        setUserActivities(result);
        setUserPagination(prev => ({
          ...prev,
          page,
          total: result.length,
          pages: Math.ceil(result.length / userPagination.limit) || 1
        }));
      } else if (result && result.activities) {
        setUserActivities(result.activities);
        setUserPagination({
          page: result.page || 1,
          limit: result.limit || 20,
          total: result.total || 0,
          pages: result.pages || 1
        });
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Error fetching user activities:', err);
      setUserError(err.message || 'Failed to load user activities. Please try again.');
    } finally {
      setUserLoading(false);
    }
  };


  const fetchRelatedActivities = async (page = 1) => {
    if (!currentUser) return;

    try {
      setRelatedLoading(true);
      setRelatedError(null);


      let params = {
        page,
        limit: relatedPagination.limit
      };


      if (selectedFilters.type && selectedFilters.type.length > 0) {
        params.type = selectedFilters.type;
      }


      if (selectedFilters.users && selectedFilters.users.length > 0) {
        params.users = selectedFilters.users;
      }


      if (selectedFilters.dateRange) {
        if (selectedFilters.dateRange.createdStart) {
          params.createdStart = selectedFilters.dateRange.createdStart;
        }
        if (selectedFilters.dateRange.createdEnd) {
          params.createdEnd = selectedFilters.dateRange.createdEnd;
        }
      }


      if (searchQuery) {
        params.search = searchQuery;
      }

      const result = await activityService.getUserRelatedActivities(currentUser._id, params);


      if (Array.isArray(result)) {
        setRelatedActivities(result);
        setRelatedPagination(prev => ({
          ...prev,
          page,
          total: result.length,
          pages: Math.ceil(result.length / relatedPagination.limit) || 1
        }));
      } else if (result && result.activities) {
        setRelatedActivities(result.activities);
        setRelatedPagination({
          page: result.page || 1,
          limit: result.limit || 20,
          total: result.total || 0,
          pages: result.pages || 1
        });
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Error fetching related activities:', err);
      setRelatedError(err.message || 'Failed to load related activities. Please try again.');
    } finally {
      setRelatedLoading(false);
    }
  };


  useEffect(() => {
    if (!currentUser) return;

    if (activeTab === 'all') {
      fetchActivities(pagination.page);
    } else if (activeTab === 'me') {
      fetchUserActivities(userPagination.page);
    } else if (activeTab === 'related') {
      fetchRelatedActivities(relatedPagination.page);
    }
  }, [activeTab, selectedFilters, searchQuery, currentUser]);


  const handlePageChange = (newPage) => {
    if (newPage !== pagination.page) {
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchActivities(newPage);
    }
  };


  const handleUserPageChange = (newPage) => {
    if (newPage !== userPagination.page) {
      setUserPagination(prev => ({ ...prev, page: newPage }));
      fetchUserActivities(newPage);
    }
  };


  const handleRelatedPageChange = (newPage) => {
    if (newPage !== relatedPagination.page) {
      setRelatedPagination(prev => ({ ...prev, page: newPage }));
      fetchRelatedActivities(newPage);
    }
  };


  const clearFilters = () => {
    setSelectedFilters({
      type: [],
      users: [],
      dateRange: null
    });
    setSearchQuery('');
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  const handleSearchSubmit = (e) => {
    e.preventDefault();


    setPagination(prev => ({ ...prev, page: 1 }));
    setUserPagination(prev => ({ ...prev, page: 1 }));
    setRelatedPagination(prev => ({ ...prev, page: 1 }));


    if (activeTab === 'all') {
      fetchActivities(1);
    } else if (activeTab === 'me') {
      fetchUserActivities(1);
    } else if (activeTab === 'related') {
      fetchRelatedActivities(1);
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
    attachment_added: {
      icon: <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FiPaperclip className="h-4 w-4" />
            </div>,
      label: 'Attachment Added'
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
      <div key={activity._id} className="p-6 hover:bg-gray-50 transition-colors">
        <div className="flex items-start">
          <div className="mr-4 flex-shrink-0">
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {activity.description}
            </p>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span title={formatDate(activity.createdAt)}>
                {formatRelativeTime(activity.createdAt)}
              </span>
              {activity.user && (
                <span className="ml-2 flex items-center">
                  • By {activity.user.name}
                </span>
              )}
            </div>

            {/* Activity metadata if available */}
            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
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
              </div>
            )}

            {/* Related task/note links */}
            <div className="mt-2">
              {activity.task && (
                <Link
                  to={`/tasks/${activity.task}`}
                  className="text-sm font-medium text-violet-600 hover:text-violet-700"
                >
                  View task
                </Link>
              )}

              {activity.note && (
                <Link
                  to={`/notes/${activity.note}`}
                  className="text-sm font-medium text-violet-600 hover:text-violet-700 ml-3"
                >
                  View note
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600">
            Track and view activity history across your workspace
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search activities..."
                className="appearance-none block w-full pl-10 pr-3 py-3.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>
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

          {/* View mode toggle */}
          <div className="border rounded-xl overflow-hidden flex shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3.5 ${viewMode === 'list'
                ? 'bg-violet-100 text-violet-700 font-medium'
                : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              title="List view"
            >
              <FiList className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3.5 ${viewMode === 'grid'
                ? 'bg-violet-100 text-violet-700 font-medium'
                : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              title="Grid view"
            >
              <FiGrid className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'all') fetchActivities(pagination.page);
              else if (activeTab === 'me') fetchUserActivities(userPagination.page);
              else if (activeTab === 'related') fetchRelatedActivities(relatedPagination.page);
            }}
            className="inline-flex items-center justify-center px-4 py-3.5 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
        </div>
      </div>

      {/* Filters panel - using the expanded TaskFilters style */}
      {filtersOpen && (
        <ActivityFilters
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          clearFilters={clearFilters}
          activityTypes={ACTIVITY_TYPES}
        />
      )}

      {/* Tabs for different activity views */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="me">My Activities</TabsTrigger>
          <TabsTrigger value="related">Related to Me</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {/* Render activities based on view mode */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (

              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : error ? (

              <div className="p-6 text-center">
                <div className="text-red-500 mb-4">
                  <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-4">{error}</p>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                  onClick={() => fetchActivities(pagination.page)}
                >
                  <FiRefreshCw className="mr-2 -ml-1 h-4 w-4" /> Try Again
                </button>
              </div>
            ) : activities.length === 0 ? (

              <div className="p-12 text-center">
                <svg className="h-16 w-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No activities found</h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : viewMode === 'grid' ? (

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map(activity => renderActivityItem(activity, true))}
              </div>
            ) : (

              <div className="divide-y divide-gray-200">
                {activities.map(activity => renderActivityItem(activity, false))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && !loading && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="me" className="mt-0">
          {/* My activities tab - now with grid/list views and pagination */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {userLoading ? (

              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : userError ? (

              <div className="p-6 text-center">
                <div className="text-red-500 mb-4">
                  <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-4">{userError}</p>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                  onClick={() => fetchUserActivities(userPagination.page)}
                >
                  <FiRefreshCw className="mr-2 -ml-1 h-4 w-4" /> Try Again
                </button>
              </div>
            ) : userActivities.length === 0 ? (

              <div className="p-12 text-center">
                <svg className="h-16 w-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No activities found</h3>
                <p className="mt-2 text-gray-500">
                  You haven't performed any activities yet
                </p>
              </div>
            ) : viewMode === 'grid' ? (

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userActivities.map(activity => renderActivityItem(activity, true))}
              </div>
            ) : (

              <div className="divide-y divide-gray-200">
                {userActivities.map(activity => renderActivityItem(activity, false))}
              </div>
            )}
          </div>

          {/* Pagination for user activities */}
          {userPagination.pages > 1 && !userLoading && (
            <div className="mt-6">
              <Pagination
                currentPage={userPagination.page}
                totalPages={userPagination.pages}
                onPageChange={handleUserPageChange}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="related" className="mt-0">
          {/* Related activities tab - now with grid/list views and pagination */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {relatedLoading ? (

              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : relatedError ? (

              <div className="p-6 text-center">
                <div className="text-red-500 mb-4">
                  <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-4">{relatedError}</p>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                  onClick={() => fetchRelatedActivities(relatedPagination.page)}
                >
                  <FiRefreshCw className="mr-2 -ml-1 h-4 w-4" /> Try Again
                </button>
              </div>
            ) : relatedActivities.length === 0 ? (

              <div className="p-12 text-center">
                <svg className="h-16 w-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No related activities found</h3>
                <p className="mt-2 text-gray-500">
                  There are no activities related to you yet
                </p>
              </div>
            ) : viewMode === 'grid' ? (

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedActivities.map(activity => renderActivityItem(activity, true))}
              </div>
            ) : (

              <div className="divide-y divide-gray-200">
                {relatedActivities.map(activity => renderActivityItem(activity, false))}
              </div>
            )}
          </div>

          {/* Pagination for related activities */}
          {relatedPagination.pages > 1 && !relatedLoading && (
            <div className="mt-6">
              <Pagination
                currentPage={relatedPagination.page}
                totalPages={relatedPagination.pages}
                onPageChange={handleRelatedPageChange}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivitiesPage;