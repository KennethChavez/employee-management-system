<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const login = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = 'Por favor ingrese usuario y contraseña'
    return
  }
  
  isLoading.value = true
  
  try {
    const success = await userStore.login(username.value, password.value)
    
    if (success) {
      router.push('/')
    } else {
      errorMessage.value = 'Usuario o contraseña incorrectos'
    }
  } catch (error) {
    errorMessage.value = 'Ocurrió un error durante el inicio de sesión'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-content">
        <div class="login-header">
          <img src="https://i.ytimg.com/vi/NAwza7TKNwo/maxresdefault.jpg" alt="Copantl Logo" class="logo">
          <div class="icon-3d">
            <img src="https://cdn.hotelsmotor.com/117/11656/Copantl_Hotel_&_Convention_Center-San_Pedro_Sula-Honduras48_large.webp" alt="Login Icon" class="login-icon">
          </div>
        </div>
        
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">Usuario</label>
            <div class="input-group">
              <span class="input-icon">👤</span>
              <input 
                id="username"
                type="text" 
                v-model="username" 
                class="form-input"
                placeholder="Ingrese su usuario"
                autocomplete="username"
                autofocus
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <div class="input-group">
              <span class="input-icon">🔒</span>
              <input 
                id="password"
                type="password" 
                v-model="password" 
                class="form-input"
                placeholder="Ingrese su contraseña"
                autocomplete="current-password"
              >
            </div>
          </div>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            class="login-btn" 
            :disabled="isLoading"
          >
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #003366, #004080);
  font-family: 'Montserrat', sans-serif;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.login-content {
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo {
  width: 200px;
  height: auto;
  margin-bottom: 2rem;
}

.icon-3d {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
  perspective: 1000px;
  transform-style: preserve-3d;
  animation: float 6s ease-in-out infinite;
}

.login-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #003366;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
}

.form-input {
  width: 100%;
  padding: 0.8rem;
  padding-left: 3rem;
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  font-size: 1rem;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #003366;
  box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.1);
}

.error-message {
  background-color: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

.login-btn {
  background-color: #003366;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
}

.login-btn:hover {
  background-color: #004080;
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 480px) {
  .login-content {
    padding: 2rem;
  }
  
  .logo {
    width: 150px;
  }
  
  .icon-3d {
    width: 80px;
    height: 80px;
  }
}
</style>