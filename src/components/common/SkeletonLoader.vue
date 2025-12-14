<template>
  <div :class="['skeleton', `skeleton-${type}`, { 'skeleton-animated': animated }]">
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-header"></div>
      <div class="skeleton-body">
        <div class="skeleton-line" v-for="n in lines" :key="n" :style="{ width: getRandomWidth() }"></div>
      </div>
    </div>
    <div v-else-if="type === 'list'" class="skeleton-list">
      <div class="skeleton-item" v-for="n in count" :key="n"></div>
    </div>
    <div v-else class="skeleton-default"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'card', 'list', 'text', 'avatar'].includes(value)
  },
  lines: {
    type: Number,
    default: 3
  },
  count: {
    type: Number,
    default: 5
  },
  animated: {
    type: Boolean,
    default: true
  }
})

const getRandomWidth = () => {
  const widths = ['100%', '90%', '80%', '70%', '60%']
  return widths[Math.floor(Math.random() * widths.length)]
}
</script>

<style scoped>
.skeleton {
  background: var(--bg-secondary);
  border-radius: 8px;
}

.skeleton-animated {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--bg-primary) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-card {
  padding: 20px;
}

.skeleton-header {
  height: 24px;
  width: 60%;
  background: var(--bg-primary);
  border-radius: 4px;
  margin-bottom: 16px;
}

.skeleton-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 16px;
  background: var(--bg-primary);
  border-radius: 4px;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-item {
  height: 80px;
  background: var(--bg-primary);
  border-radius: 8px;
}

.skeleton-default {
  height: 100px;
  width: 100%;
}
</style>

