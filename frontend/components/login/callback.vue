<template>
  <div>
    <h1>Logging in...</h1>
  </div>
</template>

<script setup>
import { useCookie } from '@vueuse/integrations';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();

const processLogin = async () => {
  // 从 URL 中提取授权码
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    try {
      // 向后端发送请求，交换授权码
      const response = await fetch(`/auth/callback?code=${code}`);
      const result = await response.json();

      if (result.token) {
        const authToken = useCookie("token", {
          maxAge: 60 * 60 * 24 * 7, // 7 天
          path: "/",
          sameSite: "strict",
        });
        authToken.value = result.token;
        userStore.setUserInfo(result.info);
        router.push("/");
      } else {
        console.error("Login failed: No token returned");
      }
    } catch (error) {
      console.error("Error in googleLoginUserCallback:", error);
    }
  } else {
    console.error("No authorization code found");
  }
};

// 调用处理登录函数
processLogin();
</script>
