import { useRoutes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import routes from './routes'

function App() {
  const { isAuthenticated, loading } = useAuth()
  const routing = useRoutes(routes(isAuthenticated))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return routing
}

export default App