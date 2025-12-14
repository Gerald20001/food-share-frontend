<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <button @click="close" class="modal-close">×</button>
          
          <div class="auth-tabs">
            <button
              :class="['tab', { active: mode === 'login' }]"
              @click="mode = 'login'"
            >
              {{ $t('auth.login') }}
            </button>
            <button
              :class="['tab', { active: mode === 'register' }]"
              @click="mode = 'register'"
            >
              {{ $t('auth.signup') }}
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="auth-form">
            <div v-if="mode === 'register'" class="form-group">
              <label>{{ $t('auth.name') }}</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="input"
                :placeholder="$t('auth.enterName')"
              />
            </div>

            <div class="form-group">
              <label>{{ $t('auth.email') }}</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="input"
                :placeholder="$t('auth.enterEmail')"
              />
            </div>

            <div class="form-group">
              <label>{{ $t('auth.password') }}</label>
              <input
                v-model="form.password"
                type="password"
                required
                class="input"
                :placeholder="$t('auth.enterPassword')"
                minlength="6"
              />
            </div>

            <div v-if="mode === 'register'" class="form-group">
              <label>{{ $t('auth.role') }}</label>
              <select v-model="form.role" required class="input">
                <option value="">{{ $t('auth.selectRole') }}</option>
                <option value="volunteer">{{ $t('auth.volunteer') }}</option>
                <option value="organization">{{ $t('auth.organization') }}</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? $t('auth.processing') : mode === 'login' ? $t('auth.login') : $t('auth.signup') }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'

const props = defineProps({
  isOpen: Boolean,
  initialMode: { type: String, default: 'login' }
})

const emit = defineEmits(['close'])

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const toastStore = useToastStore()

const mode = ref(props.initialMode)
const loading = ref(false)
const form = ref({
  name: '',
  email: '',
  password: '',
  role: ''
})

watch(() => props.initialMode, (newMode) => {
  mode.value = newMode
})

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    form.value = { name: '', email: '', password: '', role: '' }
  }
})

const close = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (loading.value) return // Prevent double submission
  
  loading.value = true
  
  try {
    if (mode.value === 'login') {
      const result = await authStore.login(form.value.email, form.value.password)
      if (result && result.success) {
        toastStore.success(t('auth.loginSuccess'))
        close()
        // Small delay to ensure state is updated
        setTimeout(() => {
          if (authStore.isOrganization) {
            router.push('/dashboard')
          } else {
            router.push('/map')
          }
        }, 100)
      } else {
        // Don't close modal on error, show error message with longer duration
        const errorMsg = result?.message || t('common.error')
        toastStore.showToast(errorMsg, 'error', 10000)
        loading.value = false
        return
      }
    } else {
      // Validate form before submitting
      if (!form.value.name || !form.value.email || !form.value.password || !form.value.role) {
        toastStore.showToast(t('auth.fillAllFields') || 'Please fill all required fields', 'error', 10000)
        loading.value = false
        return
      }
      
      const result = await authStore.register({
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        role: form.value.role,
        language: localStorage.getItem('language') || 'en'
      })
      if (result && result.success) {
        toastStore.success(t('auth.signupSuccess'))
        close()
        // Small delay to ensure state is updated
        setTimeout(() => {
          if (authStore.isOrganization) {
            router.push('/dashboard')
          } else {
            router.push('/map')
          }
        }, 100)
      } else {
        // Don't close modal on error, show error message with longer duration
        const errorMsg = result?.message || t('common.error')
        toastStore.showToast(errorMsg, 'error', 10000)
        loading.value = false
        return
      }
    }
  } catch (error) {
    console.error('Auth error:', error)
    const errorMsg = error?.response?.data?.message || 
                    (Array.isArray(error?.response?.data?.errors) && error.response.data.errors[0]?.msg) ||
                    error?.message || 
                    t('common.error')
    toastStore.showToast(errorMsg, 'error', 10000)
    loading.value = false
    return
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 32px;
  max-width: 450px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-xl);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--text-secondary);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.auth-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  border-bottom: 2px solid var(--border-color);
}

.tab {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: -2px;
}

.tab:hover {
  color: var(--text-primary);
}

.tab.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>


