import { useRoutes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import routes from './routes'
import { ShadcnProvider } from './components/ui/shadcn-provider';
import './styles/shadcn-theme.css'; // O CSS do tema que criamos


function App() {
  const { isAuthenticated, loading } = useAuth()
  const routing = useRoutes(routes(isAuthenticated))

  return (
    <ShadcnProvider>
      {routing}
    </ShadcnProvider>
  );
}

export default App