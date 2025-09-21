import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiEdit2,
  FiTrash2,
  FiTag,
  FiMoreVertical,
  FiStar,
  FiClock,
  FiCalendar,
  FiEye
} from 'react-icons/fi'
import { useNotes } from '../../hooks/useNotes'
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal'

const categoryConfig = {
  general: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: 'bg-indigo-100 text-indigo-700',
    hover: 'hover:border-indigo-300',
    accent: 'bg-indigo-500'
  },
  personal: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: 'bg-rose-100 text-rose-700',
    hover: 'hover:border-rose-300',
    accent: 'bg-rose-500'
  },
  work: {
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    icon: 'bg-sky-100 text-sky-700',
    hover: 'hover:border-sky-300',
    accent: 'bg-sky-500'
  },
  important: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'bg-amber-100 text-amber-700',
    hover: 'hover:border-amber-300',
    accent: 'bg-amber-500'
  },
  idea: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'bg-emerald-100 text-emerald-700',
    hover: 'hover:border-emerald-300',
    accent: 'bg-emerald-500'
  }
}

const defaultCategoryStyle = {
  bg: 'bg-gray-50',
  border: 'border-gray-200',
  icon: 'bg-gray-100 text-gray-700',
  hover: 'hover:border-gray-300',
  accent: 'bg-gray-500'
}

const NoteCard = ({ note, onEdit }) => {
  const { pinNote, unpinNote, deleteNote } = useNotes()
  const [showOptions, setShowOptions] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPinning, setIsPinning] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const categoryStyle = categoryConfig[note.category] || defaultCategoryStyle

  const handlePinToggle = async () => {
    try {
      setIsPinning(true)
      if (note.isPinned) {
        await unpinNote(note._id)
      } else {
        await pinNote(note._id)
      }
    } catch (error) {
      console.error('Failed to toggle pin status:', error)
    } finally {
      setIsPinning(false)
      setShowOptions(false)
    }
  }

  const openDeleteModal = () => {
    setShowOptions(false)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      await deleteNote(note._id)
    } catch (error) {
      console.error('Failed to delete note:', error)
      setIsDeleting(false)
      setDeleteModalOpen(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const truncateContent = (text, maxLength = 120) => {
    if (!text) return ''

    if (text.length <= maxLength) return text

    const firstLineBreak = text.indexOf('\n')

    if (firstLineBreak > 0 && firstLineBreak < maxLength) {
      return text.substring(0, firstLineBreak) + '...'
    }

    const lastSpace = text.lastIndexOf(' ', maxLength)
    if (lastSpace > 0) {
      return text.substring(0, lastSpace) + '...'
    }

    return text.substring(0, maxLength) + '...'
  }

  const getTimeAgo = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return 'just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHour < 24) return `${diffHour}h ago`
    if (diffDay < 7) return `${diffDay}d ago`

    return formatDate(dateString)
  }

  return (
    <div
      className={`relative rounded-xl border ${categoryStyle.border} shadow-sm transition-all duration-200
      ${isHovered ? 'shadow-md ' + categoryStyle.hover : ''} ${categoryStyle.bg}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Indicador de fixado */}
      {note.isPinned && (
        <div className="absolute -top-1.5 -right-1.5 z-10">
          <div className="h-7 w-7 rounded-full bg-amber-400 flex items-center justify-center shadow-sm">
            <FiStar className="text-white w-4 h-4" />
          </div>
        </div>
      )}

      {/* Barra superior com categoria */}
      <div className={`h-1.5 w-full ${categoryStyle.accent} rounded-t-xl`}></div>

      <div className="p-4">
        {/* Cabeçalho do card */}
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className={`mr-2 w-8 h-8 rounded-full ${categoryStyle.icon} flex items-center justify-center`}>
              <span className="text-xs font-semibold uppercase">{note.category?.charAt(0) || 'N'}</span>
            </div>
            <h3 className="font-medium text-gray-900 text-lg line-clamp-1">{note.title}</h3>
          </div>

          {/* Menu de opções */}
          <div className="relative">
            <button
              type="button"
              className={`text-gray-500 hover:text-gray-700 rounded-full p-1.5 ${isHovered ? 'opacity-100' : 'opacity-70'} hover:bg-gray-100`}
              onClick={() => setShowOptions(!showOptions)}
              aria-label="Opções da nota"
            >
              <FiMoreVertical className="h-5 w-5" />
            </button>

            {showOptions && (
              <div className="absolute right-0 z-10 mt-1 w-44 bg-white rounded-xl shadow-lg py-1 border border-gray-200">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    setShowOptions(false)
                    onEdit(note)
                  }}
                >
                  <FiEdit2 className="mr-2 h-4 w-4" /> Editar
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={handlePinToggle}
                  disabled={isPinning}
                >
                  <FiStar className={`mr-2 h-4 w-4 ${note.isPinned ? 'text-amber-400' : ''}`} />
                  {note.isPinned ? 'Remover fixação' : 'Fixar nota'}
                </button>
                <Link
                  to={`/notes/${note._id}`}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <FiEye className="mr-2 h-4 w-4" /> Visualizar
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  onClick={openDeleteModal}
                >
                  <FiTrash2 className="mr-2 h-4 w-4" /> Excluir
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo da nota */}
        <div className="mt-3 mb-3">
          <p className="text-gray-600 text-sm line-clamp-3 min-h-[3rem]">
            {truncateContent(note.content)}
          </p>
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200"
              >
                <FiTag className="mr-1 h-3 w-3 text-gray-500" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Rodapé com data e links rápidos */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
          {/* Data de atualização */}
          <div className="flex items-center text-xs text-gray-500" title={formatDate(note.updatedAt)}>
            <FiClock className="mr-1 h-3 w-3" />
            <span>{getTimeAgo(note.updatedAt)}</span>
          </div>

          {/* Botões de ação rápida */}
          <div className="flex space-x-1.5">
            <button
              onClick={handlePinToggle}
              disabled={isPinning}
              className={`p-1.5 rounded-lg transition-colors ${note.isPinned ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
              title={note.isPinned ? "Remover fixação" : "Fixar nota"}
            >
              <FiStar className="h-4 w-4" />
            </button>

            <button
              onClick={() => onEdit(note)}
              className="p-1.5 rounded-lg transition-colors text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              title="Editar nota"
            >
              <FiEdit2 className="h-4 w-4" />
            </button>

            <Link
              to={`/notes/${note._id}`}
              className="p-1.5 rounded-lg transition-colors text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              title="Ver detalhes"
            >
              <FiEye className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Excluir nota"
        message="Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita."
        itemName={note.title}
        itemType="nota"
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default NoteCard