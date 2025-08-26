import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // Estado del usuario
  const user = ref({
    name: '',
    email: '',
    avatar: '',
    preferences: {
      theme: 'dark',
      language: 'es',
      notifications: true
    }
  })

  const isLoggedIn = ref(false)
  const loading = ref(false)

  // Actions
  function setUser(userData) {
    user.value = { ...user.value, ...userData }
    isLoggedIn.value = true
  }

  function updatePreferences(newPreferences) {
    user.value.preferences = { ...user.value.preferences, ...newPreferences }
  }

  function logout() {
    user.value = {
      name: '',
      email: '',
      avatar: '',
      preferences: {
        theme: 'dark',
        language: 'es',
        notifications: true
      }
    }
    isLoggedIn.value = false
  }

  async function login(credentials) {
    loading.value = true
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Datos de usuario simulados
      setUser({
        name: credentials.name || 'Usuario Demo',
        email: credentials.email || 'demo@ejemplo.com',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.name || 'Usuario Demo')}&background=6366f1&color=fff`
      })
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    user,
    isLoggedIn,
    loading,
    // Actions
    setUser,
    updatePreferences,
    logout,
    login
  }
})