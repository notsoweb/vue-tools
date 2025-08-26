import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // Estado
  const count = ref(0)
  const name = ref('Vue + Pinia')
  const history = ref([])

  // Getters (computed)
  const doubleCount = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)
  const totalOperations = computed(() => history.value.length)

  // Actions
  function increment() {
    count.value++
    addToHistory('increment', count.value)
  }

  function decrement() {
    count.value--
    addToHistory('decrement', count.value)
  }

  function reset() {
    const oldValue = count.value
    count.value = 0
    addToHistory('reset', 0, oldValue)
  }

  function setCount(newCount) {
    const oldValue = count.value
    count.value = newCount
    addToHistory('set', newCount, oldValue)
  }

  function addToHistory(action, newValue, oldValue = null) {
    history.value.unshift({
      id: Date.now(),
      action,
      newValue,
      oldValue,
      timestamp: new Date().toLocaleTimeString()
    })
    
    // Mantener solo los últimos 10 registros
    if (history.value.length > 10) {
      history.value = history.value.slice(0, 10)
    }
  }

  function clearHistory() {
    history.value = []
  }

  return {
    // Estado
    count,
    name,
    history,
    // Getters
    doubleCount,
    isEven,
    totalOperations,
    // Actions
    increment,
    decrement,
    reset,
    setCount,
    clearHistory
  }
})