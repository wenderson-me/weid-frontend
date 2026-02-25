import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  FiX,
  FiSave,
  FiCalendar,
  FiClock,
  FiTag,
  FiPlus,
  FiPaperclip,
  FiAlertTriangle,
  FiArrowLeft
} from 'react-icons/fi'
import { useTasks } from '../../hooks/useTasks'
import userService from '../../services/userService'


const taskSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .required('Title is required'),
  description: Yup.string()
    .nullable(),
  status: Yup.string()
    .oneOf(['todo', 'inProgress', 'inReview', 'done'], 'Invalid status')
    .required('Status is required'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high', 'urgent'], 'Invalid priority')
    .required('Priority is required'),
  dueDate: Yup.date()
    .nullable()
    .transform((value, originalValue) => {
      // Convert empty string to null
      return originalValue === '' ? null : value;
    })
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      'Due date cannot be in the past'
    ),
  estimatedHours: Yup.number()
    .positive('Estimated hours must be positive')
    .nullable()
    .transform((value, originalValue) => {
      // Convert empty string to null
      return originalValue === '' ? null : value;
    }),
})

const TaskForm = ({ taskId }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { getTaskById, createTask, updateTask } = useTasks()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(taskId ? true : false)
  const [usersLoading, setUsersLoading] = useState(true)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])


  const defaultValues = {
    title: '',
    description: '',
    status: new URLSearchParams(location.search).get('status') || 'todo',
    priority: 'medium',
    dueDate: '',
    estimatedHours: '',
    assignees: [],
    tags: [],
    attachments: [],
  }


  const fetchUsers = async () => {
    try {
      setUsersLoading(true)

      const response = await userService.getUsers({ limit: 100 })

      if (response && response.users) {
        setUsers(response.users)
      } else {
        console.warn('Unexpected user response format, using default values')
        setUsers([
          { _id: 'user1', name: 'John Doe', avatar: null },
          { _id: 'user2', name: 'Jane Smith', avatar: null },
          { _id: 'user3', name: 'Bob Johnson', avatar: null },
        ])
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)

      setUsers([
        { _id: 'user1', name: 'John Doe', avatar: null },
        { _id: 'user2', name: 'Jane Smith', avatar: null },
        { _id: 'user3', name: 'Bob Johnson', avatar: null },
      ])
    } finally {
      setUsersLoading(false)
    }
  }


  useEffect(() => {

    fetchUsers()


    if (taskId) {
      let isMounted = true;
      const fetchTaskData = async () => {
        try {
          setLoading(true)
          const taskData = await getTaskById(taskId)
          if (isMounted) {
            setTask(taskData)
            setError(null)
          }
        } catch (err) {
          if (isMounted) {
            setError(err.message || 'Failed to fetch task')
            console.error('Error fetching task:', err)
          }
        } finally {
          if (isMounted) {
            setLoading(false)
          }
        }
      }

      fetchTaskData()
      return () => {
        isMounted = false
      }
    }
  }, [taskId, getTaskById])


  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {

      const formattedValues = {
        ...values,
        // Ensure assignees is a valid array of IDs
        assignees: Array.isArray(values.assignees) ? values.assignees.filter(id => id && typeof id === 'string') : [],
      }

      // Only include dueDate if it has a valid value
      if (values.dueDate && values.dueDate.trim() !== '') {
        formattedValues.dueDate = values.dueDate
      } else {
        delete formattedValues.dueDate
      }

      // Only include estimatedHours if it has a valid value
      if (values.estimatedHours) {
        formattedValues.estimatedHours = Number(values.estimatedHours)
      } else {
        delete formattedValues.estimatedHours
      }

      // Remove newTag field if present
      if ('newTag' in formattedValues) {
        delete formattedValues.newTag
      }

      console.log('Submitting task data:', formattedValues)

      if (taskId) {

        await updateTask(taskId, formattedValues)
      } else {

        await createTask(formattedValues)
      }


      navigate('/tasks')
    } catch (err) {
      console.error('Error saving task:', err)


      if (err.response && err.response.data && err.response.data.errors) {
        const serverErrors = err.response.data.errors


        Object.keys(serverErrors).forEach(field => {
          setFieldError(field, serverErrors[field])
        })
      }


      setError(err.message || 'Failed to save task. Please check the form and try again.')
    } finally {
      setSubmitting(false)
    }
  }


  const prepareInitialValues = () => {
    if (taskId && task) {
      return {
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',

        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',

        estimatedHours: task.estimatedHours !== null && task.estimatedHours !== undefined
          ? task.estimatedHours
          : '',

        assignees: Array.isArray(task.assignees)
          ? task.assignees.map(assignee => typeof assignee === 'object' ? assignee._id : assignee)
          : [],
        tags: Array.isArray(task.tags) ? task.tags : [],
        attachments: Array.isArray(task.attachments) ? task.attachments : [],
      }
    }
    return defaultValues
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  const initialValues = prepareInitialValues()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          to="/tasks"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <FiArrowLeft className="mr-2" /> Back to Tasks
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {taskId ? 'Edit Task' : 'Create New Task'}
        </h1>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={taskSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="appearance-none block w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Task title"
                />
                <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className="appearance-none block w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 min-h-[120px] resize-y"
                  placeholder="Task description (optional)"
                />
                <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Field
                    as="select"
                    id="status"
                    name="status"
                    className="appearance-none block w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="inReview">In Review</option>
                    <option value="done">Done</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <Field
                    as="select"
                    id="priority"
                    name="priority"
                    className="appearance-none block w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Field>
                  <ErrorMessage name="priority" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              {/* Due Date and Estimated Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date (optional)</label>
                  <div className="relative">
                    {/* We'll keep just the input without the custom icon */}
                    <Field
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      className="appearance-none block w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                  <ErrorMessage name="dueDate" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours (optional)</label>
                  <div className="relative">
                    {/* Maintain the clock icon but move it to a better position */}
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiClock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="number"
                      id="estimatedHours"
                      name="estimatedHours"
                      className="appearance-none block w-full pl-12 py-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      min="0"
                      step="0.5"
                      placeholder="0"
                    />
                  </div>
                  <ErrorMessage name="estimatedHours" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              {/* Assignees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignees (optional)</label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {values.assignees.map((assigneeId, index) => {
                    const user = users.find(u => u._id === assigneeId)
                    return (
                      <div
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-800"
                      >
                        <span>{user?.name || 'Unknown user'}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newAssignees = [...values.assignees]
                            newAssignees.splice(index, 1)
                            setFieldValue('assignees', newAssignees)
                          }}
                          className="ml-2 text-violet-600 hover:text-violet-800 focus:outline-none"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
                <div className="flex space-x-2">
                  {usersLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
                      <span className="text-sm text-gray-500">Loading users...</span>
                    </div>
                  ) : (
                    <>
                      <select
                        className="appearance-none block flex-1 px-4 py-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            const userId = e.target.value
                            if (!values.assignees.includes(userId)) {
                              setFieldValue('assignees', [...values.assignees, userId])
                            }
                            e.target.value = ""
                          }
                        }}
                      >
                        <option value="">Select user</option>
                        {users.map(user => (
                          <option
                            key={user._id}
                            value={user._id}
                            disabled={values.assignees.includes(user._id)}
                          >
                            {user.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      >
                        <FiPlus className="mr-2" /> Add
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (optional)</label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {values.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      <FiTag className="mr-1 text-gray-500" />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = [...values.tags]
                          newTags.splice(index, 1)
                          setFieldValue('tags', newTags)
                        }}
                        className="ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Field
                    type="text"
                    name="newTag"
                    className="appearance-none block flex-1 px-4 py-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        e.preventDefault()
                        const newTag = e.target.value.trim()
                        if (!values.tags.includes(newTag)) {
                          setFieldValue('tags', [...values.tags, newTag])
                        }
                        e.target.value = ''
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    onClick={() => {
                      const input = document.querySelector('input[name="newTag"]')
                      if (input?.value.trim()) {
                        const newTag = input.value.trim()
                        if (!values.tags.includes(newTag)) {
                          setFieldValue('tags', [...values.tags, newTag])
                        }
                        input.value = ''
                      }
                    }}
                  >
                    <FiPlus className="mr-2" /> Add
                  </button>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (optional)</label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {values.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      <FiPaperclip className="mr-1 text-gray-500" />
                      <span>{typeof attachment === 'string' ? attachment.split('/').pop() : 'File'}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newAttachments = [...values.attachments]
                          newAttachments.splice(index, 1)
                          setFieldValue('attachments', newAttachments)
                        }}
                        className="ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <label
                    htmlFor="attachment-upload"
                    className="inline-flex items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                  >
                    <FiPaperclip className="mr-2" /> Attach File
                  </label>
                  <input
                    id="attachment-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {






                      const files = Array.from(e.target.files || [])
                      const fileNames = files.map(file => file.name)

                      setFieldValue('attachments', [...values.attachments, ...fileNames])


                      e.target.value = ''
                    }}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <Link
                  to="/tasks"
                  className="inline-flex items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70"
                >
                  <FiSave className="mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Task'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default TaskForm