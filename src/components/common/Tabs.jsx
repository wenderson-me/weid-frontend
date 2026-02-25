const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b" style={{ borderColor: 'var(--border-color)' }}>
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                transition-colors
                ${isActive
                  ? 'border-current'
                  : 'border-transparent hover:border-current'
                }
              `}
              style={{
                color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
              }}
            >
              {Icon && <Icon className="w-5 h-5" />}
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default Tabs