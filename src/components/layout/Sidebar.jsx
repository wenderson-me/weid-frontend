import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiLogOut, FiX, FiChevronRight,
  FiMoon, FiSun, FiMonitor
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

      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-white/95 backdrop-blur-xl border-r border-gray-200/80 shadow-xl transition-all duration-300 ease-in-out transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-20' : 'w-64'} lg:translate-x-0 lg:static lg:z-0 lg:bg-white/98 lg:shadow-sm`}
        style={{
          backgroundColor: 'var(--sidebar-bg)',
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

        {/* Logo/Brand */}
        <div className={`p-6 border-b ${collapsed ? 'px-4' : ''}`} style={{ borderColor: 'var(--border-color)' }}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
              W
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Weid</h1>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Management System</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className={`py-6 h-[calc(100%-220px)] overflow-y-auto ${collapsed ? 'px-2' : 'px-4'}`}>
          {navigationConfig
            .filter(section => !section.roles || hasRole(section.roles))
            .map((section, idx) => {
              // Filter items based on user role
              const allowedItems = section.items.filter(item => !item.roles || hasRole(item.roles))

              // Skip section if no items are available
              if (allowedItems.length === 0) return null

              return (
                <div key={idx} className="mb-8">
                  {!collapsed && (
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-4 px-3" style={{ color: 'var(--text-tertiary)' }}>
                      {section.title}
                    </h2>
                  )}
                  <nav className="space-y-1">
                    {allowedItems.map((item, itemIdx) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path ||
                                      (item.path !== '/' && location.pathname.startsWith(item.path + '/'));

                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          className={`group flex items-center ${collapsed ? 'justify-center px-3' : 'justify-between px-3'} py-3 rounded-xl font-medium transition-all duration-200`}
                          style={isActive ? {
                            backgroundColor: 'var(--primary-color)',
                            color: 'white'
                          } : {
                            color: 'var(--text-secondary)'
                          }}
                          title={collapsed ? item.name : ''}
                        >
                          <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
                            <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                            {!collapsed && <span>{item.name}</span>}
                          </div>
                          {!collapsed && isActive && (
                            <FiChevronRight className="h-4 w-4" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              );
            })}
        </div>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          {collapsed ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white">
                {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-xl transition-all"
                style={{ 
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
                title={`Theme: ${theme}`}
              >
                {getThemeIcon()}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl transition-all"
                style={{ 
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
                title="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                    {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {currentUser?.name?.split(' ')[0] || 'Administrator'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                        {currentUser?.email || 'admin@example.com'}
                      </p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getRoleBadgeColor()}`}>
                        {getRoleDisplayName()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleThemeToggle}
                  className="flex-1 flex items-center justify-center p-2 rounded-xl transition-all"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)'
                  }}
                  title={`Theme: ${theme}`}
                >
                  {getThemeIcon()}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center p-2 rounded-xl transition-all"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)'
                  }}
                  title="Logout"
                >
                  <FiLogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
