import React, { useState, useEffect } from "react";
import {
  FiLoader,
  FiFile,
  FiFolder,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiX,
} from "react-icons/fi";
import driveService from "../../services/driveService";

/**
 * Componente para selecionar arquivos do Google Drive
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla se o seletor está aberto
 * @param {function} props.onClose - Função para fechar o seletor
 * @param {function} props.onSelect - Função chamada quando um arquivo é selecionado
 * @param {Array<string>} props.acceptTypes - Tipos MIME aceitos (ex: ['image/jpeg', 'application/pdf'])
 * @param {boolean} props.multiSelect - Permite selecionar múltiplos arquivos
 */
const DriveFilePicker = ({
  isOpen,
  onClose,
  onSelect,
  acceptTypes = [],
  multiSelect = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderStack, setFolderStack] = useState([{ id: null, name: "Root" }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 30,
    totalItems: 0,
    hasMore: false,
  });

  // Verificar acesso e carregar arquivos quando o componente é aberto
  useEffect(() => {
    if (isOpen) {
      checkAccessAndLoadFiles();
    }
  }, [isOpen]);

  const checkAccessAndLoadFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const access = await driveService.checkAccess();
      setHasAccess(access);

      if (access) {
        await loadFiles();
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
      // Armazenar estado para retornar a este componente após autenticação
      localStorage.setItem("driveReturnState", "filePicker");
      window.location.href = authUrl;
    } catch (err) {
      setError("Failed to get authorization URL");
      console.error(err);
    }
  };

  const loadFiles = async (folderId = null, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Indica se devemos resetar a paginação (nova pasta ou pesquisa)
      const reset = folderId !== currentFolder || page === 1;

      const result = await driveService.listFiles({
        folderId,
        search: searchTerm || undefined,
        page,
        limit: pagination.limit,
        reset
      });

      // Determine se devemos adicionar à lista atual ou substituir
      let filesList = [];
      if (page > 1 && folderId === currentFolder) {
        // Adicionar aos arquivos existentes para paginação
        filesList = [...files, ...(result.files || [])];
      } else {
        // Nova pasta ou primeira página, substituir conteúdo
        filesList = result.files || [];
      }

      // Filtrar por tipos aceitos, se especificados
      if (acceptTypes.length > 0) {
        filesList = filesList.filter(
          (file) =>
            file.mimeType.includes("folder") ||
            acceptTypes.some((type) => file.mimeType.includes(type))
        );
      }

      setFiles(filesList);
      setCurrentFolder(folderId);

      // Atualizar informações de paginação
      setPagination({
        page,
        limit: pagination.limit,
        hasMore: result.hasMore
      });

      // Atualizar pilha de navegação
      if (folderId !== currentFolder) {
        if (folderId === null) {
          // Voltamos à raiz
          setFolderStack([{ id: null, name: "Root" }]);
        } else if (currentFolder === null || true) {
          // Buscar o nome da pasta atual
          let folderName = "Folder";

          // Tente encontrar o nome da pasta na lista atual
          const folder = files.find((f) => f.id === folderId);
          if (folder) {
            folderName = folder.name;
          }

          // Se a pasta atual não estava nos arquivos carregados
          // e não é a primeira pasta depois da raiz, buscar detalhes
          if (!folder && folderStack.length > 1) {
            try {
              const folderDetails = await driveService.getFileDetails(folderId);
              if (folderDetails && folderDetails.name) {
                folderName = folderDetails.name;
              }
            } catch (folderErr) {
              console.error("Couldn't fetch folder details", folderErr);
            }
          }

          // Adicione a pasta à pilha
          setFolderStack([...folderStack, { id: folderId, name: folderName }]);
        }
      }
    } catch (err) {
      setError("Failed to load files from Google Drive");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handler para carregar mais arquivos
  const handleLoadMore = () => {
    if (loading || !pagination.hasMore) return;
    const nextPage = pagination.page + 1;
    loadFiles(currentFolder, nextPage);
  };

  const handleFolderClick = (folderId) => {
    loadFiles(folderId);
  };

  const handleFileSelect = (file) => {
    if (file.mimeType.includes("folder")) {
      handleFolderClick(file.id);
      return;
    }

    if (multiSelect) {
      // Adicionar ou remover da seleção
      const isSelected = selectedFiles.some((f) => f.id === file.id);

      if (isSelected) {
        setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
      } else {
        setSelectedFiles([...selectedFiles, file]);
      }
    } else {
      // Seleção única - retorna imediatamente
      onSelect([file]);
      onClose();
    }
  };

  const handleGoBack = () => {
    if (folderStack.length > 1) {
      const newStack = [...folderStack];
      newStack.pop(); // Remove a pasta atual
      const previousFolder = newStack[newStack.length - 1];

      setFolderStack(newStack);
      loadFiles(previousFolder.id);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadFiles(currentFolder);
  };

  const handleConfirmSelection = () => {
    if (selectedFiles.length > 0) {
      onSelect(selectedFiles);
      onClose();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    loadFiles(currentFolder);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Select from Google Drive</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <FiLoader className="animate-spin text-4xl text-blue-500 mb-4" />
            <p>Loading files from Google Drive...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={checkAccessAndLoadFiles}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : !hasAccess ? (
          <div className="p-12 text-center">
            <p className="mb-6">
              You need to connect to Google Drive to select files.
            </p>
            <button
              onClick={handleAuth}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Connect to Google Drive
            </button>
          </div>
        ) : (
          <>
            {/* Barra de navegação e pesquisa */}
            <div className="p-3 border-b flex flex-wrap gap-2 items-center">
              <button
                onClick={handleGoBack}
                disabled={folderStack.length <= 1}
                className={`p-2 rounded ${folderStack.length <= 1 ? "text-gray-400" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <FiChevronLeft />
              </button>

              <div className="flex items-center text-sm text-gray-600 overflow-x-auto whitespace-nowrap px-2 flex-grow">
                {folderStack.map((folder, index) => (
                  <React.Fragment key={folder.id || "root"}>
                    {index > 0 && (
                      <FiChevronRight className="mx-1 text-gray-400" />
                    )}
                    <span>{folder.name}</span>
                  </React.Fragment>
                ))}
              </div>

              <form
                onSubmit={handleSearch}
                className="relative flex-grow max-w-md"
              >
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md pr-10"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiSearch />
                </button>
              </form>
            </div>

            {/* Lista de arquivos */}
            <div className="overflow-y-auto flex-grow">
              {files.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No files found in this location
                </div>
              ) : (
                <div>
                  {/* Folders Section */}
                  {files.some((file) => file.mimeType.includes("folder")) && (
                    <div className="mb-2">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                        <h3 className="text-xs font-medium text-gray-700">
                          Folders
                        </h3>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {files
                          .filter((file) => file.mimeType.includes("folder"))
                          .map((folder) => {
                            return (
                              <div
                                key={folder.id}
                                onClick={() => handleFileSelect(folder)}
                                className="p-3 flex items-center hover:bg-gray-50 cursor-pointer"
                              >
                                {/* Ícone */}
                                <div className="mr-3">
                                  <FiFolder className="text-amber-500 h-5 w-5" />
                                </div>

                                {/* Informações da pasta */}
                                <div className="flex-grow">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {folder.name}
                                  </div>
                                </div>

                                <FiChevronRight className="text-gray-400" />
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Files Section */}
                  {files.some((file) => !file.mimeType.includes("folder")) && (
                    <div>
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                        <h3 className="text-xs font-medium text-gray-700">
                          Files
                        </h3>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {files
                          .filter((file) => !file.mimeType.includes("folder"))
                          .map((file) => {
                            const isSelected =
                              multiSelect &&
                              selectedFiles.some((f) => f.id === file.id);

                            return (
                              <div
                                key={file.id}
                                onClick={() => handleFileSelect(file)}
                                className={`p-3 flex items-center hover:bg-gray-50 cursor-pointer ${isSelected ? "bg-blue-50" : ""}`}
                              >
                                {/* Checkbox para seleção múltipla */}
                                {multiSelect && (
                                  <div className="mr-3">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {}} // Controlado pelo onClick do parent
                                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                    />
                                  </div>
                                )}

                                {/* Ícone */}
                                <div className="mr-3">
                                  <FiFile className="text-blue-500 h-5 w-5" />
                                </div>

                                {/* Informações do arquivo */}
                                <div className="flex-grow">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {file.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {file.mimeType?.split("/").pop() ||
                                      "unknown"}
                                    {file.size &&
                                      ` • ${(parseInt(file.size) / 1024).toFixed(1)} KB`}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Show appropriate message if one section is empty */}
                  {!files.some((file) => file.mimeType.includes("folder")) && (
                    <div className="text-center py-3 border-b border-gray-200 bg-gray-50">
                      <p className="text-gray-500 text-xs">
                        No folders in this location
                      </p>
                    </div>
                  )}

                  {!files.some((file) => !file.mimeType.includes("folder")) && (
                    <div className="text-center py-3">
                      <p className="text-gray-500 text-xs">
                        No files in this location
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Barra de ações */}
            {multiSelect && (
              <div className="p-3 border-t flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} selected`
                    : "No files selected"}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSelection}
                    disabled={selectedFiles.length === 0}
                    className={`px-4 py-2 rounded ${
                      selectedFiles.length === 0
                        ? "bg-blue-300 cursor-not-allowed text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    Select
                  </button>
                </div>
              </div>
            )}
            {pagination.hasMore && (
              <div className="text-center p-3 border-t">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="w-full py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
                >
                  {loading ? "Loading..." : "Load More Files"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DriveFilePicker;
