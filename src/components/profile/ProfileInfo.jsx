import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FiUser, FiMail, FiSave, FiUpload, FiCamera } from 'react-icons/fi'

const profileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
})

const ProfileInfo = ({ user, loading, onProfileUpdate, onAvatarUpdate }) => {
  const [avatar, setAvatar] = useState(user?.avatar || 'default-avatar.png')
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onProfileUpdate({
        name: values.name,
      })
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      const reader = new FileReader()
      reader.onload = async (event) => {
        const newAvatarUrl = event.target.result

        await onAvatarUpdate(newAvatarUrl)

        setAvatar(newAvatarUrl)
        setUploading(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setUploading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar section */}
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200">
            {avatar ? (
              <img
                src={avatar}
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-violet-100 text-violet-600 text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>

          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-full cursor-pointer shadow-sm"
          >
            <FiCamera size={16} />
            <span className="sr-only">Upload new avatar</span>
          </label>

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            disabled={uploading || loading}
          />

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
              <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* User info */}
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <div className="mt-2 text-xs text-gray-500">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 mr-2">
              {user?.role || 'User'}
            </span>
            <span>Member since {formatDate(user?.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <Formik
        initialValues={{
          name: user?.name || '',
        }}
        validationSchema={profileSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6 max-w-2xl">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Your full name"
                />
              </div>
              <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  disabled
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 bg-gray-50 rounded-xl text-gray-500 cursor-not-allowed"
                  value={user?.email || ''}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
            </div>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
              disabled={isSubmitting || loading}
            >
              <FiSave className="mr-2 -ml-1 h-5 w-5" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ProfileInfo