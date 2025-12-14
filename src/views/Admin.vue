<template>
  <div class="admin-page">
    <div class="container">
      <div class="admin-header">
        <h1>🔧 {{ $t('admin.title') || 'Admin Panel' }}</h1>
        <p class="subtitle">{{ $t('admin.subtitle') || 'Manage platform users and content' }}</p>
      </div>

      <!-- Statistics -->
      <div v-if="stats" class="stats-grid">
        <div class="stat-card card">
          <h3>{{ $t('admin.totalUsers') || 'Total Users' }}</h3>
          <p class="stat-value">{{ stats.users?.total || 0 }}</p>
          <div class="stat-details">
            <span>{{ stats.users?.volunteers || 0 }} volunteers</span>
            <span>{{ stats.users?.organizations || 0 }} organizations</span>
          </div>
        </div>

        <div class="stat-card card">
          <h3>{{ $t('admin.totalAnnouncements') || 'Announcements' }}</h3>
          <p class="stat-value">{{ stats.announcements?.total || 0 }}</p>
          <div class="stat-details">
            <span>{{ stats.announcements?.active || 0 }} active</span>
            <span>{{ stats.announcements?.completed || 0 }} completed</span>
          </div>
        </div>

        <div class="stat-card card">
          <h3>{{ $t('admin.totalReservations') || 'Reservations' }}</h3>
          <p class="stat-value">{{ stats.reservations?.total || 0 }}</p>
          <div class="stat-details">
            <span>{{ stats.reservations?.pending || 0 }} pending</span>
            <span>{{ stats.reservations?.completed || 0 }} completed</span>
          </div>
        </div>

        <div class="stat-card card">
          <h3>{{ $t('admin.averageRating') || 'Average Rating' }}</h3>
          <p class="stat-value">{{ parseFloat(stats.reviews?.average_rating || 0).toFixed(1) }}</p>
          <div class="stat-details">
            <span>{{ stats.reviews?.total || 0 }} reviews</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="admin-tabs">
        <button 
          @click="activeTab = 'users'"
          :class="['tab-button', { active: activeTab === 'users' }]"
        >
          {{ $t('admin.users') || 'Users' }}
        </button>
        <button 
          @click="activeTab = 'announcements'"
          :class="['tab-button', { active: activeTab === 'announcements' }]"
        >
          {{ $t('admin.announcements') || 'Announcements' }}
        </button>
        <button 
          @click="activeTab = 'badges'"
          :class="['tab-button', { active: activeTab === 'badges' }]"
        >
          🏆 {{ $t('admin.badges') || 'Badges' }}
        </button>
      </div>

      <!-- Users Management -->
      <div v-if="activeTab === 'users'" class="admin-section">
        <div class="section-header">
          <h2>{{ $t('admin.userManagement') || 'User Management' }}</h2>
          <input
            v-model="userSearch"
            type="text"
            class="input"
            :placeholder="$t('admin.searchUsers') || 'Search users...'"
            @input="loadUsers"
          />
        </div>

        <div v-if="adminStore.loading" class="loading">Loading...</div>
        <div v-else class="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Announcements</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in adminStore.users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <select 
                    :value="user.role" 
                    @change="updateUserRole(user.id, $event.target.value)"
                    class="role-select"
                  >
                    <option value="volunteer">Volunteer</option>
                    <option value="organization">Organization</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{{ user.announcements_count || 0 }}</td>
                <td>{{ parseFloat(user.average_rating || 0).toFixed(1) }}</td>
                <td>
                  <button 
                    @click="deleteUser(user.id)"
                    class="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Badges Management -->
      <div v-if="activeTab === 'badges'" class="admin-section">
        <div class="section-header">
          <h2>{{ $t('admin.badgeManagement') || 'Badge Management' }}</h2>
        </div>
        
        <div class="badge-management">
          <div class="badge-award-section">
            <h3>{{ $t('admin.awardBadge') || 'Award Badge to User' }}</h3>
            <div class="award-form">
              <select v-model="selectedUserId" class="input">
                <option value="">{{ $t('admin.selectUser') || 'Select User' }}</option>
                <option v-for="user in adminStore.users" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.email }})
                </option>
              </select>
              <select v-model="selectedBadgeId" class="input">
                <option value="">{{ $t('admin.selectBadge') || 'Select Badge' }}</option>
                <option v-for="badge in availableBadges" :key="badge.id" :value="badge.id">
                  {{ badge.icon }} {{ badge.name }} - {{ badge.description }}
                </option>
              </select>
              <button 
                @click="awardBadge"
                class="btn btn-primary"
                :disabled="!selectedUserId || !selectedBadgeId"
              >
                {{ $t('admin.award') || 'Award Badge' }}
              </button>
            </div>
          </div>

          <div class="badges-list">
            <h3>{{ $t('admin.availableBadges') || 'Available Badges' }}</h3>
            <div class="badges-grid">
              <div 
                v-for="badge in availableBadges" 
                :key="badge.id"
                class="badge-item card"
              >
                <div class="badge-icon-large" :style="{ color: badge.color }">
                  {{ badge.icon }}
                </div>
                <h4>{{ badge.name }}</h4>
                <p>{{ badge.description }}</p>
                <div class="badge-requirement">
                  <span class="requirement-label">{{ $t('admin.requirement') || 'Requirement' }}:</span>
                  <span class="requirement-value">{{ badge.requirement_type }} - {{ badge.requirement_value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Announcements Management -->
      <div v-if="activeTab === 'announcements'" class="admin-section">
        <div class="section-header">
          <h2>{{ $t('admin.announcementManagement') || 'Announcement Management' }}</h2>
        </div>

        <div v-if="adminStore.loading" class="loading">Loading...</div>
        <div v-else class="announcements-list">
          <div 
            v-for="announcement in adminStore.announcements" 
            :key="announcement.id"
            class="announcement-card card"
          >
            <div class="announcement-header">
              <h3>{{ announcement.title_en }}</h3>
              <span class="status-badge" :class="`status-${announcement.status}`">
                {{ announcement.status }}
              </span>
            </div>
            <p>{{ announcement.description_en }}</p>
            <div class="announcement-meta">
              <span>By: {{ announcement.organization_name }}</span>
              <span>📍 {{ announcement.address }}</span>
            </div>
            <button 
              @click="deleteAnnouncement(announcement.id)"
              class="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { useToastStore } from '../stores/toast'
import { useI18n } from 'vue-i18n'
import { badgesAPI } from '../services/api'

const adminStore = useAdminStore()
const toastStore = useToastStore()
const { t, locale } = useI18n()

const activeTab = ref('users')
const userSearch = ref('')
const stats = ref(null)
const availableBadges = ref([])
const selectedUserId = ref('')
const selectedBadgeId = ref('')

const loadStats = async () => {
  const result = await adminStore.loadStats()
  if (result.success) {
    stats.value = result.data
  }
}

const loadUsers = async () => {
  await adminStore.loadUsers({ search: userSearch.value })
}

const updateUserRole = async (userId, role) => {
  const result = await adminStore.updateUserRole(userId, role)
  if (result.success) {
    toastStore.success(t('admin.roleUpdated') || 'User role updated')
  } else {
    toastStore.error(result.message || t('admin.updateError') || 'Failed to update role')
  }
}

const deleteUser = async (userId) => {
  if (confirm(t('admin.confirmDeleteUser') || 'Are you sure you want to delete this user?')) {
    const result = await adminStore.deleteUser(userId)
    if (result.success) {
      toastStore.success(t('admin.userDeleted') || 'User deleted')
      await loadUsers()
    } else {
      toastStore.error(result.message || t('admin.deleteError') || 'Failed to delete user')
    }
  }
}

const deleteAnnouncement = async (id) => {
  if (confirm(t('admin.confirmDeleteAnnouncement') || 'Are you sure you want to delete this announcement?')) {
    const result = await adminStore.deleteAnnouncement(id)
    if (result.success) {
      toastStore.success(t('admin.announcementDeleted') || 'Announcement deleted')
      await adminStore.loadAnnouncements()
    } else {
      toastStore.error(result.message || t('admin.deleteError') || 'Failed to delete announcement')
    }
  }
}

const loadBadges = async () => {
  try {
    const response = await badgesAPI.getAvailableBadges({ language: locale.value || 'en' })
    availableBadges.value = response.data || []
  } catch (error) {
    console.error('Error loading badges:', error)
  }
}

const awardBadge = async () => {
  if (!selectedUserId.value || !selectedBadgeId.value) return
  
  try {
    const response = await badgesAPI.awardBadge(selectedUserId.value, selectedBadgeId.value)
    if (response.data.alreadyExists) {
      toastStore.showToast('Badge already awarded to this user', 'info')
    } else {
      toastStore.showToast('Badge awarded successfully!', 'success')
      selectedUserId.value = ''
      selectedBadgeId.value = ''
    }
  } catch (error) {
    toastStore.showToast(error.response?.data?.message || 'Failed to award badge', 'error')
  }
}

onMounted(async () => {
  await loadStats()
  await loadUsers()
  await adminStore.loadAnnouncements()
  await loadBadges()
})
</script>

<style scoped>
.admin-page {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.admin-header {
  margin-bottom: 40px;
}

.admin-header h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  padding: 24px;
  text-align: center;
}

.stat-card h3 {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--accent-primary);
  margin-bottom: 12px;
}

.stat-details {
  display: flex;
  justify-content: space-around;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.admin-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  border-bottom: 2px solid var(--border-color);
}

.tab-button {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: var(--text-primary);
}

.tab-button.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

.admin-section {
  margin-top: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-header h2 {
  font-size: 1.75rem;
  color: var(--text-primary);
}

.users-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-primary);
  border-radius: 8px;
  overflow: hidden;
}

thead {
  background: var(--bg-secondary);
}

th, td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  font-weight: 600;
  color: var(--text-primary);
}

.role-select {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.badge-management {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.badge-award-section {
  padding: 24px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.badge-award-section h3 {
  margin-bottom: 20px;
  color: var(--text-primary);
}

.award-form {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.award-form .input {
  flex: 1;
  min-width: 200px;
}

.badges-list h3 {
  margin-bottom: 24px;
  color: var(--text-primary);
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.badge-item {
  text-align: center;
  padding: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.badge-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.badge-icon-large {
  font-size: 4rem;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.badge-item h4 {
  margin: 12px 0 8px 0;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.badge-item p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 12px;
}

.badge-requirement {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
  font-size: 0.75rem;
}

.requirement-label {
  color: var(--text-tertiary);
  font-weight: 600;
}

.requirement-value {
  color: var(--accent-primary);
  text-transform: capitalize;
}

.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.announcement-card {
  padding: 20px;
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.announcement-meta {
  display: flex;
  gap: 16px;
  margin: 12px 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}
</style>

