import { defineNuxtConfig } from 'nuxt/config';
export default defineNuxtConfig({

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  plugins: [
    '~/plugins/apiToken.js',
    '~/plugins/element-plus.js',
    '~/plugins/notification.js',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  ssr: false,
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@200..900&family=Playwrite+CU:wght@100..400&display=swap' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL, // 配置你的後端 API URL
    },
  },

  compatibilityDate: '2024-07-19',
})