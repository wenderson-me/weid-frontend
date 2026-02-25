import { FiHome, FiUser, FiUsers, FiBarChart2, FiSettings } from 'react-icons/fi';

export const navigationConfig = [
  {
    title: 'Main',
    items: [
      {
        name: 'Dashboard',
        icon: FiHome,
        path: '/dashboard',
        description: 'Overview and statistics',
        roles: ['admin', 'manager', 'user'] // Available to all
      }
    ]
  },
  {
    title: 'Management',
    roles: ['admin', 'manager'], // Only for privileged users
    items: [
      {
        name: 'Users',
        icon: FiUsers,
        path: '/admin/users',
        description: 'Manage users and permissions',
        roles: ['admin', 'manager']
      },
      {
        name: 'Reports',
        icon: FiBarChart2,
        path: '/admin/reports',
        description: 'View system reports',
        roles: ['admin', 'manager']
      }
    ]
  },
  {
    title: 'System',
    roles: ['admin'], // Only for admins
    items: [
      {
        name: 'Settings',
        icon: FiSettings,
        path: '/admin/settings',
        description: 'System configuration',
        roles: ['admin']
      }
    ]
  },
  {
    title: 'Account',
    items: [
      {
        name: 'Profile',
        icon: FiUser,
        path: '/profile',
        description: 'Manage your account and security',
        roles: ['admin', 'manager', 'user'] // Available to all
      }
    ]
  }
];

// Breadcrumb configuration
export const getBreadcrumbs = (pathname) => {
  const paths = pathname.split('/').filter(Boolean);

  const breadcrumbMap = {
    'dashboard': { name: 'Dashboard', path: '/dashboard' },
    'profile': { name: 'Profile', path: '/profile' },
    'admin': { name: 'Admin', path: '/admin' },
    'users': { name: 'Users', path: '/admin/users' },
    'reports': { name: 'Reports', path: '/admin/reports' },
    'settings': { name: 'Settings', path: '/admin/settings' },
  };

  const breadcrumbs = [{ name: 'Home', path: '/' }];

  paths.forEach((path, index) => {
    const currentPath = '/' + paths.slice(0, index + 1).join('/');
    if (breadcrumbMap[path]) {
      breadcrumbs.push({
        name: breadcrumbMap[path].name,
        path: currentPath
      });
    }
  });

  return breadcrumbs;
};
