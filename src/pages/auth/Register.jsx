import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(100, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
      'Password must contain uppercase, lowercase, number and special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
})

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setApiError('')
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
      navigate('/dashboard')
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to register. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel with registration form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-violet-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xl font-bold">W</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Weid</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
            <p className="text-gray-600">
              Let's get started with your free Weid account
            </p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
              {apiError}
            </div>
          )}

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className={`appearance-none block w-full pl-12 py-3.5 border ${
                        errors.name && touched.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <ErrorMessage name="name" component="div" className="mt-1.5 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`appearance-none block w-full pl-12 py-3.5 border ${
                        errors.email && touched.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900`}
                      placeholder="Enter your email"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="mt-1.5 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`appearance-none block w-full pl-12 pr-12 py-3.5 border ${
                        errors.password && touched.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                  <ErrorMessage name="password" component="div" className="mt-1.5 text-sm text-red-600" />

                  {/* Password strength indicators */}
                  {values.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/^.{8,}$/.test(values.password) ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-600">At least 8 characters</span>
                      </div>
                      <div className="flex items-center">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/[A-Z]/.test(values.password) ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-600">Contains uppercase letter</span>
                      </div>
                      <div className="flex items-center">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/[a-z]/.test(values.password) ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-600">Contains lowercase letter</span>
                      </div>
                      <div className="flex items-center">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/\d/.test(values.password) ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-600">Contains number</span>
                      </div>
                      <div className="flex items-center">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(values.password) ? 'text-green-500' : 'text-gray-300'}`} />
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
                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="font-medium text-violet-600 hover:text-violet-500">
                        Terms of Service
                      </a>
                      {' '}and{' '}
                      <a href="#" className="font-medium text-violet-600 hover:text-violet-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                    {!isSubmitting && <FiArrowRight className="ml-2" />}
                  </button>
                </div>

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-violet-600 hover:text-violet-500 transition-colors">
                      Sign in
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Right panel with background image */}
      <div className="hidden lg:flex lg:w-1/2 bg-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-violet-800 opacity-90"></div>
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center mb-8">
            <span className="text-violet-600 text-4xl font-bold">W</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">Join Weid Today</h1>
          <p className="text-xl max-w-md text-center mb-8">
            Start organizing your projects more efficiently and boost your team's productivity.
          </p>

          <div className="grid grid-cols-2 gap-6 max-w-lg w-full">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Task Management</h3>
              <p className="text-white/80">Organize tasks with intuitive boards and track progress effortlessly</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className="text-white/80">Work together seamlessly with real-time updates and notifications</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Note Taking</h3>
              <p className="text-white/80">Capture ideas quickly and organize your thoughts in one place</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-white/80">Gain insights into productivity and track project performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register