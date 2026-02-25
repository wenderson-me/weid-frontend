import { useState, useEffect } from 'react'
import { FiSun, FiMoon, FiMonitor, FiSave, FiGlobe, FiBell, FiMail } from 'react-icons/fi'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import userService from '../../services/userService'

const ProfilePreferences = () => {
  const { theme, setTheme } = useTheme()
  const { currentUser, setCurrentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [preferences, setPreferences] = useState({
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    weeklyDigest: false,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  useEffect(() => {
    if (currentUser?.preferences) {
      setPreferences(prev => ({
        ...prev,
        ...currentUser.preferences
      }))
    }
  }, [currentUser])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const updatedUser = await userService.updatePreferences(preferences)
      setCurrentUser(updatedUser)
      
      setSuccess('Preferences updated successfully')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message || 'Failed to update preferences')
    } finally {
      setLoading(false)
    }
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: FiSun },
    { value: 'dark', label: 'Dark', icon: FiMoon },
    { value: 'system', label: 'System', icon: FiMonitor },
  ]

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' },
    { value: 'es', label: 'Español' },
  ]

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div 
          className="rounded-lg p-4 border"
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgb(239, 68, 68)',
            color: 'rgb(239, 68, 68)'
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div 
          className="rounded-lg p-4 border"
          style={{ 
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgb(34, 197, 94)',
            color: 'rgb(34, 197, 94)'
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Appearance */}
        <div 
          className="rounded-lg p-6"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <h3 
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Appearance
          </h3>

          <div className="space-y-4">
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Theme
            </label>

            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon
                const isActive = theme === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleThemeChange(option.value)}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all"
                    style={{
                      backgroundColor: isActive ? 'var(--primary-color)' : 'var(--bg-primary)',
                      borderColor: isActive ? 'var(--primary-color)' : 'var(--border-color)',
                      color: isActive ? 'white' : 'var(--text-primary)'
                    }}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div 
          className="rounded-lg p-6"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FiGlobe 
              className="w-5 h-5"
              style={{ color: 'var(--primary-color)' }}
            />
            <h3 
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Language & Region
            </h3>
          </div>

          <div className="space-y-4">
            {/* Language */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border transition-colors"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Timezone
              </label>
              <input
                type="text"
                value={preferences.timezone}
                disabled
                className="w-full px-4 py-2 rounded-lg border cursor-not-allowed"
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-tertiary)'
                }}
              />
              <p 
                className="text-xs mt-1"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Detected automatically from your system
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div 
          className="rounded-lg p-6"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FiBell 
              className="w-5 h-5"
              style={{ color: 'var(--primary-color)' }}
            />
            <h3 
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Notifications
            </h3>
          </div>

          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <FiMail 
                  className="w-5 h-5 mt-1"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Email Notifications
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Receive email updates about your tasks and activities
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div 
                  className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{ 
                    backgroundColor: preferences.emailNotifications ? 'var(--primary-color)' : 'var(--border-color)'
                  }}
                />
              </label>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <FiBell 
                  className="w-5 h-5 mt-1"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Push Notifications
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Receive browser push notifications
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.pushNotifications}
                  onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div 
                  className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{ 
                    backgroundColor: preferences.pushNotifications ? 'var(--primary-color)' : 'var(--border-color)'
                  }}
                />
              </label>
            </div>

            {/* Task Reminders */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <FiBell 
                  className="w-5 h-5 mt-1"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Task Reminders
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Get reminded about upcoming and overdue tasks
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.taskReminders}
                  onChange={(e) => handlePreferenceChange('taskReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div 
                  className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{ 
                    backgroundColor: preferences.taskReminders ? 'var(--primary-color)' : 'var(--border-color)'
                  }}
                />
              </label>
            </div>

            {/* Weekly Digest */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <FiMail 
                  className="w-5 h-5 mt-1"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Weekly Digest
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Receive a weekly summary of your activities
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.weeklyDigest}
                  onChange={(e) => handlePreferenceChange('weeklyDigest', e.target.checked)}
                  className="sr-only peer"
                />
                <div 
                  className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{ 
                    backgroundColor: preferences.weeklyDigest ? 'var(--primary-color)' : 'var(--border-color)'
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            style={{ 
              backgroundColor: 'var(--primary-color)',
              color: 'white'
            }}
          >
            <FiSave className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfilePreferences
