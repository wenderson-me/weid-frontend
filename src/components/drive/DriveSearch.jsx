import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const DriveSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    onSearch(query);

    // Reset searching state after a short delay to show loading indicator
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className={`h-5 w-5 ${isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files and folders..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-10 flex items-center px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}

        <button
          type="submit"
          className={`absolute inset-y-0 right-0 flex items-center px-3 rounded-r-lg ${
            query ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-500 bg-gray-100 dark:bg-gray-600 dark:text-gray-300'
          } transition-colors`}
        >
          <span className="text-sm font-medium">Search</span>
        </button>
      </div>
    </form>
  );
};

export default DriveSearch;