import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FiMail, FiArrowLeft, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
})

const ForgotPassword = () => {
  const { forgotPassword } = useAuth()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setApiError('')
      await forgotPassword(values.email)
      setIsSubmitted(true)
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to send reset email. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <FiCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-center text-base text-gray-600">
              We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the email?{' '}
              <button
                onClick={() => setIsSubmitted(false)}
                className="font-medium text-violet-600 hover:text-violet-500 focus:outline-none"
              >
                Try again
              </button>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center font-medium text-violet-600 hover:text-violet-500">
              <FiArrowLeft className="mr-1" /> Back to login
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h2>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
              {apiError}
            </div>
          )}

          <Formik
            initialValues={{
              email: '',
            }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`appearance-none block w-full pl-10 pr-3 py-3.5 border ${
                        errors.email && touched.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900`}
                      placeholder="Enter your email"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isSubmitting ? 'Sending...' : 'Send reset link'}
                    {!isSubmitting && <FiArrowRight className="ml-2" />}
                  </button>
                </div>

                <div className="text-center mt-6">
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
          <h1 className="text-4xl font-bold mb-6">Password Recovery</h1>
          <p className="text-xl max-w-md text-center mb-8">
            Don't worry - it happens to the best of us. We'll help you get back into your account.
          </p>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl max-w-lg">
            <h3 className="text-lg font-semibold mb-2">Secure Password Tips</h3>
            <ul className="space-y-2 text-white/90">
              <li className="flex items-start">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs text-white mr-2 mt-0.5">1</span>
                Use a unique password for each account
              </li>
              <li className="flex items-start">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs text-white mr-2 mt-0.5">2</span>
                Combine uppercase, lowercase, numbers and special characters
              </li>
              <li className="flex items-start">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs text-white mr-2 mt-0.5">3</span>
                Never share your password with anyone
              </li>
              <li className="flex items-start">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs text-white mr-2 mt-0.5">4</span>
                Consider using a password manager
              </li>
            </ul>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-violet-800 to-transparent"></div>
      </div>
    </div>
  )
}

export default ForgotPassword