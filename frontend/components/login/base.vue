<template>
  <div class="main-login mt-28">
    <div
      @click="googleLoginHandler"
      class="google-login cursor-pointer mx-auto bg-blue-500 w-80 h-14 rounded-full flex items-center justify-center"
    >
      <h2 class="text-white w-9/12">Continue with Google</h2>
      <div class="rounded-full bg-white w-8 h-8 flex items-center justify-center">
        <img src="../../public/google.png" alt="google-login" class="w-5 h-5" />
      </div>
    </div>
    <div>
      <div
        class="mx-auto bg-white border border-gray-200 w-80 h-14 rounded-full flex items-center justify-center mt-6"
      >
        <input
          class="focus:outline-none w-9/12"
          type="email"
          v-model="email"
          @input="debouncedValidateEmail"
          placeholder="Enter your work email"
        />

        <svg
          @click="checkEmail"
          class="svg-icon cursor-pointer"
          :class="{ valid: isValid && email, invalid: !isValid }"
          fill="#000000"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm-28.9 143.6l75.5 72.4H120c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h182.6l-75.5 72.4c-9.7 9.3-9.9 24.8-.4 34.3l11 10.9c9.4 9.4 24.6 9.4 33.9 0L404.3 273c9.4-9.4 9.4-24.6 0-33.9L271.6 106.3c-9.4-9.4-24.6-9.4-33.9 0l-11 10.9c-9.5 9.6-9.3 25.1.4 34.4z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { debounce } from "~/utils/debounce";
import { validateEmailFormat } from "~/utils/validate/Email";
import { googleLoginHandler } from "~/utils/google-login";
import { useUserStore } from "../../stores/user";

const emit = defineEmits(["stepEvent"]);
const userStore = useUserStore();
const email = ref(userStore.email);

const router = useRouter();
const showFirstContent = ref(true);

const toggleContent = () => {
  showFirstContent.value = !showFirstContent.value;
};
const isValid = ref(false);

const validateEmail = () => {
  isValid.value = validateEmailFormat(email.value);
};

const debouncedValidateEmail = debounce(validateEmail, 300);

const checkEmail = async () => {
  try {
    // 發送 POST 請求檢查 email 是否存在
    const result = await $fetch("api/users/check-email", {
      method: "POST",
      body: { email: email.value },
    });

    // 根據用戶是否存在觸發相應的事件
    if (!result.user_exists) {
      // 導去註冊路由
      emit("stepEvent", 1);
    } else {
      // 導去登入路由
      emit("stepEvent", 2);
    }
  } catch (err) {
    // 捕獲並記錄異常
    console.error(err);
  }
};

watch(
  isValid,
  async (valid) => {
    if (valid) {
      userStore.setEmail(email.value);
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.container {
  width: 1012px;
  height: 607px;
}
.login-bg {
  background-image: url("/login_bg.jpg"); /* 引用背景圖片 */
  background-size: cover; /* 背景圖片覆蓋整個容器 */
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.75;
}
.title-font {
  font-family: "Playwrite CU", cursive;
}
.arrow-btn {
  fill: blue;
}
.svg-icon {
  width: 2rem; /* 可以根據需要調整寬度 */
  height: 2rem; /* 可以根據需要調整高度 */
}

.valid {
  fill: rgb(59, 130, 246);
}

.invalid {
  fill: gray;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
