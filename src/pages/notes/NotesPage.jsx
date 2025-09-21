import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNotes } from '../../hooks/useNotes'
import { useTheme } from '../../hooks/useTheme'
import {
  FiPlus,
  FiGrid,
  FiList,
  FiRefreshCw,
  FiAlertCircle,
  FiInfo,
  FiX,
  FiFilter,
  FiStar,
  FiSearch,
  FiChevronDown,
  FiCalendar,
  FiChevronUp,
  FiClock,
  FiBookmark
} from 'react-icons/fi'
import NoteCard from '../../components/notes/NoteCard'
import NotesFilter from '../../components/notes/NotesFilter'
import NoteModal from '../../components/notes/NoteModal'

const NotesPage = () => {
  const location = useLocation()
  const { notes, loading, error, fetchNotes, clearError } = useNotes()
  const { theme } = useTheme()
  const [viewMode, setViewMode] = useState(localStorage.getItem('notesViewMode') || 'grid')
  const [selectedNote, setSelectedNote] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [pinnedNotesOpen, setPinnedNotesOpen] = useState(true)
  const [otherNotesOpen, setOtherNotesOpen] = useState(true)

  const pinnedNotes = notes.filter(note => note.isPinned)
  const otherNotes = notes.filter(note => !note.isPinned)

  const filteredPinnedNotes = pinnedNotes.filter(note =>
    searchTerm ?
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    : true
  )

  const filteredOtherNotes = otherNotes.filter(note =>
    searchTerm ?
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    : true
  )

  const sortNotes = (notesToSort) => {
    return [...notesToSort].sort((a, b) => {
      let valueA, valueB;

      if (sortBy === 'title') {
        valueA = a.title?.toLowerCase();
        valueB = b.title?.toLowerCase();
      } else if (sortBy === 'createdAt') {
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
      } else {
        valueA = new Date(a.updatedAt).getTime();
        valueB = new Date(b.updatedAt).getTime();
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

  const sortedPinnedNotes = sortNotes(filteredPinnedNotes);
  const sortedOtherNotes = sortNotes(filteredOtherNotes);

  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        message: location.state.message,
        type: location.state.type || 'info'
      })

      window.history.replaceState({}, document.title)

      const timer = setTimeout(() => {
        setNotification(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [location.state])

  useEffect(() => {
    localStorage.setItem('notesViewMode', viewMode)
  }, [viewMode])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const handleNoteSelect = useCallback((note) => {
    setSelectedNote(note)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedNote(null)
    fetchNotes()
  }, [fetchNotes])

  const dismissNotification = () => {
    setNotification(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notas</h1>
          <p className="text-gray-600">
            Organize suas ideias e informações importantes
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="bg-white border border-gray-200 p-1 rounded-lg flex shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-violet-100 text-violet-700' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Visualização em grade"
              aria-label="Visualização em grade"
              aria-pressed={viewMode === 'grid'}
            >
              <FiGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-violet-100 text-violet-700' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Visualização em lista"
              aria-label="Visualização em lista"
              aria-pressed={viewMode === 'list'}
            >
              <FiList className="h-5 w-5" />
            </button>
          </div>

          <Link
            to="/notes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <FiPlus className="mr-2" /> Nova Nota
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar notas..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm('')}
            >
              <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`inline-flex items-center px-4 py-2 border ${filtersOpen ? 'bg-violet-600 text-white border-transparent' : 'border-gray-300 text-gray-700 bg-white'} rounded-lg shadow-sm hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <FiFilter className="mr-2" /> Filtros
        </button>

        <div className="relative">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm rounded-lg"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setSortOrder('desc');
            }}
          >
            <option value="updatedAt">Ordenar por: Mais recentes</option>
            <option value="createdAt">Ordenar por: Data de criação</option>
            <option value="title">Ordenar por: Título</option>
          </select>
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <FiChevronUp className="h-5 w-5 text-gray-400" /> : <FiChevronDown className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
      </div>

      {filtersOpen && <NotesFilter />}

      {notification && (
        <div className={`rounded-xl p-4 ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' :
          notification.type === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${
              notification.type === 'success' ? 'text-green-600' :
              notification.type === 'error' ? 'text-red-600' :
              'text-blue-600'
            }`}>
              {notification.type === 'success' ? '✓' :
               notification.type === 'error' ? <FiAlertCircle className="h-5 w-5" /> :
               <FiInfo className="h-5 w-5" />}
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className={`text-sm ${
                notification.type === 'success' ? 'text-green-700' :
                notification.type === 'error' ? 'text-red-700' :
                'text-blue-700'
              }`}>
                {notification.message}
              </p>
              <button
                type="button"
                onClick={dismissNotification}
                className={`ml-3 -mr-1 flex-shrink-0 inline-flex p-1 rounded-md ${
                  notification.type === 'success' ? 'text-green-500 hover:bg-green-100' :
                  notification.type === 'error' ? 'text-red-500 hover:bg-red-100' :
                  'text-blue-500 hover:bg-blue-100'
                }`}
              >
                <span className="sr-only">Fechar</span>
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <div className="ml-1">
              <p className="text-sm text-red-700 font-medium">{error}</p>
              <button
                onClick={() => {
                  clearError();
                  fetchNotes();
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
              >
                <FiRefreshCw className="mr-1 h-4 w-4" /> Tentar novamente
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-violet-500 rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-500">Carregando notas...</p>
        </div>
      ) : notes.length > 0 ? (
        <div className="space-y-6">
          {sortedPinnedNotes.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex justify-between items-center cursor-pointer"
                   onClick={() => setPinnedNotesOpen(!pinnedNotesOpen)}>
                <div className="flex items-center">
                  <FiStar className="text-amber-500 mr-2" />
                  <h3 className="font-medium text-gray-900">Notas Fixadas</h3>
                  <span className="ml-2 text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
                    {sortedPinnedNotes.length}
                  </span>
                </div>
                <button className="text-gray-500">
                  {pinnedNotesOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>

              {pinnedNotesOpen && (
                <div className={viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
                  : "divide-y divide-gray-100"
                }>
                  {sortedPinnedNotes.map((note) => (
                    <div key={note._id} className={viewMode === 'list' ? "py-2" : ""}>
                      <NoteCard
                        note={note}
                        onEdit={handleNoteSelect}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {sortedOtherNotes.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                   onClick={() => setOtherNotesOpen(!otherNotesOpen)}>
                <div className="flex items-center">
                  <FiBookmark className="text-gray-500 mr-2" />
                  <h3 className="font-medium text-gray-900">Outras Notas</h3>
                  <span className="ml-2 text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
                    {sortedOtherNotes.length}
                  </span>
                </div>
                <button className="text-gray-500">
                  {otherNotesOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>

              {otherNotesOpen && (
                <div className={viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
                  : "divide-y divide-gray-100"
                }>
                  {sortedOtherNotes.map((note) => (
                    <div key={note._id} className={viewMode === 'list' ? "py-2" : ""}>
                      <NoteCard
                        note={note}
                        onEdit={handleNoteSelect}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {filteredPinnedNotes.length === 0 && filteredOtherNotes.length === 0 && searchTerm && (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200 shadow-sm">
              <FiSearch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma nota encontrada</h3>
              <p className="text-gray-600 mb-4">
                Não encontramos nenhuma nota correspondente a "{searchTerm}".
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <FiX className="mr-2 h-4 w-4" /> Limpar pesquisa
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-violet-100 mb-4">
            <FiBookmark className="h-8 w-8 text-violet-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma nota encontrada</h3>
          <p className="text-gray-600 mb-6">
            {error ? "Tente ajustar seus filtros ou tente novamente mais tarde." : "Comece criando sua primeira nota."}
          </p>
          <div className="flex justify-center space-x-4">
            {error ? (
              <button
                onClick={() => {
                  clearError();
                  fetchNotes();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                <FiRefreshCw className="mr-2" /> Tentar novamente
              </button>
            ) : (
              <Link to="/notes/new" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
                <FiPlus className="mr-2" /> Criar Nova Nota
              </Link>
            )}
          </div>
        </div>
      )}

      {selectedNote && (
        <NoteModal
          note={selectedNote}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default NotesPage