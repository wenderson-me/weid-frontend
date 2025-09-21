import { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FiSave, FiMoon, FiSun, FiMonitor, FiLayout, FiCalendar, FiList, FiFilter, FiGlobe } from 'react-icons/fi'
import { useTheme } from '../../hooks/useTheme'


const preferencesSchema = Yup.object().shape({
  theme: Yup.string()
    .oneOf(['light', 'dark', 'system'])
    .required('Theme is required'),
  language: Yup.string()
    .required('Language is required'),
  defaultTaskView: Yup.string()
    .oneOf(['list', 'board', 'calendar'])
    .required('Default task view is required'),
})

const ProfilePreferences = ({ preferences, loading, onPreferencesUpdate }) => {
  const { theme, toggleTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState(preferences?.theme || theme || 'system')
  const [selectedTaskView, setSelectedTaskView] = useState(preferences?.defaultTaskView || 'board')


  useEffect(() => {
    setSelectedTheme(preferences?.theme || theme)
  }, [preferences, theme])


  const themeOptions = [
    { value: 'light', label: 'Light', icon: <FiSun className="mr-2" /> },
    { value: 'dark', label: 'Dark', icon: <FiMoon className="mr-2" /> },
    { value: 'system', label: 'System Default', icon: <FiMonitor className="mr-2" /> },
  ]

  const languageOptions = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
  ]

  const taskViewOptions = [
    { value: 'board', label: 'Kanban Board', icon: <FiLayout className="mr-2" /> },
    { value: 'list', label: 'List View', icon: <FiList className="mr-2" /> },
    { value: 'calendar', label: 'Calendar', icon: <FiCalendar className="mr-2" /> },
  ]

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'inReview', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ]


  const handleSubmit = async (values, { setSubmitting }) => {
    try {

      await onPreferencesUpdate(values)


      toggleTheme(values.theme)
    } catch (error) {
      console.error('Error updating preferences:', error)
    } finally {
      setSubmitting(false)
    }
  }


  const handleThemeChange = (value) => {
    setSelectedTheme(value)

    toggleTheme(value)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">User Preferences</h2>
        <p className="text-gray-600 mb-6">
          Customize your experience with Weid. These settings will be applied across all your devices.
        </p>
      </div>

      <Formik
        initialValues={{
          theme: preferences?.theme || 'system',
          language: preferences?.language || 'en-US',
          defaultTaskView: preferences?.defaultTaskView || 'board',
          defaultTaskFilter: {
            status: preferences?.defaultTaskFilter?.status || [],
            priority: preferences?.defaultTaskFilter?.priority || [],
          }
        }}
        validationSchema={preferencesSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-8 max-w-3xl">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {themeOptions.map((option) => (
                  <div key={option.value}>
                    <Field name="theme">
                      {({ field }) => (
                        <label
                          className={`
                            flex items-center p-4 border rounded-xl cursor-pointer
                            ${field.value === option.value
                              ? 'border-violet-500 bg-violet-50 text-violet-700'
                              : 'border-gray-200 hover:bg-gray-50'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            {...field}
                            value={option.value}
                            checked={field.value === option.value}
                            className="sr-only"
                            onChange={(e) => {
                              field.onChange(e)
                              handleThemeChange(option.value)
                            }}
                          />
                          {option.icon}
                          <span>{option.label}</span>
                        </label>
                      )}
                    </Field>
                  </div>
                ))}
              </div>
              <ErrorMessage name="theme" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Language Selection */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiGlobe className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  as="select"
                  name="language"
                  id="language"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500"
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              </div>
              <ErrorMessage name="language" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Default Task View */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Default Task View</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {taskViewOptions.map((option) => (
                  <div key={option.value}>
                    <Field name="defaultTaskView">
                      {({ field }) => (
                        <label
                          className={`
                            flex items-center p-4 border rounded-xl cursor-pointer
                            ${field.value === option.value
                              ? 'border-violet-500 bg-violet-50 text-violet-700'
                              : 'border-gray-200 hover:bg-gray-50'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            {...field}
                            value={option.value}
                            checked={field.value === option.value}
                            className="sr-only"
                            onChange={(e) => {
                              field.onChange(e)
                              setSelectedTaskView(option.value)
                            }}
                          />
                          {option.icon}
                          <span>{option.label}</span>
                        </label>
                      )}
                    </Field>
                  </div>
                ))}
              </div>
              <ErrorMessage name="defaultTaskView" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Default Task Filters */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Default Task Filters</label>
                <div className="flex items-center text-xs text-gray-500">
                  <FiFilter className="mr-1" />
                  <span>Select filters to apply by default when viewing tasks</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-200 rounded-xl">
                {/* Status Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="space-y-2">
                    {statusOptions.map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                          checked={values.defaultTaskFilter.status.includes(option.value)}
                          onChange={(e) => {
                            const isChecked = e.target.checked
                            const currentValues = [...values.defaultTaskFilter.status]

                            if (isChecked) {
                              setFieldValue('defaultTaskFilter.status', [...currentValues, option.value])
                            } else {
                              setFieldValue(
                                'defaultTaskFilter.status',
                                currentValues.filter(value => value !== option.value)
                              )
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Priority Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <div className="space-y-2">
                    {priorityOptions.map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                          checked={values.defaultTaskFilter.priority.includes(option.value)}
                          onChange={(e) => {
                            const isChecked = e.target.checked
                            const currentValues = [...values.defaultTaskFilter.priority]

                            if (isChecked) {
                              setFieldValue('defaultTaskFilter.priority', [...currentValues, option.value])
                            } else {
                              setFieldValue(
                                'defaultTaskFilter.priority',
                                currentValues.filter(value => value !== option.value)
                              )
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
              disabled={isSubmitting || loading}
            >
              <FiSave className="mr-2 -ml-1 h-5 w-5" />
              {isSubmitting ? 'Saving...' : 'Save Preferences'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ProfilePreferences