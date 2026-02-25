import React from 'react';
import { useHoverAnimation } from '../../hooks/useAnimations';
import LoadingSkeleton from '../common/LoadingSkeleton';

const TaskStatisticsCard = ({ title, value, icon, color, loading, index = 0 }) => {
  const { onMouseEnter, onMouseLeave, style } = useHoverAnimation({
    duration: 300,
    scale: 1.02,
    y: -4,
    enableGlow: true
  });

  if (loading) {
    return (
      <LoadingSkeleton
        variant="card"
        width="100%"
        height="100px"
        className="entrance-fade"
        style={{ animationDelay: `${index * 50}ms` }}
      />
    );
  }

  return (
    <div
      className="bg-white p-4 rounded-lg shadow card-advanced-hover entrance-fade"
      style={{
        ...style,
        animationDelay: `${index * 50}ms`
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${color || 'bg-violet-100'}`}>{icon}</div>
      </div>
    </div>
  );
};

export default TaskStatisticsCard;