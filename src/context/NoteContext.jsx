import { createContext, useState, useCallback, useRef, useEffect } from 'react'
import noteService from '../services/noteService'
import { useAuth } from '../hooks/useAuth'

const NoteContext = createContext(null)

export const NoteProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    isPinned: null,
    tags: [],
    page: 1,
    limit: 10
  })

  const fetchInProgress = useRef(false)

  useEffect(() => {
    return () => {
      fetchInProgress.current = false
    }
  }, [])

  const fetchNotes = useCallback(async (customFilters = null) => {
    if (fetchInProgress.current || !isAuthenticated) return null

    try {
      fetchInProgress.current = true
      setLoading(true)
      setError(null)

      const filtersToUse = customFilters || filters

      const cleanFilters = { ...filtersToUse }

      if (!cleanFilters.search) delete cleanFilters.search
      if (!cleanFilters.category) delete cleanFilters.category
      if (cleanFilters.isPinned === null) delete cleanFilters.isPinned
      if (!cleanFilters.tags || cleanFilters.tags.length === 0) delete cleanFilters.tags


      const response = await noteService.getNotes(cleanFilters)

      setNotes(response.notes || [])

      return response
    } catch (err) {
      console.error("Erro ao buscar notas:", err)
      setError(err.message || 'Falha ao buscar notas')
      return null
    } finally {
      setLoading(false)
      fetchInProgress.current = false
    }
  }, [isAuthenticated, filters])

  const updateFilters = useCallback((newFilters, shouldFetch = false) => {
    setFilters(prev => {
      const updated = {
        ...prev,
        ...newFilters
      }

      if (shouldFetch) {
        setTimeout(() => fetchNotes(updated), 0)
      }

      return updated
    })
  }, [fetchNotes])

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      search: '',
      category: '',
      isPinned: null,
      tags: [],
      page: 1,
      limit: 10
    }

    setFilters(defaultFilters)

    return fetchNotes(defaultFilters)
  }, [fetchNotes])

  const getNoteById = useCallback(async (noteId) => {
    if (!isAuthenticated) return null

    try {
      setLoading(true)
      setError(null)
      const note = await noteService.getNoteById(noteId)
      return note
    } catch (err) {
      console.error(`Erro ao buscar nota ${noteId}:`, err)

      if (err.message.includes("permissão")) {
        setError(`Você não tem permissão para visualizar esta nota. Apenas o proprietário pode acessá-la.`)
      } else {
        setError(err.message || `Falha ao buscar nota com ID: ${noteId}`)
      }

      throw err
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const createNote = useCallback(async (noteData) => {
    if (!isAuthenticated) return null

    try {
      setLoading(true)
      setError(null)
      const newNote = await noteService.createNote(noteData)

      setNotes(prev => [newNote, ...prev])

      return newNote
    } catch (err) {
      console.error("Erro ao criar nota:", err)
      const errorMessage = err.message || 'Falha ao criar nota'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const updateNote = useCallback(async (noteId, noteData) => {
    if (!isAuthenticated) return null

    try {
      setLoading(true)
      setError(null)
      const updatedNote = await noteService.updateNote(noteId, noteData)

      setNotes(prev => prev.map(note =>
        note._id === noteId ? updatedNote : note
      ))

      return updatedNote
    } catch (err) {
      console.error(`Erro ao atualizar nota ${noteId}:`, err)

      if (err.message.includes("permissão")) {
        setError(`Você não tem permissão para editar esta nota. Apenas o proprietário pode modificá-la.`)
      } else {
        setError(err.message || `Falha ao atualizar nota com ID: ${noteId}`)
      }

      throw err
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const deleteNote = useCallback(async (noteId) => {
    if (!isAuthenticated) return false

    try {
      setLoading(true)
      setError(null)
      const success = await noteService.deleteNote(noteId)

      if (success) {
        setNotes(prev => prev.filter(note => note._id !== noteId))
      }

      return success
    } catch (err) {
      console.error(`Erro ao excluir nota ${noteId}:`, err)

      if (err.message.includes("permissão")) {
        setError(`Você não tem permissão para excluir esta nota. Apenas o proprietário pode excluí-la.`)
      } else {
        setError(err.message || `Falha ao excluir nota com ID: ${noteId}`)
      }

      throw err
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const pinNote = useCallback(async (noteId) => {
    if (!isAuthenticated) return null

    try {
      setLoading(true)
      setError(null)
      const updatedNote = await noteService.pinNote(noteId)

      setNotes(prev => prev.map(note =>
        note._id === noteId ? { ...note, isPinned: true } : note
      ))

      return updatedNote
    } catch (err) {
      console.error(`Erro ao fixar nota ${noteId}:`, err)

      if (err.message.includes("permissão")) {
        setError(`Você não tem permissão para fixar esta nota.`)
      } else {
        setError(err.message || `Falha ao fixar nota com ID: ${noteId}`)
      }

      throw err
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const unpinNote = useCallback(async (noteId) => {
    if (!isAuthenticated) return null

    try {
      setLoading(true)
      setError(null)
      const updatedNote = await noteService.unpinNote(noteId)

      setNotes(prev => prev.map(note =>
        note._id === noteId ? { ...note, isPinned: false } : note
      ))

      return updatedNote
    } catch (err) {
      console.error(`Erro ao desafixar nota ${noteId}:`, err)

      if (err.message.includes("permissão")) {
        setError(`Você não tem permissão para desafixar esta nota.`)
      } else {
        setError(err.message || `Falha ao desafixar nota com ID: ${noteId}`)
      }

      throw err
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = {
    notes,
    filters,
    loading,
    error,
    fetchNotes,
    updateFilters,
    resetFilters,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    pinNote,
    unpinNote,
    clearError
  }

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>
}

export default NoteContext