import { FiUsers } from 'react-icons/fi'

const UsersManagement = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
        <FiUsers className="w-8 h-8" />
        Users Management
      </h1>
      <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
        Este é um teste simples para ver se o componente renderiza.
      </p>
    </div>
  )
}

export default UsersManagement
