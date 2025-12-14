<template>
  <div class="map-page">
    <div class="map-container">
      <div class="map-filters card">
        <h2>{{ $t('map.title') }}</h2>
        <div class="filter-group">
          <label>{{ $t('map.searchByName') }}</label>
          <input
            v-model="filters.search"
            type="text"
            class="input"
            placeholder="Search announcements..."
            @input="debounceSearch"
          />
        </div>
        <div class="filter-group">
          <label>{{ $t('map.searchByAddress') }}</label>
          <input
            v-model="filters.address"
            type="text"
            class="input"
            placeholder="Enter address..."
            @input="debounceAddressSearch"
          />
        </div>
        <div class="filter-group">
          <label>{{ $t('map.category') }}</label>
          <select v-model="filters.category" class="input">
            <option value="">{{ $t('map.allCategories') }}</option>
            <option value="bakery">{{ $t('map.bakery') }}</option>
            <option value="vegetables">{{ $t('map.vegetables') }}</option>
            <option value="dairy">{{ $t('map.dairy') }}</option>
            <option value="fruits">{{ $t('map.fruits') }}</option>
            <option value="prepared">{{ $t('map.prepared') }}</option>
          </select>
        </div>
        <button @click="clearFilters" class="btn btn-secondary">{{ $t('map.clearFilters') }}</button>
        
        <div class="location-controls">
          <button @click="getCurrentLocation" class="btn btn-primary">
            📍 {{ $t('map.getMyLocation') || 'Get My Location' }}
          </button>
          <button 
            v-if="userLocation && routeToAnnouncement && L.Routing" 
            @click="toggleRoute" 
            class="btn btn-outline"
            :class="{ active: showRoute }"
          >
            {{ showRoute ? '🚫 ' : '🗺️ ' }}{{ showRoute ? ($t('map.hideRoute') || 'Hide Route') : ($t('map.showRoute') || 'Show Route') }}
          </button>
        </div>
        
        <div class="announcements-list">
          <h3>{{ $t('map.availableFood') }} ({{ filteredAnnouncements.length }})</h3>
          <div class="markers-list">
            <div
              v-for="announcement in filteredAnnouncements"
              :key="announcement.id"
              class="marker-item card"
              :class="{ active: selectedAnnouncement?.id === announcement.id }"
              @click="selectAnnouncement(announcement)"
            >
              <img :src="announcement.image" :alt="announcement.title" class="marker-image" />
              <div class="marker-info">
                <h4>{{ announcement.title }}</h4>
                <p class="marker-address">📍 {{ announcement.address }}</p>
                <p class="marker-category">{{ announcement.category }}</p>
                  <router-link
                    :to="`/announcement/${announcement.id}`"
                    class="btn btn-primary btn-sm"
                  >
                    {{ $t('common.view') }}
                  </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="map-wrapper">
        <div ref="mapContainer" class="map-container-leaflet"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAnnouncementsStore } from '../stores/announcements'
import { useToastStore } from '../stores/toast'
import SkeletonLoader from '../components/common/SkeletonLoader.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// Routing will be checked at runtime - if L.Routing exists, it's available

// Fix for default marker icons in Leaflet with Vite
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

const { t } = useI18n()
const announcementsStore = useAnnouncementsStore()
const toastStore = useToastStore()
const mapContainer = ref(null)
let map = null
let markers = []

const filters = ref({
  search: '',
  address: '',
  category: ''
})

const selectedAnnouncement = ref(null)
let routingControl = null
let userLocation = ref(null)
let userMarker = null
const showRoute = ref(false)
const routeToAnnouncement = ref(null)

let searchTimeout = null
let addressTimeout = null

const filteredAnnouncements = computed(() => {
  let filtered = [...announcementsStore.announcements]
  
  // Exclude completed and cancelled announcements from map
  filtered = filtered.filter(a => 
    a.status !== 'completed' && a.status !== 'cancelled'
  )

  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(searchLower) ||
      a.description.toLowerCase().includes(searchLower)
    )
  }

  if (filters.value.address) {
    const addressLower = filters.value.address.toLowerCase()
    filtered = filtered.filter(a =>
      a.address.toLowerCase().includes(addressLower)
    )
  }

  if (filters.value.category) {
    filtered = filtered.filter(a => a.category === filters.value.category)
  }

  return filtered
})

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    updateMapMarkers()
  }, 300)
}

const debounceAddressSearch = () => {
  clearTimeout(addressTimeout)
  addressTimeout = setTimeout(() => {
    updateMapMarkers()
  }, 500)
}

const clearFilters = () => {
  filters.value = {
    search: '',
    address: '',
    category: ''
  }
  updateMapMarkers()
}

const selectAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement
  routeToAnnouncement.value = announcement
  // Center map on selected announcement
  if (map && announcement.coordinates) {
    map.setView([announcement.coordinates.lat, announcement.coordinates.lng], 15)
    // Open popup for the marker
    markers.forEach(marker => {
      if (marker.announcementId === announcement.id) {
        marker.openPopup()
      }
    })
    // Show route if user location is available and route is enabled
    if (userLocation.value && showRoute.value) {
      showRouteToAnnouncement(announcement)
    }
  }
}

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        // Remove existing user marker
        if (userMarker && map) {
          map.removeLayer(userMarker)
        }
        // Add user location marker
        if (map) {
          userMarker = L.marker([userLocation.value.lat, userLocation.value.lng], {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: '<div class="user-location-pin">📍</div>',
              iconSize: [30, 30],
              iconAnchor: [15, 30]
            })
          }).addTo(map)
          userMarker.bindPopup('Your location').openPopup()
          
          // Fit map to show user and announcements
          if (markers.length > 0) {
            const group = new L.featureGroup([userMarker, ...markers])
            map.fitBounds(group.getBounds().pad(0.1))
          } else {
            map.setView([userLocation.value.lat, userLocation.value.lng], 13)
          }
          
          // Show route if enabled
          if (showRoute.value && routeToAnnouncement.value) {
            showRouteToAnnouncement(routeToAnnouncement.value)
          }
        }
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
  }
}

const showRouteToAnnouncement = (announcement) => {
  if (!map || !userLocation.value || !announcement.coordinates) return
  
  // Check if routing is available
  if (!L.Routing || !L.Routing.control) {
    toastStore.showToast('Routing feature is not available. Please install leaflet-routing-machine.', 'info')
    return
  }

  // Remove existing route
  if (routingControl) {
    map.removeControl(routingControl)
    routingControl = null
  }

  // Add new route using OSRM
  try {
    if (L.Routing && L.Routing.control && L.Routing.osrmv1) {
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.value.lat, userLocation.value.lng),
          L.latLng(announcement.coordinates.lat, announcement.coordinates.lng)
        ],
        routeWhileDragging: false,
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          profile: 'driving'
        }),
        lineOptions: {
          styles: [
            { color: '#667eea', opacity: 0.8, weight: 5 }
          ]
        },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false
      }).addTo(map)
    }
  } catch (error) {
    console.error('Error creating route:', error)
    toastStore.showToast('Failed to create route', 'error')
  }
}

const toggleRoute = () => {
  showRoute.value = !showRoute.value
  if (showRoute.value && routeToAnnouncement.value && userLocation.value) {
    showRouteToAnnouncement(routeToAnnouncement.value)
  } else if (routingControl) {
    map.removeControl(routingControl)
    routingControl = null
  }
}

const initMap = () => {
  if (!mapContainer.value) return

  // Initialize map centered on Kyiv (or first announcement if available)
  const defaultCenter = filteredAnnouncements.value.length > 0 && filteredAnnouncements.value[0].coordinates
    ? [filteredAnnouncements.value[0].coordinates.lat, filteredAnnouncements.value[0].coordinates.lng]
    : [50.4501, 30.5234] // Kyiv, Ukraine

  map = L.map(mapContainer.value, {
    center: defaultCenter,
    zoom: 12,
    zoomControl: true
  })

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map)

  updateMapMarkers()
}

const updateMapMarkers = () => {
  // Remove existing markers
  markers.forEach(marker => {
    map.removeLayer(marker)
  })
  markers = []

  if (!map || filteredAnnouncements.value.length === 0) return

  // Add markers for filtered announcements
  filteredAnnouncements.value.forEach(announcement => {
    if (!announcement.coordinates) return

    const { lat, lng } = announcement.coordinates

    // Create custom icon based on category
    const categoryColors = {
      bakery: '#ff6b6b',
      vegetables: '#51cf66',
      dairy: '#339af0',
      fruits: '#ffd43b',
      prepared: '#ff922b'
    }

    const categoryIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-pin" style="background-color: ${categoryColors[announcement.category] || '#28a745'}">
          <span class="marker-emoji">${getCategoryEmoji(announcement.category)}</span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    })

    const marker = L.marker([lat, lng], { icon: categoryIcon })
      .addTo(map)
      .bindPopup(`
        <div class="map-popup">
          <img src="${announcement.image}" alt="${announcement.title}" class="popup-image" />
          <h3>${announcement.title}</h3>
          <p class="popup-category">${announcement.category}</p>
          <p class="popup-address">📍 ${announcement.address}</p>
          <p class="popup-description">${announcement.description.substring(0, 100)}...</p>
          <a href="/announcement/${announcement.id}" class="popup-link">View Details →</a>
        </div>
      `)

    marker.announcementId = announcement.id
    markers.push(marker)
  })

  // Fit map to show all markers
  if (markers.length > 0) {
    const group = new L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.1))
  }
}

const getCategoryEmoji = (category) => {
  const emojis = {
    bakery: '🥖',
    vegetables: '🥬',
    dairy: '🥛',
    fruits: '🍎',
    prepared: '🍱'
  }
  return emojis[category] || '🍽️'
}

// Watch for changes in filtered announcements
watch(filteredAnnouncements, () => {
  if (map) {
    updateMapMarkers()
  }
}, { deep: true })

onMounted(async () => {
  try {
    const result = await announcementsStore.loadAnnouncements()
    if (result.success) {
      // Initialize map after DOM is ready and data is loaded
      setTimeout(() => {
        initMap()
        // Try to get user location
        getCurrentLocation()
      }, 300)
    } else {
      console.error('Failed to load announcements:', result.message)
    }
  } catch (error) {
    console.error('Error loading announcements:', error)
    // Still try to initialize map even if loading fails
    setTimeout(() => {
      initMap()
      getCurrentLocation()
    }, 300)
  }
})

onBeforeUnmount(() => {
  if (routingControl) {
    map.removeControl(routingControl)
  }
  if (userMarker) {
    map.removeLayer(userMarker)
  }
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
.map-page {
  min-height: calc(100vh - 200px);
  padding: 24px 0;
}

.map-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  height: calc(100vh - 150px);
}

.map-filters {
  overflow-y: auto;
  height: 100%;
}

.map-filters h2 {
  margin-bottom: 24px;
  color: var(--text-primary);
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.location-controls {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.location-controls .btn.active {
  background: var(--accent-primary);
  color: white;
}

.announcements-list {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid var(--border-color);
}

.announcements-list h3 {
  font-size: 1.125rem;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.markers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
}

.marker-item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 12px;
}

.marker-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.marker-item.active {
  border: 2px solid var(--accent-primary);
  background: var(--bg-tertiary);
}

.marker-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.marker-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.marker-info h4 {
  color: var(--text-primary);
  font-size: 1rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.marker-address {
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin: 0;
}

.marker-category {
  color: var(--accent-primary);
  font-weight: 600;
  text-transform: capitalize;
  font-size: 0.75rem;
  margin: 0;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.75rem;
  margin-top: auto;
  align-self: flex-start;
}

.map-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  background: var(--bg-secondary);
}

.map-container-leaflet {
  width: 100%;
  height: 100%;
  min-height: 600px;
}

/* Custom marker styles */
:deep(.custom-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-pin) {
  width: 40px;
  height: 40px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 3px solid white;
}

:deep(.marker-emoji) {
  transform: rotate(45deg);
  font-size: 20px;
}

:deep(.user-location-pin) {
  font-size: 24px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* Popup styles */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  padding: 0;
  background: var(--bg-primary);
  color: var(--text-primary);
}

:deep(.leaflet-popup-content) {
  margin: 0;
  padding: 16px;
  min-width: 250px;
}

:deep(.map-popup) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.popup-image) {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}

:deep(.map-popup h3) {
  margin: 0;
  font-size: 1.125rem;
  color: var(--text-primary);
}

:deep(.popup-category) {
  color: var(--accent-primary);
  font-weight: 600;
  text-transform: capitalize;
  font-size: 0.875rem;
  margin: 0;
}

:deep(.popup-address) {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

:deep(.popup-description) {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0;
}

:deep(.popup-link) {
  display: inline-block;
  margin-top: 8px;
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

:deep(.popup-link:hover) {
  color: var(--accent-hover);
}

@media (max-width: 1024px) {
  .map-container {
    grid-template-columns: 300px 1fr;
  }
}

@media (max-width: 768px) {
  .map-container {
    grid-template-columns: 1fr;
    height: auto;
  }

  .map-filters {
    max-height: 400px;
  }

  .map-wrapper {
    min-height: 400px;
  }

  .map-container-leaflet {
    min-height: 400px;
  }

  .markers-list {
    max-height: 300px;
  }
}

/* Leaflet Routing Machine styles */
:deep(.leaflet-routing-container) {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

:deep(.leaflet-routing-container h2) {
  color: var(--text-primary);
}

:deep(.leaflet-routing-alt) {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

:deep(.leaflet-routing-alt-minimized) {
  background: var(--bg-secondary);
}
</style>
