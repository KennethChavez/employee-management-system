<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppHeader from './components/layout/AppHeader.vue'

const route = useRoute()
const showSidebar = computed(() => route.name !== 'login')
</script>

<template>
  <div class="app-layout">
    <AppSidebar v-if="showSidebar" />
    <div class="app-container">
      <AppHeader v-if="showSidebar" />
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.app-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: var(--color-background);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>