<template>
  <div class="contact">
    <div class="container">
      <div class="contact-content">
        <div class="contact-info">
          <h1>{{ $t('contact.title') }}</h1>
          <p class="contact-description">
            {{ $t('contact.description') }}
          </p>

          <div class="contact-details">
            <div class="contact-item">
              <div class="contact-icon">📧</div>
              <div>
                <h3>{{ $t('contact.email') }}</h3>
                <p>info@foodshare.com</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">📱</div>
              <div>
                <h3>{{ $t('contact.phone') }}</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">📍</div>
              <div>
                <h3>{{ $t('contact.address') }}</h3>
                <p>123 Food Share St, City, Country</p>
              </div>
            </div>
          </div>

          <div class="social-links">
            <h3>{{ $t('contact.followUs') }}</h3>
            <div class="social-icons">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>
        </div>

        <div class="contact-form-wrapper">
          <form @submit.prevent="handleSubmit" class="contact-form card">
            <h2>Send us a Message</h2>
            <div class="form-group">
              <label>{{ $t('contact.name') }} *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="input"
                :placeholder="$t('contact.namePlaceholder')"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('contact.email') }} *</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="input"
                :placeholder="$t('contact.emailPlaceholder')"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('contact.subject') }} *</label>
              <input
                v-model="form.subject"
                type="text"
                required
                class="input"
                :placeholder="$t('contact.subjectPlaceholder')"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('contact.message') }} *</label>
              <textarea
                v-model="form.message"
                required
                class="input"
                rows="6"
                :placeholder="$t('contact.messagePlaceholder')"
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? $t('contact.sending') : $t('contact.sendMessage') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToastStore } from '../stores/toast'

const { t } = useI18n()
const toastStore = useToastStore()
const loading = ref(false)

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // TODO: Replace with API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toastStore.success(t('contact.success'))
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch (error) {
    toastStore.error(t('contact.error'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-info h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.contact-description {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin-bottom: 40px;
  line-height: 1.6;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 40px;
}

.contact-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.contact-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.contact-item h3 {
  font-size: 1.25rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.contact-item p {
  color: var(--text-secondary);
}

.social-links h3 {
  font-size: 1.25rem;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.social-icons {
  display: flex;
  gap: 16px;
}

.social-icons a {
  font-size: 2rem;
  transition: transform 0.3s ease;
}

.social-icons a:hover {
  transform: scale(1.2);
}

.contact-form-wrapper {
  display: flex;
  align-items: flex-start;
}

.contact-form {
  width: 100%;
}

.contact-form h2 {
  font-size: 2rem;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.contact-form .form-group {
  margin-bottom: 20px;
}

.contact-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.contact-form textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>


