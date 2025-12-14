import { defineStore } from 'pinia'
import { ref } from 'vue'
import { announcementsAPI } from '../services/api'

export const useAnnouncementsStore = defineStore('announcements', () => {
  const announcements = ref([])
  const selectedAnnouncement = ref(null)
  const filters = ref({
    search: '',
    address: '',
    category: ''
  })
  const loading = ref(false)

  const loadAnnouncements = async (params = {}) => {
    loading.value = true
    try {
      const queryParams = {
        ...params,
        ...(filters.value.search && { search: filters.value.search }),
        ...(filters.value.category && { category: filters.value.category }),
        ...(filters.value.address && { address: filters.value.address })
      }
      
      // Exclude completed announcements from map view
      if (!params.includeCompleted) {
        queryParams.status = 'active,reserved,confirmed'
      }
      
      const response = await announcementsAPI.getAll(queryParams)
      // Check if response.data is an array
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || [])
      // Transform data to match frontend format
      let mappedData = data.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        category: a.category,
        address: a.address,
        coordinates: a.latitude && a.longitude ? { lat: parseFloat(a.latitude), lng: parseFloat(a.longitude) } : null,
        expiryDate: a.expiry_date,
        image: a.image_url ? (a.image_url.startsWith('http') ? a.image_url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${a.image_url}`) : null,
        status: a.status,
        organization: {
          id: a.organization_id,
          name: a.organization_name,
          avatar: a.organization_avatar
        },
        createdAt: a.created_at
      }))
      
      // Filter out completed announcements if not explicitly included
      if (!params.includeCompleted) {
        mappedData = mappedData.filter(a => a.status !== 'completed' && a.status !== 'cancelled')
      }
      
      announcements.value = mappedData
      return { success: true }
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

  const getAnnouncementById = async (id) => {
    try {
      const response = await announcementsAPI.getById(id)
      const a = response.data
      
      // Backend returns image or image_url, coordinates or latitude/longitude
      const imageUrl = a.image || a.image_url
      const image = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`) : null
      
      // Handle coordinates - can be object or separate lat/lng
      let coordinates = null
      if (a.coordinates && a.coordinates.lat && a.coordinates.lng) {
        coordinates = { lat: parseFloat(a.coordinates.lat), lng: parseFloat(a.coordinates.lng) }
      } else if (a.latitude && a.longitude) {
        coordinates = { lat: parseFloat(a.latitude), lng: parseFloat(a.longitude) }
      }
      
      // Transform data to match frontend format
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        category: a.category,
        address: a.address,
        coordinates: coordinates,
        expiryDate: a.expiry_date || a.expiryDate,
        image: image,
        status: a.status,
        organization: a.organization || {
          id: a.organization_id,
          name: a.organization_name || 'Unknown',
          avatar: a.organization_avatar || null
        },
        createdAt: a.created_at || a.createdAt
      }
    } catch (error) {
      console.error('Get announcement error:', error)
      return null
    }
  }

  const createAnnouncement = async (announcementData) => {
    loading.value = true
    try {
      let imageUrl = null
      
      // Upload image if provided
      if (announcementData.image && announcementData.image instanceof File) {
        const { uploadAPI } = await import('../services/api')
        const uploadResponse = await uploadAPI.uploadImage(announcementData.image)
        imageUrl = uploadResponse.data.url
      } else if (announcementData.image) {
        imageUrl = announcementData.image
      }
      
      const response = await announcementsAPI.create({
        titleEn: announcementData.title,
        titleUk: announcementData.titleUk || null,
        descriptionEn: announcementData.description,
        descriptionUk: announcementData.descriptionUk || null,
        category: announcementData.category,
        address: announcementData.address,
        latitude: announcementData.coordinates?.lat || null,
        longitude: announcementData.coordinates?.lng || null,
        expiryDate: announcementData.expiryDate,
        imageUrl: imageUrl
      })
      
      // Reload announcements
      await loadAnnouncements()
      return { success: true, id: response.data.id }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create announcement' 
      }
    } finally {
      loading.value = false
    }
  }

  const updateAnnouncement = async (id, updates) => {
    loading.value = true
    try {
      let imageUrl = updates.imageUrl
      
      // Upload image if it's a new file
      if (updates.image && updates.image instanceof File) {
        const { uploadAPI } = await import('../services/api')
        const uploadResponse = await uploadAPI.uploadImage(updates.image)
        imageUrl = uploadResponse.data.url
      } else if (updates.image && !updates.image.startsWith('http')) {
        imageUrl = updates.image
      }
      
      await announcementsAPI.update(id, {
        titleEn: updates.title,
        titleUk: updates.titleUk || null,
        descriptionEn: updates.description,
        descriptionUk: updates.descriptionUk || null,
        category: updates.category,
        address: updates.address,
        latitude: updates.coordinates?.lat || null,
        longitude: updates.coordinates?.lng || null,
        expiryDate: updates.expiryDate,
        imageUrl: imageUrl,
        status: updates.status
      })
      
      await loadAnnouncements()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update announcement' 
      }
    } finally {
      loading.value = false
    }
  }

  const deleteAnnouncement = async (id) => {
    loading.value = true
    try {
      await announcementsAPI.delete(id)
      await loadAnnouncements()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete announcement' 
      }
    } finally {
      loading.value = false
    }
  }

  return {
    announcements,
    selectedAnnouncement,
    filters,
    loading,
    loadAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  }
})
