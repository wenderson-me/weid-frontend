import { useState } from 'react'
import { FiUser, FiShield, FiSettings } from 'react-icons/fi'
import Tabs from '../../components/common/Tabs'
import ProfileInfo from '../../components/profile/ProfileInfo'
import ProfileSecurity from '../../components/profile/ProfileSecurity'
import ProfilePreferences from '../../components/profile/ProfilePreferences'

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('info')

  const tabs = [
    {
      id: 'info',
      label: 'Personal Information',
      icon: FiUser
    },
    {
      id: 'security',
      label: 'Security',
      icon: FiShield
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: FiSettings
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <ProfileInfo />
      case 'security':
        return <ProfileSecurity />
      case 'preferences':
        return <ProfilePreferences />
      default:
        return <ProfileInfo />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          User Profile
        </h1>
        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-8">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-200">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default UserProfile
