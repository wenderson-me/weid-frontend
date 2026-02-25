import { FiCheckSquare, FiClock, FiAlertCircle, FiFile, FiStar, FiMessageSquare, FiCalendar, FiClock as FiClockIcon } from 'react-icons/fi'
import LoadingSkeleton from '../common/LoadingSkeleton'
import { useHoverAnimation } from '../../hooks/useAnimations'

const ProfileStatistics = ({ stats, loading }) => {

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }


  const getMembershipDuration = (startDate) => {
    if (!startDate) return 'N/A'

    const start = new Date(startDate)
    const now = new Date()

    const diffInYears = Math.floor((now - start) / (365.25 * 24 * 60 * 60 * 1000))
    const diffInMonths = Math.floor((now - start) / (30.44 * 24 * 60 * 60 * 1000)) % 12

    if (diffInYears > 0) {
      return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ${diffInMonths > 0 ? `and ${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}` : ''}`
    }

    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}`
  }


  const StatCard = ({ title, value, icon, color, index = 0 }) => {
    const { onMouseEnter, onMouseLeave, style } = useHoverAnimation({
      duration: 300,
      scale: 1.02,
      y: -4,
      enableGlow: true
    });

    return (
      <div
        className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm card-advanced-hover entrance-fade ${color ? `bg-${color}-50` : ''}`}
        style={{ ...style, animationDelay: `${index * 50}ms` }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
          </div>
          <div className="rounded-full p-2 bg-white shadow-sm border border-gray-100">
            {icon}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <LoadingSkeleton variant="text" width="40%" height="28px" className="mb-4" />
          <LoadingSkeleton variant="text" width="60%" height="20px" />
        </div>

        {/* Account Overview Skeleton */}
        <div>
          <LoadingSkeleton variant="text" width="30%" height="24px" className="mb-4" />
          <LoadingSkeleton variant="card" width="100%" height="140px" />
        </div>

        {/* Task Activity Skeletons */}
        <div>
          <LoadingSkeleton variant="text" width="30%" height="24px" className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, idx) => (
              <LoadingSkeleton
                key={`task-stat-${idx}`}
                variant="card"
                width="100%"
                height="120px"
                style={{ animationDelay: `${idx * 100}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Content & Participation Skeletons */}
        <div>
          <LoadingSkeleton variant="text" width="30%" height="24px" className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, idx) => (
              <LoadingSkeleton
                key={`content-stat-${idx}`}
                variant="card"
                width="100%"
                height="120px"
                style={{ animationDelay: `${idx * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }


  if (!stats) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Statistics unavailable</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          We couldn't load your statistics at this time. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Activity Statistics</h2>
        <p className="text-gray-600 mb-6">
          Here's an overview of your activity and usage on the platform.
        </p>
      </div>

      {/* Account Overview */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-4">Account Overview</h3>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Member Since</div>
              <div className="flex items-center">
                <FiCalendar className="h-5 w-5 text-violet-500 mr-2" />
                <span className="text-gray-900">{formatDate(stats.memberSince)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {getMembershipDuration(stats.memberSince)}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Last Login</div>
              <div className="flex items-center">
                <FiClockIcon className="h-5 w-5 text-violet-500 mr-2" />
                <span className="text-gray-900">{formatDate(stats.lastLogin)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Statistics */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-4">Task Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tasks"
            value={stats.tasks.total}
            icon={<FiCheckSquare className="h-5 w-5 text-gray-600" />}
            index={0}
          />
          <StatCard
            title="Completed Tasks"
            value={stats.tasks.completed}
            icon={<FiCheckSquare className="h-5 w-5 text-green-600" />}
            color="green"
            index={1}
          />
          <StatCard
            title="In Progress"
            value={stats.tasks.inProgress}
            icon={<FiClock className="h-5 w-5 text-blue-600" />}
            color="blue"
            index={2}
          />
          <StatCard
            title="Overdue Tasks"
            value={stats.tasks.overdue}
            icon={<FiAlertCircle className="h-5 w-5 text-red-600" />}
            color="red"
            index={3}
          />
        </div>
      </div>

      {/* Notes and Comments */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-4">Content & Participation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Notes"
            value={stats.notes.total}
            icon={<FiFile className="h-5 w-5 text-violet-600" />}
            color="violet"
          />
          <StatCard
            title="Pinned Notes"
            value={stats.notes.pinned}
            icon={<FiStar className="h-5 w-5 text-amber-600" />}
            color="amber"
          />
          <StatCard
            title="Comments"
            value={stats.comments}
            icon={<FiMessageSquare className="h-5 w-5 text-cyan-600" />}
            color="cyan"
          />
        </div>
      </div>

      {/* Task Completion Rate */}
      {stats.tasks.total > 0 && (
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-4">Completion Rate</h3>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Task Completion</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round((stats.tasks.completed / stats.tasks.total) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${(stats.tasks.completed / stats.tasks.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              You've completed {stats.tasks.completed} out of {stats.tasks.total} assigned tasks
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileStatistics