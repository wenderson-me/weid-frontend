import React from 'react';
import { FiChevronRight, FiFolder, FiHome } from 'react-icons/fi';

const DriveFolderBreadcrumb = ({ folderPath = [], onFolderClick }) => {
  return (
    <div className="flex items-center space-x-1 overflow-x-auto py-1 w-full scrollbar-hide">
      {folderPath.map((folder, index) => {
        const isLast = index === folderPath.length - 1;

        // First item (root)
        if (index === 0) {
          return (
            <React.Fragment key={folder.id || 'root'}>
              <button
                onClick={() => onFolderClick(null)}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm ${
                  isLast
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } transition-colors`}
              >
                <FiHome className="flex-shrink-0" />
                <span className="truncate max-w-xs">Root</span>
              </button>
              {!isLast && (
                <FiChevronRight className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
              )}
            </React.Fragment>
          );
        }

        // Other items
        return (
          <React.Fragment key={folder.id || `folder-${index}`}>
            <button
              onClick={() => onFolderClick(folder.id)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm ${
                isLast
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } transition-colors whitespace-nowrap`}
            >
              <FiFolder className="flex-shrink-0" />
              <span className="truncate max-w-xs">{folder.name}</span>
            </button>
            {!isLast && (
              <FiChevronRight className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default DriveFolderBreadcrumb;