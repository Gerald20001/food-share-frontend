<template>
  <div class="stats-chart">
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  labels: {
    type: Array,
    required: true
  },
  color: {
    type: String,
    default: '#4f46e5'
  }
})

const chartCanvas = ref(null)
let chart = null

const drawChart = () => {
  if (!chartCanvas.value) return

  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  if (props.data.length === 0) return

  const maxValue = Math.max(...props.data)
  const barWidth = width / props.data.length - 10
  const spacing = 10

  props.data.forEach((value, index) => {
    const barHeight = (value / maxValue) * (height - 40)
    const x = index * (barWidth + spacing) + spacing
    const y = height - barHeight - 20

    // Draw bar
    ctx.fillStyle = props.color
    ctx.fillRect(x, y, barWidth, barHeight)

    // Draw value label
    ctx.fillStyle = '#fff'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(value, x + barWidth / 2, y - 5)

    // Draw label
    ctx.fillStyle = '#666'
    ctx.font = '10px sans-serif'
    ctx.fillText(props.labels[index] || '', x + barWidth / 2, height - 5)
  })
}

onMounted(() => {
  if (chartCanvas.value) {
    chartCanvas.value.width = chartCanvas.value.offsetWidth
    chartCanvas.value.height = chartCanvas.value.offsetHeight
    drawChart()
  }
})

watch(() => props.data, () => {
  drawChart()
}, { deep: true })
</script>

<style scoped>
.stats-chart {
  width: 100%;
  height: 200px;
}

.chart-container {
  width: 100%;
  height: 100%;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>

