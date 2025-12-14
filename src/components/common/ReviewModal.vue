<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content review-modal">
      <div class="modal-header">
        <h2>{{ $t('review.title') }}</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="modal-body">
        <div class="review-target">
          <img :src="targetUser?.avatar || 'https://via.placeholder.com/50'" :alt="targetUser?.name" />
          <div>
            <h3>{{ targetUser?.name }}</h3>
            <p>{{ targetUser?.role === 'organization' ? $t('review.organization') : $t('review.volunteer') }}</p>
          </div>
        </div>

        <div class="rating-section">
          <label>{{ $t('review.ratingLabel') }}</label>
          <div class="star-rating">
            <button
              v-for="star in 5"
              :key="star"
              class="star-btn"
              :class="{ active: star <= rating }"
              @click="rating = star"
            >
              ⭐
            </button>
          </div>
        </div>

        <div class="comment-section">
          <label>{{ $t('review.commentLabel') }}</label>
          <textarea
            v-model="comment"
            :placeholder="$t('review.commentPlaceholder')"
            rows="5"
            class="input"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">
          {{ $t('common.cancel') }}
        </button>
        <button class="btn btn-primary" @click="handleSubmit" :disabled="loading || !rating">
          {{ loading ? $t('common.saving') : $t('review.submit') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { reviewsAPI } from '../../services/api'
import { useToastStore } from '../../stores/toast'

const props = defineProps({
  isOpen: Boolean,
  reservationId: String,
  targetUser: Object
})

const emit = defineEmits(['close', 'submitted'])

const { t } = useI18n()
const toastStore = useToastStore()

const rating = ref(0)
const comment = ref('')
const loading = ref(false)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    rating.value = 0
    comment.value = ''
  }
})

const handleSubmit = async () => {
  if (!rating.value) {
    toastStore.error(t('review.ratingRequired'))
    return
  }

  loading.value = true
  try {
    await reviewsAPI.create({
      reservation_id: props.reservationId,
      rating: rating.value,
      comment: comment.value.trim() || null
    })
    
    toastStore.success(t('review.success'))
    emit('submitted')
    emit('close')
  } catch (error) {
    console.error('Create review error:', error)
    toastStore.error(error.response?.data?.message || t('review.error'))
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.review-modal {
  background: var(--bg-primary);
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-body {
  padding: 24px;
}

.review-target {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  margin-bottom: 24px;
}

.review-target img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.review-target h3 {
  margin: 0 0 4px 0;
  color: var(--text-primary);
}

.review-target p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.rating-section {
  margin-bottom: 24px;
}

.rating-section label {
  display: block;
  margin-bottom: 12px;
  color: var(--text-primary);
  font-weight: 600;
}

.star-rating {
  display: flex;
  gap: 8px;
}

.star-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s ease;
  filter: grayscale(100%);
  opacity: 0.5;
}

.star-btn:hover {
  transform: scale(1.2);
}

.star-btn.active {
  filter: grayscale(0%);
  opacity: 1;
}

.comment-section label {
  display: block;
  margin-bottom: 12px;
  color: var(--text-primary);
  font-weight: 600;
}

.comment-section textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.comment-section textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid var(--border-color);
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}
</style>

