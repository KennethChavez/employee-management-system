<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCompanyStore } from '../../stores/company'
import { useThemeStore } from '../../stores/theme'

const router = useRouter()
const route = useRoute()
const companyStore = useCompanyStore()
const themeStore = useThemeStore()
const isMobileMenuOpen = ref(false)

const companies = [
  { id: 'nsh', name: 'NSH', color: 'var(--color-nsh)' },
  { id: 'tsn', name: 'TSN', color: 'var(--color-tsn)' },
  { id: 'oth', name: 'OTH', color: 'var(--color-oth)' }
]

const currentCompany = computed(() => {
  return route.params.company || 'nsh'
})

const isDarkMode = computed({
  get: () => themeStore.isDarkMode,
  set: (value) => themeStore.setDarkMode(value)
})

const navigateTo = (path) => {
  router.push(path)
  isMobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}
</script>

<template>
  <aside class="sidebar" :class="{ 'mobile-open': isMobileMenuOpen }">
    <div class="sidebar-header">
      <h1 class="logo">EMS</h1>
      <button class="mobile-toggle" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    
    <div class="company-selector">
      <h3>Companies</h3>
      <div class="company-list">
        <button
          v-for="company in companies"
          :key="company.id"
          class="company-btn"
          :class="{ active: currentCompany === company.id }"
          :style="{ '--company-color': company.color }"
          @click="navigateTo(`/employees/${company.id}`)"
        >
          {{ company.name }}
        </button>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <h3>Navigation</h3>
      <ul>
        <li>
          <a 
            @click.prevent="navigateTo('/')"
            :class="{ active: route.name === 'dashboard' }"
          >
            Dashboard
          </a>
        </li>
        <li>
          <a 
            @click.prevent="navigateTo(`/employees/${currentCompany}`)"
            :class="{ active: route.name === 'employees' }"
          >
            Employees
          </a>
        </li>
        <li>
          <a 
            @click.prevent="navigateTo('/all-employees')"
            :class="{ active: route.name === 'all-employees' }"
          >
            All Employees
          </a>
        </li>
        <li>
          <a 
            @click.prevent="navigateTo(`/settings/${currentCompany}`)"
            :class="{ active: route.name === 'company-settings' }"
          >
            Settings
          </a>
        </li>
      </ul>
    </nav>
    
    <div class="theme-toggle">
      <button @click="toggleTheme" class="theme-btn">
        {{ isDarkMode ? '🌙' : '☀️' }} {{ isDarkMode ? 'Dark' : 'Light' }} Mode
      </button>
    </div>
    
    <div class="sidebar-footer">
      <p>© 2025 Employee Management System</p>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  height: 100%;
  background-color: var(--color-card);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
}

.logo {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
}

.company-selector {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.company-list {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.company-btn {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
  text-align: center;
  font-weight: 500;
  transition: all 0.2s ease;
}

.company-btn:hover {
  border-color: var(--company-color, var(--color-primary));
}

.company-btn.active {
  background-color: var(--company-color, var(--color-primary));
  color: white;
  border-color: transparent;
}

.sidebar-nav {
  padding: 1.5rem;
  flex: 1;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
}

.sidebar-nav li {
  margin-bottom: 0.25rem;
}

.sidebar-nav a {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: var(--color-text-primary);
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.sidebar-nav a:hover {
  background-color: var(--color-hover);
}

.sidebar-nav a.active {
  background-color: var(--color-active);
  color: var(--color-primary);
  font-weight: 500;
}

.theme-toggle {
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.theme-btn {
  width: 100%;
  background-color: var(--color-card);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.theme-btn:hover {
  background-color: var(--color-hover);
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.mobile-toggle {
  display: none;
  background: transparent;
  border: none;
  padding: 0;
  width: 24px;
  height: 20px;
  position: relative;
  cursor: pointer;
}

.mobile-toggle span {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--color-text-primary);
  position: absolute;
  transition: all 0.3s ease;
}

.mobile-toggle span:nth-child(1) {
  top: 0;
}

.mobile-toggle span:nth-child(2) {
  top: 9px;
}

.mobile-toggle span:nth-child(3) {
  top: 18px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 100;
    transform: translateX(-100%);
    width: 100%;
    max-width: 300px;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .mobile-toggle {
    display: block;
  }
}

/* iPhone-specific adjustments */
@media screen and (max-width: 428px) {
  .sidebar {
    max-width: 100%;
  }

  .company-list {
    flex-direction: column;
  }

  .company-btn {
    width: 100%;
  }

  .sidebar-nav a {
    padding: 1rem;
  }
}

/* Safe area insets for modern iOS devices */
@supports (padding: max(0px)) {
  .sidebar {
    padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
    padding-left: max(0px, env(safe-area-inset-left));
  }
}
</style>