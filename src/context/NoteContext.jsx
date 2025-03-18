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

  // Use ref to track if fetch is in progress
  const fetchInProgress = useRef(false)

  // Cleanup function for component unmounting
  useEffect(() => {
    return () => {
      fetchInProgress.current = false
    }
  }, [])

  const fetchNotes = useCallback(async (customFilters = null) => {
    // Don't fetch if already fetching or not authenticated
    if (fetchInProgress.current || !isAuthenticated) return null

    try {
      fetchInProgress.current = true
      setLoading(true)
      setError(null)

      // Use custom filters if provided, otherwise use stored filters
      const filtersToUse = customFilters || filters

      // Clean filters before sending to API
      const cleanFilters = { ...filtersToUse }

      // Remove empty/null values
      if (!cleanFilters.search) delete cleanFilters.search
      if (!cleanFilters.category) delete cleanFilters.category
      if (cleanFilters.isPinned === null) delete cleanFilters.isPinned
      if (!cleanFilters.tags || cleanFilters.tags.length === 0) delete cleanFilters.tags

      // O filtro de owner é implícito no backend, não precisamos enviar

      const response = await noteService.getNotes(cleanFilters)

      // Ensure we have a notes array, even if the backend doesn't return one
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

  // Update filters and optionally fetch notes
  const updateFilters = useCallback((newFilters, shouldFetch = false) => {
    setFilters(prev => {
      const updated = {
        ...prev,
        ...newFilters
      }

      // If shouldFetch is true, fetch notes with the updated filters
      if (shouldFetch) {
        // Use setTimeout to ensure state is updated before fetch
        setTimeout(() => fetchNotes(updated), 0)
      }

      return updated
    })
  }, [fetchNotes])

  // Reset filters and fetch notes with default filters
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

    // Fetch with default filters
    return fetchNotes(defaultFilters)
  }, [fetchNotes])

  // Get a note by ID
  const getNoteById = useCallback(async (noteId) => {
    if (!isAuthenticated) return null

    try {
      setLoading(true)
      setError(null)
      const note = await noteService.getNoteById(noteId)
      return note
    } catch (err) {
      console.error(`Erro ao buscar nota ${noteId}:`, err)

      // Verificar se é um erro de permissão
      if (err.message.includes("permissão")) {
        setError(`Você não tem permissão para visualizar esta nota. Apenas o proprietário pode acessá-la.`)
      } else {
        setError(err.message || `Falha ao buscar nota com ID: ${noteId}`)
      }

      // Propagar o erro para que o componente possa tratá-lo
      throw err
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Create a new note
  const createNote = useCallback(async (noteData) => {
    if (!isAuthenticated) return null

    try {
      setLoading(true)
      setError(null)
      const newNote = await noteService.createNote(noteData)

      // Update local state by adding the new note to the front of the array
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

  // Update an existing note
  const updateNote = useCallback(async (noteId, noteData) => {
    if (!isAuthenticated) return null

    try {
      setLoading(true)
      setError(null)
      const updatedNote = await noteService.updateNote(noteId, noteData)

      // Update local state
      setNotes(prev => prev.map(note =>
        note._id === noteId ? updatedNote : note
      ))

      return updatedNote
    } catch (err) {
      console.error(`Erro ao atualizar nota ${noteId}:`, err)

      // Verificar se é um erro de permissão
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

  // Delete a note
  const deleteNote = useCallback(async (noteId) => {
    if (!isAuthenticated) return false

    try {
      setLoading(true)
      setError(null)
      const success = await noteService.deleteNote(noteId)

      if (success) {
        // Update local state by removing the deleted note
        setNotes(prev => prev.filter(note => note._id !== noteId))
      }

      return success
    } catch (err) {
      console.error(`Erro ao excluir nota ${noteId}:`, err)

      // Verificar se é um erro de permissão
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

  // Pin a note
  const pinNote = useCallback(async (noteId) => {
    if (!isAuthenticated) return null

    try {
      setLoading(true)
      setError(null)
      const updatedNote = await noteService.pinNote(noteId)

      // Update local state by setting isPinned to true for the specified note
      setNotes(prev => prev.map(note =>
        note._id === noteId ? { ...note, isPinned: true } : note
      ))

      return updatedNote
    } catch (err) {
      console.error(`Erro ao fixar nota ${noteId}:`, err)

      // Verificar se é um erro de permissão
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

  // Unpin a note
  const unpinNote = useCallback(async (noteId) => {
    if (!isAuthenticated) return null

    try {
      setLoading(true)
      setError(null)
      const updatedNote = await noteService.unpinNote(noteId)

      // Update local state by setting isPinned to false for the specified note
      setNotes(prev => prev.map(note =>
        note._id === noteId ? { ...note, isPinned: false } : note
      ))

      return updatedNote
    } catch (err) {
      console.error(`Erro ao desafixar nota ${noteId}:`, err)

      // Verificar se é um erro de permissão
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

  // Clear error
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