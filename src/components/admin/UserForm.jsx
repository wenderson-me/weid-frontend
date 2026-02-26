import { useState } from 'react'
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'

const UserForm = ({ initialUser = null, onSubmit, isLoading = false, mode = 'create' }) => {
  const isEditMode = mode === 'edit' && initialUser
  
  const [formData, setFormData] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    password: '',
    confirmPassword: '',
    role: initialUser?.role || 'user',
  })

const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' })

  // Validação de força de senha
  const checkPasswordStrength = (password) => {
    if (!password) return { score: 0, message: '' }
    
    let score = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)
    }
    
    Object.values(checks).forEach(check => {
      if (check) score++
    })
    
    const messages = {
      1: 'Senha muito fraca',
      2: 'Senha fraca',
      3: 'Senha razoável',
      4: 'Senha boa',
      5: 'Senha forte'
    }
    
    return {
      score,
      message: messages[score] || '',
      checks
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value))
    }
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validação de nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    // Validação de senha (obrigatória em modo criar)
    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Senha deve ter pelo menos 8 caracteres'
      } else if (passwordStrength.score < 3) {
        newErrors.password = 'Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais'
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem'
      }
    } else {
      // Em modo edição, senha é opcional mas se preenchida, deve ser validada
      if (formData.password || formData.confirmPassword) {
        if (formData.password.length < 8) {
          newErrors.password = 'Senha deve ter pelo menos 8 caracteres'
        } else if (passwordStrength.score < 3) {
          newErrors.password = 'Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais'
        }
        
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'As senhas não coincidem'
        }
      }
    }
    
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Preparar dados para envio
    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
    }
    
    // Incluir senha apenas se foi preenchida
    if (formData.password) {
      submitData.password = formData.password
    }
    
    onSubmit(submitData)
  }

  const strength = checkPasswordStrength(formData.password)
  const strengthColor = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-blue-500',
    5: 'bg-green-500'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="José Silva"
          className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: errors.name ? 'rgb(239, 68, 68)' : 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm flex items-center gap-1" style={{ color: 'rgb(239, 68, 68)' }}>
            <FiAlertCircle className="w-4 h-4" /> {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="usuario@exemplo.com"
          className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: errors.email ? 'rgb(239, 68, 68)' : 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
          disabled={isLoading || isEditMode}
        />
        {errors.email && (
          <p className="mt-1 text-sm flex items-center gap-1" style={{ color: 'rgb(239, 68, 68)' }}>
            <FiAlertCircle className="w-4 h-4" /> {errors.email}
          </p>
        )}
        {isEditMode && (
          <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Email não pode ser alterado
          </p>
        )}
      </div>

      {/* Papel */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Papel <span className="text-red-500">*</span>
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
          disabled={isLoading}
        >
          <option value="user">Usuário</option>
          <option value="manager">Gerenciador</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      {/* Senha */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Senha {!isEditMode && <span className="text-red-500">*</span>} {isEditMode && <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>(opcional)</span>}
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres com maiúsculas, minúsculas, números e caracteres especiais"
            className="w-full px-4 py-2 pr-12 rounded-lg border transition-colors focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: errors.password ? 'rgb(239, 68, 68)' : 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
          </button>
        </div>

        {/* Indicador de força de senha */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded transition-colors ${i <= strength.score ? strengthColor[strength.score] : 'bg-gray-300'}`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs" style={{ color: strength.score >= 4 ? 'rgb(34, 197, 94)' : strength.score >= 3 ? 'rgb(202, 138, 4)' : 'rgb(239, 68, 68)' }}>
              {strength.message}
            </p>
          </div>
        )}

        {errors.password && (
          <p className="mt-1 text-sm flex items-center gap-1" style={{ color: 'rgb(239, 68, 68)' }}>
            <FiAlertCircle className="w-4 h-4" /> {errors.password}
          </p>
        )}
      </div>

      {/* Confirmar Senha */}
      {(formData.password || !isEditMode) && (
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Confirmar Senha {!isEditMode && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar senha"
              className="w-full px-4 py-2 pr-12 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: errors.confirmPassword ? 'rgb(239, 68, 68)' : formData.password && formData.password === formData.confirmPassword ? 'rgb(34, 197, 94)' : 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm flex items-center gap-1" style={{ color: 'rgb(239, 68, 68)' }}>
              <FiAlertCircle className="w-4 h-4" /> {errors.confirmPassword}
            </p>
          )}
        </div>
      )}

      {/* Botão de Submit */}
      <div className="flex gap-3 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          {isLoading ? 'Salvando...' : isEditMode ? 'Atualizar Usuário' : 'Criar Usuário'}
        </button>
      </div>
    </form>
  )
}

export default UserForm
