// composables/useComponentSwitcher.js
import { ref } from 'vue'

export function useComponentSwitcher(componentsMap, initialStep = 0) {
  const componentKeys = Object.keys(componentsMap)
  const currentComponentIndex = ref(initialStep)
  const currentComponent = ref(componentsMap[componentKeys[initialStep]])

  const setComponentIndex = (idx) => {
    currentComponentIndex.value = idx
    currentComponent.value = componentsMap[componentKeys[idx]]
  }

  return {
    currentComponent,
    currentComponentIndex,
    setComponentIndex
  }
}
