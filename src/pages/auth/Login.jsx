import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
})

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setApiError('')
      await login(values.email, values.password)
      navigate('/dashboard')
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel with login form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-violet-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xl font-bold">W</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Weid</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">
              Please enter your details to sign in
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
              password: '',
            }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Link to="/forgot-password" className="text-sm font-medium text-violet-600 hover:text-violet-500">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={`appearance-none block w-full pl-12 pr-12 py-3.5 border ${
                        errors.password && touched.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900`}
                      placeholder="Enter your password"
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
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                    Remember me
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                    {!isSubmitting && <FiArrowRight className="ml-2" />}
                  </button>
                </div>

                <div className="text-center mt-8">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-violet-600 hover:text-violet-500 transition-colors">
                      Sign up
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Right panel with background image */}
      <div className="hidden lg:block lg:w-1/2 bg-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-violet-800 opacity-95"></div>
        <div className="absolute inset-0 opacity-10 pattern-dots-xl"></div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white h-full">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-6">Manage your tasks efficiently</h1>
            <p className="text-xl mb-10 text-white/80">
              Weid helps you organize, prioritize, and complete your tasks in a simple and productive way.
            </p>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl mt-6">
              <div className="flex justify-between mb-6">
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Your Progress</h3>
                  <p className="text-white/70 text-sm">This week</p>
                </div>
                <div className="bg-violet-700/50 text-white px-3 py-1 rounded-lg text-sm">
                  70%
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completed Tasks</span>
                    <span>18/24</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Active Projects</span>
                    <span>4/6</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login