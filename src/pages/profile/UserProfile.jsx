import { useState, useEffect } from 'react'
import { FiUser, FiSettings, FiPieChart, FiShield, FiAlertTriangle } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import ProfileInfo from '../../components/profile/ProfileInfo'
import ProfilePreferences from '../../components/profile/ProfilePreferences'
import ProfileStatistics from '../../components/profile/ProfileStatistics'
import ProfileAccount from '../../components/profile/ProfileAccount'
import userService from '../../services/userService'

const UserProfile = () => {
  const { currentUser, refreshToken } = useAuth()
  const [activeTab, setActiveTab] = useState('info')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [preferences, setPreferences] = useState(currentUser?.preferences || {
    theme: 'system',
    language: 'en-US',
    defaultTaskView: 'board',
    defaultTaskFilter: {
      status: [],
      priority: []
    }
  })


  useEffect(() => {
    const fetchUserStats = async () => {
      if (activeTab === 'statistics') {
        try {
          setLoading(true)
          setError(null)
          const response = await userService.getUserStatistics()
          setUserStats(response)
        } catch (err) {
          console.error('Failed to fetch user statistics:', err)
          setError('Unable to load statistics. Please try again later.')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserStats()
  }, [activeTab])


  const handleProfileUpdate = async (profileData) => {
    try {
      setLoading(true)
      setError(null)
      const updatedUser = await userService.updateProfile(profileData)


      refreshToken()

      return updatedUser
    } catch (err) {
      console.error('Failed to update profile:', err)
      setError(err.message || 'Failed to update profile. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }


  const handlePreferencesUpdate = async (preferencesData) => {
    try {
      setLoading(true)
      setError(null)
      const updatedUser = await userService.updatePreferences(preferencesData)
      setPreferences(updatedUser.preferences)


      refreshToken()

      return updatedUser
    } catch (err) {
      console.error('Failed to update preferences:', err)
      setError(err.message || 'Failed to update preferences. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }


  const handleAvatarUpdate = async (avatarUrl) => {
    try {
      setLoading(true)
      setError(null)
      const updatedUser = await userService.updateAvatar(avatarUrl)


      refreshToken()

      return updatedUser
    } catch (err) {
      console.error('Failed to update avatar:', err)
      setError(err.message || 'Failed to update avatar. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }


  const handleDeactivateAccount = async () => {
    try {
      setLoading(true)
      setError(null)
      await userService.deactivateAccount()
      return true
    } catch (err) {
      console.error('Failed to deactivate account:', err)
      setError(err.message || 'Failed to deactivate account. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }


  const tabs = [
    { id: 'info', label: 'Profile Information', icon: <FiUser className="mr-2" /> },
    { id: 'preferences', label: 'Preferences', icon: <FiSettings className="mr-2" /> },
    { id: 'statistics', label: 'Statistics', icon: <FiPieChart className="mr-2" /> },
    { id: 'account', label: 'Account', icon: <FiShield className="mr-2" /> },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>

      {/* Error alert */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-violet-500 text-violet-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <ProfileInfo
              user={currentUser}
              loading={loading}
              onProfileUpdate={handleProfileUpdate}
              onAvatarUpdate={handleAvatarUpdate}
            />
          )}

          {activeTab === 'preferences' && (
            <ProfilePreferences
              preferences={preferences}
              loading={loading}
              onPreferencesUpdate={handlePreferencesUpdate}
            />
          )}

          {activeTab === 'statistics' && (
            <ProfileStatistics
              stats={userStats}
              loading={loading}
            />
          )}

          {activeTab === 'account' && (
            <ProfileAccount
              user={currentUser}
              loading={loading}
              onDeactivateAccount={handleDeactivateAccount}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile