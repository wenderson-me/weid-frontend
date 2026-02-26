import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiLogOut, FiX, FiChevronRight, FiChevronDown,
  FiMoon, FiSun, FiMonitor,
  FiUser, FiSearch, FiHelpCircle, FiArrowRight
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import useRole from '../../hooks/useRole';
import { navigationConfig } from '../../config/navigation';

const Sidebar = ({ open, toggleSidebar, collapsed }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { hasRole, getRoleDisplayName, getRoleBadgeColor } = useRole();
  const [expandedSection, setExpandedSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
    toggleTheme(newTheme);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Sidebar - Left Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 backdrop-blur-xl border-r transition-all duration-300 ease-in-out transform flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        } w-64 lg:translate-x-0 lg:static lg:z-0`}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-5 right-5 p-2 rounded-xl transition-all lg:hidden"
          onClick={toggleSidebar}
          style={{ color: 'var(--text-secondary)' }}
        >
          <FiX size={20} />
        </button>

        {/* Header with dropdown */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <button className="flex items-center justify-between w-full p-3 rounded-lg hover:opacity-80 transition-opacity" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm">
                W
              </div>
              <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                Weid
              </span>
            </div>
            <FiChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
                '--tw-ring-color': 'var(--primary-color)'
              }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          {navigationConfig
            .filter(section => !section.roles || hasRole(section.roles))
            .map((section, idx) => {
              const allowedItems = section.items.filter(item => !item.roles || hasRole(item.roles))
              const isExpanded = expandedSection === section.title;

              if (allowedItems.length === 0) return null

              return (
                <div key={idx} className="mb-4">
                  {/* Section Header */}
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : section.title)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg mb-2 transition-all"
                    style={{
                      backgroundColor: isExpanded ? 'var(--bg-primary)' : 'transparent',
                      color: 'var(--text-tertiary)'
                    }}
                  >
                    <h2 className="text-xs font-bold uppercase tracking-wider">
                      {section.title}
                    </h2>
                    <FiChevronDown
                      size={16}
                      className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Section Items */}
                  {isExpanded && (
                    <div className="space-y-1 pl-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {allowedItems.map((item, itemIdx) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                                        (item.path !== '/' && location.pathname.startsWith(item.path + '/'));

                        return (
                          <Link
                            key={itemIdx}
                            to={item.path}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 group relative overflow-hidden"
                            style={isActive ? {
                              backgroundColor: 'var(--primary-color)',
                              color: 'white'
                            } : {
                              color: 'var(--text-secondary)'
                            }}
                            title={item.name}
                          >
                            {isActive && (
                              <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: 'white' }} />
                            )}
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="flex-1">{item.name}</span>
                            {isActive && (
                              <FiArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </nav>

        {/* Help Center Card */}
        <div className="mx-4 mb-4 p-4 rounded-lg border-2 border-dashed" style={{
          borderColor: 'var(--primary-color)',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <div className="flex items-center space-x-2 mb-2">
            <FiHelpCircle size={16} style={{ color: 'var(--primary-color)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Need Help?</span>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
            Check our documentation or contact support
          </p>
          <button className="w-full text-sm font-medium py-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white'
            }}
          >
            View Docs
          </button>
        </div>

        {/* User Section Footer */}
        <div className="p-4 border-t space-y-3" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          {/* User Info Card with Avatar */}
          <div className="p-3 rounded-xl transition-all hover:scale-105" style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)'
          }}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg">
                {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {currentUser?.name || 'User'}
                </p>
                <div className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-semibold ${getRoleBadgeColor()}`}>
                  {getRoleDisplayName()}
                </div>
              </div>
            </div>
            <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
              {currentUser?.email || 'user@example.com'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Link
              to="/profile"
              className="flex flex-col items-center justify-center p-3 rounded-lg transition-all hover:scale-110 group"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)'
              }}
              title="Profile"
            >
              <FiUser className="h-5 w-5 mb-1 group-hover:text-violet-500 transition-colors" />
              <span className="text-xs font-medium">Profile</span>
            </Link>

            <button
              onClick={handleThemeToggle}
              className="flex flex-col items-center justify-center p-3 rounded-lg transition-all hover:scale-110 group"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)'
              }}
              title={`Theme: ${theme}`}
            >
              {theme === 'dark' ? (
                <FiSun className="h-5 w-5 mb-1 text-amber-400" />
              ) : theme === 'light' ? (
                <FiMoon className="h-5 w-5 mb-1" />
              ) : (
                <FiMonitor className="h-5 w-5 mb-1 text-gray-500" />
              )}
              <span className="text-xs font-medium">Theme</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center p-3 rounded-lg transition-all hover:scale-110 group hover:text-red-500"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)'
              }}
              title="Logout"
            >
              <FiLogOut className="h-5 w-5 mb-1 group-hover:text-red-500 transition-colors" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
