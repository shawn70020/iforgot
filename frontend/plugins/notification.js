import { defineNuxtPlugin } from '#app'
import Notifications from 'vue3-notifications'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Notifications)
})
