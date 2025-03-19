import React, { useState } from 'react';
import { FiFile, FiFileText, FiFolder, FiDownload, FiImage, FiVideo, FiMusic, FiCode, FiArchive } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Map MIME types to icons
const getFileIcon = (mimeType) => {
  if (!mimeType) return <FiFile className="text-gray-400" />;

  if (mimeType.includes('folder')) return <FiFolder className="text-amber-400" />;
  if (mimeType.includes('image')) return <FiImage className="text-blue-400" />;
  if (mimeType.includes('video')) return <FiVideo className="text-red-400" />;
  if (mimeType.includes('audio')) return <FiMusic className="text-green-400" />;
  if (mimeType.includes('text') || mimeType.includes('document')) return <FiFileText className="text-indigo-400" />;
  if (mimeType.includes('application/json') || mimeType.includes('javascript') || mimeType.includes('html')) return <FiCode className="text-violet-400" />;
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('compress')) return <FiArchive className="text-orange-400" />;

  return <FiFile className="text-gray-400" />;
};

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '—';

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '—';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const DriveFileList = ({ files, onFileClick, onDownload, loading, error }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort files
  const sortedFiles = [...files].sort((a, b) => {
    // Folders always come first
    if (a.mimeType.includes('folder') && !b.mimeType.includes('folder')) {
      return -1;
    }
    if (!a.mimeType.includes('folder') && b.mimeType.includes('folder')) {
      return 1;
    }

    // Then sort by the selected key
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    if (sortConfig.key === 'modifiedTime') {
      return sortConfig.direction === 'asc'
        ? new Date(a.modifiedTime) - new Date(b.modifiedTime)
        : new Date(b.modifiedTime) - new Date(a.modifiedTime);
    }

    if (sortConfig.key === 'size') {
      // Handle undefined sizes
      const sizeA = a.size ? Number(a.size) : 0;
      const sizeB = b.size ? Number(b.size) : 0;

      return sortConfig.direction === 'asc'
        ? sizeA - sizeB
        : sizeB - sizeA;
    }

    return 0;
  });

  // Loading state
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="h-14 bg-gray-100 dark:bg-gray-800 rounded mb-2 flex items-center p-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading files</h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error.message || "Something went wrong. Please try again."}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-md bg-red-50 dark:bg-red-900 px-3 py-2 text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No files</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No files found in your Google Drive.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                <span>Name</span>
                {sortConfig.key === 'name' && (
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {sortConfig.direction === 'asc' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    )}
                  </svg>
                )}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('modifiedTime')}
            >
              <div className="flex items-center">
                <span>Modified</span>
                {sortConfig.key === 'modifiedTime' && (
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {sortConfig.direction === 'asc' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    )}
                  </svg>
                )}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('size')}
            >
              <div className="flex items-center">
                <span>Size</span>
                {sortConfig.key === 'size' && (
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {sortConfig.direction === 'asc' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    )}
                  </svg>
                )}
              </div>
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedFiles.map((file) => (
            <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                    {getFileIcon(file.mimeType)}
                  </div>
                  <div className="ml-4">
                    <div
                      className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                      onClick={() => onFileClick(file)}
                    >
                      {file.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {file.mimeType.split('/').pop()}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDate(file.modifiedTime)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {!file.mimeType.includes('folder') && (
                  <button
                    onClick={() => onDownload(file.id)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                  >
                    <FiDownload className="h-5 w-5" />
                    <span className="sr-only">Download</span>
                  </button>
                )}
                <Link
                  to={`/drive/file/${file.id}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                >
                  <span>Details</span>
                  <span className="sr-only">, {file.name}</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriveFileList;