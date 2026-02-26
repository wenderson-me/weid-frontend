import React from 'react';
import { FiBookmark, FiCheck, FiClock } from 'react-icons/fi';

const TaskCard = ({
  title,
  description,
  colorClass,
  priority = 'normal',
  dueDate,
  subtasks = [],
  isCompleted = false
}) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    pink: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
    cyan: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200',
    red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
  };

  const dotColors = {
    blue: 'bg-blue-400',
    pink: 'bg-pink-400',
    orange: 'bg-orange-400',
    green: 'bg-green-400',
    purple: 'bg-purple-400',
    cyan: 'bg-cyan-400',
    red: 'bg-red-400'
  };

  return (
    <div
      className={`rounded-2xl p-5 border-2 shadow-sm transition-all hover:shadow-md hover:scale-105 cursor-pointer ${colorClasses[colorClass] || colorClasses.blue}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-sm text-gray-800 mb-1">{title}</h3>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        <FiBookmark className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
      </div>

      {/* Subtasks */}
      {subtasks.length > 0 && (
        <div className="space-y-2 mb-4">
          {subtasks.map((task, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${task.completed ? dotColors[colorClass] : 'bg-gray-300'}`} />
              <span className="text-xs text-gray-700">{task.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 border-opacity-50">
        {dueDate && (
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <FiClock className="w-3 h-3" />
            <span>{dueDate}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          {priority === 'high' && (
            <span className="px-2 py-1 bg-red-200 text-red-700 rounded text-xs font-semibold">High</span>
          )}
          {isCompleted && (
            <div className="p-1 bg-green-200 rounded">
              <FiCheck className="w-3 h-3 text-green-700" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
