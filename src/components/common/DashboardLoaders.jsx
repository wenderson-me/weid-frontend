/**
 * Dashboard Loaders
 * Sophisticated skeleton loaders for dashboard components
 */

import LoadingSkeleton from './LoadingSkeleton'

export const DashboardStatsLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm p-6 entrance-fade" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2 w-full">
              <LoadingSkeleton variant="line" width="60%" />
              <LoadingSkeleton variant="text" width="40%" />
            </div>
            <LoadingSkeleton variant="avatar" height="40px" />
          </div>
          <LoadingSkeleton variant="text" width="30%" height="32px" />
        </div>
      ))}
    </div>
  )
}

export const TaskCardSkeletonLoader = ({ count = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <LoadingSkeleton 
          key={idx}
          variant="taskCard" 
          style={{ animationDelay: `${idx * 100}ms` }}
        />
      ))}
    </div>
  )
}

export const TaskBoardLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, colIdx) => (
        <div key={colIdx} className="bg-white rounded-xl p-4 entrance-fade" style={{ animationDelay: `${colIdx * 100}ms` }}>
          {/* Column Header */}
          <div className="mb-4">
            <LoadingSkeleton variant="line" width="70%" height="24px" />
            <LoadingSkeleton variant="line" width="30%" height="16px" className="mt-2" />
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, cardIdx) => (
              <LoadingSkeleton 
                key={cardIdx}
                variant="taskCard"
                style={{ animationDelay: `${(colIdx * 100) + (cardIdx * 50)}ms` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export const ProfileLoader = () => {
  return (
    <div className="max-w-2xl entrance-fade">
      {/* Avatar Section */}
      <div className="text-center mb-8">
        <LoadingSkeleton variant="avatar" height="100px" className="mx-auto mb-4" />
        <LoadingSkeleton variant="line" width="50%" height="24px" className="mx-auto mb-2" />
        <LoadingSkeleton variant="line" width="70%" height="16px" className="mx-auto" />
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="space-y-2" style={{ animationDelay: `${idx * 100}ms` }}>
            <LoadingSkeleton variant="line" width="30%" height="16px" />
            <LoadingSkeleton variant="text" width="100%" height="40px" />
          </div>
        ))}
      </div>

      {/* Button */}
      <LoadingSkeleton variant="text" width="100px" height="40px" className="mt-6" />
    </div>
  )
}

export const ActivityFeedLoader = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex gap-4 entrance-fade" style={{ animationDelay: `${idx * 80}ms` }}>
          {/* Avatar */}
          <LoadingSkeleton variant="avatar" height="40px" />
          
          {/* Content */}
          <div className="flex-1 space-y-2">
            <LoadingSkeleton variant="line" width="60%" />
            <LoadingSkeleton variant="line" width="40%" />
          </div>

          {/* Time */}
          <LoadingSkeleton variant="line" width="50px" />
        </div>
      ))}
    </div>
  )
}

export const NotesGridLoader = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx}
          className="rounded-xl bg-white shadow-sm p-4 space-y-3 entrance-fade"
          style={{ animationDelay: `${idx * 80}ms` }}
        >
          {/* Tags */}
          <div className="flex gap-2">
            <LoadingSkeleton variant="line" width="20%" height="24px" />
            <LoadingSkeleton variant="line" width="24%" height="24px" />
          </div>

          {/* Title */}
          <LoadingSkeleton variant="line" width="100%" height="20px" />
          <LoadingSkeleton variant="line" width="85%" height="20px" />

          {/* Content */}
          <div className="space-y-2">
            <LoadingSkeleton variant="line" width="100%" height="16px" />
            <LoadingSkeleton variant="line" width="75%" height="16px" />
          </div>

          {/* Footer */}
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <LoadingSkeleton variant="line" width="40%" height="16px" />
            <LoadingSkeleton variant="avatar" height="28px" />
          </div>
        </div>
      ))}
    </div>
  )
}
