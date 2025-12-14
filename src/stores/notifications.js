import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notificationsAPI } from '../services/api'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const unreadCount = ref(0)
  const preferences = ref(null)
  const loading = ref(false)

  const loadNotifications = async (params = {}) => {
    loading.value = true
    try {
      const response = await notificationsAPI.getAll(params)
      notifications.value = response.data.notifications
      unreadCount.value = notifications.value.filter(n => !n.read).length
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Load notifications error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to load notifications' 
      }
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markRead(id)
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        notification.read = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to mark as read' 
      }
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllRead()
      notifications.value.forEach(n => n.read = true)
      unreadCount.value = 0
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to mark all as read' 
      }
    }
  }

  const loadPreferences = async () => {
    try {
      const response = await notificationsAPI.getPreferences()
      preferences.value = response.data
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Load preferences error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to load preferences' 
      }
    }
  }

  const updatePreferences = async (data) => {
    try {
      const response = await notificationsAPI.updatePreferences(data)
      preferences.value = response.data
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update preferences' 
      }
    }
  }

  const subscribePush = async (subscription) => {
    try {
      await notificationsAPI.subscribePush(subscription)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to subscribe to push notifications' 
      }
    }
  }

  return {
    notifications,
    unreadCount,
    preferences,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    loadPreferences,
    updatePreferences,
    subscribePush
  }
})

