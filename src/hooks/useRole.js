import { useAuth } from './useAuth'

/**
 * User roles enum
 */
export const UserRole = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
}

/**
 * Hook to manage user roles and permissions
 */
export const useRole = () => {
  const { currentUser } = useAuth()

  /**
   * Get current user role
   */
  const role = currentUser?.role || UserRole.USER

  /**
   * Check if user is admin
   */
  const isAdmin = role === UserRole.ADMIN

  /**
   * Check if user is manager
   */
  const isManager = role === UserRole.MANAGER

  /**
   * Check if user is regular user
   */
  const isUser = role === UserRole.USER

  /**
   * Check if user has specific role
   */
  const hasRole = (requiredRole) => {
    if (!requiredRole) return true
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role)
    }
    return role === requiredRole
  }

  /**
   * Check if user has admin or manager privileges
   */
  const isPrivileged = isAdmin || isManager

  /**
   * Check if user can access admin features
   */
  const canAccessAdmin = isAdmin

  /**
   * Check if user can manage users
   */
  const canManageUsers = isAdmin || isManager

  /**
   * Check if user can manage tasks
   */
  const canManageTasks = isAdmin || isManager

  /**
   * Check if user can view reports
   */
  const canViewReports = isAdmin || isManager

  /**
   * Get role display name
   */
  const getRoleDisplayName = (userRole = role) => {
    switch (userRole) {
      case UserRole.ADMIN:
        return 'Administrator'
      case UserRole.MANAGER:
        return 'Manager'
      case UserRole.USER:
        return 'User'
      default:
        return 'Unknown'
    }
  }

  /**
   * Get role badge color
   */
  const getRoleBadgeColor = (userRole = role) => {
    switch (userRole) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800'
      case UserRole.MANAGER:
        return 'bg-blue-100 text-blue-800'
      case UserRole.USER:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return {
    role,
    isAdmin,
    isManager,
    isUser,
    isPrivileged,
    hasRole,
    canAccessAdmin,
    canManageUsers,
    canManageTasks,
    canViewReports,
    getRoleDisplayName,
    getRoleBadgeColor,
  }
}

export default useRole
