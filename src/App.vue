<template>
  <div id="app" :data-theme="theme">
    <ToastContainer />
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from './stores/theme'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import ToastContainer from './components/common/ToastContainer.vue'

const themeStore = useThemeStore()
const theme = computed(() => themeStore.theme)
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>

