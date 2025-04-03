// src/components/layout/AppLayout.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FiMenu, FiX, FiSearch, FiPlus, FiSun, FiMoon, FiSettings,
  FiBell, FiChevronDown, FiChevronRight, FiLogOut, FiUser,
  FiHome, FiCheckSquare, FiFileText, FiCalendar,
  FiActivity, FiClock, FiCloud, FiGrid
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const AppLayout = ({ children }) => {
  // Layout state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true' || false
  );
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Feature state
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Refs for handling outside clicks
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Detect outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Save sidebar state in localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  // Focus search input when mobile search is shown
  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  // Get page title based on current route
  const getPageTitle = useCallback(() => {
    const { pathname } = location;
    if (pathname.includes('/dashboard')) return 'Dashboard';
    if (pathname.includes('/tasks')) return 'Tasks';
    if (pathname.includes('/notes')) return 'Notes';
    if (pathname.includes('/schedule')) return 'Schedule';
    if (pathname.includes('/activities')) return 'Activities';
    if (pathname.includes('/drive')) return 'Google Drive';
    if (pathname.includes('/weather')) return 'Weather';
    if (pathname.includes('/profile')) return 'Profile';
    if (pathname.includes('/settings')) return 'Settings';
    return 'Weid';
  }, [location]);

  // Cycle through themes: light -> dark -> system
  const handleThemeToggle = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    toggleTheme(themes[nextIndex]);
  };

  // Get theme icon based on current theme
  const getThemeIcon = useCallback(() => {
    switch (theme) {
      case 'dark':
        return { icon: <FiSun className="w-5 h-5" />, label: 'Light Mode' };
      case 'light':
        return { icon: <FiMoon className="w-5 h-5" />, label: 'Dark Mode' };
      default:
        return {
          icon: <FiSettings className="w-5 h-5" />,
          label: 'System Theme'
        };
    }
  }, [theme]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    console.log('Searching for:', searchQuery);
    // Future implementation: actual search functionality
    setShowMobileSearch(false);
  };

  // Navigation menu configuration
  const menuItems = [
    {
      title: 'Main',
      items: [
        { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
        { path: '/tasks', icon: <FiCheckSquare />, label: 'Tasks' },
        { path: '/notes', icon: <FiFileText />, label: 'Notes' },
        { path: '/schedule', icon: <FiCalendar />, label: 'Schedule' },
        { path: '/activities', icon: <FiActivity />, label: 'Activities' },
      ]
    },
    {
      title: 'Tools',
      items: [
        { path: '/drive', icon: <FiGrid />, label: 'Google Drive' },
        { path: '/weather', icon: <FiCloud />, label: 'Weather' },
      ]
    },
    {
      title: 'Personal',
      items: [
        { path: '/profile', icon: <FiUser />, label: 'Profile' },
        { path: '/settings', icon: <FiSettings />, label: 'Settings' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 fixed top-0 left-0 right-0">
        {/* Logo Section - always visible */}
        <div className={`flex items-center h-full px-4 border-r border-gray-200 dark:border-gray-700 ${sidebarCollapsed ? 'w-16 justify-center' : 'w-64'}`}>
          <Link to="/dashboard" className="flex items-center">
            {!sidebarCollapsed && (
              <span className="text-xl font-semibold text-violet-600 dark:text-violet-400">Weid</span>
            )}
            {sidebarCollapsed && (
              <span className="text-xl font-semibold text-violet-600 dark:text-violet-400">W</span>
            )}
          </Link>

          {/* Desktop sidebar collapse button */}
          {!isMobile && (
            <button
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-1 ml-auto rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <FiChevronRight /> : <FiChevronDown />}
            </button>
          )}
        </div>

        {/* Header Content */}
        <div className="flex-1 flex items-center justify-between h-full px-4">
          {/* Left Header Section */}
          <div className="flex items-center">
            {/* Mobile menu toggle */}
            {isMobile && (
              <button
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            )}

            <h1 className="text-lg font-medium text-gray-800 dark:text-white">
              {getPageTitle()}
            </h1>
          </div>

          {/* Center: Search (desktop only) */}
          {!isMobile && (
            <form onSubmit={handleSearch} className="max-w-md w-full mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                  <FiSearch />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    onClick={() => setSearchQuery('')}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            {isMobile && (
              <button
                aria-label="Search"
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={() => setShowMobileSearch(true)}
              >
                <FiSearch size={20} />
              </button>
            )}

            {/* Create Button */}
            <button
              aria-label="Create new item"
              className="hidden sm:flex items-center space-x-1 p-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-700 text-white"
              onClick={() => navigate('/tasks/new')}
            >
              <FiPlus size={18} />
              <span className="hidden md:inline">Create</span>
            </button>

            {/* Theme Toggle */}
            <button
              aria-label={getThemeIcon().label}
              title={getThemeIcon().label}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              onClick={handleThemeToggle}
            >
              {getThemeIcon().icon}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                aria-label="Notifications"
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FiBell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-block w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                    <button
                      className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                      onClick={() => setNotificationCount(0)}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {/* Sample notifications */}
                    <div
                      className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/tasks');
                      }}
                    >
                      <div className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">New task assigned:</span> Update documentation
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">10 minutes ago</div>
                    </div>
                    <div
                      className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/activities');
                      }}
                    >
                      <div className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">Task completed:</span> Website redesign
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 hour ago</div>
                    </div>
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">Reminder:</span> Team meeting at 3pm
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</div>
                    </div>
                  </div>
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                    <button
                      className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/activities');
                      }}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                aria-label="User menu"
                className="flex items-center space-x-1 p-1 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white uppercase">
                  {currentUser?.name?.charAt(0) || 'W'}
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-medium text-gray-900 dark:text-white">{currentUser?.name || 'User'}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.email || 'user@example.com'}</div>
                  </div>
                  <div className="py-1">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/profile');
                      }}
                    >
                      <FiUser className="mr-3 text-gray-500 dark:text-gray-400" />
                      Profile
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                    >
                      <FiSettings className="mr-3 text-gray-500 dark:text-gray-400" />
                      Settings
                    </button>
                  </div>
                  <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleLogout}
                    >
                      <FiLogOut className="mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 bottom-0 left-0 z-10 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          } ${isMobile ? (mobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}
        >
          <div className="h-full flex flex-col">
            {/* Menu Items */}
            <nav className="flex-1 px-2 py-4 overflow-y-auto">
              {menuItems.map((section, idx) => (
                <div key={idx} className="mb-6">
                  {!sidebarCollapsed && (
                    <h2 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </h2>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item, itemIdx) => (
                      <Link
                        key={itemIdx}
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                          location.pathname.includes(item.path)
                            ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        } ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                        onClick={() => isMobile && setMobileOpen(false)}
                      >
                        <span className={`h-5 w-5 ${location.pathname.includes(item.path) ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {item.icon}
                        </span>
                        {!sidebarCollapsed && (
                          <span className="ml-3 font-medium">{item.label}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            {/* User Info - Only show when sidebar is expanded */}
            {!sidebarCollapsed && !isMobile && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white uppercase">
                  {currentUser?.name?.charAt(0) || 'W'}
                </div>
                <div className="ml-3 flex-1 truncate">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{currentUser?.name || 'User'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser?.email || 'user@example.com'}</div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile backdrop */}
        {isMobile && mobileOpen && (
          <div
            className="fixed inset-0 z-0 bg-gray-900/50"
            onClick={() => setMobileOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isMobile ? 'pl-0' : (sidebarCollapsed ? 'pl-16' : 'pl-64')
          }`}
        >
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
          {/* Footer */}
          <footer className="mt-auto py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Weid Management. All rights reserved.
          </footer>
        </main>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4">
          <div className="flex items-center mb-4">
            <button
              className="mr-2 text-gray-500 dark:text-gray-400"
              onClick={() => setShowMobileSearch(false)}
            >
              <FiX size={24} />
            </button>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Search</h2>
          </div>
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              <FiSearch />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                onClick={() => setSearchQuery('')}
              >
                <FiX />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default AppLayout;