<template>
  <div>
    <div class="container mx-auto w-80 h-8 flex items-center mt-10">
      <img
        @click="backHandle"
        class="w-6 cursor-pointer"
        src="../../public/back.svg"
        alt="Back Button"
      />
      <span class="text-xl font-bold ml-6">Welcome Back!</span>
    </div>
    <div
      class="input-container mx-auto bg-white border border-gray-200 w-80 h-14 rounded-full flex items-center justify-center mt-6"
    >
      <input
        class="input-field focus:outline-none w-9/12 cursor-not-allowed"
        type="email"
        v-model="email"
        readonly
      />
    </div>
    <div
      class="input-container mx-auto bg-white border border-gray-200 w-80 h-14 rounded-full flex items-center justify-center mt-6 relative"
    >
      <input
        class="input-field focus:outline-none w-9/12"
        :type="showPassword ? 'text' : 'password'"
        v-model="password"
        placeholder="Password"
      />
      <button
        type="button"
        @click="togglePasswordVisibility"
        class="password-toggle inset-y-0 right-0 px-3 flex items-center text-gray-600 absolute right-2"
      >
        <img
          class="w-5 h-5"
          v-if="showPassword"
          src="../../public/eye.png"
          alt="Show Password"
        />
        <img v-else class="w-5 h-5" src="../../public/hidden.png" alt="Hide Password" />
      </button>
    </div>
    <h3
      class="forgot-password mx-auto text-blue-500 text-center cursor-pointer mt-6 hover:text-blue-700"
    >
      Forgot Password?
    </h3>
    <button
      @click="loginHandler"
      class="login-button mx-auto bg-blue-500 border border-gray-200 w-80 h-14 rounded-full flex items-center justify-center mt-6 relative text-white cursor-pointer"
    >
      Sign In
    </button>
  </div>
</template>

<script setup>
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";

const emit = defineEmits(["stepEvent"]);
const userStore = useUserStore();
const { email, password } = storeToRefs(userStore);

const showPassword = ref(false);

const backHandle = () => {
  emit("stepEvent", 0);
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const loginHandler = async () => {
  try {
    const result = await $fetch("api/users/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });

    if (result.token) {
      const authToken = useCookie("token", {
        maxAge: 60 * 60 * 24 * 7, // 7 天
        path: "/",
        sameSite: "strict",
      });
      authToken.value = result.token;
      userStore.setUserInfo(result.info);
      navigateTo("/");
    } else {
      console.error("Login failed: No token returned");
    }
  } catch (error) {
    console.error("Login error:", error);
  }
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  margin-top: 2.5rem;
}

.input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
}

.input-field {
  outline: none;
  width: 75%;
}

.password-toggle {
  position: absolute;
  right: 0.5rem;
}

.forgot-password {
  margin-top: 1.5rem;
  color: #3b82f6;
  text-align: center;
  cursor: pointer;
}

.forgot-password:hover {
  color: #1d4ed8;
}

.login-button {
  margin-top: 1.5rem;
  background-color: #3b82f6;
  border: 1px solid #e5e7eb;
  color: white;
  cursor: pointer;
}

.login-button:hover {
  background-color: #2563eb;
}
</style>
