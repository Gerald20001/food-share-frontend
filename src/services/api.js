import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Create separate instance for file uploads (without Content-Type header)
const uploadApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

// Request interceptor to add auth token and language
const requestInterceptor = (config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Add language to query params (only for non-upload requests)
  if (!config.headers['Content-Type'] || !config.headers['Content-Type'].includes('multipart')) {
    const language = localStorage.getItem('language') || 'en'
    if (config.params) {
      config.params.language = language
    } else {
      config.params = { language }
    }
  }
  
  return config
}

api.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error))
uploadApi.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error))

// Response interceptor for error handling
const responseInterceptor = (response) => {
  // Log response for debugging
  if (import.meta.env.DEV) {
    console.log('API Response:', response.config?.url, response.status, response.data)
  }
  return response
}
const errorInterceptor = (error) => {
  // Log error for debugging
  console.error('API Error:', error.config?.url, error.response?.status, error.response?.data)
  
  // Don't redirect on 401 for auth endpoints - let the component handle it
  if (error.response?.status === 401) {
    const url = error.config?.url || ''
    if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Only redirect if not already on home page
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }
  }
  return Promise.reject(error)
}

api.interceptors.response.use(responseInterceptor, errorInterceptor)
uploadApi.interceptors.response.use(responseInterceptor, errorInterceptor)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
}

export const announcementsAPI = {
  getAll: (params) => {
    const language = localStorage.getItem('language') || 'en'
    return api.get('/announcements', { 
      params: { ...params, language } 
    })
  },
  getById: (id) => {
    const language = localStorage.getItem('language') || 'en'
    return api.get(`/announcements/${id}`, { 
      params: { language } 
    })
  },
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`)
}

export const reviewsAPI = {
  getByUser: (userId) => api.get(`/reviews/user/${userId}`),
  create: (data) => api.post('/reviews', data),
  getStats: (userId) => api.get(`/reviews/stats/${userId}`)
}

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return uploadApi.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  uploadAvatar: (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return uploadApi.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  uploadCover: (file) => {
    const formData = new FormData()
    formData.append('cover', file)
    return uploadApi.post('/upload/cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  changePassword: (id, data) => api.post(`/users/${id}/change-password`, data),
  updateAvatar: (id, avatarUrl) => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'
    const fullUrl = avatarUrl.startsWith('http') ? avatarUrl : `${baseUrl}${avatarUrl}`
    return api.put(`/users/${id}`, { avatar: fullUrl })
  },
  updateCover: (id, coverUrl) => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'
    const fullUrl = coverUrl.startsWith('http') ? coverUrl : `${baseUrl}${coverUrl}`
    return api.put(`/users/${id}`, { coverImage: fullUrl })
  }
}

export const reservationsAPI = {
  getOrganizationReservations: () => api.get('/reservations/organization'),
  getVolunteerBookings: () => api.get('/reservations/volunteer'),
  create: (data) => api.post('/reservations', data),
  approve: (id) => api.post(`/reservations/${id}/approve`),
  reject: (id) => api.post(`/reservations/${id}/reject`),
  complete: (id) => api.post(`/reservations/${id}/complete`),
  cancel: (id) => api.delete(`/reservations/${id}`)
}

export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  getPreferences: () => api.get('/notifications/preferences'),
  updatePreferences: (data) => api.put('/notifications/preferences', data),
  subscribePush: (subscription) => api.post('/notifications/push/subscribe', subscription),
  unsubscribePush: (endpoint) => api.post('/notifications/push/unsubscribe', { endpoint }),
  getVapidKey: () => api.get('/notifications/push/vapid-key')
}

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAnnouncements: (params) => api.get('/admin/announcements', { params }),
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`)
}

export const badgesAPI = {
  getUserBadges: (userId, params) => api.get(`/badges/user/${userId}`, { params }),
  getUserStats: (userId) => api.get(`/badges/stats/${userId}`),
  getAvailableBadges: (params) => api.get('/badges/available', { params }),
  checkBadges: (userId) => api.post(`/badges/check/${userId}`),
  awardBadge: (userId, badgeId) => api.post('/badges/award', { userId, badgeId }),
  removeBadge: (userId, badgeId) => api.delete(`/badges/award/${userId}/${badgeId}`)
}

export const publicAPI = {
  getStats: () => api.get('/public/stats')
}

export default api
