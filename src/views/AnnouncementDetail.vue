<template>
  <div class="announcement-detail">
    <div v-if="loading" class="container">
      <div class="loading-state">
        <p>{{ $t('common.loading') }}</p>
      </div>
    </div>
    <div v-else-if="announcement" class="container">
      <div class="detail-content">
        <div class="detail-image">
          <img 
            v-if="announcement.image" 
            :src="announcement.image" 
            :alt="announcement.title"
            @error="handleImageError"
          />
          <div v-else class="image-placeholder">
            <span>🍽️</span>
            <p>{{ $t('announcement.noImage') || 'No image available' }}</p>
          </div>
        </div>

        <div class="detail-info">
          <div class="detail-header">
            <div>
              <h1>{{ announcement.title }}</h1>
              <p class="detail-category">{{ $t(`map.${announcement.category}`) || announcement.category }}</p>
            </div>
            <div class="status-badge" :class="`status-${announcement.status}`">
              {{ $t(`dashboard.status.${announcement.status}`) || announcement.status }}
            </div>
          </div>

          <div class="detail-section">
            <h3>{{ $t('announcement.description') }}</h3>
            <p>{{ announcement.description }}</p>
          </div>

          <div class="detail-section">
            <h3>📍 {{ $t('announcement.location') }}</h3>
            <p>{{ announcement.address }}</p>
            <div v-if="announcement.coordinates" ref="mapContainer" class="map-preview"></div>
            <div v-else class="map-mini">
              <div class="map-placeholder-small">🗺️ {{ $t('announcement.location') }}</div>
            </div>
          </div>

          <div class="detail-section">
            <h3>⏰ {{ $t('announcement.expiryDate') }}</h3>
            <p>{{ formatDate(announcement.expiryDate) }}</p>
          </div>

          <div class="detail-section" v-if="announcement.organization && announcement.organization.id">
            <h3>{{ $t('announcement.organization') }}</h3>
            <router-link
              :to="`/profile/${announcement.organization.id}`"
              class="organization-link"
            >
              <img
                :src="getOrganizationAvatar(announcement.organization)"
                :alt="announcement.organization.name"
                class="org-avatar"
                @error="handleAvatarError"
              />
              <span>{{ announcement.organization.name || 'Unknown' }}</span>
            </router-link>
          </div>

          <div class="detail-actions">
            <template v-if="authStore.isVolunteer && announcement.status === 'active'">
              <button @click="openReservationModal" class="btn btn-primary btn-large">
                {{ $t('announcement.reserve') }}
              </button>
            </template>
            <template v-if="authStore.isOrganization && authStore.user?.id === announcement.organization.id">
              <router-link
                :to="`/announcement/edit/${announcement.id}`"
                class="btn btn-secondary"
              >
                {{ $t('announcement.edit') }}
              </router-link>
              <button @click="handleDelete" class="btn btn-outline">{{ $t('announcement.delete') }}</button>
              <button
                v-if="announcement.status === 'reserved'"
                @click="handleConfirm"
                class="btn btn-primary"
              >
                {{ $t('announcement.confirm') }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="container">
      <div class="not-found">
        <h2>{{ $t('announcement.notFound') }}</h2>
        <router-link to="/map" class="btn btn-primary">{{ $t('announcement.backToMap') }}</router-link>
      </div>
    </div>
    <ReservationModal
      :is-open="reservationModalOpen"
      :announcement="announcement"
      @close="reservationModalOpen = false"
      @success="handleReservationSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAnnouncementsStore } from '../stores/announcements'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import ReservationModal from '../components/common/ReservationModal.vue'

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const announcementsStore = useAnnouncementsStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const reservationModalOpen = ref(false)
const mapContainer = ref(null)
let map = null
let marker = null

const announcement = ref(null)
const loading = ref(true)

const loadAnnouncement = async () => {
  loading.value = true
  try {
    const data = await announcementsStore.getAnnouncementById(route.params.id)
    if (data) {
      announcement.value = data
      console.log('Loaded announcement:', data)
      console.log('Organization:', data.organization)
      console.log('Organization ID:', data.organization?.id)
      if (data.coordinates) {
        setTimeout(() => initMap(), 100)
      }
    } else {
      console.error('Announcement not found')
      announcement.value = null
    }
  } catch (error) {
    console.error('Error loading announcement:', error)
    announcement.value = null
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const openReservationModal = () => {
  if (!authStore.isAuthenticated) {
    toastStore.error(t('auth.loginRequired') || 'Please log in to reserve food')
    return
  }
  reservationModalOpen.value = true
}

const handleReservationSuccess = async () => {
  // Refresh announcement status if needed
  await loadAnnouncement()
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  const placeholder = event.target.nextElementSibling
  if (placeholder) {
    placeholder.style.display = 'flex'
  }
}

const getOrganizationAvatar = (org) => {
  if (!org) return 'https://via.placeholder.com/50'
  const avatar = org.avatar || org.avatar_url
  if (!avatar) return 'https://via.placeholder.com/50'
  return avatar.startsWith('http') ? avatar : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${avatar}`
}

const handleAvatarError = (event) => {
  event.target.src = 'https://via.placeholder.com/50'
}

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this announcement?')) {
    try {
      await announcementsStore.deleteAnnouncement(announcement.value.id)
      toastStore.success('Announcement deleted')
      router.push('/dashboard')
    } catch (error) {
      toastStore.error('Failed to delete announcement')
    }
  }
}

const handleConfirm = async () => {
  try {
    await announcementsStore.confirmReservation(announcement.value.id)
    toastStore.success('Reservation confirmed!')
  } catch (error) {
    toastStore.error('Failed to confirm reservation')
  }
}

const initMap = () => {
  if (!mapContainer.value || !announcement.value?.coordinates) return

  const { lat, lng } = announcement.value.coordinates

  if (map) {
    map.remove()
  }

  map = L.map(mapContainer.value, {
    center: [lat, lng],
    zoom: 15,
    zoomControl: true
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map)

  marker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(announcement.value.title)
    .openPopup()
}

watch(() => announcement.value?.coordinates, (newCoords) => {
  if (newCoords && mapContainer.value && !map) {
    setTimeout(() => initMap(), 100)
  }
}, { immediate: false })

onMounted(() => {
  loadAnnouncement()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
.announcement-detail {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-image {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.detail-image img {
  width: 100%;
  height: 100%;
  min-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 12px;
}

.image-placeholder span {
  font-size: 4rem;
  margin-bottom: 16px;
}

.image-placeholder p {
  font-size: 1.125rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--border-color);
}

.detail-header h1 {
  font-size: 2.5rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.detail-category {
  color: var(--accent-primary);
  font-weight: 600;
  text-transform: capitalize;
  font-size: 1.125rem;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: capitalize;
  font-size: 0.875rem;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

[data-theme="dark"] .status-active {
  background: #1e4620;
  color: #6cce7a;
}

.status-reserved {
  background: #fff3cd;
  color: #856404;
}

[data-theme="dark"] .status-reserved {
  background: #4a3f1e;
  color: #ffd700;
}

.status-confirmed {
  background: #cce5ff;
  color: #004085;
}

[data-theme="dark"] .status-confirmed {
  background: #1a3a5c;
  color: #6bb6ff;
}

.detail-section {
  margin-bottom: 32px;
}

.detail-section h3 {
  font-size: 1.25rem;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.detail-section p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.map-preview {
  margin-top: 16px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.map-mini {
  margin-top: 16px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-placeholder-small {
  color: var(--text-tertiary);
  font-size: 1.5rem;
}

.organization-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text-primary);
  padding: 12px;
  border-radius: 8px;
  background: var(--bg-secondary);
  transition: all 0.3s ease;
}

.organization-link:hover {
  background: var(--bg-tertiary);
  transform: translateX(4px);
}

.org-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.detail-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 2px solid var(--border-color);
}

.btn-large {
  padding: 16px 32px;
  font-size: 1.125rem;
}

.not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found h2 {
  font-size: 2rem;
  margin-bottom: 24px;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .detail-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .detail-image img {
    height: 300px;
  }

  .detail-header {
    flex-direction: column;
    gap: 16px;
  }

  .detail-header h1 {
    font-size: 2rem;
  }
}
</style>


