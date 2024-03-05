import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host:'0.0.0.0',
    port:5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，去掉 /api 前缀
      },
      '/image': {  // 添加对图片路径的转发规则
        target: 'http://localhost:8081/',
        changeOrigin: true,
      },
    },
  },
  
})
