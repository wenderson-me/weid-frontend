import React, { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

const GoalSection = ({ title, date, tasks = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
        <FiChevronRight
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-4 border-t border-gray-200">
          {tasks.length > 0 ? (
            <div className="space-y-3 mt-4">
              {tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    defaultChecked={task.completed}
                    className="w-4 h-4 mt-1 rounded"
                  />
                  <div className="flex-1">
                    <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.name}
                    </p>
                  </div>
                  {task.priority && (
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No tasks yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalSection;
