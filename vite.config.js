import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
// import vueDevTools from 'vite-plugin-vue-devtools' // Temporarily remove or comment out

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    // vueDevTools(), // Temporarily remove or comment out
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
