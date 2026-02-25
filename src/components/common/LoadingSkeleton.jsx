/**
 * LoadingSkeleton Component
 * Provides elegant loading placeholder skeletons with shimmer effect
 */

const LoadingSkeleton = ({ 
  variant = 'card', 
  count = 1, 
  width = '100%', 
  height = '100px',
  className = ''
}) => {
  const baseClasses = 'rounded-lg bg-gray-200 skeleton'
  
  const variants = {
    card: {
      className: 'rounded-xl shadow-sm',
      style: {
        width: width,
        height: height,
      }
    },
    text: {
      className: 'rounded-md h-4',
      style: { width: width }
    },
    avatar: {
      className: 'rounded-full',
      style: {
        width: height,
        height: height,
      }
    },
    line: {
      className: 'rounded-md h-3',
      style: { width: width }
    },
    taskCard: {
      className: 'rounded-xl shadow-sm p-4 space-y-3',
      style: { width: width }
    }
  }

  const variant_config = variants[variant] || variants.card

  // Task Card Skeleton
  if (variant === 'taskCard') {
    return (
      <div className={`${variant_config.className} ${className}`} style={variant_config.style}>
        {/* Tags skeleton */}
        <div className="flex gap-2">
          <div className="skeleton rounded-full h-5 w-12"></div>
          <div className="skeleton rounded-full h-5 w-16"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="skeleton h-5 w-full rounded-md"></div>
          <div className="skeleton h-5 w-4/5 rounded-md"></div>
        </div>
        
        {/* Description skeleton */}
        <div className="skeleton h-4 w-full rounded-md"></div>
        
        {/* Progress bar skeleton */}
        <div className="space-y-1">
          <div className="skeleton h-2 w-full rounded-full"></div>
        </div>
        
        {/* Footer skeleton */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <div className="flex gap-2">
            <div className="skeleton h-4 w-20 rounded-md"></div>
            <div className="skeleton h-4 w-16 rounded-md"></div>
          </div>
          <div className="flex gap-1">
            <div className="skeleton h-6 w-6 rounded-full"></div>
            <div className="skeleton h-6 w-6 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  // Multi-item skeleton
  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, idx) => (
          <div 
            key={idx}
            className={`${baseClasses} ${variant_config.className} entrance-fade`}
            style={{
              ...variant_config.style,
              animationDelay: `${idx * 50}ms`
            }}
          ></div>
        ))}
      </div>
    )
  }

  // Single item skeleton
  return (
    <div 
      className={`${baseClasses} ${variant_config.className} entrance-fade ${className}`}
      style={variant_config.style}
    ></div>
  )
}

export default LoadingSkeleton
