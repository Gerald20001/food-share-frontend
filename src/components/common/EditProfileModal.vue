<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <button @click="close" class="modal-close">×</button>
          
          <h2>{{ $t('profile.editTitle') }}</h2>

          <form @submit.prevent="handleSubmit" class="profile-form">
            <div class="form-group">
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
              <label>{{ $t('profile.phone') }}</label>
              <input
                v-model="form.phone"
                type="tel"
                class="input"
                :placeholder="$t('profile.phonePlaceholder')"
              />
            </div>

            <div class="form-group">
              <label>{{ $t('profile.address') }}</label>
              <input
                v-model="form.address"
                type="text"
                class="input"
                :placeholder="$t('profile.addressPlaceholder')"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? $t('common.loading') : $t('common.save') }}
              </button>
              <button type="button" @click="close" class="btn btn-secondary">
                {{ $t('common.cancel') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { usersAPI } from '../../services/api'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'

const props = defineProps({
  isOpen: Boolean,
  user: Object
})

const emit = defineEmits(['close', 'updated'])

const { t } = useI18n()
const authStore = useAuthStore()
const toastStore = useToastStore()

const loading = ref(false)
const form = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

watch(() => props.user, (user) => {
  if (user) {
    form.value = {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    }
  }
}, { immediate: true })

const close = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!props.user) return

  loading.value = true
  
  try {
    await usersAPI.updateProfile(props.user.id, form.value)
    toastStore.success(t('profile.updateSuccess'))
    emit('updated', form.value)
    close()
    // Refresh user data
    await authStore.initAuth()
  } catch (error) {
    toastStore.error(error.response?.data?.message || t('common.error'))
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
  max-width: 500px;
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

.modal-content h2 {
  font-size: 1.75rem;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.profile-form {
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

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
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

