<template>
  <div class="notification-demo">
    <h1>浏览器通知示例</h1>
    <button @click="requestPermission">请求通知权限</button>
    <button @click="showNotification">显示通知</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useNotifications } from 'vue3-notifications'

const { notify } = useNotifications()
const notificationPermission = ref(Notification.permission)

const requestPermission = () => {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      notificationPermission.value = permission
      console.log('Notification permission:', permission)
    })
  } else {
    console.error('This browser does not support notifications.')
  }
}

const showNotification = () => {
  if (notificationPermission.value === 'granted') {
    notify({
      title: '提醒',
      text: '这是一个浏览器通知示例',
      icon: 'path/to/icon.png', // 可选：通知的图标
    })
  } else {
    console.error('Notification permission not granted.')
  }
}

</script>

<style scoped>
.notification-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>
