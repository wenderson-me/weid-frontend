import { useState } from 'react'
import { FiMenu, FiSearch, FiPlus, FiBell, FiUser, FiMoon, FiSun, FiMonitor } from 'react-icons/fi'
import { useTheme } from '../../hooks/useTheme'

const Header = ({ title, toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const { theme, toggleTheme, getEffectiveTheme } = useTheme()

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'
    toggleTheme(newTheme)
  }

  // Get theme icon and label
  const getThemeIcon = () => {
    const effectiveTheme = getEffectiveTheme()
    switch (theme) {
      case 'dark':
        return {
          icon: <FiSun size={22} className="text-amber-400" />,
          label: "Switch to light mode"
        }
      case 'light':
        return {
          icon: <FiMoon size={22} />,
          label: "Switch to system theme"
        }
      default:
        return {
          icon: <FiMonitor size={22} className="text-gray-500" />,
          label: "Switch to dark mode"
        }
    }
  }

  const { icon, label } = getThemeIcon()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Left Section: Menu toggle and Title */}
        <div className="flex items-center">
          <button
            type="button"
            className="text-gray-500 hover:text-violet-600 lg:hidden mr-3 p-2 rounded-lg hover:bg-violet-50 transition-colors"
            onClick={toggleSidebar}
          >
            <FiMenu size={22} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>

        {/* Right Section: Search, Create, Theme Toggle, Notifications, Profile */}
        <div className="flex items-center space-x-3">

          {/* Theme Toggle Button */}
          <button
            className="p-2 rounded-lg text-gray-500 hover:text-violet-600 hover:bg-violet-50 transition-colors relative group"
            onClick={handleThemeToggle}
            aria-label={label}
            title={label}
          >
            {icon}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {label}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-lg text-gray-500 hover:text-violet-600 hover:bg-violet-50 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FiBell size={22} />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header