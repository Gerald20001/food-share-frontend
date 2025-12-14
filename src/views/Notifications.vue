<template>
  <div class="notifications-page">
    <div class="container">
      <div class="notifications-header">
        <h1>🔔 {{ $t('notifications.title') || 'Notifications' }}</h1>
        <button 
          v-if="notificationsStore.unreadCount > 0"
          @click="markAllAsRead"
          class="btn btn-outline"
        >
          {{ $t('notifications.markAllRead') || 'Mark all as read' }}
        </button>
      </div>

      <div v-if="notificationsStore.loading" class="loading">
        <div class="skeleton-item" v-for="n in 5" :key="n"></div>
      </div>

      <div v-else-if="notificationsStore.notifications.length === 0" class="empty-state">
        <p>{{ $t('notifications.noNotifications') || 'No notifications yet' }}</p>
      </div>

      <div v-else class="notifications-list">
        <div
          v-for="notification in notificationsStore.notifications"
          :key="notification.id"
          :class="['notification-card', 'card', { unread: !notification.read }]"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-content">
            <h3>{{ notification.title }}</h3>
            <p>{{ notification.message }}</p>
            <span class="notification-time">{{ formatTime(notification.created_at) }}</span>
          </div>
          <div class="notification-actions">
            <button
              v-if="!notification.read"
              @click.stop="markAsRead(notification.id)"
              class="btn btn-sm btn-outline"
            >
              ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '../stores/notifications'
import { useToastStore } from '../stores/toast'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const notificationsStore = useNotificationsStore()
const toastStore = useToastStore()
const { t } = useI18n()

const loadNotifications = async () => {
  await notificationsStore.loadNotifications()
}

const markAsRead = async (id) => {
  const result = await notificationsStore.markAsRead(id)
  if (result.success) {
    toastStore.success(t('notifications.markedRead') || 'Notification marked as read')
  }
}

const markAllAsRead = async () => {
  const result = await notificationsStore.markAllAsRead()
  if (result.success) {
    toastStore.success(t('notifications.allMarkedRead') || 'All notifications marked as read')
  }
}

const handleNotificationClick = (notification) => {
  if (!notification.read) {
    markAsRead(notification.id)
  }
  if (notification.link) {
    router.push(notification.link)
  }
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

onMounted(() => {
  loadNotifications()
})
</script>

<style scoped>
.notifications-page {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.notifications-header h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-card {
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.notification-card:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.notification-card.unread {
  border-left: 4px solid var(--accent-primary);
  background: var(--bg-secondary);
}

.notification-content {
  flex: 1;
}

.notification-content h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.notification-content p {
  color: var(--text-secondary);
  margin-bottom: 8px;
  line-height: 1.6;
}

.notification-time {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.notification-actions {
  margin-left: 16px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
}

.loading {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-item {
  height: 100px;
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-primary) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>

