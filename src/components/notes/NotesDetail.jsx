import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiArrowLeft, FiEdit2, FiTrash2, FiCalendar, FiTag, FiStar, FiAlertCircle, FiLock } from 'react-icons/fi'
import { useNotes } from '../../hooks/useNotes'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal'

const CATEGORY_COLORS = {
  'general': 'bg-gray-100 text-gray-800',
  'personal': 'bg-green-100 text-green-800',
  'work': 'bg-blue-100 text-blue-800',
  'important': 'bg-amber-100 text-amber-800',
  'idea': 'bg-purple-100 text-purple-800'
}

const NotesDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getNoteById, deleteNote, pinNote, unpinNote } = useNotes()
  const { theme } = useTheme()

  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPinning, setIsPinning] = useState(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchNote = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const noteData = await getNoteById(id)
      setNote(noteData)
    } catch (err) {
      console.error("Error fetching note:", err)
      if (err.response?.status === 403) {
        setError("You don't have permission to view this note.")
      } else if (err.response?.status === 404) {
        setError("Note not found")
      } else {
        setError(err.message || 'Failed to load note')
      }
    } finally {
      setLoading(false)
    }
  }, [id, getNoteById])

  useEffect(() => {
    let isMounted = true;

    const loadNote = async () => {
      try {
        setLoading(true)
        const noteData = await getNoteById(id)
        if (isMounted) {
          setNote(noteData)
          setError(null)
        }
      } catch (err) {
        console.error("Error fetching note:", err)
        if (isMounted) {
          if (err.response?.status === 403) {
            setError("You don't have permission to view this note. Notes are only visible to their owners.")
          } else if (err.response?.status === 404) {
            setError("Note not found")
          } else {
            setError(err.message || 'Failed to load note')
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadNote()

    return () => {
      isMounted = false
    }
  }, [id, getNoteById])

  const formatDate = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const openDeleteModal = () => {
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      await deleteNote(id)
      navigate('/notes', {
        state: {
          message: 'Note deleted successfully',
          type: 'success'
        }
      })
    } catch (error) {
      console.error('Failed to delete note:', error)
      setError(error.message || 'Failed to delete note')
      setIsDeleting(false)
      setDeleteModalOpen(false)
    }
  }

  const handlePinToggle = async () => {
    if (!note) return;

    try {
      setIsPinning(true)
      let updatedNote;

      if (note.isPinned) {
        updatedNote = await unpinNote(id);
      } else {
        updatedNote = await pinNote(id);
      }

      setNote(updatedNote);
      setIsPinning(false);
    } catch (err) {
      console.error(`Error toggling pin status for note ${id}:`, err)
      setError(err.message || 'Failed to update pin status');
      setIsPinning(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-violet-500 rounded-full border-t-transparent animate-spin mb-4"></div>
        <p className="text-gray-500">Loading note...</p>
      </div>
    )
  }

  if (error && error.includes("permission")) {
    return (
      <div>
        <div className="mb-6">
          <Link
            to="/notes"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="mr-1" /> Back to Notes
          </Link>
        </div>

        <div className="text-center py-12 card">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-yellow-100 mb-4">
            <FiLock className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Restricted Access</h3>
          <p className="text-gray-600 mb-2 max-w-md mx-auto">
            You don't have permission to view this note. Only the note owner can view it.
          </p>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            You are logged in as: {user?.email}
          </p>
          <Link
            to="/notes"
            className="btn btn-primary"
          >
            View my notes
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="mb-6">
          <Link
            to="/notes"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="mr-1" /> Back to Notes
          </Link>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-xl">
          <div className="flex items-start">
            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
              <button
                onClick={fetchNote}
                className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div>
        <div className="mb-6">
          <Link
            to="/notes"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="mr-1" /> Back to Notes
          </Link>
        </div>

        <div className="text-center py-12 card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Note not found</h3>
          <p className="text-gray-600 mb-6">The note you're looking for doesn't exist or has been deleted.</p>
          <Link
            to="/notes/new"
            className="btn btn-primary"
          >
            Create New Note
          </Link>
        </div>
      </div>
    )
  }

  const categoryColor = CATEGORY_COLORS[note.category] || 'bg-gray-100 text-gray-800';

  return (
    <div>
      {/* Back button and actions */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/notes"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <FiArrowLeft className="mr-1" /> Back to Notes
        </Link>

        <div className="flex space-x-2">
          <button
            onClick={handlePinToggle}
            disabled={isPinning}
            className={`btn btn-outline ${isPinning ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            <FiStar className={`mr-1 ${note.isPinned ? 'text-yellow-500' : ''}`} />
            {isPinning ? 'Updating...' : (note.isPinned ? 'Unpin' : 'Pin')}
          </button>

          <Link
            to={`/notes/${id}/edit`}
            className="btn btn-outline"
          >
            <FiEdit2 className="mr-1" /> Edit
          </Link>

          <button
            onClick={openDeleteModal}
            className="btn btn-outline text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <FiTrash2 className="mr-1" /> Delete
          </button>
        </div>
      </div>

      {/* Note content */}
      <div className="card overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>

            {note.category && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryColor}`}>
                {note.category}
              </span>
            )}
          </div>

          {note.isPinned && (
            <div className="mb-4 flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <FiStar className="mr-1" /> Pinned
              </span>
            </div>
          )}

          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-line text-gray-700">{note.content}</p>
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <FiTag className="mr-1" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500 border-t border-gray-200 pt-4">
            <FiCalendar className="mr-1" />
            <span>
              {note.updatedAt !== note.createdAt ? (
                <span>Updated on {formatDate(note.updatedAt)}</span>
              ) : (
                <span>Created on {formatDate(note.createdAt)}</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        itemName={note.title}
        itemType="note"
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default NotesDetail