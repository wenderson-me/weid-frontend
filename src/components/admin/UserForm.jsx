import { useState } from 'react'
import { FiMail, FiLock, FiUser, FiShield, FiEye, FiEyeOff } from 'react-icons/fi'
import { checkPasswordStrength, getPasswordStrengthColor, getPasswordStrengthMessage } from '../../utils/securityUtils'
import { UserRole } from '../../hooks/useRole'

const UserForm = ({ initialUser, onSubmit, isLoading, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    password: initialUser?.password || '',
    role: initialUser?.role || UserRole.USER
  })

  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(null)

  const handlePasswordChange = (e) => {
    const password = e.target.value
    setFormData({ ...formData, password })
    if (password) {
      const strength = checkPasswordStrength(password)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const roleOptions = [
    { value: UserRole.ADMIN, label: 'Admin', description: 'Full system access' },
    { value: UserRole.MANAGER, label: 'Manager', description: 'Limited admin access' },
    { value: UserRole.USER, label: 'User', description: 'Regular user access' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <div className="flex items-center gap-2">
            <FiUser className="w-4 h-4" />
            Full Name
          </div>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
          className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
            '--tw-ring-color': 'var(--primary-color)'
          }}
          disabled={isLoading}
          required
        />
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <div className="flex items-center gap-2">
            <FiMail className="w-4 h-4" />
            Email Address
          </div>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
            '--tw-ring-color': 'var(--primary-color)'
          }}
          disabled={isLoading}
          required
        />
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <div className="flex items-center gap-2">
            <FiLock className="w-4 h-4" />
            Password {mode === 'edit' && <span className="text-xs text-gray-500">(leave empty to keep current)</span>}
          </div>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={formData.password}
            onChange={handlePasswordChange}
            placeholder={mode === 'edit' ? 'Leave empty to keep current password' : 'Enter a secure password'}
            className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 pr-10"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              '--tw-ring-color': 'var(--primary-color)'
            }}
            disabled={isLoading}
            required={mode === 'create'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.password && passwordStrength && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(Object.keys(passwordStrength.requirements || {}).filter(k => passwordStrength.requirements[k]).length / (Object.keys(passwordStrength.requirements || {}).length || 1)) * 100}%`,
                    backgroundColor: getPasswordStrengthColor(passwordStrength.strength)
                  }}
                />
              </div>
              <span className="text-xs font-medium" style={{ color: getPasswordStrengthColor(passwordStrength.strength) }}>
                {passwordStrength.strength}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {getPasswordStrengthMessage(passwordStrength.strength)}
            </p>
          </div>
        )}
      </div>

      {/* Role Field */}
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          <div className="flex items-center gap-2">
            <FiShield className="w-4 h-4" />
            User Role
          </div>
        </label>
        <div className="space-y-2">
          {roleOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-start p-3 rounded-lg border cursor-pointer transition-all"
              style={{
                backgroundColor: formData.role === option.value ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-primary)',
                borderColor: formData.role === option.value ? 'rgb(59, 130, 246)' : 'var(--border-color)'
              }}
            >
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={formData.role === option.value}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 mr-3"
                disabled={isLoading}
              />
              <div className="flex-1">
                <p
                  className="font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {option.label}
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {option.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 rounded-lg font-medium transition-all text-white"
          style={{
            backgroundColor: isLoading ? 'rgba(59, 130, 246, 0.5)' : 'var(--primary-color)',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Saving...' : mode === 'edit' ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  )
}

export default UserForm
