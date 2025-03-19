import React, { useState, useEffect } from "react";
import {
  FiCloud,
  FiFile,
  FiFolder,
  FiDownload,
  FiExternalLink,
  FiX,
  FiRefreshCw,
  FiChevronRight,
} from "react-icons/fi";
import driveService from "../../services/driveService";

const DriveIntegration = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "Root" }]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalItems: 0,
    hasMore: false,
  });

  // Verificar se o usuário já tem acesso ao Drive
  useEffect(() => {
    // Verificar se estamos retornando de um processo de autenticação
    const justAuthenticated = localStorage.getItem("driveConnected") === "true";

    if (justAuthenticated) {
      // Se acabamos de autenticar, mostrar um feedback positivo
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
      }
    } catch (err) {
      setError("Failed to check Google Drive access");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    try {
      const authUrl = await driveService.getAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError("Failed to get authorization URL");
      console.error(err);
    }
  };

  const loadFiles = async (folderId = null, page = 1) => {
    setLoading(true);
    try {
      const result = await driveService.listFiles({
        folderId,
        page,
        limit: pagination.limit,
      });

      setFiles(result.files || []);
      setCurrentFolder(folderId);

      setPagination({
        page,
        limit: pagination.limit,
        totalItems: result.totalItems || result.files?.length || 0,
        hasMore:
          result.hasMore || (result.files?.length || 0) >= pagination.limit,
      });

      if (folderId) {
        const folder = files.find((f) => f.id === folderId);
        if (folder && !breadcrumbs.find((b) => b.id === folderId)) {
          setBreadcrumbs([...breadcrumbs, { id: folderId, name: folder.name }]);
        }
      } else {
        setBreadcrumbs([{ id: null, name: "Root" }]);
      }
    } catch (err) {
      setError("Failed to load files from Google Drive");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = async (file) => {
    if (file.mimeType.includes("folder")) {
      // Se for uma pasta, navegar para ela
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
    if (
      window.confirm("Are you sure you want to revoke Google Drive access?")
    ) {
      try {
        await driveService.revokeAccess();
        setHasAccess(false);
        setFiles([]);
      } catch (err) {
        setError("Failed to revoke Google Drive access");
        console.error(err);
      }
    }
  };

  const navigateToBreadcrumb = (breadcrumb) => {
    loadFiles(breadcrumb.id);
    // Atualizar breadcrumbs para remover todos os que vêm depois deste
    const index = breadcrumbs.findIndex((b) => b.id === breadcrumb.id);
    if (index >= 0) {
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    }
  };

  const handleLoadMore = () => {
    if (loading || !pagination.hasMore) return;
    loadFiles(currentFolder, pagination.page + 1);
  };

  // Renderização condicional baseada no estado de acesso
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
        <p className="mt-4 text-gray-600">Loading Google Drive...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        <p>{error}</p>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => setError(null)}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
          <button
            onClick={checkDriveAccess}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FiRefreshCw className="mr-1" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
        <FiCloud className="text-gray-400 text-6xl mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Connect to Google Drive
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Connect your Google Drive account to access and manage your files
          directly from this application.
        </p>
        <button
          onClick={handleAuth}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png"
            alt="Google Drive"
            className="h-5 w-5 mr-2"
          />
          Connect Google Drive
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Google Drive Files
        </h2>
        <div className="flex">
          <button
            onClick={() => loadFiles(currentFolder)}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 mr-4"
            title="Refresh files"
          >
            <FiRefreshCw className="mr-1" /> Refresh
          </button>
          <button
            onClick={handleRevokeAccess}
            className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800"
            title="Disconnect from Google Drive"
          >
            <FiX className="mr-1" /> Disconnect
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center mb-4 text-sm overflow-x-auto whitespace-nowrap pb-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.id || "root"}>
            {index > 0 && <span className="mx-2 text-gray-400">/</span>}
            <button
              className={`hover:text-violet-600 ${breadcrumb.id === currentFolder ? "font-semibold text-violet-600" : "text-gray-600"}`}
              onClick={() => navigateToBreadcrumb(breadcrumb)}
            >
              {breadcrumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Files and Folders Container */}
      <div className="border border-gray-200 rounded-lg">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FiFolder className="text-gray-400 text-4xl mb-2" />
            <p className="text-gray-500">No files found in this location</p>
          </div>
        ) : (
          <div>
            {/* Folders Section */}
            {files.some((file) => file.mimeType?.includes("folder")) && (
              <div className="mb-4">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Folders</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {files
                    .filter((file) => file.mimeType?.includes("folder"))
                    .map((folder) => (
                      <div
                        key={folder.id}
                        className="flex items-center py-3 px-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleFileClick(folder)}
                      >
                        <FiFolder className="text-amber-500 mr-3 flex-shrink-0" />
                        <div className="flex-grow min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {folder.name}
                          </div>
                        </div>
                        <FiChevronRight className="text-gray-400" />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Files Section */}
            {files.some((file) => !file.mimeType?.includes("folder")) && (
              <div>
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Files</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {files
                    .filter((file) => !file.mimeType?.includes("folder"))
                    .map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center py-3 px-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleFileClick(file)}
                      >
                        <FiFile className="text-blue-500 mr-3 flex-shrink-0" />
                        <div className="flex-grow min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {file.size
                              ? `${(parseInt(file.size) / 1024).toFixed(1)} KB`
                              : ""}
                            {file.modifiedTime &&
                              ` • ${new Date(file.modifiedTime).toLocaleDateString()}`}
                          </div>
                        </div>
                        <div className="flex">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(file.webViewLink, "_blank");
                            }}
                            className="text-gray-500 hover:text-gray-700 p-1"
                            title="View in Google Drive"
                          >
                            <FiExternalLink />
                          </button>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const url = await driveService.getDownloadUrl(
                                  file.id
                                );
                                window.open(url, "_blank");
                              } catch (err) {
                                setError("Failed to download file");
                              }
                            }}
                            className="text-gray-500 hover:text-gray-700 p-1 ml-1"
                            title="Download"
                          >
                            <FiDownload />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Show appropriate message if one section is empty */}
            {!files.some((file) => file.mimeType?.includes("folder")) && (
              <div className="text-center py-6 border-b border-gray-200 bg-gray-50">
                <p className="text-gray-500 text-sm">
                  No folders in this location
                </p>
              </div>
            )}

            {!files.some((file) => !file.mimeType?.includes("folder")) && (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">
                  No files in this location
                </p>
              </div>
            )}
            {pagination.hasMore && (
              <div className="text-center p-4 border-t">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriveIntegration;
