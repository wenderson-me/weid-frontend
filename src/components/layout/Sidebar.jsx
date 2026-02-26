import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiLogOut, FiX, FiChevronRight,
  FiMoon, FiSun, FiMonitor,
  FiUser
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

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
    toggleTheme(newTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <FiSun size={18} className="text-amber-400" />;
      case 'light':
        return <FiMoon size={18} />;
      default:
        return <FiMonitor size={18} className="text-gray-500" />;
    }
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          {navigationConfig
            .filter(section => !section.roles || hasRole(section.roles))
            .map((section, idx) => {
              const allowedItems = section.items.filter(item => !item.roles || hasRole(item.roles))

              if (allowedItems.length === 0) return null

              return (
                <div key={idx} className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-3" style={{ color: 'var(--text-tertiary)' }}>
                    {section.title}
                  </h2>
                  <div className="space-y-1">
                    {allowedItems.map((item, itemIdx) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path ||
                                      (item.path !== '/' && location.pathname.startsWith(item.path + '/'));

                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 group"
                          style={isActive ? {
                            backgroundColor: 'var(--primary-color)',
                            color: 'white'
                          } : {
                            color: 'var(--text-secondary)'
                          }}
                          title={item.name}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span className="flex-1">{item.name}</span>
                          {isActive && (
                            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'white' }} />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </nav>

        {/* User Section Footer */}
        <div className="p-4 border-t space-y-3" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          {/* User Info */}
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white flex-shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {currentUser?.name || 'User'}
              </p>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor()}`}>
                  {getRoleDisplayName()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              <FiUser className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <button
              onClick={handleThemeToggle}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              title={`Theme: ${theme}`}
            >
              {getThemeIcon()}
              <span>Theme: {theme}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm hover:text-red-500"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              title="Logout"
            >
              <FiLogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
