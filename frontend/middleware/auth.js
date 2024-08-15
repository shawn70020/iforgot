import { useAuth } from '~/composables/useAuth';
import { useTodoStore } from "../../stores/todo";
const todoStore = useTodoStore();
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, checkToken } = useAuth();
  todoStore.todoItems.value = []
  await checkToken(); // 檢查 token
  
  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }
});
