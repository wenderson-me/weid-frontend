// src/services/driveService.js
import apiClient from '../config/axios';

class DriveService {
  /**
   * Inicia o processo de autorização com o Google Drive
   * @returns {Promise<string>} URL de autorização para redirecionamento
   */
  async getAuthUrl() {
    const response = await apiClient.get('/drive/auth');
    return response.data.data.authUrl;
  }

  /**
   * Verifica se o usuário tem acesso ao Google Drive
   * @returns {Promise<boolean>} Status de acesso
   */
  async checkAccess() {
    try {
      // Verificar se temos status armazenado localmente primeiro (do callback recente)
      const localStatus = localStorage.getItem('driveConnected');

      // Se temos status local, use-o para evitar chamada de API desnecessária
      if (localStatus === 'true') {
        // Para garantir que estamos sempre verificando com o backend,
        // removemos após usar para próximas chamadas consultarem o servidor
        localStorage.removeItem('driveConnected');
        return true;
      }

      // Se não temos status local, consulte a API
      const response = await apiClient.get('/drive/status');
      return response.data.data.connected;
    } catch (error) {
      console.error('Failed to check Drive access:', error);
      return false;
    }
  }

  /**
   * Lista arquivos do Google Drive do usuário
   * @param {Object} options - Opções de filtro e paginação
   * @returns {Promise<Object>} Lista de arquivos e metadata
   */
  async listFiles(options = {}) {
    const params = {
      page: options.page || 1,
      limit: options.limit || 20,
      folderId: options.folderId,
      search: options.search,
      mimeType: options.mimeType
    };

    const response = await apiClient.get('/drive/files', { params });

    // Padronizar a resposta para incluir meta informações de paginação
    const result = response.data.data;
    return {
      files: result.files || result, // Aceita ambos formatos de resposta
      totalItems: result.totalItems || result.length || 0,
      hasMore: result.hasMore || result.nexatPageToken || false
    };
  }

  /**
   * Obtém detalhes de um arquivo específico
   * @param {string} fileId - ID do arquivo no Google Drive
   * @returns {Promise<Object>} Detalhes do arquivo
   */
  async getFileDetails(fileId) {
    const response = await apiClient.get(`/drive/files/${fileId}`);
    return response.data.data;
  }

  /**
   * Obtém URL para download de um arquivo
   * @param {string} fileId - ID do arquivo no Google Drive
   * @returns {Promise<string>} URL para download
   */
  async getDownloadUrl(fileId) {
    const response = await apiClient.get(`/drive/files/${fileId}/download`);
    return response.data.data.downloadUrl;
  }

  /**
   * Revoga o acesso ao Google Drive
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async revokeAccess() {
    const response = await apiClient.post('/drive/revoke');
    return response.data.success;
  }
}

export default new DriveService();