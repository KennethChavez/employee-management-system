import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  
  const users = [
    { username: 'Kenneth', password: 'Admin', role: 'admin', fullName: 'Kenneth Chavez' },
    { username: 'Admin', password: 'Admin', role: 'admin', fullName: 'Administrator' },
    { username: 'Jaime', password: 'RRHH', role: 'hr', fullName: 'Jaime HR' },
    { username: 'Victor', password: 'RRHH2025', role: 'hr', fullName: 'Victor HR' },
    { username: 'Guillermo', password: 'Gerencia', role: 'manager', fullName: 'Guillermo Orellana' },
    { username: 'Natalia', password: 'Larach', role: 'executive', fullName: 'Natalia Larach' }
  ]
  
  const login = async (username, password) => {
    const user = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password
    )
    
    if (user) {
      currentUser.value = {
        username: user.username,
        role: user.role,
        fullName: user.fullName
      }
      localStorage.setItem('user', JSON.stringify(currentUser.value))
      return true
    }
    return false
  }
  
  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('user')
  }
  
  const checkAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      currentUser.value = JSON.parse(savedUser)
    }
    return currentUser.value !== null
  }
  
  return {
    currentUser,
    login,
    logout,
    checkAuth
  }
})