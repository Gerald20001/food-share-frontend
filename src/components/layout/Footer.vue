<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-logo">
            <span class="logo-icon">🍽️</span>
            Food Share
          </h3>
          <p class="footer-description">
            Connecting organizations with volunteers to reduce food waste and help those in need.
          </p>
        </div>

        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/map">Map</router-link></li>
            <li><router-link to="/blog">Blog</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>For Organizations</h4>
          <ul>
            <li><router-link to="/dashboard">Dashboard</router-link></li>
            <li><a href="#" @click.prevent>How It Works</a></li>
            <li><a href="#" @click.prevent>Benefits</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Connect</h4>
          <div class="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2024 Food Share. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 60px 0 24px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 16px;
  color: var(--text-primary);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
}

.logo-icon {
  font-size: 2rem;
}

.footer-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-section a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--accent-primary);
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-links a {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.social-links a:hover {
  transform: scale(1.2);
}

.footer-bottom {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>


