import { FiHome, FiUser } from 'react-icons/fi';

export const navigationConfig = [
  {
    title: 'Main',
    items: [
      {
        name: 'Dashboard',
        icon: FiHome,
        path: '/dashboard',
        description: 'Overview and statistics'
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
        description: 'Manage your account and security'
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
