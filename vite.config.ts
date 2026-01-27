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
        // 手動分割 vendor chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router')) {
              return 'vue-vendor'
            }
            if (id.includes('reka-ui') || id.includes('lucide-vue-next')) {
              return 'ui-vendor'
            }
            if (id.includes('@vueuse')) {
              return 'utils-vendor'
            }
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
