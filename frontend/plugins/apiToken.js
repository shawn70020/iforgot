export default defineNuxtPlugin((nuxtApp) => {
    // 自定義全局 $fetch 方法
    nuxtApp.provide('apiFetch', async (url, options = {}) => {
      const token = useCookie('token').value; // 從 cookie 中獲取 token
      options.headers = options.headers || {};
      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }
      options.headers['Content-Type'] = 'application/json';
      return fetch(url, options).then((res) => res.json());
    });
  });
  