<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-content">
        <router-link to="/" class="logo">
          <span class="logo-icon">🍽️</span>
          <span class="logo-text">Food Share</span>
        </router-link>

        <div class="nav-links" :class="{ active: mobileMenuOpen }">
          <router-link to="/" @click="closeMobileMenu">{{ $t('nav.home') }}</router-link>
          <router-link to="/map" @click="closeMobileMenu">{{ $t('nav.map') }}</router-link>
          <router-link to="/blog" @click="closeMobileMenu">{{ $t('nav.blog') }}</router-link>
          <router-link to="/contact" @click="closeMobileMenu">{{ $t('nav.contact') }}</router-link>
          
          <template v-if="authStore.isAuthenticated">
            <router-link 
              v-if="authStore.isOrganization" 
              to="/dashboard" 
              @click="closeMobileMenu"
            >
              {{ $t('nav.dashboard') }}
            </router-link>
            <router-link 
              v-if="authStore.isVolunteer" 
              to="/bookings" 
              @click="closeMobileMenu"
            >
              {{ $t('nav.bookings') }}
            </router-link>
            <router-link 
              v-if="authStore.user?.role === 'admin'"
              to="/admin"
              @click="closeMobileMenu"
            >
              🔧 {{ $t('nav.admin') || 'Admin' }}
            </router-link>
            <router-link 
              to="/notifications"
              @click="closeMobileMenu"
              class="notification-link"
            >
              🔔
              <span v-if="notificationsStore.unreadCount > 0" class="notification-badge">
                {{ notificationsStore.unreadCount }}
              </span>
            </router-link>
            <router-link 
              :to="`/profile/${authStore.user?.id}`" 
              @click="closeMobileMenu"
            >
              {{ $t('nav.profile') }}
            </router-link>
            <button @click="handleLogout" class="btn btn-outline">{{ $t('nav.logout') }}</button>
          </template>
          <template v-else>
            <button @click="openAuthModal('login')" class="btn btn-outline">{{ $t('nav.login') }}</button>
            <button @click="openAuthModal('register')" class="btn btn-primary">{{ $t('nav.signup') }}</button>
          </template>
        </div>

        <div class="navbar-actions">
          <div class="language-switcher">
            <button
              @click="changeLanguage('en')"
              :class="['lang-btn', { active: currentLanguage === 'en' }]"
              title="English"
            >
              EN
            </button>
            <button
              @click="changeLanguage('uk')"
              :class="['lang-btn', { active: currentLanguage === 'uk' }]"
              title="Українська"
            >
              UK
            </button>
          </div>
          <button @click="toggleTheme" class="theme-toggle" :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`">
            <span v-if="theme === 'light'">🌙</span>
            <span v-else>☀️</span>
          </button>
          <button @click="toggleMobileMenu" class="mobile-menu-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>
    <AuthModal :is-open="authModalOpen" :initial-mode="authMode" @close="authModalOpen = false" />
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth'
import { useNotificationsStore } from '../../stores/notifications'
import { useThemeStore } from '../../stores/theme'
import { useToastStore } from '../../stores/toast'
import AuthModal from '../common/AuthModal.vue'

const router = useRouter()
const { locale, t } = useI18n()
const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const themeStore = useThemeStore()
const toastStore = useToastStore()

const mobileMenuOpen = ref(false)
const authModalOpen = ref(false)
const authMode = ref('login')

const theme = computed(() => themeStore.theme)
const currentLanguage = computed(() => locale.value)

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
  // Reload page to update all API calls with new language
  window.location.reload()
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const openAuthModal = (mode) => {
  authMode.value = mode
  authModalOpen.value = true
}

const handleLogout = () => {
  authStore.logout()
  toastStore.success(t('auth.logoutSuccess'))
  router.push('/')
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await notificationsStore.loadNotifications({ limit: 5, unreadOnly: true })
  }
})

watch(() => authStore.isAuthenticated, async (isAuth) => {
  if (isAuth) {
    await notificationsStore.loadNotifications({ limit: 5, unreadOnly: true })
  }
})
</script>

<style scoped>
.navbar {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(var(--bg-primary-rgb, 255, 255, 255), 0.9);
}

[data-theme="dark"] .navbar {
  background: rgba(26, 26, 26, 0.9);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--text-primary);
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  justify-content: center;
}

.nav-links a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-links a:hover {
  color: var(--accent-primary);
}

.nav-links a.router-link-active {
  color: var(--accent-primary);
}

.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
  border-radius: 2px;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-link {
  position: relative;
  padding: 8px 12px;
  font-size: 1.2rem;
  text-decoration: none;
  color: var(--text-primary);
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.notification-link:hover {
  background: var(--bg-secondary);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.theme-toggle {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: var(--bg-tertiary);
  transform: scale(1.1);
}

.language-switcher {
  display: flex;
  gap: 4px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 4px;
}

.lang-btn {
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.lang-btn:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.lang-btn.active {
  background: var(--accent-primary);
  color: white;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.mobile-menu-toggle span {
  width: 24px;
  height: 3px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    flex-direction: column;
    padding: 24px;
    gap: 16px;
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-lg);
  }

  .nav-links.active {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .nav-links a {
    width: 100%;
    padding: 12px;
    text-align: center;
  }
}
</style>
