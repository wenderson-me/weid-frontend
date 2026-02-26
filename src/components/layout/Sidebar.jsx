import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiLogOut, FiX, FiChevronRight,
  FiMoon, FiSun, FiMonitor,
  FiHome, FiGrid, FiTrendingUp, FiCalendar, 
  FiClock, FiShoppingCart, FiMessageSquare, FiBell,
  FiSettings, FiKey, FiHelpCircle, FiUser
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
        <div className="p-4 border-t" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {currentUser?.name?.split(' ')[0] || 'User'}
                </p>
                <p className="text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>
                  {getRoleDisplayName()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleThemeToggle}
              className="flex-1 flex items-center justify-center p-2 rounded-lg transition-all"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)'
              }}
              title={`Theme: ${theme}`}
            >
              {getThemeIcon()}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center p-2 rounded-lg transition-all hover:text-red-500"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)'
              }}
              title="Logout"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Secondary Sidebar - Right Icon Panel */}
      <aside
        className="hidden lg:flex lg:fixed lg:inset-y-0 lg:right-0 lg:w-20 lg:z-20 lg:flex-col lg:items-center bg-opacity-50 border-l"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)'
        }}
      >
        {/* Quick Navigation Icons */}
        <nav className="flex-1 flex flex-col items-center justify-center space-y-4 py-6 px-3">
          {[
            { icon: FiHome, label: 'Dashboard', path: '/dashboard', badge: false },
            { icon: FiGrid, label: 'Products', path: '/products', badge: false },
            { icon: FiTrendingUp, label: 'Analytics', path: '/analytics', badge: true },
            { icon: FiCalendar, label: 'Schedule', path: '/schedule', badge: false },
            { icon: FiMessageSquare, label: 'Messages', path: '/messages', badge: true },
            { icon: FiBell, label: 'Notifications', path: '/notifications', badge: true },
          ].map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
                            (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
            
            return (
              <Link
                key={idx}
                to={item.path}
                className="relative p-3 rounded-lg transition-all hover:scale-110 group"
                style={{
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary-color)' : 'transparent'
                }}
                title={item.label}
              >
                <Icon className="h-6 w-6" />
                {item.badge && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Icons */}
        <div className="flex flex-col items-center space-y-3 p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={handleThemeToggle}
            className="p-3 rounded-lg transition-all hover:scale-110"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-primary)'
            }}
            title={`Theme: ${theme}`}
          >
            {getThemeIcon()}
          </button>
          <button
            className="p-3 rounded-lg transition-all hover:scale-110"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-primary)'
            }}
            title="Settings"
          >
            <FiSettings className="h-5 w-5" />
          </button>
          <button
            onClick={handleLogout}
            className="p-3 rounded-lg transition-all hover:scale-110 hover:text-red-500"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-primary)'
            }}
            title="Logout"
          >
            <FiLogOut className="h-5 w-5" />
          </button>
        </div>

        {/* User Avatar */}
        <div className="p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs cursor-pointer hover:scale-110 transition-transform"
            title={currentUser?.name}
          >
            {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
