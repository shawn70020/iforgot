import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from "../../stores/user";
import Cookies from "js-cookie";

const isAuthenticated = ref(false);
const user = ref(null);
const userStore = useUserStore();
export const useAuth = () => {
  const router = useRouter();

  const login = async (email, password) => {
    try {
      const response = await $fetch('/api/login', {
        method: 'POST',
        body: { email, password },
      });
      isAuthenticated.value = true;
      user.value = response.user;
      router.push('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const checkToken = async () => {
    if (process.client) {
      if (Cookies.get('token')) {
        try {
          const response = await $fetch('/api/users/checkLogin');
          userStore.setUserInfo(response.info);
          isAuthenticated.value = true;
        } catch (error) {
          console.error('Login failed', error);
        }
      } else {
        isAuthenticated.value = false;
      }
    }
  }
  const logout = () => {
    isAuthenticated.value = false;
    user.value = null;
    router.push('/login');
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    checkToken
  };
};
