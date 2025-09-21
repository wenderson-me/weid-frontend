import React from 'react'
import { FiMenu } from 'react-icons/fi'

const Logo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" className="text-violet-600" />
    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Header = ({ title, toggleSidebar }) => {

  return (
    <header
      className="sticky top-0 z-10 border-b transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="px-4 md:px-6 py-2.5 flex items-center justify-between">
        {/* Left Section: Menu toggle, Logo and Title */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg transition-all duration-200 hover:scale-105"
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
          >
            <FiMenu size={20} />
          </button>

          <div className="flex items-center space-x-2">
            <Logo size={20} />
            <h1
              className="text-lg font-medium tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h1>
          </div>
        </div>


      </div>
    </header>
  )
}

export default Header