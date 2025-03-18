import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FiLock, FiEye, FiEyeOff, FiArrowLeft, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
      'Password must contain uppercase, lowercase, number and special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
})

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [apiError, setApiError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm">
          <div>
            <div className="h-12 w-12 mx-auto rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xl">
              W
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Invalid reset link
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              The password reset link is invalid or has expired. Please request a new link.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="w-full inline-flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors">
              Request new reset link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setApiError('')
      await resetPassword(token, values.newPassword, values.confirmPassword)
      setIsSuccess(true)
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <FiCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Password reset successful
            </h2>
            <p className="mt-2 text-center text-base text-gray-600">
              Your password has been reset successfully. You can now login with your new password.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/login" className="w-full inline-flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors">
              Go to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel with reset form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-violet-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xl font-bold">W</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Weid</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Set new password</h2>
            <p className="text-gray-600">
              Create a strong password that you don't use for other websites.
            </p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
              {apiError}
            </div>
          )}

          <Formik
            initialValues={{
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`appearance-none block w-full pl-12 pr-12 py-3.5 border ${
                        errors.newPassword && touched.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                  </div>
                  <ErrorMessage name="newPassword" component="div" className="mt-1.5 text-sm text-red-600" />

                  {/* Password strength indicators */}
                  {values.newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/^.{8,}$/.test(values.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-600">At least 8 characters</span>
                      </div>
                      <div className="flex items-center">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/[A-Z]/.test(values.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-600">Contains uppercase letter</span>
                      </div>
                      <div className="flex items-center">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/[a-z]/.test(values.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-600">Contains lowercase letter</span>
                      </div>
                      <div className="flex items-center">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/\d/.test(values.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-600">Contains number</span>
                      </div>
                      <div className="flex items-center">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(values.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-600">Contains special character</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`appearance-none block w-full pl-12 pr-12 py-3.5 border ${
                        errors.confirmPassword && touched.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="mt-1.5 text-sm text-red-600" />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isSubmitting ? 'Resetting password...' : 'Reset password'}
                    {!isSubmitting && <FiArrowRight className="ml-2" />}
                  </button>
                </div>

                <div className="text-center">
                  <Link to="/login" className="inline-flex items-center font-medium text-violet-600 hover:text-violet-500">
                    <FiArrowLeft className="mr-1" /> Back to login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Right panel with background */}
      <div className="hidden lg:flex lg:w-1/2 bg-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-violet-800 opacity-90"></div>
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center mb-8">
            <span className="text-violet-600 text-4xl font-bold">W</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">Create a secure password</h1>
          <p className="text-xl max-w-md text-center mb-8">
            Strong passwords are essential for keeping your account and personal information safe.
          </p>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl max-w-lg">
            <h3 className="text-lg font-semibold mb-2">Password Best Practices</h3>
            <ul className="space-y-2 text-white/90">
              <li className="flex items-start">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs text-white mr-2 mt-0.5">1</span>
                Create a unique password you don't use elsewhere
              </li>
              <li className="flex items-start">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs text-white mr-2 mt-0.5">2</span>
                Aim for at least 12 characters for extra security
              </li>
              <li className="flex items-start">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs text-white mr-2 mt-0.5">3</span>
                Consider using a passphrase that's easy to remember
              </li>
              <li className="flex items-start">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs text-white mr-2 mt-0.5">4</span>
                Avoid personal information like birthdays or names
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword