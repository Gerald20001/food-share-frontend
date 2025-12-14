<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
      >
        <span class="toast-icon">{{ getIcon(toast.type) }}</span>
        <span class="toast-message">{{ toast.message }}</span>
        <button @click="toastStore.removeToast(toast.id)" class="toast-close">×</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from '../../stores/toast'

const toastStore = useToastStore()

const getIcon = (type) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  min-width: 300px;
  animation: slideIn 0.3s ease-out;
}

.toast-icon {
  font-size: 1.25rem;
  font-weight: bold;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  color: var(--text-primary);
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.toast-close:hover {
  color: var(--text-primary);
}

.toast-success {
  border-left: 4px solid #28a745;
}

.toast-success .toast-icon {
  color: #28a745;
}

.toast-error {
  border-left: 4px solid #dc3545;
}

.toast-error .toast-icon {
  color: #dc3545;
}

.toast-warning {
  border-left: 4px solid #ffc107;
}

.toast-warning .toast-icon {
  color: #ffc107;
}

.toast-info {
  border-left: 4px solid #17a2b8;
}

.toast-info .toast-icon {
  color: #17a2b8;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .toast-container {
    right: 10px;
    left: 10px;
    max-width: none;
  }

  .toast {
    min-width: auto;
  }
}
</style>


