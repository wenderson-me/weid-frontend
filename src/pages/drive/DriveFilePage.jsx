import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiRefreshCw, FiDownload, FiLoader } from 'react-icons/fi';
import DriveFileDetails from '../../components/drive/DriveFileDetails';
import driveService from '../../services/driveService';

const DriveFilePage = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load file details
  useEffect(() => {
    const loadFileDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if the user has access
        const hasAccess = await driveService.checkAccess();
        if (!hasAccess) {
          setError(new Error('You need to connect to Google Drive to view file details.'));
          setLoading(false);
          return;
        }

        const fileDetails = await driveService.getFileDetails(fileId);
        setFile(fileDetails);
      } catch (error) {
        console.error('Error loading file details:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadFileDetails();
  }, [fileId]);

  // Handle download
  const handleDownload = async (fileId) => {
    try {
      setIsDownloading(true);
      const downloadUrl = await driveService.getDownloadUrl(fileId);

      // Open download URL in a new tab
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error getting download URL:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    driveService.getFileDetails(fileId)
      .then(fileDetails => {
        setFile(fileDetails);
        setError(null);
      })
      .catch(error => {
        console.error('Error refreshing file details:', error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">File Details</h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {file && !file.mimeType?.includes('folder') && (
              <button
                onClick={() => handleDownload(file.id)}
                disabled={isDownloading}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
              >
                {isDownloading ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <FiDownload className="h-4 w-4" />
                    <span>Download</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* File details */}
        <DriveFileDetails
          file={file}
          onDownload={handleDownload}
          loading={loading}
          error={error ? error.message : null}
        />
      </div>

      {/* Download indicator */}
      {isDownloading && (
        <div className="fixed inset-x-0 bottom-0 bg-blue-600 text-white py-2 px-4 flex items-center justify-center">
          <FiLoader className="animate-spin mr-2" />
          <span>Preparing download...</span>
        </div>
      )}
    </div>
  );
};

export default DriveFilePage;