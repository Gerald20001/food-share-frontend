<template>
  <div class="dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1>{{ $t('dashboard.title') }}</h1>
        <router-link to="/announcement/create" class="btn btn-primary">
          {{ $t('dashboard.createNew') }}
        </router-link>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card card">
          <div class="stat-value">{{ announcements.length }}</div>
          <div class="stat-label">{{ $t('dashboard.totalAnnouncements') }}</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">{{ activeCount }}</div>
          <div class="stat-label">{{ $t('dashboard.active') }}</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">{{ pendingReservations.length }}</div>
          <div class="stat-label">{{ $t('dashboard.pendingRequests') }}</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">{{ confirmedCount }}</div>
          <div class="stat-label">{{ $t('dashboard.confirmed') }}</div>
        </div>
      </div>

      <!-- Pending Reservations Section -->
      <div v-if="pendingReservations.length > 0" class="reservations-section">
        <h2>{{ $t('dashboard.pendingVolunteerRequests') }}</h2>
        <div class="reservations-list">
          <div
            v-for="reservation in pendingReservations"
            :key="reservation.id"
            class="reservation-card card"
          >
            <div class="reservation-header">
              <div class="volunteer-info">
                <img
                  :src="reservation.volunteer.avatar"
                  :alt="reservation.volunteer.name"
                  class="volunteer-avatar"
                />
                <div>
                  <h3>{{ reservation.volunteer.name }}</h3>
                  <p class="volunteer-contact">
                    📧 {{ reservation.volunteer.email }}
                    <span v-if="reservation.volunteer.phone">| 📱 {{ reservation.volunteer.phone }}</span>
                  </p>
                </div>
              </div>
              <span class="status-badge status-pending">{{ $t('dashboard.requested') }}</span>
            </div>

            <div class="reservation-details">
              <div class="announcement-preview">
                <img
                  :src="getAnnouncementImage(reservation.announcementId)"
                  :alt="getAnnouncementTitle(reservation.announcementId)"
                  class="preview-image"
                />
                <div>
                  <h4>{{ getAnnouncementTitle(reservation.announcementId) }}</h4>
                  <p class="preview-address">
                    📍 {{ getAnnouncementAddress(reservation.announcementId) }}
                  </p>
                </div>
              </div>
              <div v-if="reservation.message" class="volunteer-message">
                <strong>{{ $t('dashboard.message') }}:</strong>
                <p>{{ reservation.message }}</p>
              </div>
              <div class="reservation-meta">
                <span>{{ $t('dashboard.requested') }}: {{ formatDateTime(reservation.requestedAt) }}</span>
              </div>
            </div>

            <div class="reservation-actions">
              <button
                @click="approveReservation(reservation.id)"
                class="btn btn-primary"
              >
                ✓ {{ $t('dashboard.approve') }}
              </button>
              <button
                @click="rejectReservation(reservation.id)"
                class="btn btn-outline"
              >
                ✕ {{ $t('dashboard.reject') }}
              </button>
              <router-link
                :to="`/announcement/${reservation.announcementId}`"
                class="btn btn-secondary"
              >
                {{ $t('dashboard.viewAnnouncement') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Approved Reservations -->
      <div v-if="approvedReservations.length > 0" class="reservations-section">
        <h2>{{ $t('dashboard.approvedReservations') }}</h2>
        <div class="reservations-list">
          <div
            v-for="reservation in approvedReservations"
            :key="reservation.id"
            class="reservation-card card"
          >
            <div class="reservation-header">
              <div class="volunteer-info">
                <img
                  :src="reservation.volunteer.avatar"
                  :alt="reservation.volunteer.name"
                  class="volunteer-avatar"
                />
                <div>
                  <h3>{{ reservation.volunteer.name }}</h3>
                  <p class="volunteer-contact">
                    📧 {{ reservation.volunteer.email }}
                    <span v-if="reservation.volunteer.phone">| 📱 {{ reservation.volunteer.phone }}</span>
                  </p>
                </div>
              </div>
              <span class="status-badge status-approved">{{ $t('dashboard.approved') }}</span>
            </div>

            <div class="reservation-details">
              <div class="announcement-preview">
                <img
                  :src="getAnnouncementImage(reservation.announcementId)"
                  :alt="getAnnouncementTitle(reservation.announcementId)"
                  class="preview-image"
                />
                <div>
                  <h4>{{ getAnnouncementTitle(reservation.announcementId) }}</h4>
                  <p class="preview-address">
                    📍 {{ getAnnouncementAddress(reservation.announcementId) }}
                  </p>
                </div>
              </div>
              <div class="reservation-meta">
                <span>{{ $t('dashboard.approved') }}: {{ formatDateTime(reservation.approvedAt) }}</span>
              </div>
            </div>

            <div class="reservation-actions">
              <button
                v-if="reservation.status !== 'completed'"
                @click="completeReservation(reservation.id)"
                class="btn btn-primary"
              >
                ✓ {{ $t('dashboard.markCompleted') }}
              </button>
              <button
                v-if="reservation.status === 'completed'"
                @click="openReviewModal(reservation)"
                class="btn btn-outline"
              >
                ⭐ {{ $t('dashboard.leaveReview') }}
              </button>
              <router-link
                :to="`/announcement/${reservation.announcementId}`"
                class="btn btn-secondary"
              >
                {{ $t('dashboard.viewDetails') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Completed Reservations (Archive) -->
      <div v-if="completedReservations.length > 0" class="reservations-section archive-section">
        <h2>{{ $t('dashboard.completedReservations') || 'Completed Reservations (Archive)' }}</h2>
        <p class="section-description">{{ $t('dashboard.archiveDescription') || 'These reservations have been completed. You can leave reviews for volunteers.' }}</p>
        <div class="reservations-list">
          <div
            v-for="reservation in completedReservations"
            :key="reservation.id"
            class="reservation-card card archive-card"
          >
            <div class="reservation-header">
              <div class="volunteer-info">
                <img
                  :src="reservation.volunteer.avatar || 'https://via.placeholder.com/50'"
                  :alt="reservation.volunteer.name"
                  class="volunteer-avatar"
                />
                <div>
                  <h3>{{ reservation.volunteer.name }}</h3>
                  <p class="volunteer-contact">
                    📧 {{ reservation.volunteer.email }}
                    <span v-if="reservation.volunteer.phone">| 📱 {{ reservation.volunteer.phone }}</span>
                  </p>
                </div>
              </div>
              <span class="status-badge status-completed">{{ $t('dashboard.completed') || 'Completed' }}</span>
            </div>

            <div class="reservation-details">
              <div class="announcement-preview">
                <img
                  :src="getAnnouncementImage(reservation.announcementId)"
                  :alt="getAnnouncementTitle(reservation.announcementId)"
                  class="preview-image"
                />
                <div>
                  <h4>{{ getAnnouncementTitle(reservation.announcementId) }}</h4>
                  <p class="preview-address">
                    📍 {{ getAnnouncementAddress(reservation.announcementId) }}
                  </p>
                </div>
              </div>
              <div class="reservation-meta">
                <span>{{ $t('dashboard.completed') || 'Completed' }}: {{ formatDateTime(reservation.completedAt || reservation.approvedAt) }}</span>
              </div>
            </div>

            <div class="reservation-actions">
              <button
                @click="openReviewModal(reservation)"
                class="btn btn-primary"
              >
                ⭐ {{ $t('dashboard.leaveReview') }}
              </button>
              <router-link
                :to="`/announcement/${reservation.announcementId}`"
                class="btn btn-secondary"
              >
                {{ $t('dashboard.viewDetails') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- My Announcements -->
      <div class="announcements-list">
        <h2>{{ $t('dashboard.myAnnouncements') }}</h2>
        <div v-if="announcements.length === 0" class="empty-state">
          <p>{{ $t('dashboard.noAnnouncements') }}</p>
        </div>
        <div v-else class="announcements-grid">
          <div
            v-for="announcement in announcements"
            :key="announcement.id"
            class="announcement-card card"
          >
            <img :src="announcement.image" :alt="announcement.title" class="card-image" />
            <div class="card-content">
              <div class="card-header">
                <h3>{{ announcement.title }}</h3>
                <span class="status-badge" :class="`status-${announcement.status}`">
                  {{ announcement.status }}
                </span>
              </div>
              <p class="card-description">{{ announcement.description }}</p>
              <div class="card-meta">
                <span>📍 {{ announcement.address }}</span>
                <span>⏰ {{ formatDate(announcement.expiryDate) }}</span>
              </div>
              <div class="card-actions">
                <router-link
                  :to="`/announcement/${announcement.id}`"
                  class="btn btn-secondary btn-sm"
                >
                  {{ $t('dashboard.view') }}
                </router-link>
                <router-link
                  :to="`/announcement/edit/${announcement.id}`"
                  class="btn btn-outline btn-sm"
                >
                  {{ $t('dashboard.edit') }}
                </router-link>
                <button
                  @click="deleteAnnouncement(announcement.id)"
                  class="btn btn-outline btn-sm"
                >
                  {{ $t('dashboard.delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ReviewModal
      :is-open="reviewModalOpen"
      :reservation-id="selectedReservation?.id"
      :target-user="targetUser"
      @close="reviewModalOpen = false"
      @submitted="handleReviewSubmitted"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useAnnouncementsStore } from '../stores/announcements'
import { useBookingsStore } from '../stores/bookings'
import { useToastStore } from '../stores/toast'
import ReviewModal from '../components/common/ReviewModal.vue'
import SkeletonLoader from '../components/common/SkeletonLoader.vue'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const announcementsStore = useAnnouncementsStore()
const bookingsStore = useBookingsStore()
const toastStore = useToastStore()

const announcements = computed(() => {
  // Filter announcements to show only current organization's announcements
  if (!authStore.user || !authStore.user.id) {
    return []
  }
  return announcementsStore.announcements.filter(a => 
    a.organization?.id === authStore.user.id
  )
})

const activeCount = computed(() => {
  return announcements.value.filter(a => a.status === 'active').length
})

const confirmedCount = computed(() => {
  return announcements.value.filter(a => a.status === 'confirmed').length
})

const pendingReservations = computed(() => {
  return bookingsStore.reservations.filter(r => r.status === 'pending')
})

const approvedReservations = computed(() => {
  return bookingsStore.reservations.filter(r => r.status === 'approved')
})

const completedReservations = computed(() => {
  return bookingsStore.reservations.filter(r => r.status === 'completed')
})

const getAnnouncementById = (id) => {
  return announcementsStore.getAnnouncementById(id)
}

const getAnnouncementTitle = (id) => {
  const announcement = getAnnouncementById(id)
  return announcement?.title || 'Unknown'
}

const getAnnouncementImage = (id) => {
  const announcement = getAnnouncementById(id)
  return announcement?.image || 'https://via.placeholder.com/400x300'
}

const getAnnouncementAddress = (id) => {
  const announcement = getAnnouncementById(id)
  return announcement?.address || 'Unknown address'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const approveReservation = async (id) => {
  try {
    const result = await bookingsStore.approveReservation(id)
    if (result.success) {
      await bookingsStore.loadReservations()
      toastStore.success(t('dashboard.approveSuccess') || 'Reservation approved!')
    } else {
      toastStore.error(result.message || t('dashboard.approveError') || 'Failed to approve reservation')
    }
  } catch (error) {
    toastStore.error(error.response?.data?.message || t('dashboard.approveError') || 'Failed to approve reservation')
  }
}

const rejectReservation = async (id) => {
  if (confirm(t('dashboard.confirmReject') || 'Are you sure you want to reject this reservation?')) {
    try {
      const result = await bookingsStore.rejectReservation(id)
      if (result.success) {
        await bookingsStore.loadReservations()
        toastStore.success(t('dashboard.rejectSuccess') || 'Reservation rejected')
      } else {
        toastStore.error(result.message || t('dashboard.rejectError') || 'Failed to reject reservation')
      }
    } catch (error) {
      toastStore.error(error.response?.data?.message || t('dashboard.rejectError') || 'Failed to reject reservation')
    }
  }
}

const reviewModalOpen = ref(false)
const selectedReservation = ref(null)
const targetUser = ref(null)

const completeReservation = async (id) => {
  try {
    const result = await bookingsStore.completeReservation(id)
    if (result.success) {
      await bookingsStore.loadReservations()
      toastStore.success(t('dashboard.completeSuccess') || 'Reservation marked as completed!')
    } else {
      toastStore.error(result.message || t('dashboard.completeError') || 'Failed to complete reservation')
    }
  } catch (error) {
    toastStore.error(error.response?.data?.message || t('dashboard.completeError') || 'Failed to complete reservation')
  }
}

const openReviewModal = (reservation) => {
  selectedReservation.value = reservation
  // Format volunteer avatar URL
  const volunteerAvatar = reservation.volunteer.avatar
  const formattedAvatar = volunteerAvatar 
    ? (volunteerAvatar.startsWith('http') 
        ? volunteerAvatar 
        : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${volunteerAvatar.startsWith('/') ? volunteerAvatar : '/' + volunteerAvatar}`)
    : 'https://via.placeholder.com/50'
  
  targetUser.value = {
    id: reservation.volunteer.id,
    name: reservation.volunteer.name,
    avatar: formattedAvatar,
    role: 'volunteer'
  }
  reviewModalOpen.value = true
}

const handleReviewSubmitted = async () => {
  await bookingsStore.loadReservations()
  reviewModalOpen.value = false
  selectedReservation.value = null
  targetUser.value = null
}

const deleteAnnouncement = async (id) => {
  if (confirm('Are you sure you want to delete this announcement?')) {
    try {
      await announcementsStore.deleteAnnouncement(id)
      toastStore.success('Announcement deleted')
    } catch (error) {
      toastStore.error('Failed to delete announcement')
    }
  }
}

onMounted(() => {
  announcementsStore.loadAnnouncements()
  bookingsStore.loadReservations()
})
</script>

<style scoped>
.dashboard {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 16px;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  text-align: center;
  padding: 32px;
}

.stat-value {
  font-size: 3rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  color: var(--text-secondary);
  font-weight: 600;
}

.reservations-section {
  margin-bottom: 40px;
}

.reservations-section h2 {
  font-size: 2rem;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.archive-section {
  background: var(--bg-secondary);
  padding: 32px;
  border-radius: 16px;
  margin-top: 40px;
  border: 2px solid var(--border-color);
}

.archive-section h2 {
  color: var(--text-primary);
  margin-bottom: 8px;
}

.section-description {
  color: var(--text-secondary);
  margin-bottom: 24px;
  font-size: 0.95rem;
  line-height: 1.6;
}

.archive-card {
  opacity: 0.95;
  border-left: 4px solid var(--accent-primary);
  transition: all 0.3s ease;
}

.archive-card:hover {
  opacity: 1;
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.reservations-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.reservation-card {
  padding: 24px;
}

.reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
}

.volunteer-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.volunteer-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.volunteer-info h3 {
  font-size: 1.25rem;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.volunteer-contact {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.reservation-details {
  margin-bottom: 20px;
}

.announcement-preview {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.announcement-preview h4 {
  font-size: 1.125rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.preview-address {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.volunteer-message {
  margin: 16px 0;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border-left: 4px solid var(--accent-primary);
}

.volunteer-message strong {
  color: var(--text-primary);
  display: block;
  margin-bottom: 8px;
}

.volunteer-message p {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

.reservation-meta {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.reservation-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.announcements-list h2 {
  font-size: 2rem;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.announcements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.announcement-card {
  overflow: hidden;
  padding: 0;
  transition: all 0.3s ease;
}

.announcement-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.card-header h3 {
  font-size: 1.25rem;
  color: var(--text-primary);
  flex: 1;
}

.card-description {
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.875rem;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

[data-theme="dark"] .status-active {
  background: #1e4620;
  color: #6cce7a;
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

.status-confirmed {
  background: #cce5ff;
  color: #004085;
}

[data-theme="dark"] .status-confirmed {
  background: #1a3a5c;
  color: #6bb6ff;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .announcements-grid {
    grid-template-columns: 1fr;
  }

  .reservation-header {
    flex-direction: column;
    gap: 16px;
  }

  .announcement-preview {
    flex-direction: column;
  }

  .preview-image {
    width: 100%;
    height: 200px;
  }
}
</style>
