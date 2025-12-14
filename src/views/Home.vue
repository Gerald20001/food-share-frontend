<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            {{ $t('home.heroTitle') }}
            <span class="text-gradient">{{ $t('home.heroTitleGradient') }}</span>
          </h1>
          <p class="hero-subtitle">
            {{ $t('home.heroSubtitle') }}
          </p>
          <div class="hero-actions">
            <router-link to="/map" class="btn btn-primary">{{ $t('home.findFood') }}</router-link>
            <button @click="openAuthModal('register')" class="btn btn-outline">{{ $t('home.getStarted') }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">{{ $t('home.benefitsTitle') }}</h2>
        <p class="section-subtitle">{{ $t('home.benefitsSubtitle') }}</p>
        <div class="benefits-grid">
          <div class="benefit-card card animated-card" data-animation="fadeInUp" data-delay="0">
            <div class="benefit-icon">📍</div>
            <h3>{{ $t('home.findNearby') }}</h3>
            <p>{{ $t('home.findNearbyDesc') }}</p>
            <div class="benefit-glow"></div>
          </div>
          <div class="benefit-card card animated-card" data-animation="fadeInUp" data-delay="100">
            <div class="benefit-icon">🤝</div>
            <h3>{{ $t('home.easySharing') }}</h3>
            <p>{{ $t('home.easySharingDesc') }}</p>
            <div class="benefit-glow"></div>
          </div>
          <div class="benefit-card card animated-card" data-animation="fadeInUp" data-delay="200">
            <div class="benefit-icon">🌱</div>
            <h3>{{ $t('home.reduceWaste') }}</h3>
            <p>{{ $t('home.reduceWasteDesc') }}</p>
            <div class="benefit-glow"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="section mission-section">
      <div class="container">
        <div class="mission-content">
          <div class="mission-text">
            <h2 class="section-title">{{ $t('home.missionTitle') }}</h2>
            <p>
              {{ $t('home.missionText1') }}
            </p>
            <p>
              {{ $t('home.missionText2') }}
            </p>
          </div>
          <div class="mission-image">
            <canvas ref="earthCanvas" class="earth-canvas"></canvas>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">{{ $t('home.howItWorksTitle') }}</h2>
        <p class="section-subtitle">{{ $t('home.howItWorksSubtitle') }}</p>
        <div class="steps-grid">
          <div class="step-card animated-card" data-animation="fadeInUp" data-delay="0">
            <div class="step-number">1</div>
            <h3>{{ $t('home.step1') }}</h3>
            <p>{{ $t('home.step1Desc') }}</p>
            <div class="step-arrow">→</div>
          </div>
          <div class="step-card animated-card" data-animation="fadeInUp" data-delay="200">
            <div class="step-number">2</div>
            <h3>{{ $t('home.step2') }}</h3>
            <p>{{ $t('home.step2Desc') }}</p>
            <div class="step-arrow">→</div>
          </div>
          <div class="step-card animated-card" data-animation="fadeInUp" data-delay="400">
            <div class="step-number">3</div>
            <h3>{{ $t('home.step3') }}</h3>
            <p>{{ $t('home.step3Desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- For Whom -->
    <section class="section for-whom-section">
      <div class="container">
        <h2 class="section-title">{{ $t('home.forWhomTitle') }}</h2>
        <div class="for-whom-grid">
          <div class="for-whom-card card animated-card" data-animation="fadeInLeft" data-delay="0">
            <h3>🏢 {{ $t('home.forOrganizations') }}</h3>
            <ul>
              <li>{{ $t('home.forOrganizationsDesc1') }}</li>
              <li>{{ $t('home.forOrganizationsDesc2') }}</li>
              <li>{{ $t('home.forOrganizationsDesc3') }}</li>
              <li>{{ $t('home.forOrganizationsDesc4') }}</li>
            </ul>
            <button @click="openAuthModal('register')" class="btn btn-primary">{{ $t('home.joinAsOrg') }}</button>
          </div>
          <div class="for-whom-card card animated-card" data-animation="fadeInRight" data-delay="0">
            <h3>👤 {{ $t('home.forVolunteers') }}</h3>
            <ul>
              <li>{{ $t('home.forVolunteersDesc1') }}</li>
              <li>{{ $t('home.forVolunteersDesc2') }}</li>
              <li>{{ $t('home.forVolunteersDesc3') }}</li>
              <li>{{ $t('home.forVolunteersDesc4') }}</li>
            </ul>
            <button @click="openAuthModal('register')" class="btn btn-primary">{{ $t('home.joinAsVolunteer') }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics -->
    <section class="section stats-section">
      <div class="container">
        <h2 class="section-title">{{ $t('home.statsTitle') || 'Our Impact' }}</h2>
        <div class="stats-grid">
          <div class="stat-card animated-card" data-animation="fadeInUp" data-delay="0">
            <div class="stat-icon">👥</div>
            <div class="stat-number" :data-target="stats.users">{{ animatedStats.users }}</div>
            <div class="stat-label">{{ $t('home.statsUsers') }}</div>
            <div class="stat-trend">+12% this month</div>
          </div>
          <div class="stat-card animated-card" data-animation="fadeInUp" data-delay="100">
            <div class="stat-icon">🏢</div>
            <div class="stat-number" :data-target="stats.organizations">{{ animatedStats.organizations }}</div>
            <div class="stat-label">{{ $t('home.statsOrgs') }}</div>
            <div class="stat-trend">+8% this month</div>
          </div>
          <div class="stat-card animated-card" data-animation="fadeInUp" data-delay="200">
            <div class="stat-icon">🍽️</div>
            <div class="stat-number" :data-target="stats.meals">{{ animatedStats.meals }}</div>
            <div class="stat-label">{{ $t('home.statsMeals') }}</div>
            <div class="stat-trend">+25% this month</div>
          </div>
        </div>
        <div class="chart-section">
          <div class="chart-card card animated-card" data-animation="fadeInUp" data-delay="300">
            <h3>{{ $t('home.chartTitle') || 'Activity Overview' }}</h3>
            <StatsChart 
              :data="chartData" 
              :labels="chartLabels"
              color="#4f46e5"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">{{ $t('home.faqTitle') }}</h2>
        <div class="faq-list">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="faq-item card"
            :class="{ active: activeFaq === index }"
            @click="toggleFaq(index)"
          >
            <div class="faq-question">
              <h3>{{ $t(`home.${faq.key}Q`) }}</h3>
              <span class="faq-icon">{{ activeFaq === index ? '−' : '+' }}</span>
            </div>
            <div v-if="activeFaq === index" class="faq-answer">
              <p>{{ $t(`home.${faq.key}A`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>{{ $t('home.ctaTitle') }}</h2>
          <p>{{ $t('home.ctaSubtitle') }}</p>
          <button @click="openAuthModal('register')" class="btn btn-primary btn-large">{{ $t('home.ctaButton') }}</button>
        </div>
      </div>
    </section>

    <AuthModal :is-open="authModalOpen" :initial-mode="authMode" @close="authModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AuthModal from '../components/common/AuthModal.vue'
import StatsChart from '../components/common/StatsChart.vue'
import { publicAPI } from '../services/api'
import * as THREE from 'three'

const { t } = useI18n()
const authModalOpen = ref(false)
const authMode = ref('register')
const activeFaq = ref(null)

const stats = ref({
  users: 0,
  organizations: 0,
  meals: 0
})

const animatedStats = ref({
  users: 0,
  organizations: 0,
  meals: 0
})

const chartData = ref([0, 0, 0, 0, 0, 0, 0])
const chartLabels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'])

let animationInterval = null
let particlesInterval = null
const earthCanvas = ref(null)
let earthScene = null
let earthCamera = null
let earthRenderer = null
let earthMesh = null
let animationId = null

const animateNumber = (start, end, duration, callback) => {
  const startTime = performance.now()
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const current = Math.floor(start + (end - start) * progress)
    callback(current)
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  requestAnimationFrame(animate)
}

const loadStats = async () => {
  try {
    const response = await publicAPI.getStats()
    if (response.data) {
      stats.value = {
        users: response.data.users?.total || 0,
        organizations: response.data.users?.organizations || 0,
        meals: response.data.reservations?.completed || 0
      }
      
      // Update chart data
      if (response.data.chartData && response.data.chartLabels) {
        chartData.value = response.data.chartData
        chartLabels.value = response.data.chartLabels
      }
      
      // Start animations with real data
      startAnimations()
    }
  } catch (error) {
    console.error('Error loading stats:', error)
    // Use default values if API fails
    stats.value = { users: 0, organizations: 0, meals: 0 }
    startAnimations()
  }
}

const startAnimations = () => {
  // Animate stats
  animateNumber(0, stats.value.users, 2000, (val) => { animatedStats.value.users = val })
  setTimeout(() => {
    animateNumber(0, stats.value.organizations, 2000, (val) => { animatedStats.value.organizations = val })
  }, 200)
  setTimeout(() => {
    animateNumber(0, stats.value.meals, 2000, (val) => { animatedStats.value.meals = val })
  }, 400)

  // Animate chart data with smooth transitions
  const updateChart = () => {
    chartData.value = chartData.value.map((val, index) => {
      // Add small random variation for animation effect
      const variation = Math.sin(Date.now() / 1000 + index) * 5
      return Math.max(0, val + variation)
    })
  }
  animationInterval = setInterval(updateChart, 2000)
}

const openAuthModal = (mode) => {
  authMode.value = mode
  authModalOpen.value = true
}

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const faqs = [
  { key: 'faq1' },
  { key: 'faq2' },
  { key: 'faq3' },
  { key: 'faq4' }
]

onMounted(() => {
  loadStats()
  
  // Create particles effect
  createParticles()
  
  // Initialize 3D Earth - wait for DOM to be fully ready
  setTimeout(() => {
    if (earthCanvas.value) {
      initEarth()
    } else {
      // Retry if canvas not ready
      setTimeout(() => {
        initEarth()
      }, 200)
    }
  }, 300)
  
  // Intersection Observer for scroll animations with staggered delays
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0
        setTimeout(() => {
          entry.target.classList.add('animate')
        }, parseInt(delay))
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  document.querySelectorAll('.animated-card').forEach(card => {
    observer.observe(card)
  })
})

const createParticles = () => {
  const hero = document.querySelector('.hero')
  if (!hero) return
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    particle.style.left = Math.random() * 100 + '%'
    particle.style.top = Math.random() * 100 + '%'
    particle.style.animationDelay = Math.random() * 3 + 's'
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's'
    particle.style.setProperty('--random-x', (Math.random() * 2 - 1))
    hero.appendChild(particle)
  }
}

const initEarth = () => {
  if (!earthCanvas.value) return

  const width = 400
  const height = 400

  // Scene
  earthScene = new THREE.Scene()
  earthScene.background = null

  // Camera
  earthCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  earthCamera.position.z = 3

  // Renderer
  earthRenderer = new THREE.WebGLRenderer({ 
    canvas: earthCanvas.value,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  })
  earthRenderer.setSize(width, height)
  earthRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  earthRenderer.setClearColor(0x000000, 0)

  // Earth geometry - high resolution for realistic look
  const geometry = new THREE.SphereGeometry(1, 64, 64)

  // Texture loader
  const loader = new THREE.TextureLoader()
  
  // Create realistic Earth texture using canvas
  const textureCanvas = document.createElement('canvas')
  textureCanvas.width = 2048
  textureCanvas.height = 1024
  const earthCtx = textureCanvas.getContext('2d')
  
  // Base ocean color
  const oceanGradient = earthCtx.createLinearGradient(0, 0, textureCanvas.width, textureCanvas.height)
  oceanGradient.addColorStop(0, '#1e3a8a')
  oceanGradient.addColorStop(0.3, '#2563eb')
  oceanGradient.addColorStop(0.5, '#3b82f6')
  oceanGradient.addColorStop(0.7, '#2563eb')
  oceanGradient.addColorStop(1, '#1e3a8a')
  earthCtx.fillStyle = oceanGradient
  earthCtx.fillRect(0, 0, textureCanvas.width, textureCanvas.height)
  
  // Add ocean depth variation
  earthCtx.globalAlpha = 0.3
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * textureCanvas.width
    const y = Math.random() * textureCanvas.height
    const radius = 50 + Math.random() * 150
    const gradient = earthCtx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, 'rgba(30, 58, 138, 0.8)')
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0)')
    earthCtx.fillStyle = gradient
    earthCtx.beginPath()
    earthCtx.arc(x, y, radius, 0, Math.PI * 2)
    earthCtx.fill()
  }
  earthCtx.globalAlpha = 1.0
  
  // Draw continents with realistic shapes
  const drawContinent = (x, y, width, height, color) => {
    earthCtx.fillStyle = color
    earthCtx.beginPath()
    earthCtx.ellipse(x, y, width, height, 0, 0, Math.PI * 2)
    earthCtx.fill()
    
    // Add texture to continent
    earthCtx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    for (let i = 0; i < 20; i++) {
      const px = x + (Math.random() - 0.5) * width * 1.5
      const py = y + (Math.random() - 0.5) * height * 1.5
      if (Math.pow((px - x) / width, 2) + Math.pow((py - y) / height, 2) < 1) {
        earthCtx.fillRect(px, py, 2, 2)
      }
    }
  }
  
  // North America
  drawContinent(textureCanvas.width * 0.25, textureCanvas.height * 0.35, textureCanvas.width * 0.15, textureCanvas.height * 0.25, '#2d5016')
  // South America
  drawContinent(textureCanvas.width * 0.28, textureCanvas.height * 0.65, textureCanvas.width * 0.08, textureCanvas.height * 0.2, '#1a3d0a')
  // Europe/Africa
  drawContinent(textureCanvas.width * 0.5, textureCanvas.height * 0.5, textureCanvas.width * 0.12, textureCanvas.height * 0.35, '#2d5016')
  // Asia
  drawContinent(textureCanvas.width * 0.7, textureCanvas.height * 0.4, textureCanvas.width * 0.2, textureCanvas.height * 0.3, '#1a3d0a')
  // Australia
  drawContinent(textureCanvas.width * 0.75, textureCanvas.height * 0.7, textureCanvas.width * 0.06, textureCanvas.height * 0.08, '#2d5016')
  
  const earthTexture = new THREE.CanvasTexture(textureCanvas)
  earthTexture.wrapS = THREE.RepeatWrapping
  earthTexture.wrapT = THREE.ClampToEdgeWrapping
  
  // Create normal map for depth effect
  const normalCanvas = document.createElement('canvas')
  normalCanvas.width = 1024
  normalCanvas.height = 512
  const normalCtx = normalCanvas.getContext('2d')
  normalCtx.fillStyle = '#8080ff' // Base normal color (neutral)
  normalCtx.fillRect(0, 0, normalCanvas.width, normalCanvas.height)
  
  // Add variation for continents (slightly raised)
  normalCtx.fillStyle = '#8180ff'
  normalCtx.beginPath()
  normalCtx.ellipse(normalCanvas.width * 0.25, normalCanvas.height * 0.35, normalCanvas.width * 0.15, normalCanvas.height * 0.25, 0, 0, Math.PI * 2)
  normalCtx.fill()
  normalCtx.beginPath()
  normalCtx.ellipse(normalCanvas.width * 0.28, normalCanvas.height * 0.65, normalCanvas.width * 0.08, normalCanvas.height * 0.2, 0, 0, Math.PI * 2)
  normalCtx.fill()
  normalCtx.beginPath()
  normalCtx.ellipse(normalCanvas.width * 0.5, normalCanvas.height * 0.5, normalCanvas.width * 0.12, normalCanvas.height * 0.35, 0, 0, Math.PI * 2)
  normalCtx.fill()
  normalCtx.beginPath()
  normalCtx.ellipse(normalCanvas.width * 0.7, normalCanvas.height * 0.4, normalCanvas.width * 0.2, normalCanvas.height * 0.3, 0, 0, Math.PI * 2)
  normalCtx.fill()
  normalCtx.beginPath()
  normalCtx.ellipse(normalCanvas.width * 0.75, normalCanvas.height * 0.7, normalCanvas.width * 0.06, normalCanvas.height * 0.08, 0, 0, Math.PI * 2)
  normalCtx.fill()
  
  const normalTexture = new THREE.CanvasTexture(normalCanvas)
  normalTexture.wrapS = THREE.RepeatWrapping
  normalTexture.wrapT = THREE.ClampToEdgeWrapping
  
  // Create Earth material with texture and normal map
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: normalTexture,
    roughness: 0.8,
    metalness: 0.1,
    emissive: 0x000011,
    emissiveIntensity: 0.05
  })

  earthMesh = new THREE.Mesh(geometry, earthMaterial)
  earthScene.add(earthMesh)

  // Add clouds layer with procedural texture
  const cloudsGeometry = new THREE.SphereGeometry(1.01, 64, 64)
  const cloudsCanvas = document.createElement('canvas')
  cloudsCanvas.width = 1024
  cloudsCanvas.height = 512
  const cloudsCtx = cloudsCanvas.getContext('2d')
  
  // Create cloud pattern
  cloudsCtx.fillStyle = 'rgba(255, 255, 255, 0.6)'
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * cloudsCanvas.width
    const y = Math.random() * cloudsCanvas.height
    const radius = 20 + Math.random() * 40
    cloudsCtx.beginPath()
    cloudsCtx.arc(x, y, radius, 0, Math.PI * 2)
    cloudsCtx.fill()
  }
  
  const cloudsTexture = new THREE.CanvasTexture(cloudsCanvas)
  cloudsTexture.wrapS = THREE.RepeatWrapping
  cloudsTexture.wrapT = THREE.RepeatWrapping
  
  const cloudsMaterial = new THREE.MeshStandardMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.5,
    alphaMap: cloudsTexture,
    side: THREE.DoubleSide,
    depthWrite: false,
    roughness: 1.0,
    metalness: 0.0
  })
  const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial)
  earthScene.add(clouds)

  // Add atmosphere glow effect
  const atmosphereGeometry = new THREE.SphereGeometry(1.05, 32, 32)
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x4a90e2,
    transparent: true,
    opacity: 0.2,
    side: THREE.BackSide
  })
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
  earthScene.add(atmosphere)

  // Enhanced lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  earthScene.add(ambientLight)

  // Main sun light (simulating sunlight)
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.5)
  sunLight.position.set(5, 3, 5)
  sunLight.castShadow = false
  earthScene.add(sunLight)

  // Fill light for better visibility
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4)
  fillLight.position.set(-3, -2, -2)
  earthScene.add(fillLight)

  // Point light for specular highlights
  const pointLight = new THREE.PointLight(0xffffff, 0.6)
  pointLight.position.set(2, 2, 2)
  earthScene.add(pointLight)

  // Store clouds for animation
  let cloudsMesh = clouds

  // Animation with smooth rotation
  let rotationSpeed = 0.003
  const animate = () => {
    if (earthMesh) {
      earthMesh.rotation.y += rotationSpeed
      if (cloudsMesh) {
        cloudsMesh.rotation.y += rotationSpeed * 1.1
      }
    }
    earthRenderer.render(earthScene, earthCamera)
    animationId = requestAnimationFrame(animate)
  }
  animate()

  // Fallback function for procedural Earth if textures fail
  function createProceduralEarth() {
    const proceduralMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x000011,
      shininess: 30,
      specular: 0x111111
    })
    if (earthMesh) {
      earthMesh.material = proceduralMaterial
    }
  }
}

