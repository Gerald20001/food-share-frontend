<template>
  <div class="profile">
    <div class="container">
      <div v-if="loading" class="loading-state">
        <p>{{ $t('common.loading') }}</p>
      </div>
      <div v-else-if="profileUser" class="profile-content">
        <div class="profile-header">
          <div class="profile-cover">
            <img 
              v-if="profileUser.coverImage" 
              :src="profileUser.coverImage" 
              alt="Cover" 
              class="cover-image"
            />
            <div v-else class="cover-placeholder"></div>
            <button
              v-if="isOwnProfile"
              @click="showCoverUpload = true"
              class="edit-cover-btn"
            >
              {{ $t('profile.editCover') }}
            </button>
          </div>
          <div class="profile-info">
            <div class="profile-avatar-wrapper">
              <img
                :src="profileUser.avatar || 'https://via.placeholder.com/150'"
                :alt="profileUser.name"
                class="profile-avatar"
              />
              <button
                v-if="isOwnProfile"
                @click="showAvatarUpload = true"
                class="edit-avatar-btn"
              >
                ✏️
              </button>
            </div>
            <div class="profile-details">
              <h1>{{ profileUser.name }}</h1>
              <p class="profile-email">{{ profileUser.email }}</p>
              <p class="profile-role">{{ profileUser.role }}</p>
              <p class="profile-joined">{{ $t('profile.joined') }} {{ formatDate(profileUser.joinedDate || profileUser.createdAt) }}</p>
            </div>
            <button
              v-if="isOwnProfile"
              @click="editProfile = true"
              class="btn btn-primary"
            >
              {{ $t('profile.editTitle') }}
            </button>
          </div>
        </div>

        <div class="profile-stats">
          <div class="stat-card card stat-announcements">
            <div class="stat-icon">📢</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats?.total_announcements || profileUser.stats?.announcements || 0 }}</div>
              <div class="stat-label">{{ $t('profile.announcements') }}</div>
            </div>
          </div>
          <div class="stat-card card stat-reviews">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats?.total_reviews_received || profileUser.stats?.reviews || 0 }}</div>
              <div class="stat-label">{{ $t('profile.reviews') }}</div>
            </div>
          </div>
          <div class="stat-card card stat-rating">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-value">{{ 
                userStats?.average_rating 
                  ? (typeof userStats.average_rating === 'number' 
                      ? Number(userStats.average_rating).toFixed(1) 
                      : parseFloat(userStats.average_rating || 0).toFixed(1))
                  : (profileUser.stats?.rating || 0) 
              }}</div>
              <div class="stat-label">{{ $t('profile.rating') }}</div>
            </div>
          </div>
          <div class="stat-card card stat-level" v-if="userStats">
            <div class="stat-icon">🏆</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.level || 1 }}</div>
              <div class="stat-label">{{ $t('profile.level') }}</div>
            </div>
          </div>
          <div class="stat-card card stat-points" v-if="userStats">
            <div class="stat-icon">💎</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.total_points || 0 }}</div>
              <div class="stat-label">{{ $t('profile.points') }}</div>
            </div>
          </div>
          <div class="stat-card card stat-completed" v-if="userStats && profileUser.role === 'volunteer'">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <div class="stat-value">{{ userStats.total_completed_reservations || 0 }}</div>
              <div class="stat-label">{{ $t('profile.completedReservations') }}</div>
            </div>
          </div>
        </div>

        <div class="profile-sections">
          <div class="profile-section" v-if="userBadges.length > 0 || loadingBadges">
            <h2>{{ $t('profile.badges') }}</h2>
            <div v-if="loadingBadges" class="badges-loading">
              <p>{{ $t('common.loading') }}</p>
            </div>
            <div v-else-if="userBadges.length === 0" class="empty-state">
              <p>{{ $t('profile.noBadges') }}</p>
            </div>
            <div v-else class="badges-grid">
              <div
                v-for="badge in userBadges"
                :key="badge.id"
                class="badge-card card"
                :title="badge.description"
              >
                <div class="badge-icon" :style="{ color: badge.color }">
                  {{ badge.icon }}
                </div>
                <div class="badge-info">
                  <h4>{{ badge.name }}</h4>
                  <p class="badge-description">{{ badge.description }}</p>
                  <p class="badge-date">{{ formatDate(badge.earned_at) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h2>{{ $t('profile.announcements') }}</h2>
            <div v-if="userAnnouncements.length === 0" class="empty-state">
              <p>{{ $t('profile.noAnnouncements') }}</p>
            </div>
            <div v-else class="announcements-grid">
              <div
                v-for="announcement in userAnnouncements"
                :key="announcement.id"
                class="announcement-card card"
                @click="$router.push(`/announcement/${announcement.id}`)"
              >
                <img :src="announcement.image" :alt="announcement.title" />
                <div class="card-content">
                  <h3>{{ announcement.title }}</h3>
                  <p>{{ announcement.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h2>{{ $t('profile.reviews') }}</h2>
            <div v-if="reviews.length === 0" class="empty-state">
              <p>{{ $t('profile.noReviews') }}</p>
            </div>
            <div v-else class="reviews-list">
              <div v-for="review in reviews" :key="review.id" class="review-card card">
                <div class="review-header">
                  <div class="reviewer-info">
                    <img :src="review.reviewer.avatar" :alt="review.reviewer.name" class="reviewer-avatar" />
                    <div>
                      <h4>{{ review.reviewer.name }}</h4>
                      <p class="reviewer-role">{{ review.reviewer.role === 'organization' ? $t('profile.organization') : $t('profile.volunteer') }}</p>
                      <div class="review-rating">
                        <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= review.rating }">⭐</span>
                        <span class="rating-value">{{ review.rating }}/5</span>
                      </div>
                    </div>
                  </div>
                  <span class="review-date">{{ formatDate(review.date) }}</span>
                </div>
                <p v-if="review.comment" class="review-text">{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="not-found">
        <h2>User not found</h2>
      </div>
    </div>
    <EditProfileModal
      :is-open="editProfile"
      :user="profileUser"
      @close="editProfile = false"
      @updated="loadProfile"
    />
    <ImageUploadModal
      :is-open="showAvatarUpload"
      type="avatar"
      @close="showAvatarUpload = false"
      @uploaded="handleAvatarUploaded"
    />
    <ImageUploadModal
      :is-open="showCoverUpload"
      type="cover"
      @close="showCoverUpload = false"
      @uploaded="handleCoverUploaded"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useAnnouncementsStore } from '../stores/announcements'
import { useToastStore } from '../stores/toast'
import { useBadgesStore } from '../stores/badges'
import { usersAPI, reviewsAPI } from '../services/api'
import EditProfileModal from '../components/common/EditProfileModal.vue'
import ImageUploadModal from '../components/common/ImageUploadModal.vue'

const route = useRoute()
const { t, locale } = useI18n()
const authStore = useAuthStore()
const announcementsStore = useAnnouncementsStore()
const toastStore = useToastStore()
const badgesStore = useBadgesStore()

const editProfile = ref(false)
const showAvatarUpload = ref(false)
const showCoverUpload = ref(false)
const profileUser = ref(null)
const loading = ref(true)
const userBadges = ref([])
const userStats = ref(null)
const loadingBadges = ref(false)

const loadProfile = async () => {
  loading.value = true
  try {
    // Ensure auth is initialized first
    if (!authStore.user && !authStore.initialized) {
      await authStore.initAuth()
    }
    
    // Get user ID from route params or current user
    let userId = route.params.id
    // Convert to string and check if it's a valid ID
    userId = userId ? String(userId).trim() : null
    if (!userId || userId === 'undefined' || userId === 'null' || userId === '') {
      userId = authStore.user?.id ? String(authStore.user.id).trim() : null
    }
    
    if (!userId) {
      console.error('No user ID available. Route params:', route.params, 'Auth user:', authStore.user)
      profileUser.value = null
      loading.value = false
      // Don't show error if user is just not logged in
      if (authStore.user) {
        toastStore.error('User ID is required')
      }
      return
    }
    
    console.log('Loading profile for user ID:', userId, 'Type:', typeof userId)
    const response = await usersAPI.getProfile(userId)
    console.log('Profile response:', response)
    
    // Backend returns data in response.data
    if (response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      profileUser.value = response.data
      console.log('Profile loaded:', profileUser.value)
      
      // Load badges and stats after profile is loaded
      await loadBadgesAndStats(userId)
    } else {
      console.error('Invalid response format:', response)
      profileUser.value = null
      toastStore.error('Failed to load profile')
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    console.error('Error response:', error.response)
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      toastStore.error('Network error. Please check if the server is running.')
      profileUser.value = null
    } else if (error.response?.status === 404) {
      toastStore.error('Profile not found')
      profileUser.value = null
    } else if (error.response?.status === 401) {
      // User not authenticated, redirect to login
      toastStore.error('Please log in to view profile')
      profileUser.value = null
    } else {
      toastStore.error(error.response?.data?.message || 'Failed to load profile')
      profileUser.value = null
    }
  } finally {
    loading.value = false
  }
}

const loadBadgesAndStats = async (userId) => {
  if (!userId) return
  loadingBadges.value = true
  try {
    // Load badges
    const badgesResult = await badgesStore.loadUserBadges(userId, { language: locale.value || 'en' })
    if (badgesResult.success) {
      userBadges.value = badgesResult.data || []
    }
    
    // Load stats
    const statsResult = await badgesStore.loadUserStats(userId)
    if (statsResult.success) {
      userStats.value = statsResult.data
    }
    
    // Check for new badges
    await badgesStore.checkBadges(userId)
    // Reload badges after checking
    const badgesResult2 = await badgesStore.loadUserBadges(userId, { language: locale.value || 'en' })
    if (badgesResult2.success) {
      userBadges.value = badgesResult2.data || []
    }
  } catch (error) {
    console.error('Error loading badges:', error)
  } finally {
    loadingBadges.value = false
  }
}

const isOwnProfile = computed(() => {
  return authStore.user?.id === profileUser.value?.id
})

const userAnnouncements = computed(() => {
  // TODO: Filter by user ID when backend is connected
  return announcementsStore.announcements.slice(0, 6)
})

const reviews = ref([])

const loadReviews = async () => {
  if (!profileUser.value?.id) return
  
  try {
    const response = await reviewsAPI.getByUser(profileUser.value.id)
    reviews.value = response.data.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      date: review.created_at,
      reviewer: {
        name: review.reviewer_name,
        avatar: review.reviewer_avatar ? (review.reviewer_avatar.startsWith('http') ? review.reviewer_avatar : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${review.reviewer_avatar}`) : 'https://via.placeholder.com/50',
        role: review.reviewer_role
      }
    }))
  } catch (error) {
    console.error('Error loading reviews:', error)
    reviews.value = []
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}

const handleAvatarUploaded = async (url) => {
  try {
    if (!profileUser.value) {
      // Try to get user ID from auth store or route
      const userId = authStore.user?.id || route.params.id
      if (!userId) {
        toastStore.error('User ID not available')
        return
      }
      await usersAPI.updateAvatar(userId, url)
    } else {
      await usersAPI.updateAvatar(profileUser.value.id, url)
    }
    await loadProfile()
    await authStore.initAuth()
  } catch (error) {
    console.error('Error updating avatar:', error)
    toastStore.error(error.response?.data?.message || 'Failed to update avatar')
  }
}

const handleCoverUploaded = async (url) => {
  try {
    if (!profileUser.value) {
      // Try to get user ID from auth store or route
      const userId = authStore.user?.id || route.params.id
      if (!userId) {
        toastStore.error('User ID not available')
        return
      }
      await usersAPI.updateCover(userId, url)
    } else {
      await usersAPI.updateCover(profileUser.value.id, url)
    }
    await loadProfile()
  } catch (error) {
    console.error('Error updating cover:', error)
    toastStore.error(error.response?.data?.message || 'Failed to update cover image')
  }
}

onMounted(async () => {
  await loadProfile()
  await announcementsStore.loadAnnouncements()
  if (profileUser.value) {
    await loadReviews()
  }
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    loadProfile()
  }
})

watch(() => profileUser.value, (newUser) => {
  if (newUser) {
    loadReviews()
  }
})
</script>

<style scoped>
.profile {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.profile-header {
  margin-bottom: 40px;
}

.profile-cover {
  height: 200px;
  background: var(--gradient-primary);
  border-radius: 12px 12px 0 0;
  position: relative;
  overflow: hidden;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: var(--gradient-hero);
}

.edit-cover-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-cover-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.profile-info {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding: 24px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 12px 12px;
  flex-wrap: wrap;
}

.profile-avatar-wrapper {
  position: relative;
  margin-top: -60px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--bg-primary);
  object-fit: cover;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: white;
  border: 3px solid var(--bg-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.profile-details {
  flex: 1;
  min-width: 200px;
}

.profile-details h1 {
  font-size: 2rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.profile-email {
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.profile-role {
  color: var(--accent-primary);
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 4px;
}

.profile-joined {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.05;
  background: var(--gradient-primary);
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-card:hover::before {
  opacity: 0.1;
}

.stat-icon {
  font-size: 2.5rem;
  line-height: 1;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  animation: float 3s ease-in-out infinite;
}

.stat-announcements .stat-icon {
  animation-delay: 0s;
}

.stat-reviews .stat-icon {
  animation-delay: 0.5s;
}

.stat-rating .stat-icon {
  animation-delay: 1s;
}

.stat-level .stat-icon {
  animation-delay: 1.5s;
}

.stat-points .stat-icon {
  animation-delay: 2s;
}

.stat-completed .stat-icon {
  animation-delay: 2.5s;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
  line-height: 1.2;
  display: block;
}

.stat-label {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Specific card colors */
.stat-announcements {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.stat-reviews {
  background: linear-gradient(135deg, rgba(255, 212, 59, 0.1) 0%, rgba(255, 146, 43, 0.1) 100%);
  border: 1px solid rgba(255, 212, 59, 0.2);
}

.stat-rating {
  background: linear-gradient(135deg, rgba(81, 207, 102, 0.1) 0%, rgba(51, 154, 240, 0.1) 100%);
  border: 1px solid rgba(81, 207, 102, 0.2);
}

.stat-level {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 146, 43, 0.1) 100%);
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.stat-points {
  background: linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
  border: 1px solid rgba(118, 75, 162, 0.2);
}

.stat-completed {
  background: linear-gradient(135deg, rgba(51, 207, 102, 0.1) 0%, rgba(51, 154, 240, 0.1) 100%);
  border: 1px solid rgba(51, 207, 102, 0.2);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.profile-section h2 {
  font-size: 1.75rem;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.badge-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.badge-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.badge-icon {
  font-size: 3rem;
  margin-bottom: 12px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.badge-info h4 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.badge-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
}

.badge-date {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin: 0;
}

.badges-loading {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.announcements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.announcement-card {
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  transition: all 0.3s ease;
}

.announcement-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.announcement-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.card-content {
  padding: 16px;
}

.card-content h3 {
  font-size: 1.125rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.card-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  padding: 20px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.reviewer-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color);
}

.reviewer-info h4 {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.reviewer-role {
  margin: 0 0 8px 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.star {
  font-size: 1.25rem;
  opacity: 0.3;
  transition: opacity 0.2s ease;
}

.star.filled {
  opacity: 1;
}

.rating-value {
  margin-left: 8px;
  color: var(--accent-primary);
  font-weight: 600;
  font-size: 0.875rem;
}

.review-date {
  color: var(--text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.review-text {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found h2 {
  font-size: 2rem;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-avatar-wrapper {
    margin-top: -40px;
  }

  .announcements-grid {
    grid-template-columns: 1fr;
  }

  .badges-grid {
    grid-template-columns: 1fr;
  }
}
</style>
