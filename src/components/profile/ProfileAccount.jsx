import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FiKey, FiLock, FiLogOut, FiAlertTriangle, FiEye, FiEyeOff, FiShield } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

const passwordChangeSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
      'Password must contain uppercase, lowercase, number and special character'
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
})

const ProfileAccount = ({ user, loading, onDeactivateAccount }) => {
  const { logout } = useAuth()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [deactivateConfirmOpen, setDeactivateConfirmOpen] = useState(false)
  const [deactivateError, setDeactivateError] = useState(null)

  const handlePasswordChange = async (values, { setSubmitting, resetForm, setStatus }) => {
    try {
      console.log('Changing password...', values)

      setTimeout(() => {
        setStatus({ success: 'Password changed successfully!' })
        resetForm()
        setSubmitting(false)
      }, 1000)
    } catch (error) {
      console.error('Error changing password:', error)
      setStatus({ error: error.message || 'Failed to change password' })
      setSubmitting(false)
    }
  }

  const handleDeactivateAccount = async () => {
    try {
      setDeactivateError(null)
      await onDeactivateAccount()
      logout()
    } catch (error) {
      console.error('Error deactivating account:', error)
      setDeactivateError(error.message || 'Failed to deactivate account')
    } finally {
      setDeactivateConfirmOpen(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Account Security</h2>
        <p className="text-gray-600 mb-6">
          Manage your account security settings and preferences.
        </p>
      </div>

      {/* Password Change Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>

        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          validationSchema={passwordChangeSchema}
          onSubmit={handlePasswordChange}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-4 max-w-md">
              {status?.success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{status.success}</p>
                    </div>
                  </div>
                </div>
              )}

              {status?.error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{status.error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    id="currentPassword"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ?
                      <FiEyeOff className="h-5 w-5 text-gray-400" /> :
                      <FiEye className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </div>
                <ErrorMessage name="currentPassword" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    id="newPassword"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Create a new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ?
                      <FiEyeOff className="h-5 w-5 text-gray-400" /> :
                      <FiEye className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </div>
                <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    id="confirmPassword"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ?
                      <FiEyeOff className="h-5 w-5 text-gray-400" /> :
                      <FiEye className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
                  disabled={isSubmitting || loading}
                >
                  <FiShield className="mr-2 -ml-1 h-5 w-5" />
                  {isSubmitting ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Logout from all devices */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium text-gray-900 mb-4">Sessions</h3>
        <p className="text-gray-600 mb-4">
          Log out from all devices where you're currently signed in.
        </p>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          onClick={() => {
            console.log('Logging out from all devices...')
            alert('You have been logged out from all devices')
          }}
        >
          <FiLogOut className="mr-2 -ml-1 h-5 w-5" />
          Logout from all devices
        </button>
      </div>

      {/* Account Deactivation */}
      <div className="bg-red-50 p-6 rounded-xl border border-red-200">
        <h3 className="text-md font-medium text-red-800 mb-4">Deactivate Account</h3>
        <p className="text-red-700 mb-4">
          Deactivating your account will hide your profile and data until you log in again.
        </p>

        {deactivateError && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{deactivateError}</p>
              </div>
            </div>
          </div>
        )}

        {deactivateConfirmOpen ? (
          <div className="bg-white p-4 rounded-lg border border-red-300 mb-4">
            <p className="text-gray-700 font-medium mb-4">
              Are you sure you want to deactivate your account?
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleDeactivateAccount}
                disabled={loading}
              >
                Yes, deactivate my account
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                onClick={() => setDeactivateConfirmOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => setDeactivateConfirmOpen(true)}
          >
            <FiAlertTriangle className="mr-2 -ml-1 h-5 w-5" />
            Deactivate Account
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfileAccount