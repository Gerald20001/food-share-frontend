import { defineStore } from 'pinia'
import { ref } from 'vue'
import { badgesAPI } from '../services/api'

export const useBadgesStore = defineStore('badges', () => {
  const userBadges = ref([])
  const userStats = ref(null)
  const availableBadges = ref([])
  const loading = ref(false)

  const loadUserBadges = async (userId, params = {}) => {
    loading.value = true
    try {
      const response = await badgesAPI.getUserBadges(userId, params)
      userBadges.value = response.data
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Load user badges error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to load badges' 
      }
    } finally {
      loading.value = false
    }
  }

  const loadUserStats = async (userId) => {
    try {
      const response = await badgesAPI.getUserStats(userId)
      userStats.value = response.data
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Load user stats error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to load stats' 
      }
    }
  }

  const loadAvailableBadges = async (params = {}) => {
    try {
      const response = await badgesAPI.getAvailableBadges(params)
      availableBadges.value = response.data
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Load available badges error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to load available badges' 
      }
    }
  }

  const checkBadges = async (userId) => {
    try {
      const response = await badgesAPI.checkBadges(userId)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Check badges error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to check badges' 
      }
    }
  }

  return {
    userBadges,
    userStats,
    availableBadges,
    loading,
    loadUserBadges,
    loadUserStats,
    loadAvailableBadges,
    checkBadges
  }
})

