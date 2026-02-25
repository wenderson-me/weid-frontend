import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const [title, setTitle] = useState('')

  useEffect(() => {
    const pathname = location.pathname

    if (pathname.includes('/dashboard')) {
      setTitle('Dashboard')
    } else if (pathname.includes('/tasks')) {
      setTitle('Tasks')
    } else if (pathname.includes('/activities')) {
      setTitle('Activities')
    } else if (pathname.includes('/notes')) {
      setTitle('Notes')
    } else if (pathname.includes('/schedule')) {
      setTitle('Schedule')
    } else if (pathname.includes('/products')) {
      setTitle('Products')
    } else if (pathname.includes('/settings')) {
      setTitle('Settings')
    } else if (pathname.includes('/profile')) {
      setTitle('Profile')
    } else {
      setTitle('Weid')
    }

    if (window.innerWidth <= 1024) {
      setSidebarOpen(false)
    }
  }, [location])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />


        <div className="flex flex-col flex-1 overflow-hidden">
           {/* Main Content
          <Header
            title={title}
            toggleSidebar={toggleSidebar}
          />
           */}


          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
  )
}

export default MainLayout