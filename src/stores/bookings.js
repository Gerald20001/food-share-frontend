import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reservationsAPI } from '../services/api'

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref([])
  const reservations = ref([]) // For organizations to see volunteer requests
  const loading = ref(false)

  const loadReservations = async () => {
    loading.value = true
    try {
      const response = await reservationsAPI.getOrganizationReservations()
      reservations.value = response.data
      return { success: true }
    } catch (error) {
      console.error('Load reservations error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to load reservations' 
      }
    } finally {
      loading.value = false
    }
  }

  const loadBookings = async () => {
    loading.value = true
    try {
      const response = await reservationsAPI.getVolunteerBookings()
      bookings.value = response.data
      return { success: true }
    } catch (error) {
      console.error('Load bookings error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to load bookings' 
      }
    } finally {
      loading.value = false
    }
  }

  const createReservation = async (announcementId, message) => {
    loading.value = true
    try {
      const response = await reservationsAPI.create({
        announcementId,
        message: message || null
      })
      return { success: true, id: response.data.id }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create reservation' 
      }
    } finally {
      loading.value = false
    }
  }

  const approveReservation = async (id) => {
    loading.value = true
    try {
      await reservationsAPI.approve(id)
      await loadReservations()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to approve reservation' 
      }
    } finally {
      loading.value = false
    }
  }

  const rejectReservation = async (id) => {
    loading.value = true
    try {
      await reservationsAPI.reject(id)
      await loadReservations()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reject reservation' 
      }
    } finally {
      loading.value = false
    }
  }

  const cancelBooking = async (id) => {
    loading.value = true
    try {
      await reservationsAPI.cancel(id)
      await loadBookings()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to cancel booking' 
      }
    } finally {
      loading.value = false
    }
  }

  const completeReservation = async (id) => {
    loading.value = true
    try {
      await reservationsAPI.complete(id)
      await loadReservations()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to complete reservation' 
      }
    } finally {
      loading.value = false
    }
  }

  return {
    bookings,
    reservations,
    loading,
    loadBookings,
    loadReservations,
    createReservation,
    approveReservation,
    rejectReservation,
    cancelBooking,
    completeReservation
  }
})
