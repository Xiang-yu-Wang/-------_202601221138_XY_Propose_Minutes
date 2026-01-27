import path from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // 可透過 SKIP_COMPRESSION=true 跳過壓縮，避免 Windows/防毒鎖檔造成無訊息的 exit code 1
    ...(process.env.SKIP_COMPRESSION === 'true'
      ? []
      : [compression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 1024,
          deleteOriginFile: false,
        })]),
  ],
  base: "./",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 清理輸出目錄
    emptyOutDir: true,
    // 避免內建壓縮體積計算在 Windows 發生崩潰
    reportCompressedSize: false,
    // 避免 esbuild 在部分 Windows 環境的原生崩潰，改用 terser 壓縮
    minify: 'terser',
    // 優化建置配置
    rollupOptions: {
      output: {
        // 手動分割 vendor chunks - 進一步細分以減少首屏載入
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Vue 核心 - 單獨拆分
            if (id.includes('vue/dist')) {
              return 'vue-core'
            }
            // Vue Router - 單獨拆分
            if (id.includes('vue-router')) {
              return 'vue-router'
            }
            // Vue 相關但非核心
            if (id.includes('@vue/') || id.includes('vue')) {
              return 'vue-ecosystem'
            }
            // UI 組件庫 - 拆分
            if (id.includes('reka-ui')) {
              return 'reka-ui'
            }
            // 圖標庫 - 單獨拆分（按需加載）
            if (id.includes('lucide-vue-next')) {
              return 'lucide-icons'
            }
            // VueUse 工具庫
            if (id.includes('@vueuse')) {
              return 'vueuse'
            }
            // Tailwind 相關
            if (id.includes('tailwind') || id.includes('clsx') || id.includes('class-variance-authority')) {
              return 'tailwind-utils'
            }
            // 其他第三方庫
            return 'vendor'
          }
        }
      }
    },
    // 啟用 CSS 代碼分割
    cssCodeSplit: true,
    // 設置 chunk 大小警告閾值
    chunkSizeWarningLimit: 1000
  }
})
