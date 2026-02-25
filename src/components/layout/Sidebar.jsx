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
          className="absolute top-5 right-5 p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all duration-200 lg:hidden"
          onClick={toggleSidebar}
        >
          <FiX size={20} />
        </button>

        {/* Logo/Brand */}
        <div className={`p-6 border-b border-gray-200/80 ${collapsed ? 'px-4' : ''}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
              W
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">Weid</h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={handleThemeToggle}
              className="mt-4 w-full flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 hover:scale-105 bg-gray-100"
              title="Toggle theme"
            >
              {getThemeIcon()}
            </button>
          )}
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
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-4 px-3 text-gray-500">
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
                          className={`group flex items-center ${collapsed ? 'justify-center px-3' : 'justify-between px-3'} py-3 rounded-xl font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-violet-50 text-violet-700 shadow-sm border border-violet-100'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          title={collapsed ? item.name : ''}
                        >
                          <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
                            <Icon className={`h-5 w-5 ${isActive ? 'text-violet-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                            {!collapsed && <span>{item.name}</span>}
                          </div>
                          {!collapsed && isActive && (
                            <FiChevronRight className="h-4 w-4 text-violet-500" />
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50/50">
          {collapsed ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white">
                {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                  {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {currentUser?.name?.split(' ')[0] || 'Administrator'}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser?.email || 'admin@example.com'}
                    </p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getRoleBadgeColor()}`}>
                      {getRoleDisplayName()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex-shrink-0"
                title="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
