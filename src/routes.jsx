import { Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Dashboard from './pages/dashboard/Dashboard'
import TaskBoard from './pages/tasks/TaskBoard'
import TaskDetail from './pages/tasks/TaskDetail'
import TaskEdit from './components/tasks/TaskEdit'
import NotePage from './pages/notes/NotesPage'
import NotesDetail from './components/notes/NotesDetail'
import NoteForm from './components/notes/NoteForm'
import UserProfile from './pages/profile/UserProfile'
import SchedulePage from './pages/schedule/SchedulePage'
import ActivitiesPage from './pages/activities/ActivitiesPage'
import NotFound from './pages/NotFound'

const routes = (isAuthenticated) => [
  {
    path: '/',
    element: isAuthenticated ? <MainLayout /> : <Navigate to="/login" />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'tasks', element: <TaskBoard /> },
      { path: 'tasks/new', element: <TaskEdit /> },
      { path: 'tasks/:id', element: <TaskDetail /> },
      { path: 'tasks/:id/edit', element: <TaskEdit /> },
      { path: 'notes', element: <NotePage /> },
      { path: 'notes/new', element: <NoteForm /> },
      { path: 'notes/:id', element: <NotesDetail /> },
      { path: 'notes/:id/edit', element: <NoteForm /> },
      { path: 'schedule', element: <SchedulePage /> },
      { path: 'activities', element: <ActivitiesPage /> },
      { path: 'profile', element: <UserProfile /> },
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