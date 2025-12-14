<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <button @click="close" class="modal-close">×</button>
          
          <h2>{{ $t('profile.uploadImage') }}</h2>

          <div class="upload-area">
            <input
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="file-input"
              id="image-upload-input"
              ref="fileInput"
            />
            <label for="image-upload-input" class="upload-label">
              <div v-if="!preview" class="upload-placeholder">
                <span>📷</span>
                <p>{{ $t('profile.clickToUpload') }}</p>
              </div>
              <div v-else class="image-preview-large">
                <img :src="preview" :alt="$t('profile.preview')" />
                <button type="button" @click="clearPreview" class="remove-preview">×</button>
              </div>
            </label>
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              @click="handleUpload" 
              class="btn btn-primary" 
              :disabled="loading || !preview"
            >
              {{ loading ? $t('common.loading') : $t('common.save') }}
            </button>
            <button type="button" @click="close" class="btn btn-secondary">
              {{ $t('common.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { uploadAPI } from '../../services/api'
import { useToastStore } from '../../stores/toast'

const props = defineProps({
  isOpen: Boolean,
  type: {
    type: String,
    default: 'avatar', // 'avatar' or 'cover'
    validator: (value) => ['avatar', 'cover', 'image'].includes(value)
  }
})

const emit = defineEmits(['close', 'uploaded'])

const { t } = useI18n()
const toastStore = useToastStore()

const loading = ref(false)
const preview = ref(null)
const selectedFile = ref(null)
const fileInput = ref(null)

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    clearPreview()
  }
})

const close = () => {
  emit('close')
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const clearPreview = () => {
  preview.value = null
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleUpload = async () => {
  if (!selectedFile.value) return

  loading.value = true
  
  try {
    let response
    if (props.type === 'avatar') {
      response = await uploadAPI.uploadAvatar(selectedFile.value)
    } else if (props.type === 'cover') {
      response = await uploadAPI.uploadCover(selectedFile.value)
    } else {
      response = await uploadAPI.uploadImage(selectedFile.value)
    }
    
    toastStore.success(t('profile.uploadSuccess'))
    emit('uploaded', response.data.url)
    close()
  } catch (error) {
    toastStore.error(error.response?.data?.message || t('profile.uploadError'))
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

.upload-area {
  margin-bottom: 24px;
}

.file-input {
  display: none;
}

.upload-label {
  display: block;
  cursor: pointer;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
}

.upload-label:hover {
  border-color: var(--primary);
  background: var(--bg-secondary);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-placeholder span {
  font-size: 3rem;
}

.image-preview-large {
  position: relative;
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 8px;
}

.image-preview-large img {
  width: 100%;
  height: auto;
  display: block;
}

.remove-preview {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.remove-preview:hover {
  background: rgba(0, 0, 0, 0.9);
}

.form-actions {
  display: flex;
  gap: 12px;
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

