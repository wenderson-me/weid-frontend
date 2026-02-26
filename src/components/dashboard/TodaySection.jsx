import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const TodaySection = ({ tasks = [] }) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl p-6 border-2 border-pink-200">
      <h3 className="font-bold text-lg text-gray-800 mb-2">Today</h3>
      <p className="text-sm text-gray-600 mb-4">
        {completedCount} of {totalCount} tasks completed
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-pink-200 rounded-full h-2 mb-6">
        <div
          className="bg-pink-500 h-2 rounded-full transition-all"
          style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
        />
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
              task.completed ? 'bg-pink-500' : 'bg-white border-2 border-pink-300'
            }`}>
              {task.completed && <FiCheck className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-sm font-medium flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaySection;
