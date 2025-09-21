import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FiSave, FiArrowLeft, FiAlertCircle, FiX } from 'react-icons/fi'
import { useNotes } from '../../hooks/useNotes'
import { useTheme } from '../../hooks/useTheme'

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
  { value: 'important', label: 'Important' },
  { value: 'idea', label: 'Idea' },
]

const noteSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  content: Yup.string()
    .required('Content is required'),
  category: Yup.string()
    .oneOf(CATEGORIES.map(c => c.value), 'Invalid category')
    .required('Category is required'),
  isPinned: Yup.boolean(),
  tags: Yup.array().of(Yup.string())
})

const NoteForm = ({ isModal = false }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getNoteById, createNote, updateNote } = useNotes()
  const { theme } = useTheme()

  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState(null)
  const [newTag, setNewTag] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const defaultValues = {
    title: '',
    content: '',
    category: 'general',
    isPinned: false,
    tags: [],
  }

  useEffect(() => {
    let isMounted = true;

    if (id) {
      const fetchNote = async () => {
        try {
          setLoading(true)
          setError(null)
          const noteData = await getNoteById(id)
          if (isMounted) {
            setNote(noteData)
          }
        } catch (err) {
          console.error("Error fetching note for edit:", err);
          if (isMounted) {
            if (err.response?.status === 403) {
              setError("You don't have permission to edit this note.")
            } else {
              setError(err.message || 'Failed to fetch note')
            }
          }
        } finally {
          if (isMounted) {
            setLoading(false)
          }
        }
      }

      fetchNote()
    } else {
      setNote(null)
      setLoading(false)
      setError(null)
    }

    return () => {
      isMounted = false;
    }
  }, [id, getNoteById])

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError(null)
      setIsSaving(true)

      const noteData = {
        title: values.title,
        content: values.content,
        category: values.category,
        isPinned: values.isPinned,
        tags: values.tags,
      }

      let result;
      if (id) {
        result = await updateNote(id, noteData)
      } else {
        result = await createNote(noteData)
      }

      if (!isModal) {
        navigate('/notes', {
          state: {
            message: id ? 'Note updated successfully' : 'Note created successfully',
            type: 'success'
          }
        });
      }

      return result
    } catch (err) {
      console.error('Error saving note:', err)
      setError(err.message || 'Failed to save note')
      return null
    } finally {
      setSubmitting(false)
      setIsSaving(false)
    }
  }

  const getInitialValues = () => {
    if (id && note) {
      return {
        title: note.title || '',
        content: note.content || '',
        category: note.category || 'general',
        isPinned: note.isPinned || false,
        tags: note.tags || [],
      }
    }
    return defaultValues
  }

  const handleAddTag = (values, setFieldValue) => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !values.tags.includes(trimmedTag)) {
      setFieldValue('tags', [...values.tags, trimmedTag]);
      setNewTag('');
    }
  }

  const handleRetry = () => {
    if (id) {
      setLoading(true)
      setError(null)
      getNoteById(id)
        .then(data => {
          setNote(data)
        })
        .catch(err => {
          setError(err.message || 'Failed to fetch note')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  const initialValues = getInitialValues()

  return (
    <div className={`${isModal ? '' : 'max-w-3xl mx-auto'}`}>
      {!isModal && (
        <div className="mb-6">
          <Link
            to="/notes"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="mr-1" /> Back to Notes
          </Link>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {id ? 'Edit Note' : 'Create New Note'}
      </h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-xl">
          <div className="flex items-start">
            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
              {id && (
                <button
                  onClick={handleRetry}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={noteSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue, errors, touched }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="title" className="label">Title</label>
              <Field
                type="text"
                id="title"
                name="title"
                className={`input ${errors.title && touched.title ? 'border-red-300 bg-red-50' : ''}`}
                placeholder="Note title"
              />
              <ErrorMessage name="title" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="category" className="label">Category</label>
              <Field
                as="select"
                id="category"
                name="category"
                className={`input ${errors.category && touched.category ? 'border-red-300 bg-red-50' : ''}`}
              >
                {CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" className="error" />
            </div>

            <div>
              <label className="inline-flex items-center">
                <Field
                  type="checkbox"
                  name="isPinned"
                  className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Pin this note</span>
              </label>
            </div>

            <div>
              <label htmlFor="content" className="label">Content</label>
              <Field
                as="textarea"
                id="content"
                name="content"
                className={`input min-h-[200px] resize-y ${errors.content && touched.content ? 'border-red-300 bg-red-50' : ''}`}
                placeholder="Your note content..."
              />
              <ErrorMessage name="content" component="div" className="error" />
            </div>

            <div>
              <label className="label">Tags</label>
              <div className="mb-2 flex flex-wrap gap-2">
                {values.tags && values.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newTags = [...values.tags];
                        newTags.splice(index, 1);
                        setFieldValue('tags', newTags);
                      }}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="input mr-2"
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(values, setFieldValue);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(values, setFieldValue)}
                  className="btn btn-outline"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
              {isModal ? (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setError(null);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              ) : (
                <Link
                  to="/notes"
                  className="btn btn-outline"
                >
                  Cancel
                </Link>
              )}
              <button
                type="submit"
                disabled={isSubmitting || isSaving}
                className={`btn btn-primary ${(isSubmitting || isSaving) ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <FiSave className="mr-1" />
                {isSubmitting || isSaving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default NoteForm