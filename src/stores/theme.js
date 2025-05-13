import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(false)

  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
    } else {
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  // Apply theme to document
  const applyTheme = () => {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }

  // Watch for changes and apply theme
  watch(isDarkMode, () => {
    applyTheme()
  })

  // Set dark mode
  const setDarkMode = (value) => {
    isDarkMode.value = value
  }

  // Initialize theme on store creation
  initializeTheme()

  return {
    isDarkMode,
    setDarkMode
  }
})