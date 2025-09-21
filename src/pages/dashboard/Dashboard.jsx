
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { FiInfo } from 'react-icons/fi';
import TaskStatisticsCard from '../../components/dashboard/TaskStatisticsCard';
import RecentTasksCard from '../../components/dashboard/RecentTasksCard';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import activityService from '../../services/activityService';
import { DashboardStatsLoader } from '../../components/common/LoadingStates';
import MorningBriefing from '../../components/dashboard/MorningBriefing';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { tasks, statistics, loading: tasksLoading, fetchTasks, fetchStatistics } = useTasks();
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const fetchPromises = [
          fetchTasks({ limit: 10 }),
          fetchStatistics(),
          fetchActivities()
        ];

        await Promise.all(fetchPromises);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      }
    };

    fetchData();
  }, [fetchTasks, fetchStatistics]);

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const activities = await activityService.getUserActivities(10);
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Failed to load activity feed.');
    } finally {
      setLoadingActivities(false);
    }
  };


  const statsCards = [
    {
      title: 'Total Tasks',
      value: statistics?.total || 0,
      icon: <FiInfo className="h-8 w-8 text-violet-600" />,
      color: 'bg-violet-100 text-violet-700',
      loading: tasksLoading
    },
    {
      title: 'Tasks In Progress',
      value: statistics?.byStatus?.inProgress || 0,
      icon: <FiInfo className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-100 text-blue-700',
      loading: tasksLoading
    },
    {
      title: 'Tasks Completed',
      value: statistics?.byStatus?.done || 0,
      icon: <FiInfo className="h-8 w-8 text-green-600" />,
      color: 'bg-green-100 text-green-700',
      loading: tasksLoading
    },
    {
      title: 'Overdue Tasks',
      value: statistics?.overdue || 0,
      icon: <FiInfo className="h-8 w-8 text-red-600" />,
      color: 'bg-red-100 text-red-700',
      loading: tasksLoading
    }
  ];


  const handleRetry = () => {
    setError(null);
    fetchTasks({ limit: 10 });
    fetchStatistics();
    fetchActivities();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome message */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {currentUser?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Error message if data fetching fails */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={handleRetry}
                className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
       {/* Morning Briefing */}
       <MorningBriefing tasks={tasks} loading={tasksLoading} />

      {/* Statistics Cards */}
      {tasksLoading ? (
        <DashboardStatsLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsCards.map((card, index) => (
            <TaskStatisticsCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              loading={card.loading}
            />
          ))}
        </div>
      )}

      {/* Tasks and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 p-4 border-b">
            Recent Tasks
          </h2>
          <RecentTasksCard tasks={tasks.slice(0, 10)} loading={tasksLoading} />
        </div>

        {/* Activity Feed */}
        <div className="bg-white shadow rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 p-4 border-b">
            Activity Feed
          </h2>
          <ActivityFeed activities={recentActivities} loading={loadingActivities} />
        </div>
      </div>

      {/* Task by Status Chart would go here - add loading state as needed */}
    </div>
  );
};

export default Dashboard;