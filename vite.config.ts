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
  }
})
