import { useState, useEffect } from 'react'
import { FiUser, FiMail, FiCamera, FiSave, FiX } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import userService from '../../services/userService'

const ProfileInfo = () => {
  const { currentUser, setCurrentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phoneNumber: '',
    avatar: ''
  })

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        phoneNumber: currentUser.phoneNumber || '',
        avatar: currentUser.avatar || ''
      })
    }
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('File must be an image')
        return
      }

      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Prepare data (only send changed fields)
      const updateData = {}
      
      if (formData.name !== currentUser.name) {
        updateData.name = formData.name
      }
      
      if (formData.bio !== currentUser.bio) {
        updateData.bio = formData.bio
      }
      
      if (formData.phoneNumber !== currentUser.phoneNumber) {
        updateData.phoneNumber = formData.phoneNumber
      }

      // Update profile
      if (Object.keys(updateData).length > 0) {
        const updatedUser = await userService.updateProfile(updateData)
        setCurrentUser(updatedUser)
      }

      // Update avatar separately if changed
      if (formData.avatar !== currentUser.avatar) {
        const updatedUser = await userService.updateAvatar(formData.avatar)
        setCurrentUser(updatedUser)
      }

      setSuccess('Profile updated successfully')
      setIsEditing(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      bio: currentUser.bio || '',
      phoneNumber: currentUser.phoneNumber || '',
      avatar: currentUser.avatar || ''
    })
    setIsEditing(false)
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div 
        className="rounded-lg p-6"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
              style={{ 
                backgroundColor: 'var(--primary-color)',
                backgroundImage: formData.avatar ? `url(${formData.avatar})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!formData.avatar && (
                <FiUser className="w-12 h-12 text-white" />
              )}
            </div>
            
            {isEditing && (
              <label 
                className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-colors"
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  color: 'white'
                }}
              >
                <FiCamera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 
              className="text-2xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {currentUser?.name}
            </h2>
            <p 
              className="flex items-center gap-2 mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <FiMail className="w-4 h-4" />
              {currentUser?.email}
            </p>
            <p 
              className="text-sm mt-2"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Member since {new Date(currentUser?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div 
          className="rounded-lg p-4 border"
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgb(239, 68, 68)',
            color: 'rgb(239, 68, 68)'
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div 
          className="rounded-lg p-4 border"
          style={{ 
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgb(34, 197, 94)',
            color: 'rgb(34, 197, 94)'
          }}
        >
          {success}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        <div 
          className="rounded-lg p-6 space-y-6"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Personal Information
            </h3>
            
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  color: 'white'
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border transition-colors"
                style={{ 
                  backgroundColor: isEditing ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                required
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 rounded-lg border cursor-not-allowed"
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-tertiary)'
                }}
              />
              <p 
                className="text-xs mt-1"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 rounded-lg border transition-colors"
                style={{ 
                  backgroundColor: isEditing ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2 rounded-lg border transition-colors resize-none"
              style={{ 
                backgroundColor: isEditing ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-2 rounded-lg border transition-colors flex items-center gap-2"
                style={{ 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'transparent'
                }}
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  color: 'white'
                }}
              >
                <FiSave className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default ProfileInfo
