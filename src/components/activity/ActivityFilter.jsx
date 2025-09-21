import { useState, useEffect } from 'react';
import {
  FiX,
  FiFilter,
  FiCalendar,
  FiTag,
  FiUser,
  FiActivity
} from 'react-icons/fi';

const ActivityFilters = ({ selectedFilters, setSelectedFilters, clearFilters, activityTypes = [] }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers([
      { _id: 'user1', name: 'John Doe', avatar: null },
      { _id: 'user2', name: 'Jane Smith', avatar: null },
      { _id: 'user3', name: 'Bob Johnson', avatar: null },
    ]);
  }, []);

  const handleTypeChange = (type) => {
    setSelectedFilters(prev => {
      const newTypes = [...prev.type];
      const typeIndex = newTypes.indexOf(type);

      if (typeIndex === -1) {
        newTypes.push(type);
      } else {
        newTypes.splice(typeIndex, 1);
      }

      return { ...prev, type: newTypes };
    });
  };

  const handleUserChange = (userId) => {
    setSelectedFilters(prev => {
      const newUsers = [...prev.users];
      const userIndex = newUsers.indexOf(userId);

      if (userIndex === -1) {
        newUsers.push(userId);
      } else {
        newUsers.splice(userIndex, 1);
      }

      return { ...prev, users: newUsers };
    });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    setSelectedFilters(prev => {
      const newDateRange = { ...prev.dateRange || {} };
      newDateRange[name] = value ? value : '';

      if (!newDateRange.createdStart && !newDateRange.createdEnd) {
        return { ...prev, dateRange: null };
      }

      return { ...prev, dateRange: newDateRange };
    });
  };

  const formatActivityType = (type) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const hasActiveFilters = Object.values(selectedFilters).some(
    filter => Array.isArray(filter) ? filter.length > 0 : !!filter
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FiFilter className="h-5 w-5 text-violet-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center"
          >
            <FiX className="mr-1" /> Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Activity Type filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Activity Type</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {activityTypes.map(type => {
              const isSelected = selectedFilters.type.includes(type);
              return (
                <label
                  key={type}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                    checked={isSelected}
                    onChange={() => handleTypeChange(type)}
                  />
                  <span className="ml-3 flex items-center text-sm text-gray-700">
                    <FiActivity className="mr-1 h-3 w-3" />
                    {formatActivityType(type)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* User filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">User</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {users.map(user => {
              const isSelected = selectedFilters.users?.includes(user._id);
              return (
                <label
                  key={user._id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                    checked={isSelected}
                    onChange={() => handleUserChange(user._id)}
                  />
                  <span className="ml-3 text-sm text-gray-700 flex items-center">
                    <FiUser className="mr-1 h-3 w-3" />
                    {user.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Date range filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Date Range</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">From</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="createdStart"
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 text-sm"
                  value={selectedFilters.dateRange?.createdStart || ''}
                  onChange={handleDateChange}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">To</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="createdEnd"
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 text-sm"
                  value={selectedFilters.dateRange?.createdEnd || ''}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFilters;