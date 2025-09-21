import { useState, useEffect, useCallback } from 'react'
import {
  FiFilter,
  FiSearch,
  FiX,
  FiTag,
  FiStar
} from 'react-icons/fi'
import { useNotes } from '../../hooks/useNotes'

const NotesFilter = () => {
  const { filters, updateFilters, resetFilters } = useNotes()
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [availableTags, setAvailableTags] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setAvailableTags(['work', 'important', 'todo', 'idea', 'meeting', 'personal'])
  }, [])

  useEffect(() => {
    setSearchTerm(filters.search || '')
  }, [filters.search])

  useEffect(() => {
    if (searchTerm === filters.search) return;

    const timer = setTimeout(() => {
      setIsSearching(true)
      updateFilters({ search: searchTerm, page: 1 }, true)

      setTimeout(() => setIsSearching(false), 300)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, filters.search, updateFilters])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    updateFilters({ search: '', page: 1 }, true)
  }

  const handleCategoryChange = useCallback((category) => {
    updateFilters({
      category: filters.category === category ? '' : category,
      page: 1
    }, true);
  }, [filters.category, updateFilters])

  const handlePinChange = useCallback((isPinned) => {
    updateFilters({
      isPinned: filters.isPinned === isPinned ? null : isPinned,
      page: 1
    }, true);
  }, [filters.isPinned, updateFilters])

  const handleTagChange = useCallback((tag) => {
    const currentTags = [...(filters.tags || [])]
    const tagIndex = currentTags.indexOf(tag)

    if (tagIndex === -1) {
      updateFilters({ tags: [...currentTags, tag], page: 1 }, true);
    } else {
      currentTags.splice(tagIndex, 1)
      updateFilters({ tags: currentTags, page: 1 }, true);
    }
  }, [filters.tags, updateFilters])

  const handleResetFilters = useCallback(() => {
    setSearchTerm('')
    resetFilters()
  }, [resetFilters])

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'page' || key === 'limit') return false
    if (Array.isArray(value)) return value.length > 0
    return !!value
  })

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        {/* Search input */}
        <div className="relative flex-grow max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            className="input pl-10 pr-10"
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search notes"
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Clear search"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Filter button */}
        <div className="flex">
          <button
            type="button"
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <FiFilter className="mr-2" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                Active
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              className="ml-2 btn btn-outline text-gray-700"
              onClick={handleResetFilters}
              aria-label="Clear all filters"
            >
              <FiX className="mr-1" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Show searching indicator */}
      {isSearching && (
        <div className="flex items-center text-sm text-gray-500 mt-1 ml-2 animate-pulse">
          <span>Searching...</span>
        </div>
      )}

      {/* Filters panel */}
      {showFilters && (
        <div id="filter-panel" className="card p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
              <div className="space-y-2">
                {['general', 'personal', 'work', 'important', 'idea'].map(category => {
                  const isSelected = filters.category === category
                  return (
                    <label
                      key={category}
                      className={`flex items-center p-2 rounded-lg cursor-pointer ${
                        isSelected ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-violet-600 rounded"
                        checked={isSelected}
                        onChange={() => handleCategoryChange(category)}
                        aria-label={`Filter by ${category} category`}
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {category}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Pin status */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Pin Status</h4>
              <div className="space-y-2">
                {[
                  { value: true, label: 'Pinned', icon: <FiStar className="mr-1 text-yellow-500" /> },
                  { value: false, label: 'Not Pinned', icon: <FiStar className="mr-1 text-gray-400" /> }
                ].map(option => {
                  const isSelected = filters.isPinned === option.value
                  return (
                    <label
                      key={String(option.value)}
                      className={`flex items-center p-2 rounded-lg cursor-pointer ${
                        isSelected ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-violet-600 rounded"
                        checked={isSelected}
                        onChange={() => handlePinChange(option.value)}
                        aria-label={`Filter by ${option.label}`}
                      />
                      <span className="ml-2 flex items-center text-sm text-gray-700">
                        {option.icon}
                        {option.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableTags.map(tag => {
                  const isSelected = filters.tags?.includes(tag)
                  return (
                    <label
                      key={tag}
                      className={`flex items-center p-2 rounded-lg cursor-pointer ${
                        isSelected ? 'bg-violet-50 border border-violet-200' : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-violet-600 rounded"
                        checked={isSelected}
                        onChange={() => handleTagChange(tag)}
                        aria-label={`Filter by ${tag} tag`}
                      />
                      <span className="ml-2 flex items-center text-sm text-gray-700">
                        <FiTag className="mr-1" />
                        {tag}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotesFilter

