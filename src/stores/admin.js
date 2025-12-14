import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminAPI } from '../services/api'

export const useAdminStore = defineStore('admin', () => {
  const stats = ref(null)
  const users = ref([])
  const announcements = ref([])
  const loading = ref(false)

  const loadStats = async () => {
    loading.value = true
    try {
      const response = await adminAPI.getStats()
      stats.value = response.data
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Load stats error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to load statistics' 
      }
    } finally {
      loading.value = false
    }
  }

  const loadUsers = async (params = {}) => {
    loading.value = true
    try {
      const response = await adminAPI.getUsers(params)
      users.value = response.data.users
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Load users error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to load users' 
      }
    } finally {
      loading.value = false
    }
  }

  const updateUserRole = async (userId, role) => {
    try {
      await adminAPI.updateUserRole(userId, role)
      const user = users.value.find(u => u.id === userId)
      if (user) {
        user.role = role
      }
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update user role' 
      }
    }
  }

  const deleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId)
      users.value = users.value.filter(u => u.id !== userId)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete user' 
      }
    }
  }

  const loadAnnouncements = async (params = {}) => {
    loading.value = true
    try {
      const response = await adminAPI.getAnnouncements(params)
      announcements.value = response.data.announcements
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Load announcements error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to load announcements' 
      }
    } finally {
      loading.value = false
    }
  }

  const deleteAnnouncement = async (id) => {
    try {
      await adminAPI.deleteAnnouncement(id)
      announcements.value = announcements.value.filter(a => a.id !== id)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete announcement' 
      }
    }
  }

  return {
    stats,
    users,
    announcements,
    loading,
    loadStats,
    loadUsers,
    updateUserRole,
    deleteUser,
    loadAnnouncements,
    deleteAnnouncement
  }
})

