import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is due to an expired token and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        })

        // Get new tokens
        const { accessToken, refreshToken: newRefreshToken } = response.data.data

        // Update tokens in localStorage
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Update header and retry the original request
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')

        // We could use an event bus to notify the app to redirect to login
        // or use a more sophisticated state management solution
        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient