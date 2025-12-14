import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isOrganization = computed(() => user.value?.role === 'organization')
  const isVolunteer = computed(() => user.value?.role === 'volunteer')

  const login = async (email, password) => {
    loading.value = true
    try {
      console.log('Attempting login with:', email)
      const response = await authAPI.login({ email, password })
      console.log('Login response:', response)
      
      // Check if response.data exists
      if (!response || !response.data) {
        console.error('Invalid response structure:', response)
        return { 
          success: false, 
          message: 'Invalid response from server' 
        }
      }
      
      const { token: authToken, user: userData } = response.data
      console.log('Extracted token and user:', { hasToken: !!authToken, hasUser: !!userData })
      
      if (!authToken || !userData) {
        console.error('Missing token or user data:', { token: authToken, user: userData })
        return { 
          success: false, 
          message: response.data.message || 'Invalid response from server' 
        }
      }
      
      user.value = userData
      token.value = authToken
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      console.log('Login successful')
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      const errorMessage = error.response?.data?.message || 
                          (Array.isArray(error.response?.data?.errors) && error.response.data.errors[0]?.msg) ||
                          error.message || 
                          'Login failed'
      return { 
        success: false, 
        message: errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      console.log('Attempting registration with:', { ...userData, password: '***' })
      const response = await authAPI.register(userData)
      console.log('Register response:', response)
      
      // Check if response.data exists
      if (!response || !response.data) {
        console.error('Invalid response structure:', response)
        return { 
          success: false, 
          message: 'Invalid response from server' 
        }
      }
      
      const { token: authToken, user: newUser } = response.data
      console.log('Extracted token and user:', { hasToken: !!authToken, hasUser: !!newUser })
      
      if (!authToken || !newUser) {
        console.error('Missing token or user data:', { token: authToken, user: newUser })
        return { 
          success: false, 
          message: response.data.message || 'Invalid response from server' 
        }
      }
      
      user.value = newUser
      token.value = authToken
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      console.log('Registration successful')
      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      const errorMessage = error.response?.data?.message || 
                          (Array.isArray(error.response?.data?.errors) && error.response.data.errors[0]?.msg) ||
                          error.message || 
                          'Registration failed'
      return { 
        success: false, 
        message: errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const initAuth = async () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      try {
        const response = await authAPI.getCurrentUser()
        // Backend returns data directly, not wrapped
        user.value = response.data || response
        if (user.value) {
          localStorage.setItem('user', JSON.stringify(user.value))
        }
      } catch (error) {
        console.error('Init auth error:', error)
        // Token invalid, clear it
        logout()
      }
    }
  }

  // Initialize on store creation
  initAuth()

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isOrganization,
    isVolunteer,
    login,
    register,
    logout,
    initAuth
  }
})
