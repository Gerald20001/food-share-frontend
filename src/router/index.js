import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('../views/Map.vue')
  },
  {
    path: '/announcement/:id',
    name: 'AnnouncementDetail',
    component: () => import('../views/AnnouncementDetail.vue'),
    props: true
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true, requiresOrganization: true }
  },
  {
    path: '/announcement/create',
    name: 'CreateAnnouncement',
    component: () => import('../views/CreateAnnouncement.vue'),
    meta: { requiresAuth: true, requiresOrganization: true }
  },
  {
    path: '/announcement/edit/:id',
    name: 'EditAnnouncement',
    component: () => import('../views/CreateAnnouncement.vue'),
    props: true,
    meta: { requiresAuth: true, requiresOrganization: true }
  },
  {
    path: '/profile/:id?',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    props: (route) => ({ id: route.params.id }),
    meta: { requiresAuth: false } // Allow viewing profiles without auth
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: () => import('../views/Bookings.vue'),
    meta: { requiresAuth: true, requiresVolunteer: true }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/Blog.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('../views/Notifications.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  // Initialize auth if token exists
  if (localStorage.getItem('token') && !authStore.user) {
    await authStore.initAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    toastStore.showToast('Please log in to access this page', 'error')
    next({ name: 'Home' })
    return
  }

  if (to.meta.requiresOrganization && !authStore.isOrganization) {
    toastStore.showToast('This page is only available for organizations', 'error')
    next({ name: 'Home' })
    return
  }

  if (to.meta.requiresVolunteer && !authStore.isVolunteer) {
    toastStore.showToast('This page is only available for volunteers', 'error')
    next({ name: 'Home' })
    return
  }

  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    toastStore.showToast('This page is only available for administrators', 'error')
    next({ name: 'Home' })
    return
  }

  next()
})

export default router


