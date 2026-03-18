// 1. React imports
import { useState } from 'react'

/**
 * useLocalStorage — drop-in replacement for useState that persists the value
 * in localStorage under the given key.
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if nothing is stored yet
 * @returns {[*, Function]} [storedValue, setValue]
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  function setValue(value) {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      // Silently ignore write failures (e.g. private browsing quota exceeded)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
