import React from 'react';
import { FiCheck } from 'react-icons/fi';

const QuickOffloadSection = ({ tasks = [] }) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-2xl p-6 border-2 border-red-200">
      <h3 className="font-bold text-lg text-gray-800 mb-2">Quickly offload tasks</h3>
      <p className="text-xs text-gray-600 mb-4">
        for mental relief
      </p>

      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold text-gray-800">
          {completedCount}/{totalCount}
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(totalCount)].map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full ${idx < completedCount ? 'bg-red-500' : 'bg-red-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-50 transition-colors">
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              task.completed ? 'bg-red-500 border-red-500' : 'border-red-300'
            }`}>
              {task.completed && <FiCheck className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-xs font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
              {task.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickOffloadSection;
