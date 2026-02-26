import { useState, useEffect } from 'react'
import { FiUsers, FiUserPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight, FiShield } from 'react-icons/fi'
import UserModal from '../../../components/admin/UserModal'
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal'
import userService from '../../../services/userService'
import { useAuth } from '../../../hooks/useAuth'

const UsersManagement = () => {
  const { currentUser } = useAuth()
  
  // Estado de usuários e filtros
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Modal e formulário
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Mensagens
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    userId: null,
    userName: null
  })

  // Buscar usuários
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getUsers()
      setUsers(Array.isArray(data) ? data : data.users || [])
      setError('')
    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
      setError('Erro ao carregar usuários. Tente novamente.')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? user.isActive : !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Abrir modal de criação
  const openCreateModal = () => {
    setSelectedUser(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  // Abrir modal de edição
  const openEditModal = (user) => {
    setSelectedUser(user)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  // Abrir confirmação de exclusão
  const openDeleteConfirm = (user) => {
    setDeleteConfirm({
      isOpen: true,
      userId: user.id,
      userName: user.name
    })
  }

  // Enviar formulário
  const handleModalSubmit = async (formData) => {
    setIsSaving(true)
    try {
      if (modalMode === 'create') {
        await userService.createUser(formData)
        setSuccess('Usuário criado com sucesso!')
      } else {
        await userService.updateUser(selectedUser.id, formData)
        setSuccess('Usuário atualizado com sucesso!')
      }
      setIsModalOpen(false)
      setSelectedUser(null)
      await fetchUsers()
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao salvar usuário'
      setError(errorMsg)
      console.error('Erro ao salvar usuário:', err)
    } finally {
      setIsSaving(false)
    }
  }

  // Deletar usuário
  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await userService.deleteUser(deleteConfirm.userId)
      setSuccess('Usuário deletado com sucesso!')
      setDeleteConfirm({ isOpen: false, userId: null, userName: null })
      await fetchUsers()
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao deletar usuário'
      setError(errorMsg)
      console.error('Erro ao deletar:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  // Ativar/Desativar usuário
  const toggleUserStatus = async (user) => {
    try {
      if (user.isActive) {
        await userService.deactivateUser(user.id)
        setSuccess('Usuário desativado com sucesso!')
      } else {
        await userService.activateUser(user.id)
        setSuccess('Usuário ativado com sucesso!')
      }
      await fetchUsers()
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao alterar status'
      setError(errorMsg)
      console.error('Erro ao alterar status:', err)
    }
  }

  // Verificar permissões
  const isAdmin = () => currentUser?.role === 'admin'
  const isManager = () => currentUser?.role === 'manager'
  const canManageUsers = () => isAdmin() || isManager()
  
  // Verificar se pode gerenciar um usuário específico
  const canManageUser = (user) => {
    // Admins podem gerenciar qualquer usuário
    if (isAdmin()) return true
    // Managers só podem gerenciar usuários não-admin
    if (isManager()) return user.role !== 'admin'
    return false
  }

  // Cores de badge
  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'rgb(239, 68, 68)',
      manager: 'rgb(59, 130, 246)',
      user: 'rgb(34, 197, 94)'
    }
    return colors[role] || 'rgb(107, 114, 128)'
  }

  const getStatusBadgeColor = (status) => {
    return status === 'active' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Access Badge */}
      <div
        className="mb-6 p-4 rounded-lg border flex items-center gap-3"
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderColor: 'rgba(59, 130, 246, 0.2)'
        }}
      >
        <FiShield
          className="w-5 h-5 flex-shrink-0"
          style={{ color: 'rgb(59, 130, 246)' }}
        />
        <div className="flex-1">
          <p
            className="text-sm font-semibold"
            style={{ color: 'rgb(59, 130, 246)' }}
          >
            Gerenciamento de Usuários
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Você está visualizando como <strong>{currentUser?.role === 'admin' ? 'Administrador' : 'Gerenciador'}</strong>
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div
          className="mb-6 p-4 rounded-lg flex items-center justify-between"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.2)',
            borderWidth: '1px'
          }}
        >
          <p style={{ color: 'rgb(220, 38, 38)' }}>{error}</p>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div
          className="mb-6 p-4 rounded-lg flex items-center justify-between"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.2)',
            borderWidth: '1px'
          }}
        >
          <p style={{ color: 'rgb(22, 163, 74)' }}>{success}</p>
          <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <FiUsers className="w-8 h-8" />
            Gerenciamento de Usuários
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white font-medium"
          style={{ backgroundColor: 'var(--primary-color)' }}
          disabled={loading || !canManageUsers()}
        >
          <FiUserPlus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      {/* Search and Filters */}
      <div
        className="rounded-lg p-6 mb-6"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--primary-color)'
              }}
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors w-fit"
            style={{
              borderColor: 'var(--border-color)',
              color: showFilters ? 'var(--primary-color)' : 'var(--text-secondary)',
              backgroundColor: showFilters ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
            }}
          >
            <FiFilter className="w-5 h-5" />
            Filtros {showFilters && <FiX className="w-4 h-4 ml-1" />}
          </button>

          {showFilters && (
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Papel
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="all">Todos os Papéis</option>
                    <option value="admin">Administrador</option>
                    <option value="manager">Gerenciador</option>
                    <option value="user">Usuário</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="all">Todos os Status</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div
        className="rounded-lg overflow-hidden border"
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
      >
        {loading ? (
          <div className="p-12 text-center">
            <div
              className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"
              style={{ borderTopColor: 'var(--primary-color)' }}
            />
            <p style={{ color: 'var(--text-secondary)' }}>Carregando usuários...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <FiUsers
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Nenhum usuário encontrado
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {searchQuery ? 'Tente ajustar sua busca' : 'Crie seu primeiro usuário'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderBottomColor: 'var(--border-color)',
                      borderBottomWidth: '1px'
                    }}
                  >
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Papel
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(paginatedUsers) && paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottomColor: 'var(--border-color)',
                        borderBottomWidth: '1px',
                        backgroundColor: user.id === currentUser?.id ? 'rgba(59, 130, 246, 0.02)' : 'transparent'
                      }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {user.name}
                          </p>
                          {user.id === currentUser?.id && (
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              (Você)
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {user.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getRoleBadgeColor(user.role) }}
                        >
                          {user.role === 'admin' ? 'Administrador' : user.role === 'manager' ? 'Gerenciador' : 'Usuário'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {user.isActive ? (
                            <FiCheckCircle style={{ color: 'rgb(34, 197, 94)' }} className="w-4 h-4" />
                          ) : (
                            <FiXCircle style={{ color: 'rgb(239, 68, 68)' }} className="w-4 h-4" />
                          )}
                          <span
                            className="text-sm"
                            style={{ color: getStatusBadgeColor(user.isActive ? 'active' : 'inactive') }}
                          >
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {canManageUser(user) && (
                            <>
                              <button
                                onClick={() => openEditModal(user)}
                                className="p-2 rounded-lg transition-colors"
                                style={{
                                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                  color: 'rgb(59, 130, 246)'
                                }}
                                title="Editar usuário"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleUserStatus(user)}
                                className="p-2 rounded-lg transition-colors"
                                style={{
                                  backgroundColor: user.isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                  color: user.isActive ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)'
                                }}
                                title={user.isActive ? 'Desativar usuário' : 'Ativar usuário'}
                              >
                                {user.isActive ? <FiXCircle className="w-4 h-4" /> : <FiCheckCircle className="w-4 h-4" />}
                              </button>
                              {user.id !== currentUser?.id && (
                                <button
                                  onClick={() => openDeleteConfirm(user)}
                                  className="p-2 rounded-lg transition-colors"
                                  style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    color: 'rgb(239, 68, 68)'
                                  }}
                                  title="Deletar usuário"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="px-6 py-4 flex items-center justify-between border-t"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Página {currentPage} de {totalPages} • {filteredUsers.length} usuários no total
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border transition-colors disabled:opacity-50"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border transition-colors disabled:opacity-50"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(null)
        }}
        onSubmit={handleModalSubmit}
        initialUser={selectedUser}
        isLoading={isSaving}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, userId: null, userName: null })}
        onConfirm={handleDeleteConfirm}
        title="Deletar Usuário"
        message="Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita."
        itemName={deleteConfirm.userName}
        itemType="usuário"
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default UsersManagement
