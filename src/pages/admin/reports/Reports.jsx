import { FiBarChart2, FiDownload, FiCalendar, FiShield } from 'react-icons/fi'
import RoleProtected from '../../../components/common/RoleProtected'
import { UserRole, useRole } from '../../../hooks/useRole'

const Reports = () => {
  const { getRoleDisplayName } = useRole()

  return (
    <RoleProtected allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
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
              Management Access Required
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Viewing as <strong>{getRoleDisplayName()}</strong> (Admins and Managers only)
            </p>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <FiBarChart2 className="w-8 h-8" />
              Reports & Analytics
            </h1>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
              View system statistics and generate reports
            </p>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white'
            }}
          >
            <FiDownload className="w-5 h-5" />
            Export Report
          </button>
        </div>

        {/* Date Range Selector */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <div className="flex items-center gap-4">
            <FiCalendar
              className="w-5 h-5"
              style={{ color: 'var(--text-secondary)' }}
            />
            <span
              className="font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Date Range:
            </span>
            <select
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
              <option>Custom range</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Users', value: '0', color: 'blue' },
            { label: 'Active Tasks', value: '0', color: 'green' },
            { label: 'Completed', value: '0', color: 'purple' },
            { label: 'Pending', value: '0', color: 'orange' }
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-lg p-6"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <p
                className="text-sm font-medium mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {stat.label}
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Reports Placeholder */}
        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <div className="text-center py-12">
            <FiBarChart2
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Reports Coming Soon
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Detailed analytics and reports will be available here soon.
            </p>
          </div>
        </div>
      </div>
    </RoleProtected>
  )
}

export default Reports
