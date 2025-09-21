import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiCheckSquare, FiActivity, FiCalendar, FiFileText,
  FiUser, FiSettings, FiLogOut, FiMenu, FiX, FiChevronRight,
  FiMoon, FiSun, FiMonitor, FiBell
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme'
import NotificationsMenu from '../notifications/NotificationsMenu';
import notificationService from '../../services/notificationService';

const Sidebar = ({ open, toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme, getEffectiveTheme } = useTheme()
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao carregar contador de notificações:', error);
    }
  };

  useEffect(() => {
    loadUnreadCount();

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!notificationsOpen) {
      loadUnreadCount();
    }
  }, [notificationsOpen]);


  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'
    toggleTheme(newTheme)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return {
          icon: <FiSun size={18} className="text-amber-400" />,
          label: "Switch to light mode"
        }
      case 'light':
        return {
          icon: <FiMoon size={18} />,
          label: "Switch to system theme"
        }
      default:
        return {
          icon: <FiMonitor size={18} className="text-gray-500" />,
          label: "Switch to dark mode"
        }
    }
  }

  const { icon, label } = getThemeIcon()

  const menuItems = [
    {
      title: 'Main',
      items: [
        {
          name: 'Dashboard',
          icon: <FiHome className="h-5 w-5" />,
          path: '/dashboard'
        },
        {
          name: 'Tasks',
          icon: <FiCheckSquare className="h-5 w-5" />,
          path: '/tasks'
        },
        {
          name: 'Notes',
          icon: <FiFileText className="h-5 w-5" />,
          path: '/notes'
        },
        {
          name: 'Activities',
          icon: <FiActivity className="h-5 w-5" />,
          path: '/activities'
        },
        {
          name: 'Schedule',
          icon: <FiCalendar className="h-5 w-5" />,
          path: '/schedule'
        },
        {
          name: 'Notifications',
          icon: <FiBell className="h-5 w-5" />,
          path: '/notifications',
          onClick: () => setNotificationsOpen(true),
          badge: unreadCount
        }
      ]
    },
    {
      title: 'Account',
      items: [
        {
          name: 'Profile',
          icon: <FiUser className="h-5 w-5" />,
          path: '/profile'
        },
        {
          name: 'Settings',
          icon: <FiSettings className="h-5 w-5" />,
          path: '/settings'
        }
      ]
    }
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/80 shadow-xl transition-all duration-300 transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0 lg:bg-white lg:shadow-none`}
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <button
          className="absolute top-5 right-5 p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all duration-200 lg:hidden"
          onClick={toggleSidebar}
          style={{
            color: 'var(--text-tertiary)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--hover-bg)'
            e.target.style.color = 'var(--text-secondary)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent'
            e.target.style.color = 'var(--text-tertiary)'
          }}
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="px-6 py-8 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Weid</h1>
                <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Management System</p>
              </div>
            </div>

            <button
              onClick={handleThemeToggle}
              className="flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 hover:scale-105 relative group"
              style={{
                backgroundColor: 'var(--hover-bg)',
                color: 'var(--text-secondary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--accent-primary)'
                e.target.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--hover-bg)'
                e.target.style.color = 'var(--text-secondary)'
              }}
              title={label}
            >
              {icon}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                style={{
                  backgroundColor: 'var(--bg-tooltip)',
                  color: 'var(--text-tooltip)',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                {label}
              </div>
            </button>
          </div>
        </div>

        <div className="px-4 py-6 h-[calc(100%-220px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-4 px-3" style={{ color: 'var(--text-tertiary)' }}>
                {section.title}
              </h2>
              <nav className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  const isActive = location.pathname === item.path ||
                                  (item.path !== '/' && location.pathname.startsWith(item.path + '/'));

                  if (item.onClick) {
                    return (
                      <button
                        key={itemIdx}
                        onClick={item.onClick}
                        className={`group flex items-center justify-between px-3 py-3 rounded-xl font-medium transition-all duration-200 w-full text-left ${
                          isActive
                            ? 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 shadow-sm border border-violet-100'
                            : 'hover:bg-gray-50'
                        }`}
                        style={{
                          color: isActive ? '#6366f1' : 'var(--text-secondary)',
                          backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                          borderColor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.target.style.backgroundColor = 'var(--hover-bg)'
                            e.target.style.color = 'var(--text-primary)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.target.style.backgroundColor = 'transparent'
                            e.target.style.color = 'var(--text-secondary)'
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-1 rounded-lg transition-colors relative ${
                            isActive ? 'text-violet-600' : 'text-gray-400 group-hover:text-gray-600'
                          }`}>
                            {item.icon}
                            {item.badge > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                {item.badge > 99 ? '99+' : item.badge}
                              </span>
                            )}
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        {isActive && (
                          <FiChevronRight className="h-4 w-4 text-violet-500" />
                        )}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={itemIdx}
                      to={item.path}
                      className={`group flex items-center justify-between px-3 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 shadow-sm border border-violet-100'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{
                        color: isActive ? '#6366f1' : 'var(--text-secondary)',
                        backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                        borderColor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.target.style.backgroundColor = 'var(--hover-bg)'
                          e.target.style.color = 'var(--text-primary)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.target.style.backgroundColor = 'transparent'
                          e.target.style.color = 'var(--text-secondary)'
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded-lg transition-colors ${
                          isActive ? 'text-violet-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`}>
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {isActive && (
                        <FiChevronRight className="h-4 w-4 text-violet-500" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 p-4 border-t backdrop-blur-sm"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-secondary)'
          }}
        >
          <div
            className="flex items-center justify-between p-3 rounded-xl border shadow-sm"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {currentUser?.name || 'User'}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                  {currentUser?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl transition-all duration-200 group"
              style={{
                color: 'var(--text-tertiary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                e.target.style.color = '#ef4444'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = 'var(--text-tertiary)'
              }}
              title="Logout"
            >
              <FiLogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </aside>


      <NotificationsMenu
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

    </>
  );
};

export default Sidebar;