import { useState } from 'react'
import { FiLock, FiEye, FiEyeOff, FiShield, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi'
import authService from '../../services/authService'
import { securityUtils } from '../../config/axios'
import { 
  checkPasswordStrength, 
  validatePasswordConfirmation,
  getPasswordStrengthColor,
  getPasswordStrengthBgColor,
  formatTimeRemaining 
} from '../../utils/securityUtils'

const ProfileSecurity = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(
    securityUtils.getSessionTimeRemaining()
  )

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [passwordStrength, setPasswordStrength] = useState(null)

  // Update session time remaining every second
  useState(() => {
    const interval = setInterval(() => {
      setSessionTimeRemaining(securityUtils.getSessionTimeRemaining())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))

    // Check password strength for new password
    if (name === 'newPassword') {
      const strength = checkPasswordStrength(value)
      setPasswordStrength(strength)
    }

    setError(null)
  }

  const handleSubmitPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate password strength
      if (!passwordStrength || !passwordStrength.isValid) {
        throw new Error('Password does not meet security requirements')
      }

      // Validate password confirmation
      const confirmValidation = validatePasswordConfirmation(
        passwordData.newPassword,
        passwordData.confirmPassword
      )

      if (!confirmValidation.isValid) {
        throw new Error(confirmValidation.message)
      }

      // Change password
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      )

      setSuccess('Password changed successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setPasswordStrength(null)

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (err) {
      setError(err.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <div 
        className="rounded-lg p-6"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <FiClock 
            className="w-5 h-5"
            style={{ color: 'var(--primary-color)' }}
          />
          <h3 
            className="text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            Active Session
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>
              Session Status
            </span>
            <span 
              className="flex items-center gap-2"
              style={{ color: 'var(--success-color)' }}
            >
              <FiCheckCircle className="w-4 h-4" />
              Active
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>
              Time Remaining
            </span>
            <span 
              className="font-mono text-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              {formatTimeRemaining(sessionTimeRemaining)}
            </span>
          </div>

          <div 
            className="text-sm p-3 rounded-lg flex items-start gap-2"
            style={{ 
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-tertiary)'
            }}
          >
            <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              Your session will automatically expire after 30 minutes of inactivity. 
              Any activity will reset the timer.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div 
          className="rounded-lg p-4 border flex items-start gap-3"
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgb(239, 68, 68)',
            color: 'rgb(239, 68, 68)'
          }}
        >
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div 
          className="rounded-lg p-4 border flex items-start gap-3"
          style={{ 
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgb(34, 197, 94)',
            color: 'rgb(34, 197, 94)'
          }}
        >
          <FiCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{success}</p>
        </div>
      )}

      {/* Change Password Form */}
      <form onSubmit={handleSubmitPassword}>
        <div 
          className="rounded-lg p-6 space-y-6"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <div className="flex items-center gap-3">
            <FiLock 
              className="w-5 h-5"
              style={{ color: 'var(--primary-color)' }}
            />
            <h3 
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Change Password
            </h3>
          </div>

          {/* Current Password */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 pr-12 rounded-lg border transition-colors"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 pr-12 rounded-lg border transition-colors"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {passwordStrength && passwordData.newPassword && (
              <div className="mt-3 space-y-2">
                {/* Strength Bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getPasswordStrengthBgColor(passwordStrength.strength)}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>

                {/* Strength Label */}
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Password Strength:
                  </span>
                  <span 
                    className={`text-sm font-semibold ${getPasswordStrengthColor(passwordStrength.strength)}`}
                  >
                    {passwordStrength.strength?.charAt(0).toUpperCase() + passwordStrength.strength?.slice(1).replace('-', ' ')}
                  </span>
                </div>

                {/* Feedback */}
                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-sm space-y-1">
                    {passwordStrength.feedback.map((feedback, index) => (
                      <li 
                        key={index}
                        className="flex items-start gap-2"
                        style={{ 
                          color: passwordStrength.isValid && passwordStrength.feedback[0] === 'Password meets requirements' 
                            ? 'var(--success-color)' 
                            : 'var(--text-tertiary)' 
                        }}
                      >
                        {passwordStrength.isValid && passwordStrength.feedback[0] === 'Password meets requirements' ? (
                          <FiCheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        ) : (
                          <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        {feedback}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 pr-12 rounded-lg border transition-colors"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Security Tips */}
          <div 
            className="p-4 rounded-lg space-y-2"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FiShield 
                className="w-4 h-4"
                style={{ color: 'var(--primary-color)' }}
              />
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                Password Security Tips
              </span>
            </div>
            <ul 
              className="text-sm space-y-1 pl-6"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <li className="list-disc">Use at least 8 characters</li>
              <li className="list-disc">Include uppercase and lowercase letters</li>
              <li className="list-disc">Include numbers and special characters</li>
              <li className="list-disc">Avoid common words or patterns</li>
              <li className="list-disc">Don't reuse passwords from other accounts</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading || !passwordStrength?.isValid}
              className="px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: 'var(--primary-color)',
                color: 'white'
              }}
            >
              <FiLock className="w-4 h-4" />
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProfileSecurity
