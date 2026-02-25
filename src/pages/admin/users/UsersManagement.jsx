import { FiUsers, FiUserPlus, FiSearch, FiFilter } from 'react-icons/fi'
import RoleProtected from '../../../components/common/RoleProtected'
import { UserRole } from '../../../hooks/useRole'

const UsersManagement = () => {
  return (
    <RoleProtected allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <FiUsers className="w-8 h-8" />
              Users Management
            </h1>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
              Manage user accounts, roles, and permissions
            </p>
          </div>
          
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: 'var(--primary-color)',
              color: 'white'
            }}
          >
            <FiUserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* Search and Filters */}
        <div 
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: 'var(--text-tertiary)' }}
              />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border transition-colors"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Filter */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
              style={{ 
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              <FiFilter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Users Table Placeholder */}
        <div 
          className="rounded-lg p-6"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <div className="text-center py-12">
            <FiUsers 
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Users Management Coming Soon
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              This feature is under development. You'll be able to manage users, roles, and permissions here.
            </p>
          </div>
        </div>
      </div>
    </RoleProtected>
  )
}

export default UsersManagement
