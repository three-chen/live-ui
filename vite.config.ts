import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'

// https://vitejs.dev/config/
export default defineConfig({
  // base: path.resolve(__dirname, './dist/'), // 新增
  plugins: [
    vue(),
    electron({
      entry: 'electron-main/index.ts'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    exclude: ['electron', 'path', 'fs']
  },

  server: {
    // port: 5173,
    // open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000/api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 不可以省略rewrite
      }
    }
  }
})
