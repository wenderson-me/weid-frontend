import React from 'react';
import { FiFolder, FiImage, FiVideo, FiMusic, FiFileText, FiCode, FiArchive, FiFile, FiDownload, FiCalendar, FiClock, FiHash, FiAlertCircle } from 'react-icons/fi';

// Map MIME types to icons (same as in FileList for consistency)
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
  if (bytes === 0 || bytes === undefined || bytes === null) return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const DriveFileDetails = ({ file, onDownload, loading, error }) => {
  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-1/3"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-100 dark:bg-gray-600 rounded-full"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading File</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If there's no file data
  if (!file || Object.keys(file).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <FiFile className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No File Selected</h3>
          <p className="text-gray-500 dark:text-gray-400">Please select a file to view its details.</p>
        </div>
      </div>
    );
  }

  // Determine if the file is an image that can be previewed
  const isPreviewableImage = file.mimeType?.includes('image/') &&
                             !file.mimeType?.includes('image/tiff') &&
                             !file.mimeType?.includes('image/x-');

  // Function to render preview
  const renderPreview = () => {
    // Image preview
    if (isPreviewableImage) {
      return (
        <div className="flex justify-center mb-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-2 transition-all">
          <img
            src={file.thumbnailLink || file.webViewLink}
            alt={file.name}
            className="max-h-52 object-contain rounded"
            onError={(e) => {
              e.target.src = ''; // Clear source
              e.target.alt = 'Preview unavailable';
              e.target.classList.add('p-4', 'bg-gray-50', 'dark:bg-gray-900');
            }}
          />
        </div>
      );
    }

    // For other file types, show an icon
    return (
      <div className="flex justify-center mb-6">
        <div className="w-28 h-28 rounded-lg flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          {React.cloneElement(getFileIcon(file.mimeType), { className: "h-16 w-16" })}
          <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">
            {file.mimeType?.split('/').pop() || 'Unknown file type'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
      {/* File header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              {getFileIcon(file.mimeType)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{file.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {file.mimeType?.split('/').pop() || 'File'}
            </p>
          </div>
        </div>
      </div>

      {/* File preview */}
      <div className="p-6">
        {renderPreview()}

        {/* File details in a clean list */}
        <div className="space-y-4">
          <div className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <div className="w-8 flex-shrink-0">
              <FiHash className="text-gray-400" />
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 w-32">ID</div>
            <div className="text-gray-900 dark:text-gray-100 text-sm truncate">{file.id}</div>
          </div>

          <div className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <div className="w-8 flex-shrink-0">
              <FiFileText className="text-gray-400" />
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 w-32">Type</div>
            <div className="text-gray-900 dark:text-gray-100">
              {file.mimeType?.split('/').pop() || 'Unknown'}
            </div>
          </div>

          <div className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <div className="w-8 flex-shrink-0">
              <FiHash className="text-gray-400" />
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 w-32">Size</div>
            <div className="text-gray-900 dark:text-gray-100">{formatFileSize(file.size)}</div>
          </div>

          <div className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <div className="w-8 flex-shrink-0">
              <FiCalendar className="text-gray-400" />
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 w-32">Created</div>
            <div className="text-gray-900 dark:text-gray-100">{formatDate(file.createdTime)}</div>
          </div>

          <div className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <div className="w-8 flex-shrink-0">
              <FiClock className="text-gray-400" />
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 w-32">Modified</div>
            <div className="text-gray-900 dark:text-gray-100">{formatDate(file.modifiedTime)}</div>
          </div>
        </div>

        {/* Download button */}
        {!file.mimeType?.includes('folder') && (
          <div className="mt-6">
            <button
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm"
              onClick={() => onDownload(file.id)}
            >
              <FiDownload className="h-5 w-5" />
              <span>Download File</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriveFileDetails;