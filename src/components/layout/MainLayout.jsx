import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Auto-close sidebar on mobile
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false)
    }
  }, [location])

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      // Mobile: toggle open/close
      setSidebarOpen(!sidebarOpen)
    } else {
      // Desktop: toggle collapse
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        collapsed={sidebarCollapsed}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header 
          toggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout