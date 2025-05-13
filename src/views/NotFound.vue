<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found fade-in">
    <div class="not-found-content card">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <button class="btn-primary" @click="goHome">Go to Dashboard</button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.not-found-content {
  text-align: center;
  padding: 3rem;
  max-width: 500px;
}

.not-found-content h1 {
  font-size: 5rem;
  margin: 0;
  color: var(--color-primary);
  line-height: 1;
}

.not-found-content h2 {
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-primary);
}

.not-found-content p {
  margin-bottom: 2rem;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .not-found-content {
    padding: 2rem;
  }
  
  .not-found-content h1 {
    font-size: 4rem;
  }
}
</style>