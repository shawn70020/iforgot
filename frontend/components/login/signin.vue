<template>
  <div>
    <div class="mx-auto w-80 h-8 flex items-center mt-10">
      <img
        @click="backHandle"
        class="w-6 cursor-pointer"
        src="../../public/back.svg"
        alt="back-btn"
      />
      <span class="text-xl font-bold ml-6">Welcome to Iforgot!</span>
    </div>
    <div
      class="mx-auto bg-white border border-gray-200 w-80 h-14 rounded-full flex items-center justify-center mt-6"
    >
      <input
        class="focus:outline-none w-9/12 cursor-not-allowed"
        type="email"
        v-model="email"
        readonly
      />
    </div>
    <div
      class="mx-auto bg-white border border-gray-200 w-80 h-14 rounded-full flex items-center justify-center mt-6"
    >
      <input
        class="focus:outline-none w-9/12"
        type="text"
        v-model="name"
        placeholder="Full Name"
      />
    </div>
    <div
      class="mx-auto bg-white border border-gray-200 w-80 h-14 rounded-full flex items-center justify-center mt-6 relative"
    >
      <input
        class="focus:outline-none w-9/12"
        :type="showPassword ? 'text' : 'password'"
        v-model="password"
        placeholder="Password"
      />

      <button
        type="button"
        @click="togglePasswordVisibility"
        class="inset-y-0 right-0 px-3 flex items-center text-gray-600 absolute right-2"
      >
        <img
          class="w-5 h-5"
          v-if="showPassword"
          src="../../public/eye.png"
          alt="show-password"
        />
        <img v-else class="w-5 h-5" src="../../public/hidden.png" alt="hide-password" />
      </button>
    </div>
    <button
      @click="registerHandler"
      class="mx-auto bg-blue-500 border border-gray-200 w-80 h-14 rounded-full flex items-center justify-center mt-6 relative text-white cursor-pointer"
    >
      Create Account
    </button>
  </div>
</template>
<script setup>
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";
const emit = defineEmits(["stepEvent"]);
const userStore = useUserStore();
const { email, name, password } = storeToRefs(userStore);
const showPassword = ref(false);

const backHandle = () => {
  emit("stepEvent", 0);
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const registerHandler = async () => {
  try {
    const result = await $fetch("api/users/register", {
      method: "POST",
      body: {
        email: email.value,
        name: name.value,
        password: password.value,
      },
    });
    if (result.token) {
      const authToken = useCookie("token", {
        maxAge: 60 * 60 * 24 * 7, // 7 天
        path: "/",
        sameSite: "strict",
      });
      authToken.value = result.token;
    }
    navigateTo("/");
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped></style>
