import React, { useState, useEffect } from 'react';
import { FiFolder, FiFile, FiImage, FiVideo, FiMusic, FiFileText, FiCode, FiArchive, FiRefreshCw, FiLogOut, FiArrowLeft } from 'react-icons/fi';
import DriveFolderBreadcrumb from './DriveFolderBreadcrumb';
import DriveSearch from './DriveSearch';
import driveService from '../../services/driveService';

const DriveIntegration = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "Root" }]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    hasMore: false
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Verificar se o usuário já tem acesso ao Drive
  useEffect(() => {
    // Verificar se estamos retornando de um processo de autenticação
    const justAuthenticated = localStorage.getItem("driveConnected") === "true";

    if (justAuthenticated) {
      // Se acabamos de autenticar, mostrar um feedback positivo
      localStorage.removeItem("driveConnected");
      setError(null);
      setHasAccess(true);
      loadFiles();
    } else {
      // Caso contrário, verificar status normalmente
      checkDriveAccess();
    }
  }, []);

  const checkDriveAccess = async () => {
    setLoading(true);
    try {
      const access = await driveService.checkAccess();
      setHasAccess(access);
      if (access) {
        loadFiles();
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to check Google Drive access");
      console.error(err);
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    try {
      const authUrl = await driveService.getAuthUrl();
      window.open(authUrl, "_blank");
    } catch (err) {
      setError("Failed to get authorization URL");
      console.error(err);
    }
  };

  const loadFiles = async (folderId = null, page = 1) => {
    try {
      const result = await driveService.listFiles({
        folderId,
        page,
        limit: pagination.limit
      });

      setFiles(result.files || []);
      setCurrentFolder(folderId);

      // Update pagination information
      setPagination({
        page: page,
        limit: pagination.limit,
        hasMore: result.hasMore || false,
      });

      // Update breadcrumbs navigation
      if (folderId) {
        const folder = files.find((f) => f.id === folderId);
        if (folder && !breadcrumbs.find((b) => b.id === folderId)) {
          setBreadcrumbs([...breadcrumbs, { id: folderId, name: folder.name }]);
        }
      } else {
        setBreadcrumbs([{ id: null, name: "Root" }]);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load files from Google Drive");
      console.error(err);
      setLoading(false);
    }
  };

  const handleFileClick = async (file) => {
    if (file.mimeType.includes("folder")) {
      // Se for uma pasta, navegar para ela
      setLoading(true);
      loadFiles(file.id);
    } else {
      // Se for um arquivo, obter URL de download/visualização
      try {
        const url = await driveService.getDownloadUrl(file.id);
        window.open(url, "_blank");
      } catch (err) {
        setError("Failed to get file download URL");
        console.error(err);
      }
    }
  };

  const handleRevokeAccess = async () => {
    if (window.confirm("Are you sure you want to revoke Google Drive access?")) {
      try {
        await driveService.revokeAccess();
        setHasAccess(false);
        setFiles([]);
        setBreadcrumbs([{ id: null, name: "Root" }]);
      } catch (err) {
        setError("Failed to revoke Google Drive access");
        console.error(err);
      }
    }
  };

  const navigateToBreadcrumb = (breadcrumb) => {
    setLoading(true);
    loadFiles(breadcrumb.id);
    // Atualizar breadcrumbs para remover todos os que vêm depois deste
    const index = breadcrumbs.findIndex((b) => b.id === breadcrumb.id);
    if (index !== -1) {
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasMore) {
      loadFiles(currentFolder, pagination.page + 1);
    }
  };

  const handleSearch = (query) => {
    setLoading(true);
    // Implementação da pesquisa (se necessário)
    loadFiles(currentFolder); // Recarregar arquivos atuais após a pesquisa
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  // Renderização condicional baseada no estado de acesso
  if (!hasAccess) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Connect Google Drive</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Connect your Google Drive account to access your files
          </p>

          {error && (
            <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md mb-4 text-sm">
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
              >
                Dismiss
              </button>
            </div>
          )}

          <button
            onClick={handleAuth}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              'Connect to Google Drive'
            )}
          </button>
        </div>
      </div>
    );
  }

  // State for error and loading
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-2xl mx-auto transition-all duration-300">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Error Loading Drive Files</h2>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors duration-200"
            >
              Dismiss
            </button>
            <button
              onClick={() => loadFiles(currentFolder)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 h-full">
      {/* Header with actions */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Google Drive</h2>
          <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">
            Connected
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleViewMode}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={viewMode === 'grid' ? "Switch to list view" : "Switch to grid view"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {viewMode === 'grid' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              )}
            </svg>
          </button>
          <button
            onClick={() => loadFiles(currentFolder)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <FiRefreshCw className="h-5 w-5" />
          </button>
          <button
            onClick={handleRevokeAccess}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Disconnect Google Drive"
          >
            <FiLogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search and navigation bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:max-w-md">
          <DriveSearch onSearch={handleSearch} />
        </div>
        <div className="w-full overflow-x-auto">
          <DriveFolderBreadcrumb folderPath={breadcrumbs} onFolderClick={navigateToBreadcrumb} />
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading files...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && files.length === 0 && (
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FiFolder className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No files found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              This folder is empty. Upload files to your Google Drive or navigate to another folder.
            </p>
            <button
              onClick={() => loadFiles(null)} // Go back to root
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Go to Root Folder
            </button>
          </div>
        </div>
      )}

      {/* Files and Folders Container */}
      {!loading && files.length > 0 && (
        <div className="flex-grow overflow-auto p-4">
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Folders */}
              {files.filter(file => file.mimeType?.includes("folder")).map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => handleFileClick(folder)}
                  className="group bg-white dark:bg-gray-750 shadow-sm hover:shadow-md rounded-lg p-4 cursor-pointer border border-gray-200 dark:border-gray-700 flex flex-col items-center transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400"
                >
                  {/* Folder Icon */}
                  <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FiFolder className="w-8 h-8 text-amber-400" />
                  </div>

                  {/* Folder Name */}
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white text-center line-clamp-2 w-full">{folder.name}</h3>

                  {/* Folder Modified Date */}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(folder.modifiedTime).toLocaleDateString()}
                  </p>
                </div>
              ))}

              {/* Files */}
              {files.filter(file => !file.mimeType?.includes("folder")).map((file) => {
                // Determine the icon based on mimetype
                let Icon = FiFile;
                let iconColor = "text-gray-500";
                let bgColor = "bg-gray-50 dark:bg-gray-700/50";

                if (file.mimeType?.includes('image')) {
                  Icon = FiImage;
                  iconColor = "text-blue-500";
                  bgColor = "bg-blue-50 dark:bg-blue-900/20";
                } else if (file.mimeType?.includes('video')) {
                  Icon = FiVideo;
                  iconColor = "text-red-500";
                  bgColor = "bg-red-50 dark:bg-red-900/20";
                } else if (file.mimeType?.includes('audio')) {
                  Icon = FiMusic;
                  iconColor = "text-green-500";
                  bgColor = "bg-green-50 dark:bg-green-900/20";
                } else if (file.mimeType?.includes('text') || file.mimeType?.includes('document')) {
                  Icon = FiFileText;
                  iconColor = "text-indigo-500";
                  bgColor = "bg-indigo-50 dark:bg-indigo-900/20";
                } else if (file.mimeType?.includes('application/json') || file.mimeType?.includes('javascript') || file.mimeType?.includes('html')) {
                  Icon = FiCode;
                  iconColor = "text-purple-500";
                  bgColor = "bg-purple-50 dark:bg-purple-900/20";
                } else if (file.mimeType?.includes('zip') || file.mimeType?.includes('tar') || file.mimeType?.includes('compress')) {
                  Icon = FiArchive;
                  iconColor = "text-orange-500";
                  bgColor = "bg-orange-50 dark:bg-orange-900/20";
                }

                return (
                  <div
                    key={file.id}
                    className="group bg-white dark:bg-gray-750 shadow-sm hover:shadow-md rounded-lg p-4 cursor-pointer border border-gray-200 dark:border-gray-700 flex flex-col items-center transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400"
                  >
                    {/* File Icon */}
                    <div className={`w-16 h-16 ${bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-8 h-8 ${iconColor}`} />
                    </div>

                    {/* File Name */}
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white text-center line-clamp-2 w-full">{file.name}</h3>

                    {/* File Info */}
                    <div className="mt-2 flex flex-col items-center space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {file.mimeType?.split('/').pop() || 'File'}
                        {file.size ? ` • ${(parseInt(file.size) / 1024).toFixed(1)} KB` : ''}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(file.modifiedTime).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Download button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileClick(file);
                      }}
                      className="mt-3 opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-all duration-200"
                    >
                      Open
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white dark:bg-gray-750 shadow-sm rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Modified</div>
                <div className="col-span-2">Size</div>
              </div>

              {/* List Items */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Folders first */}
                {files.filter(file => file.mimeType?.includes("folder")).map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => handleFileClick(folder)}
                    className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  >
                    <div className="col-span-6 flex items-center space-x-3 truncate">
                      <div className="flex-shrink-0 w-8 h-8 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                        <FiFolder className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="truncate font-medium text-gray-800 dark:text-gray-200">
                        {folder.name}
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      Folder
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      {new Date(folder.modifiedTime).toLocaleDateString()}
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      -
                    </div>
                  </div>
                ))}

                {/* Then files */}
                {files.filter(file => !file.mimeType?.includes("folder")).map((file) => {
                  // Determine the icon based on mimetype
                  let Icon = FiFile;
                  let iconColor = "text-gray-500";
                  let bgColor = "bg-gray-50 dark:bg-gray-700/50";
                  let fileType = file.mimeType?.split('/').pop() || 'File';
                  fileType = fileType.charAt(0).toUpperCase() + fileType.slice(1);

                  if (file.mimeType?.includes('image')) {
                    Icon = FiImage;
                    iconColor = "text-blue-500";
                    bgColor = "bg-blue-50 dark:bg-blue-900/20";
                  } else if (file.mimeType?.includes('video')) {
                    Icon = FiVideo;
                    iconColor = "text-red-500";
                    bgColor = "bg-red-50 dark:bg-red-900/20";
                  } else if (file.mimeType?.includes('audio')) {
                    Icon = FiMusic;
                    iconColor = "text-green-500";
                    bgColor = "bg-green-50 dark:bg-green-900/20";
                  } else if (file.mimeType?.includes('text') || file.mimeType?.includes('document')) {
                    Icon = FiFileText;
                    iconColor = "text-indigo-500";
                    bgColor = "bg-indigo-50 dark:bg-indigo-900/20";
                  } else if (file.mimeType?.includes('application/json') || file.mimeType?.includes('javascript') || file.mimeType?.includes('html')) {
                    Icon = FiCode;
                    iconColor = "text-purple-500";
                    bgColor = "bg-purple-50 dark:bg-purple-900/20";
                  } else if (file.mimeType?.includes('zip') || file.mimeType?.includes('tar') || file.mimeType?.includes('compress')) {
                    Icon = FiArchive;
                    iconColor = "text-orange-500";
                    bgColor = "bg-orange-50 dark:bg-orange-900/20";
                  }

                  return (
                    <div
                      key={file.id}
                      onClick={() => handleFileClick(file)}
                      className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    >
                      <div className="col-span-6 flex items-center space-x-3 truncate">
                        <div className={`flex-shrink-0 w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${iconColor}`} />
                        </div>
                        <div className="truncate font-medium text-gray-800 dark:text-gray-200">
                          {file.name}
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {fileType}
                      </div>
                      <div className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {new Date(file.modifiedTime).toLocaleDateString()}
                      </div>
                      <div className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {file.size ? `${(parseInt(file.size) / 1024).toFixed(1)} KB` : '-'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Load More Button */}
          {pagination.hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors duration-200"
              >
                <span>Load More</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriveIntegration;