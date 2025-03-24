// src/pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import AuthThemeToggle from '../../components/auth/AuthThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/ToastContext';

// Esquema de validação
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const { success, error: toastError } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setApiError('');
      await forgotPassword(values.email);
      setIsSubmitted(true);
      success('Reset link sent', 'Check your email for instructions to reset your password.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link. Please try again.';
      setApiError(errorMessage);
      toastError('Request failed', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50 dark:bg-gray-900">
      {/* Theme Toggle in the top right */}
      <div className="absolute top-4 right-4">
        <AuthThemeToggle />
      </div>

      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-violet-600 dark:text-violet-400">Weid</h1>
        <p className="text-gray-600 dark:text-gray-400">Management System</p>
      </div>

      {/* Forgot Password Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link
            to="/login"
            className="flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            <FiArrowLeft className="mr-2" /> Back to login
          </Link>
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
            {isSubmitted ? 'Check Your Email' : 'Forgot Password'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apiError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <FiMail className="h-16 w-16 text-blue-500 dark:text-blue-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>
              <Button onClick={() => setIsSubmitted(false)} className="mt-4">
                Send again
              </Button>
            </div>
          ) : (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
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
                        placeholder="your@email.com"
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

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send reset link'}
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-400">Remember your password? </span>
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Weid Management. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ForgotPassword;