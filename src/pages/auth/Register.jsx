// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import AuthThemeToggle from '../../components/auth/AuthThemeToggle';
import { useAuth } from '../../hooks/useAuth';

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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setApiError('');
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel with registration form */}
      <div className="flex-1 p-8 flex flex-col justify-center items-center bg-white dark:bg-gray-900">
        <div className="absolute top-4 right-4 lg:right-auto lg:left-4">
          <AuthThemeToggle />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-violet-600 dark:text-violet-400">Weid</h1>
          <p className="text-gray-600 dark:text-gray-400">Management System</p>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
              Create an Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {apiError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
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
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className={`pl-10 ${
                          errors.name && touched.name ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        className={`pl-10 ${
                          errors.email && touched.email ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 ${
                          errors.password && touched.password ? 'border-red-500' : ''
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                        >
                          {showPassword ? (
                            <FiEyeOff className="h-5 w-5" />
                          ) : (
                            <FiEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-500"
                    />

                    {/* Password strength indicators */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/^.{8,}$/.test(values.password) ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                        <span className="text-gray-600 dark:text-gray-400">At least 8 characters</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/[A-Z]/.test(values.password) ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                        <span className="text-gray-600 dark:text-gray-400">At least one uppercase letter</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/[a-z]/.test(values.password) ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                        <span className="text-gray-600 dark:text-gray-400">At least one lowercase letter</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/\d/.test(values.password) ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                        <span className="text-gray-600 dark:text-gray-400">At least one number</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <FiCheckCircle className={`h-4 w-4 mr-2 ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(values.password) ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                        <span className="text-gray-600 dark:text-gray-400">At least one special character</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <Field
                        as={Input}
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 ${
                          errors.confirmPassword && touched.confirmPassword
                            ? 'border-red-500'
                            : ''
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff className="h-5 w-5" />
                          ) : (
                            <FiEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Weid Management. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel with background image */}
      <div className="hidden lg:block flex-1 bg-violet-100 dark:bg-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-violet-900/50 dark:from-violet-900/50 dark:to-black/60">
          <div className="flex h-full items-center justify-center p-12">
            <div className="max-w-lg text-white">
              <h2 className="text-3xl font-bold mb-6">
                Welcome to Weid Management
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Join our platform to streamline your workflow, manage tasks efficiently, and collaborate with your team seamlessly.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FiCheckCircle className="h-6 w-6 text-green-300 mr-2 mt-0.5" />
                  <span>Powerful task management system</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="h-6 w-6 text-green-300 mr-2 mt-0.5" />
                  <span>Organized note-taking and document storage</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="h-6 w-6 text-green-300 mr-2 mt-0.5" />
                  <span>Seamless team collaboration features</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;