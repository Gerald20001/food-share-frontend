<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <button @click="close" class="modal-close">×</button>
          
          <h2>{{ $t('reservation.title') }}</h2>
          <p class="modal-subtitle">{{ $t('reservation.subtitle') }}</p>

          <form @submit.prevent="handleSubmit" class="reservation-form">
            <div class="form-group">
              <label>{{ $t('reservation.message') }}</label>
              <textarea
                v-model="form.message"
                class="input"
                rows="4"
                :placeholder="$t('reservation.messagePlaceholder')"
              ></textarea>
            </div>

            <div class="announcement-preview">
              <img :src="announcement.image || 'https://via.placeholder.com/400x300'" :alt="announcement.title" />
              <div>
                <h4>{{ announcement.title }}</h4>
                <p>📍 {{ announcement.address }}</p>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? $t('reservation.sending') : $t('reservation.sendRequest') }}
              </button>
              <button type="button" @click="close" class="btn btn-secondary">{{ $t('reservation.cancel') }}</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBookingsStore } from '../../stores/bookings'
import { useToastStore } from '../../stores/toast'

const props = defineProps({
  isOpen: Boolean,
  announcement: Object
})

const emit = defineEmits(['close', 'success'])

const router = useRouter()
const { t } = useI18n()
const bookingsStore = useBookingsStore()
const toastStore = useToastStore()

const loading = ref(false)
const form = ref({
  message: ''
})

const close = () => {
  emit('close')
  form.value.message = ''
}

const handleSubmit = async () => {
  if (!props.announcement) return

  loading.value = true
  
  try {
    const result = await bookingsStore.createReservation(props.announcement.id, form.value.message)
    
    if (result.success) {
      toastStore.success(t('reservation.success'))
      emit('success')
      close()
    } else {
      toastStore.error(result.message || t('common.error'))
    }
    router.push('/bookings')
  } catch (error) {
    toastStore.error(error.message || 'Failed to send reservation request')
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
  margin-bottom: 8px;
  color: var(--text-primary);
}

.modal-subtitle {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.reservation-form {
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

textarea.input {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.announcement-preview {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin: 8px 0;
}

.announcement-preview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.announcement-preview h4 {
  font-size: 1rem;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.announcement-preview p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
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

