// src/routes.jsx
import { Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import TaskBoard from './pages/tasks/TaskBoard';
import TaskDetail from './pages/tasks/TaskDetail';
import NotesPage from './pages/notes/NotesPage';
import SchedulePage from './pages/schedule/SchedulePage';
import ActivitiesPage from './pages/activities/ActivitiesPage';
import DrivePage from './pages/drive/DrivePage';
import DriveFilePage from './pages/drive/DriveFilePage';
import DriveCallbackPage from './pages/drive/DriveCallbackPage';
import UserProfile from './pages/profile/UserProfile';
import Weather from './pages/weather/WeatherPage';
import NotFound from './pages/NotFound';

const routes = (isAuthenticated) => [
  {
    path: '/',
    element: isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />,
  },
  {
    path: '/login',
    element: !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />,
  },
  {
    path: '/register',
    element: !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />,
  },
  {
    path: '/forgot-password',
    element: !isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />,
  },
  {
    path: '/reset-password',
    element: !isAuthenticated ? <ResetPassword /> : <Navigate to="/dashboard" />,
  },
  {
    path: '/drive/callback',
    element: isAuthenticated ? <DriveCallbackPage /> : <Navigate to="/login" />,
  },
  // Páginas protegidas com AppLayout
  {
    path: '/dashboard',
    element: isAuthenticated ? <AppLayout><Dashboard /></AppLayout> : <Navigate to="/login" />,
  },
  {
    path: '/tasks',
    element: isAuthenticated ? <AppLayout><TaskBoard /></AppLayout> : <Navigate to="/login" />,
  },
  {
    path: '/tasks/:id',
    element: isAuthenticated ? <AppLayout><TaskDetail /></AppLayout> : <Navigate to="/login" />,
  },
  {
    path: '/notes',
    element: isAuthenticated ? <AppLayout><NotesPage /></AppLayout> : <Navigate to="/login" />,
  },
  {
    path: '/schedule',
    element: isAuthenticated ? <AppLayout><SchedulePage /></AppLayout> : <Navigate to="/login" />,
  },
  {
    path: '/activities',
    element: isAuthenticated ? <AppLayout><ActivitiesPage /></AppLayout> : <Navigate to="/login" />,
  },
  {
    path: '/drive',
    element: isAuthenticated ? <AppLayout><DrivePage /></AppLayout> : <Navigate to="/login" />,
  },
  {
    path: '/drive/file/:fileId',
    element: isAuthenticated ? <AppLayout><DriveFilePage /></AppLayout> : <Navigate to="/login" />,
  },
  {
    path: '/weather',
    element: isAuthenticated ? <AppLayout><Weather /></AppLayout> : <Navigate to="/login" />,
  },
  {
    path: '/profile',
    element: isAuthenticated ? <AppLayout><UserProfile /></AppLayout> : <Navigate to="/login" />,
  },
  {
    path: '/settings',
    element: isAuthenticated ? <AppLayout><UserProfile /></AppLayout> : <Navigate to="/login" />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
];

export default routes;