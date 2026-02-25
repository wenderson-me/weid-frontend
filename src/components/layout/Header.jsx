import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiChevronRight, FiSearch } from 'react-icons/fi'
import { getBreadcrumbs } from '../../config/navigation'

const Header = ({ toggleSidebar, sidebarCollapsed }) => {
  const location = useLocation()
  const breadcrumbs = getBreadcrumbs(location.pathname)

  return (
    <header
      className="sticky top-0 z-10 border-b transition-all duration-200 backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Left Section: Menu toggle and Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={toggleSidebar}
            style={{
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--hover-bg)'
              e.target.style.color = 'var(--accent-primary)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = 'var(--text-secondary)'
            }}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <FiMenu size={20} />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center space-x-2">
                {index > 0 && (
                  <FiChevronRight
                    size={16}
                    className="text-gray-400"
                  />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="text-sm font-medium transition-colors hover:text-violet-600"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {crumb.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right Section: Search and Actions */}
        <div className="flex items-center space-x-3">
          <button
            className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-tertiary)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--hover-bg)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            <FiSearch size={16} />
            <span className="text-sm">Search...</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-xs font-semibold border rounded"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-secondary)'
              }}
            >
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header