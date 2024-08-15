<template>
 <LoadingStyle />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.js';

const router = useRouter();
const userStore = useUserStore();

const processLogin = async () => {
  // 从 URL 中提取授权码
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    try {
      // 向后端发送请求，交换授权码
       const response = await fetch(`http://localhost:8080/auth/callback?code=${code}`); // 注意这里请求的是后端
      const result = await response.json();

      if (result.token) {
        const authToken = useCookie("token", {
          maxAge: 60 * 60 * 24 * 7, // 7 天
          path: "/",
          sameSite: "strict",
        });
        console.log(result)
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
processLogin()
</script>