const cleanupEarth = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  if (earthRenderer) {
    earthRenderer.dispose()
  }
  // Clean up all scene objects
  if (earthScene) {
    earthScene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(mat => mat.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
  }
  earthScene = null
  earthCamera = null
  earthRenderer = null
  earthMesh = null
}

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
  }
  if (particlesInterval) {
    clearInterval(particlesInterval)
  }
  cleanupEarth()
})
</script>

<style scoped>
.hero {
  background: var(--gradient-hero);
  color: white;
  padding: 120px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  perspective: 1000px;
}

/* Particles */
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  pointer-events: none;
  animation: particleFloat 5s infinite ease-in-out;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(calc(var(--random-x, 0) * 100px)) scale(0);
    opacity: 0;
  }
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  transform-style: preserve-3d;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.2;
  animation: fadeInDown 1s ease-out, pulse 3s ease-in-out infinite;
  position: relative;
  transform-style: preserve-3d;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.5),
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 60px rgba(79, 70, 229, 0.3);
  transition: transform 0.3s ease;
}

.hero-title:hover {
  transform: translateZ(20px) rotateX(5deg);
}

.hero-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animated-card {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animated-card[data-animation="fadeInLeft"] {
  transform: translateX(-50px);
}

.animated-card[data-animation="fadeInRight"] {
  transform: translateX(50px);
}

.animated-card.animate {
  opacity: 1;
  transform: translateY(0) translateX(0);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 40px;
  opacity: 0.95;
  line-height: 1.6;
  animation: fadeInUp 1.2s ease-out 0.3s both;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1.4s ease-out 0.6s both;
}

.hero-actions .btn {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hero-actions .btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.hero-actions .btn:hover::before {
  width: 300px;
  height: 300px;
}

.hero-actions .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.benefit-card {
  text-align: center;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
  border-radius: 20px;
  background: var(--bg-primary);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

.benefit-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.1), transparent);
  transition: left 0.6s ease;
}

