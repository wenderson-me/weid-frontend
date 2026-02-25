/**
 * Security utilities for password validation and security checks
 */

/**
 * Password strength levels
 */
export const PasswordStrength = {
  WEAK: 'weak',
  FAIR: 'fair',
  GOOD: 'good',
  STRONG: 'strong',
  VERY_STRONG: 'very-strong'
}

/**
 * Password requirements
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {Object} Strength assessment
 */
export const checkPasswordStrength = (password) => {
  if (!password) {
    return {
      strength: null,
      score: 0,
      feedback: ['Password is required'],
      isValid: false
    }
  }

  let score = 0
  const feedback = []
  const checks = {
    hasMinLength: password.length >= PASSWORD_REQUIREMENTS.minLength,
    hasMaxLength: password.length <= PASSWORD_REQUIREMENTS.maxLength,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChars: new RegExp(`[${PASSWORD_REQUIREMENTS.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password),
  }

  // Check length
  if (!checks.hasMinLength) {
    feedback.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`)
  } else {
    score += 20
  }

  if (!checks.hasMaxLength) {
    feedback.push(`Password must not exceed ${PASSWORD_REQUIREMENTS.maxLength} characters`)
  }

  // Check character types
  if (!checks.hasUppercase && PASSWORD_REQUIREMENTS.requireUppercase) {
    feedback.push('Include at least one uppercase letter')
  } else if (checks.hasUppercase) {
    score += 20
  }

  if (!checks.hasLowercase && PASSWORD_REQUIREMENTS.requireLowercase) {
    feedback.push('Include at least one lowercase letter')
  } else if (checks.hasLowercase) {
    score += 20
  }

  if (!checks.hasNumbers && PASSWORD_REQUIREMENTS.requireNumbers) {
    feedback.push('Include at least one number')
  } else if (checks.hasNumbers) {
    score += 20
  }

  if (!checks.hasSpecialChars && PASSWORD_REQUIREMENTS.requireSpecialChars) {
    feedback.push('Include at least one special character (!@#$%^&*...)')
  } else if (checks.hasSpecialChars) {
    score += 20
  }

  // Additional checks for bonus points
  if (password.length >= 12) score += 5
  if (password.length >= 16) score += 5

  // Check for sequential characters (lower score)
  if (/(.)\1{2,}/.test(password)) {
    score -= 10
    feedback.push('Avoid repeating characters')
  }

  // Check for common patterns
  const commonPatterns = ['123', 'abc', 'password', 'qwerty', '111', '000']
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score -= 15
    feedback.push('Avoid common patterns')
  }

  // Determine strength level
  let strength
  if (score < 40) {
    strength = PasswordStrength.WEAK
  } else if (score < 60) {
    strength = PasswordStrength.FAIR
  } else if (score < 80) {
    strength = PasswordStrength.GOOD
  } else if (score < 100) {
    strength = PasswordStrength.STRONG
  } else {
    strength = PasswordStrength.VERY_STRONG
  }

  // Check if password meets minimum requirements
  const isValid = checks.hasMinLength &&
                  checks.hasMaxLength &&
                  (!PASSWORD_REQUIREMENTS.requireUppercase || checks.hasUppercase) &&
                  (!PASSWORD_REQUIREMENTS.requireLowercase || checks.hasLowercase) &&
                  (!PASSWORD_REQUIREMENTS.requireNumbers || checks.hasNumbers) &&
                  (!PASSWORD_REQUIREMENTS.requireSpecialChars || checks.hasSpecialChars)

  return {
    strength,
    score: Math.max(0, Math.min(100, score)),
    feedback: feedback.length > 0 ? feedback : ['Password meets requirements'],
    isValid,
    checks
  }
}

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} Validation result
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return {
      isValid: false,
      message: 'Please confirm your password'
    }
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: 'Passwords do not match'
    }
  }

  return {
    isValid: true,
    message: 'Passwords match'
  }
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate secure random string
 * @param {number} length - Length of random string
 * @returns {string} Random string
 */
export const generateSecureRandom = (length = 32) => {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} Is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expirationTime = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= expirationTime
  } catch (error) {
    console.error('Error parsing token:', error)
    return true
  }
}

/**
 * Get password strength color for UI
 * @param {string} strength - Password strength level
 * @returns {string} Tailwind color class
 */
export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case PasswordStrength.WEAK:
      return 'text-red-500'
    case PasswordStrength.FAIR:
      return 'text-orange-500'
    case PasswordStrength.GOOD:
      return 'text-yellow-500'
    case PasswordStrength.STRONG:
      return 'text-blue-500'
    case PasswordStrength.VERY_STRONG:
      return 'text-green-500'
    default:
      return 'text-gray-500'
  }
}

/**
 * Get password strength background color for progress bar
 * @param {string} strength - Password strength level
 * @returns {string} Tailwind background color class
 */
export const getPasswordStrengthBgColor = (strength) => {
  switch (strength) {
    case PasswordStrength.WEAK:
      return 'bg-red-500'
    case PasswordStrength.FAIR:
      return 'bg-orange-500'
    case PasswordStrength.GOOD:
      return 'bg-yellow-500'
    case PasswordStrength.STRONG:
      return 'bg-blue-500'
    case PasswordStrength.VERY_STRONG:
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

/**
 * Format time remaining for session
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string
 */
export const formatTimeRemaining = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}
