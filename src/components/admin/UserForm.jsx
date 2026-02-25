import { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FiMail, FiLock, FiUser, FiShield, FiEye, FiEyeOff } from 'react-icons/fi'
import { checkPasswordStrength, getPasswordStrengthColor, getPasswordStrengthMessage } from '../../utils/securityUtils'
import { UserRole } from '../../hooks/useRole'

const userValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  role: Yup.string()
    .oneOf([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER], 'Invalid role')
    .required('Role is required')
})

const editUserValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters'),
  role: Yup.string()
    .oneOf([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER], 'Invalid role')
    .required('Role is required')
})

const UserForm = ({ initialUser, onSubmit, isLoading, mode = 'create' }) => {
  const [passwordStrength, setPasswordStrength] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const initialValues = {
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    password: initialUser?.password || '',
    role: initialUser?.role || UserRole.USER
  }

  const validationSchema = mode === 'edit' ? editUserValidationSchema : userValidationSchema

  const handlePasswordChange = (e) => {
    const password = e.target.value
    if (password) {
      const strength = checkPasswordStrength(password)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(null)
    }
  }

  const roleOptions = [
    { value: UserRole.ADMIN, label: 'Admin', description: 'Full system access' },
    { value: UserRole.MANAGER, label: 'Manager', description: 'Limited admin access' },
    { value: UserRole.USER, label: 'User', description: 'Regular user access' }
  ]

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <div className="flex items-center gap-2">
                <FiUser className="w-4 h-4" />
                Full Name
              </div>
            </label>
            <Field
              as="input"
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: touched.name && errors.name ? 'rgb(239, 68, 68)' : 'var(--border-color)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--primary-color)'
              }}
              disabled={isLoading}
            />
            {touched.name && errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <div className="flex items-center gap-2">
                <FiMail className="w-4 h-4" />
                Email Address
              </div>
            </label>
            <Field
              as="input"
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: touched.email && errors.email ? 'rgb(239, 68, 68)' : 'var(--border-color)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--primary-color)'
              }}
              disabled={isLoading}
            />
            {touched.email && errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <div className="flex items-center gap-2">
                <FiLock className="w-4 h-4" />
                Password {mode === 'edit' && <span className="text-xs text-gray-500">(leave empty to keep current)</span>}
              </div>
            </label>
            <div className="relative">
              <Field
                as="input"
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder={mode === 'edit' ? 'Leave empty to keep current password' : 'Enter a secure password'}
                className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 pr-10"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: touched.password && errors.password ? 'rgb(239, 68, 68)' : 'var(--border-color)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--primary-color)'
                }}
                disabled={isLoading}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {values.password && passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${(Object.keys(passwordStrength.requirements).filter(k => passwordStrength.requirements[k]).length / Object.keys(passwordStrength.requirements).length) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(passwordStrength.strength)
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: getPasswordStrengthColor(passwordStrength.strength) }}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {getPasswordStrengthMessage(passwordStrength.strength)}
                </p>
              </div>
            )}

            {touched.password && errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              <div className="flex items-center gap-2">
                <FiShield className="w-4 h-4" />
                User Role
              </div>
            </label>
            <div className="space-y-2">
              {roleOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-start p-3 rounded-lg border cursor-pointer transition-all"
                  style={{
                    backgroundColor: values.role === option.value ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-primary)',
                    borderColor: values.role === option.value ? 'rgb(59, 130, 246)' : 'var(--border-color)'
                  }}
                >
                  <Field
                    as="input"
                    type="radio"
                    name="role"
                    value={option.value}
                    className="mt-1 mr-3"
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <p
                      className="font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {option.label}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {touched.role && errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg font-medium transition-all text-white"
              style={{
                backgroundColor: isLoading || isSubmitting ? 'rgba(59, 130, 246, 0.5)' : 'var(--primary-color)',
                cursor: isLoading || isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading || isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update User' : 'Create User'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default UserForm
