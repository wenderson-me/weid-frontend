import { FiSettings, FiDatabase, FiMail, FiShield, FiGlobe, FiAlertTriangle } from 'react-icons/fi'
import RoleProtected from '../../../components/common/RoleProtected'
import { UserRole } from '../../../hooks/useRole'
import { useRole } from '../../../hooks/useRole'

const UnauthorizedFallback = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div
      className="rounded-lg p-12 text-center border-2"
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderColor: 'rgb(239, 68, 68)',
        borderStyle: 'dashed'
      }}
    >
      <FiAlertTriangle
        className="w-16 h-16 mx-auto mb-4"
        style={{ color: 'rgb(239, 68, 68)' }}
      />
      <h2
        className="text-2xl font-bold mb-2"
        style={{ color: 'rgb(239, 68, 68)' }}
      >
        Access Denied
      </h2>
      <p
        className="text-lg mb-4"
        style={{ color: 'rgb(239, 68, 68)' }}
      >
        You don't have permission to access System Settings
      </p>
      <p style={{ color: 'var(--text-secondary)' }}>
        This area is restricted to <strong>Administrators</strong> only.
      </p>
    </div>
  </div>
)

const SystemSettings = () => {
  const { getRoleDisplayName } = useRole()

  return (
    <RoleProtected
      allowedRoles={[UserRole.ADMIN]}
      fallback={<UnauthorizedFallback />}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Only Badge */}
        <div
          className="mb-6 p-4 rounded-lg border flex items-center gap-3"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            borderColor: 'rgba(239, 68, 68, 0.2)'
          }}
        >
          <FiShield
            className="w-5 h-5 flex-shrink-0"
            style={{ color: 'rgb(239, 68, 68)' }}
          />
          <div className="flex-1">
            <p
              className="text-sm font-semibold"
              style={{ color: 'rgb(239, 68, 68)' }}
            >
              Administrator Access Only
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-tertiary)' }}
            >
              You are viewing this page as <strong>{getRoleDisplayName()}</strong>
            </p>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <FiSettings className="w-8 h-8" />
            System Settings
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Configure system-wide settings and preferences
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Settings */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FiGlobe
                className="w-6 h-6"
                style={{ color: 'var(--primary-color)' }}
              />
              <h3
                className="text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                General Settings
              </h3>
            </div>
            <p
              className="text-sm mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Configure basic system settings
            </p>
            <button
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              Configure
            </button>
          </div>

          {/* Security Settings */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FiShield
                className="w-6 h-6"
                style={{ color: 'var(--primary-color)' }}
              />
              <h3
                className="text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Security Settings
              </h3>
            </div>
            <p
              className="text-sm mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Manage security and authentication
            </p>
            <button
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              Configure
            </button>
          </div>

          {/* Email Settings */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FiMail
                className="w-6 h-6"
                style={{ color: 'var(--primary-color)' }}
              />
              <h3
                className="text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Email Settings
              </h3>
            </div>
            <p
              className="text-sm mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Configure email notifications
            </p>
            <button
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              Configure
            </button>
          </div>

          {/* Database Settings */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FiDatabase
                className="w-6 h-6"
                style={{ color: 'var(--primary-color)' }}
              />
              <h3
                className="text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Database Settings
              </h3>
            </div>
            <p
              className="text-sm mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Manage database and backups
            </p>
            <button
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              Configure
            </button>
          </div>
        </div>

        {/* Warning Box */}
        <div
          className="mt-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgb(239, 68, 68)'
          }}
        >
          <div className="flex items-start gap-3">
            <FiShield
              className="w-6 h-6 flex-shrink-0 mt-0.5"
              style={{ color: 'rgb(239, 68, 68)' }}
            />
            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: 'rgb(239, 68, 68)' }}
              >
                Administrator Access Only
              </h4>
              <p
                className="text-sm"
                style={{ color: 'rgb(239, 68, 68)' }}
              >
                These settings affect the entire system. Changes should be made carefully and tested in a development environment first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </RoleProtected>
  )
}

export default SystemSettings