.benefit-card:hover::before {
  left: 100%;
}

.benefit-card:hover {
  transform: translateY(-12px) translateZ(20px) rotateY(5deg) scale(1.03);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.2),
    0 0 40px rgba(79, 70, 229, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.benefit-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.1), transparent);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.benefit-card:hover .benefit-glow {
  opacity: 1;
}

.benefit-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.benefit-card:hover .benefit-icon {
  transform: scale(1.2) rotate(5deg);
}

.benefit-card h3 {
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.benefit-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.mission-section {
  background: var(--bg-secondary);
}

.mission-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.mission-text {
  animation: fadeInLeft 1s ease-out;
}

.mission-image {
  animation: fadeInRight 1s ease-out;
}

.mission-text p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 16px;
}

.mission-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.earth-canvas {
  width: 100%;
  max-width: 400px;
  height: 400px;
  display: block;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.step-card {
  text-align: center;
  padding: 32px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.step-card:hover {
  transform: translateY(-12px) translateZ(30px) rotateY(5deg);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.2),
    0 0 40px rgba(79, 70, 229, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.step-arrow {
  position: absolute;
  top: 50%;
  right: -40px;
  transform: translateY(-50%);
  font-size: 2rem;
  color: var(--accent-primary);
  opacity: 0.5;
  animation: slideArrow 2s ease-in-out infinite;
}

.step-card:last-child .step-arrow {
  display: none;
}

@keyframes slideArrow {
  0%, 100% { transform: translateY(-50%) translateX(0); }
  50% { transform: translateY(-50%) translateX(10px); }
}

@media (max-width: 768px) {
  .step-arrow {
    display: none;
  }
}

.step-number {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 auto 24px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: pulseNumber 2s ease-in-out infinite;
}

.step-card:hover .step-number {
  transform: scale(1.15) rotate(360deg) translateZ(20px);
  box-shadow: 
    0 0 30px rgba(79, 70, 229, 0.6),
    0 0 60px rgba(79, 70, 229, 0.4),
    0 0 0 3px rgba(255, 255, 255, 0.2) inset;
}

@keyframes pulseNumber {
  0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
}

.step-card h3 {
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.step-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.for-whom-section {
  background: var(--bg-secondary);
}

.for-whom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.for-whom-card h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.for-whom-card ul {
  list-style: none;
  margin-bottom: 24px;
}

.for-whom-card li {
  padding: 8px 0;
  color: var(--text-secondary);
  position: relative;
  padding-left: 24px;
}

.for-whom-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent-primary);
  font-weight: bold;
}

.stats-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.stats-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.stats-section .section-title {
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  position: relative;
  z-index: 1;
}

.stat-card {
  text-align: center;
  padding: 40px 32px;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transform-style: preserve-3d;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 0 60px rgba(255, 255, 255, 0.1);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-12px) translateZ(30px) rotateX(2deg) scale(1.02);
  box-shadow: 
    0 25px 70px rgba(0, 0, 0, 0.3),
    0 0 60px rgba(255, 255, 255, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.2) inset,
    0 0 100px rgba(102, 126, 234, 0.2);
  background: rgba(255, 255, 255, 1);
}

.stat-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  display: block;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  line-height: 1;
  text-shadow: none;
  display: block;
}

.stat-label {
  font-size: 1.25rem;
  color: #4a5568;
  font-weight: 700;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-trend {
  font-size: 0.95rem;
  color: #51cf66;
  margin-top: 8px;
  font-weight: 700;
  background: rgba(81, 207, 102, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-block;
}

.chart-section {
  margin-top: 48px;
}

.chart-card {
  padding: 32px;
  border-radius: 16px;
}

.chart-card h3 {
  margin-bottom: 24px;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-item:hover {
  box-shadow: var(--shadow-md);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question h3 {
  font-size: 1.125rem;
  color: var(--text-primary);
}

.faq-icon {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--accent-primary);
}

.faq-answer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  line-height: 1.6;
}

.cta-section {
  background: var(--gradient-hero);
  color: white;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.cta-content p {
  font-size: 1.25rem;
  margin-bottom: 32px;
  opacity: 0.95;
}

.btn-large {
  padding: 16px 32px;
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .hero {
    padding: 80px 0;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .mission-content {
    grid-template-columns: 1fr;
  }

  .image-placeholder {
    font-size: 6rem;
  }
}
</style>


