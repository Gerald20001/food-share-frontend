<template>
  <div class="bookings">
    <div class="container">
      <div class="bookings-header">
        <h1>{{ $t('bookings.title') }}</h1>
        <router-link to="/map" class="btn btn-primary">
          {{ $t('bookings.findMore') }}
        </router-link>
      </div>
      
      <div v-if="loading" class="empty-state">
        <p>{{ $t('common.loading') }}</p>
      </div>
      <div v-else-if="bookings.length === 0" class="empty-state">
        <p>{{ $t('bookings.noBookings') }}</p>
        <router-link to="/map" class="btn btn-primary">{{ $t('bookings.browseFood') }}</router-link>
      </div>

      <div v-else class="bookings-list">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          class="booking-card card"
        >
          <div class="booking-header">
            <div class="booking-image">
              <img
                :src="getAnnouncementImage(booking)"
                :alt="getAnnouncementTitle(booking)"
              />
            </div>
            <div class="booking-info">
              <h3>{{ getAnnouncementTitle(booking) }}</h3>
              <p class="booking-description">
                {{ getAnnouncementDescription(booking) }}
              </p>
              <div class="booking-meta">
                <span>📍 {{ getAnnouncementAddress(booking) }}</span>
                <span>⏰ {{ $t('bookings.expires') }}: {{ formatDate(getAnnouncementExpiry(booking)) }}</span>
                <span>{{ $t('bookings.requested') }}: {{ formatDateTime(booking.requestedAt) }}</span>
              </div>
              <div class="booking-status">
                <span class="status-badge" :class="`status-${booking.status}`">
                  {{ booking.status }}
                </span>
              </div>
            </div>
          </div>
          <div class="booking-actions">
            <router-link
              :to="`/announcement/${booking.announcementId}`"
              class="btn btn-secondary"
            >
              {{ $t('bookings.viewDetails') }}
            </router-link>
            <button
              v-if="booking.status === 'pending'"
              @click="cancelBooking(booking.id)"
              class="btn btn-outline"
            >
              {{ $t('bookings.cancelRequest') }}
            </button>
            <div v-if="booking.status === 'approved'" class="approved-info">
              <p>✓ {{ $t('bookings.approvedInfo') }}</p>
            </div>
            <button
              v-if="booking.status === 'completed'"
              @click="openReviewModal(booking)"
              class="btn btn-outline"
            >
              ⭐ {{ $t('bookings.leaveReview') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <ReviewModal
      :is-open="reviewModalOpen"
      :reservation-id="selectedBooking?.id"
      :target-user="targetUser"
      @close="reviewModalOpen = false"
      @submitted="handleReviewSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useBookingsStore } from '../stores/bookings'
import { useToastStore } from '../stores/toast'
import ReviewModal from '../components/common/ReviewModal.vue'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const bookingsStore = useBookingsStore()
const toastStore = useToastStore()

const bookings = ref([])
const loading = ref(true)
const reviewModalOpen = ref(false)
const selectedBooking = ref(null)
const targetUser = ref(null)

const loadBookings = async () => {
  loading.value = true
  try {
    await bookingsStore.loadBookings()
    bookings.value = bookingsStore.bookings
  } catch (error) {
    console.error('Error loading bookings:', error)
  } finally {
    loading.value = false
  }
}

const getAnnouncementTitle = (booking) => {
  return booking.announcement?.title || 'Unknown'
}

const getAnnouncementDescription = (booking) => {
  return booking.announcement?.description || ''
}

const getAnnouncementImage = (booking) => {
  const imageUrl = booking.announcement?.image || booking.announcement?.image_url
  if (!imageUrl) return 'https://via.placeholder.com/400x300'
  
  // If it's already a full URL, return it
  if (imageUrl.startsWith('http')) return imageUrl
  
  // Otherwise, construct the full URL
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'
  return `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
}

const getAnnouncementAddress = (booking) => {
  return booking.announcement?.address || 'Unknown address'
}

const getAnnouncementExpiry = (booking) => {
  return booking.announcement?.expiryDate || ''
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cancelBooking = async (id) => {
  if (confirm(t('bookings.confirmCancel') || 'Are you sure you want to cancel this booking request?')) {
    try {
      const result = await bookingsStore.cancelBooking(id)
      if (result.success) {
        toastStore.success(t('bookings.cancelSuccess') || 'Booking request cancelled')
        await loadBookings()
      } else {
        toastStore.error(result.message || t('bookings.cancelError') || 'Failed to cancel booking')
      }
    } catch (error) {
      toastStore.error(t('bookings.cancelError') || 'Failed to cancel booking')
    }
  }
}

const openReviewModal = (booking) => {
  selectedBooking.value = booking
  targetUser.value = booking.organization
  reviewModalOpen.value = true
}

const handleReviewSubmitted = async () => {
  await loadBookings()
  reviewModalOpen.value = false
  selectedBooking.value = null
  targetUser.value = null
}

onMounted(() => {
  loadBookings()
})
</script>

<style scoped>
.bookings {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.bookings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.bookings-header h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state p {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.booking-card {
  padding: 24px;
}

.booking-header {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
}

.booking-image {
  flex-shrink: 0;
}

.booking-image img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.booking-info {
  flex: 1;
}

.booking-info h3 {
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.booking-description {
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.booking-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.booking-status {
  margin-top: 12px;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: capitalize;
  font-size: 0.875rem;
  display: inline-block;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

[data-theme="dark"] .status-pending {
  background: #4a3f1e;
  color: #ffd700;
}

.status-approved {
  background: #cce5ff;
  color: #004085;
}

[data-theme="dark"] .status-approved {
  background: #1a3a5c;
  color: #6bb6ff;
}

.status-rejected {
  background: #f8d7da;
  color: #721c24;
}

[data-theme="dark"] .status-rejected {
  background: #4a1e1e;
  color: #ff6b6b;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

[data-theme="dark"] .status-completed {
  background: #1e4620;
  color: #6cce7a;
}

.booking-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.approved-info {
  flex: 1;
  padding: 12px;
  background: #d4edda;
  border-radius: 8px;
  color: #155724;
}

[data-theme="dark"] .approved-info {
  background: #1e4620;
  color: #6cce7a;
}

.approved-info p {
  margin: 0;
  font-weight: 600;
}

@media (max-width: 768px) {
  .booking-header {
    flex-direction: column;
  }

  .booking-image img {
    width: 100%;
    height: 200px;
  }
}
</style>
