import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  const showToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now()
    const toast = {
      id,
      message,
      type,
      duration
    }
    toasts.value.push(toast)

    setTimeout(() => {
      removeToast(id)
    }, duration)

    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message) => showToast(message, 'success', 5000)
  const error = (message) => showToast(message, 'error', 7000) // Longer duration for errors
  const info = (message) => showToast(message, 'info', 5000)
  const warning = (message) => showToast(message, 'warning', 6000)

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
})


