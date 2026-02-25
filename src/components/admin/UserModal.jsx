import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'
import UserForm from './UserForm'

const UserModal = ({ isOpen, onClose, onSubmit, initialUser, isLoading, mode = 'create' }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose, isLoading])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const portalRoot = typeof document !== 'undefined' ? document.body : null
  if (!portalRoot) return null

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={!isLoading ? onClose : undefined}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="absolute inset-0"></div>
        </div>

        {/* Modal panel */}
        <div
          className="inline-block align-bottom rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 sm:px-6 flex justify-between items-center border-b"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <h3
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {mode === 'edit' ? 'Edit User' : 'Create New User'}
            </h3>
            {!isLoading && (
              <button
                type="button"
                className="rounded-md transition-colors"
                onClick={onClose}
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="sr-only">Close</span>
                <FiX className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Content */}
          <div
            className="px-6 py-6 sm:p-6"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <UserForm
              initialUser={initialUser}
              onSubmit={onSubmit}
              isLoading={isLoading}
              mode={mode}
            />
          </div>
        </div>
      </div>
    </div>,
    portalRoot
  )
}

export default UserModal
