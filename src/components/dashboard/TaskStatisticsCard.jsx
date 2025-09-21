import React from 'react';

const TaskStatisticsCard = ({ title, value, icon, color, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
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