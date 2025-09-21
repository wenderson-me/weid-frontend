import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FiX, FiEdit2, FiTag, FiStar } from 'react-icons/fi'
import NoteForm from './NoteForm'
import { useNotes } from '../../hooks/useNotes'
import { useTheme } from '../../hooks/useTheme'

const categoryColors = {
  general: 'from-blue-100 to-purple-100',
  personal: 'from-pink-100 to-red-100',
  work: 'from-cyan-100 to-blue-100',
  important: 'from-yellow-100 to-orange-100',
  idea: 'from-green-100 to-teal-100'
}

const NoteModal = ({ note, isOpen, onClose, isEditMode = false }) => {
  const { pinNote, unpinNote } = useNotes()
  const { theme } = useTheme()
  const [isEditing, setIsEditing] = useState(isEditMode)
  const [localNote, setLocalNote] = useState(note)

  useEffect(() => {
    setLocalNote(note)
    setIsEditing(isEditMode)
  }, [note, isEditMode])

  if (!isOpen) return null

  const handlePinToggle = async () => {
    try {
      let updatedNote
      if (localNote.isPinned) {
        updatedNote = await unpinNote(localNote._id)
      } else {
        updatedNote = await pinNote(localNote._id)
      }
      setLocalNote(updatedNote)
    } catch (error) {
      console.error('Failed to toggle pin status:', error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal */}
        <div
          className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
        >
          {isEditing ? (
            <>
              {/* Edit mode header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {localNote?._id ? 'Edit Note' : 'Create New Note'}
                </h3>
                <button
                  type="button"
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              {/* Note form */}
              <div className="px-4 py-5 sm:p-6">
                <NoteForm
                  note={localNote}
                  onClose={() => {
                    setIsEditing(false)
                    if (!localNote?._id) {
                      onClose()
                    }
                  }}
                  isModal={true}
                />
              </div>
            </>
          ) : (
            <>
              {/* View mode header */}
              <div
                className={`px-4 py-3 border-b border-gray-200 sm:px-6 flex justify-between items-center
                  bg-gradient-to-r ${categoryColors[localNote?.category] || 'from-gray-50 to-gray-100'}`}
              >
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {localNote?.title}
                  </h3>
                  {localNote?.isPinned && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <FiStar className="mr-1" />
                      Pinned
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="rounded-md text-gray-500 hover:text-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    onClick={() => setIsEditing(true)}
                  >
                    <span className="sr-only">Edit</span>
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Note content */}
              <div className="px-4 py-5 sm:p-6">
                <div
                  className="prose max-w-none mb-6 whitespace-pre-line text-gray-700"
                >
                  {localNote?.content}
                </div>

                {/* Tags */}
                {localNote?.tags && localNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {localNote.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        <FiTag className="mr-1 text-gray-500" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Note metadata */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Category</dt>
                      <dd className="mt-1 text-sm text-gray-900 capitalize">{localNote?.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(localNote?.createdAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Last updated</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(localNote?.updatedAt)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="btn btn-outline ml-3"
                  onClick={handlePinToggle}
                >
                  <FiStar className="mr-1" />
                  {localNote?.isPinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary ml-3"
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit2 className="mr-1" /> Edit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default NoteModal