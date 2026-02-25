import { Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Dashboard from './pages/dashboard/Dashboard'
import UserProfile from './pages/profile/UserProfile'
import UsersManagement from './pages/admin/users/UsersManagement'
import Reports from './pages/admin/reports/Reports'
import SystemSettings from './pages/admin/settings/SystemSettings'
import NotFound from './pages/NotFound'

const routes = (isAuthenticated) => [
  {
    path: '/',
    element: isAuthenticated ? <MainLayout /> : <Navigate to="/login" />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'profile', element: <UserProfile /> },
      // Admin routes
      { path: 'admin/users', element: <UsersManagement /> },
      { path: 'admin/reports', element: <Reports /> },
      { path: 'admin/settings', element: <SystemSettings /> },
      { path: '*', element: <NotFound /> }
    ]
  },
  {
    path: '/',
    element: !isAuthenticated ? <Navigate to="/login" /> : <Navigate to="/dashboard" />,
  },
  {
    path: '/login',
    element: !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
  },
  {
    path: '/register',
    element: !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
  },
  {
    path: '/forgot-password',
    element: !isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />
  },
  {
    path: '/reset-password',
    element: !isAuthenticated ? <ResetPassword /> : <Navigate to="/dashboard" />
  },
  {
    path: '*',
    element: <NotFound />
  }
]

export default routes