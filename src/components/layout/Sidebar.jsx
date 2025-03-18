import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiCheckSquare, FiActivity, FiCalendar, FiFileText,
  FiUser, FiSettings, FiLogOut, FiMenu, FiX
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme'

const Sidebar = ({ open, toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme()

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

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        {/* Close button - mobile only */}
        <button
          className="absolute top-4 right-4 p-1 text-gray-500 lg:hidden"
          onClick={toggleSidebar}
        >
          <FiX className="h-6 w-6" />
        </button>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-violet-600">Weid</h1>
          <p className="text-sm text-gray-500">Management System</p>
        </div>

        {/* Sidebar Content */}
        <div className="p-4 h-[calc(100%-180px)] overflow-y-auto">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h2>
              <nav className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    to={item.path}
                    className={`nav-link ${
                      location.pathname.includes(item.path) ? 'active' : ''
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* User profile and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-medium">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                  {currentUser?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                  {currentUser?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
              title="Logout"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;