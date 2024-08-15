<template>
  <div class="w-screen h-screen bg-custom-color flex items-center justify-center">
    <main class="w-[1012px] h-[607px] fixed flex bg-white rounded-3xl shadow-2xl">
      <section class="login-bg w-1/2 rounded-l-2xl h-auto bg-opacity-50"></section>
      <section class="w-1/2 pt-16">
        <h1
          class="title-font text-3xl text-blue-500 text-center"
          @click="setComponentIndex(0)"
        >
          I-Forgot
        </h1>
        <transition name="replace" mode="out-in">
          <component :is="currentComponent" @stepEvent="toggleComponent" />
        </transition>
      </section>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'login'
});
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import base from "../components/login/base";
import signin from "../components/login/signin";
import signup from "../components/login/signup";
import { useComponentSwitcher } from "../composables/useComponentSwitcher";
import Cookies from "js-cookie";
const userStore = useUserStore();

const componentsMap = {
  base,
  signin,
  signup,
};
const {
  currentComponent,
  currentComponentIndex,
  setComponentIndex,
} = useComponentSwitcher(componentsMap, userStore.step);

const toggleComponent = (idx) => {
  userStore.setStep(idx);
  setComponentIndex(idx);
};

const router = useRouter();
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
.replace-enter-active,
.replace-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.replace-enter, .replace-leave-to /* .replace-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: scale(0.95);
}
</style>
