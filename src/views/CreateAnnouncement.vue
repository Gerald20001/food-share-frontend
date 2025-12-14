<template>
  <div class="create-announcement">
    <div class="container">
      <div class="form-container">
        <h1>{{ isEdit ? $t('createAnnouncement.editTitle') : $t('createAnnouncement.title') }}</h1>

        <form @submit.prevent="handleSubmit" class="announcement-form">
          <div class="form-group">
            <label>{{ $t('createAnnouncement.titleLabel') }} *</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="input"
              placeholder="e.g., Fresh Pastries from Bakery"
            />
          </div>

          <div class="form-group">
            <label>{{ $t('createAnnouncement.descriptionLabel') }} *</label>
            <textarea
              v-model="form.description"
              required
              class="input"
              rows="4"
              placeholder="Describe the food available..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('createAnnouncement.categoryLabel') }} *</label>
              <select v-model="form.category" required class="input">
                <option value="">{{ $t('createAnnouncement.selectCategory') }}</option>
                <option value="bakery">{{ $t('map.bakery') }}</option>
                <option value="vegetables">{{ $t('map.vegetables') }}</option>
                <option value="dairy">{{ $t('map.dairy') }}</option>
                <option value="fruits">{{ $t('map.fruits') }}</option>
                <option value="prepared">{{ $t('map.prepared') }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ $t('createAnnouncement.expiryDateLabel') }} *</label>
              <input
                v-model="form.expiryDate"
                type="date"
                required
                class="input"
                :min="minDate"
              />
            </div>
          </div>

          <div class="form-group">
            <label>{{ $t('createAnnouncement.addressLabel') }} *</label>
            <input
              v-model="form.address"
              type="text"
              required
              class="input"
              :placeholder="$t('createAnnouncement.addressPlaceholder')"
              @blur="geocodeAddress"
            />
          </div>

          <div class="form-row" v-if="form.coordinates.lat">
            <div class="form-group">
              <label>{{ $t('createAnnouncement.latitude') }}</label>
              <input
                v-model.number="form.coordinates.lat"
                type="number"
                step="any"
                class="input"
                readonly
              />
            </div>
            <div class="form-group">
              <label>{{ $t('createAnnouncement.longitude') }}</label>
              <input
                v-model.number="form.coordinates.lng"
                type="number"
                step="any"
                class="input"
                readonly
              />
            </div>
          </div>

          <div class="form-group">
            <label>{{ $t('createAnnouncement.imageLabel') }}</label>
            <div class="image-upload">
              <input
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="file-input"
                id="image-upload"
              />
              <label for="image-upload" class="file-label">
                <span v-if="!imagePreview">{{ $t('createAnnouncement.chooseImage') }}</span>
                <span v-else>{{ $t('createAnnouncement.changeImage') }}</span>
              </label>
              <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="Preview" />
                <button type="button" @click="clearImage" class="remove-image">×</button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? $t('createAnnouncement.saving') : isEdit ? $t('createAnnouncement.update') : $t('createAnnouncement.create') }}
            </button>
            <router-link to="/dashboard" class="btn btn-secondary">{{ $t('common.cancel') }}</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAnnouncementsStore } from '../stores/announcements'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const announcementsStore = useAnnouncementsStore()
const toastStore = useToastStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const imagePreview = ref(null)

const form = ref({
  title: '',
  description: '',
  category: '',
  expiryDate: '',
  address: '',
  coordinates: {
    lat: null,
    lng: null
  },
  image: null
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const geocodeAddress = async () => {
  if (!form.value.address) return
  
  try {
    // Use Nominatim (OpenStreetMap) geocoding API
    const encodedAddress = encodeURIComponent(form.value.address + ', Ukraine')
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`, {
      headers: {
        'User-Agent': 'FoodShare App' // Nominatim requires a User-Agent
      }
    })
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      form.value.coordinates = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      }
      toastStore.success('Address geocoded successfully')
    } else {
      toastStore.error('Could not find coordinates for this address')
      form.value.coordinates = { lat: null, lng: null }
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    toastStore.error('Failed to geocode address. Please enter coordinates manually.')
    form.value.coordinates = { lat: null, lng: null }
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.image = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const clearImage = () => {
  form.value.image = null
  imagePreview.value = null
  const input = document.getElementById('image-upload')
  if (input) input.value = ''
}

const loadAnnouncement = async () => {
  if (isEdit.value) {
    loading.value = true
    try {
      const announcement = await announcementsStore.getAnnouncementById(route.params.id)
      if (announcement) {
        form.value = {
          title: announcement.title,
          description: announcement.description,
          category: announcement.category,
          expiryDate: announcement.expiryDate,
          address: announcement.address,
          coordinates: announcement.coordinates || { lat: null, lng: null },
          image: null
        }
        imagePreview.value = announcement.image
      }
    } catch (error) {
      toastStore.error('Failed to load announcement')
    } finally {
      loading.value = false
    }
  }
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // Ensure address is included
    if (!form.value.address) {
      toastStore.error('Address is required')
      loading.value = false
      return
    }

    const result = isEdit.value 
      ? await announcementsStore.updateAnnouncement(route.params.id, form.value)
      : await announcementsStore.createAnnouncement(form.value)
    
    if (result.success) {
      toastStore.success(isEdit.value ? t('createAnnouncement.updateSuccess') : t('createAnnouncement.success'))
      router.push('/dashboard')
    } else {
      toastStore.error(result.message || t('common.error'))
    }
  } catch (error) {
    toastStore.error(error.message || 'Failed to save announcement')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await announcementsStore.loadAnnouncements()
  await loadAnnouncement()
})
</script>

<style scoped>
.create-announcement {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.form-container h1 {
  font-size: 2.5rem;
  margin-bottom: 32px;
  color: var(--text-primary);
}

.announcement-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
}

textarea.input {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.image-upload {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-input {
  display: none;
}

.file-label {
  padding: 12px 24px;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
  font-weight: 600;
}

.file-label:hover {
  background: var(--bg-tertiary);
  border-color: var(--accent-primary);
}

.image-preview {
  position: relative;
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-image:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-container h1 {
    font-size: 2rem;
  }
}
</style>


