import { Navigate } from 'react-router-dom'
import useRole from '../../hooks/useRole'

/**
 * Component to protect routes based on user roles
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {string|string[]} props.allowedRoles - Role(s) allowed to access
 * @param {string} props.redirectTo - Path to redirect if unauthorized
 * @param {React.ReactNode} props.fallback - Component to show if unauthorized (instead of redirect)
 */
const RoleProtected = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/dashboard',
  fallback = null 
}) => {
  const { hasRole } = useRole()

  // If no roles specified, allow access
  if (!allowedRoles) {
    return children
  }

  // Check if user has required role
  const hasAccess = hasRole(allowedRoles)

  if (!hasAccess) {
    // Show fallback component if provided
    if (fallback) {
      return fallback
    }

    // Otherwise redirect
    return <Navigate to={redirectTo} replace />
  }

  return children
}

export default RoleProtected
