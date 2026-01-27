import path from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // Bundle 視覺化分析工具（僅在 ANALYZE=true 時啟用）
    ...(process.env.ANALYZE === 'true'
      ? [visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
          template: 'treemap', // 'treemap' | 'sunburst' | 'network'
        })]
      : []),
    // Windows 環境下 gzip 壓縮工具易超時/崩潰，改為禁用
    // 部署時可在 Nginx/CDN 層級啟用壓縮（更穩定且高效）
    // ...(process.env.SKIP_COMPRESSION === 'true'
    //   ? []
    //   : [compression({
    //       algorithm: 'gzip',
    //       ext: '.gz',
    //       threshold: 1024,
    //       deleteOriginFile: false,
    //     })]),
  ],
  base: "./",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Windows 上含非 ASCII 路徑（使用者資料夾/專案名）時，保留 symlink 解析可降低部分插件的路徑異常
    preserveSymlinks: true,
  },
  // 針對 Windows 與 CI 平台，提高穩定性
  esbuild: {
    // 避免 license 註解導致輸出異常
    legalComments: 'none',
    // 在某些情況下保留 class/func 名稱，可避免序列化/反序列化工具崩潰（保守設定）
    keepNames: true,
  },
  build: {
    // 清理輸出目錄
    emptyOutDir: true,
    // 避免內建壓縮體積計算在 Windows 發生崩潰
    reportCompressedSize: false,
    // 允許以環境變數暫停壓縮（如在 Windows/Bunx 下遇到壓縮器不穩定）
    minify: process.env.SKIP_COMPRESSION === 'true' ? false : 'esbuild',
    // CSS 壓縮同樣走 esbuild，或在停用壓縮時關閉
    cssMinify: process.env.SKIP_COMPRESSION === 'true' ? false : 'esbuild',
    // 目標瀏覽器，避免新語法造成壓縮器在部分平台出錯
    target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
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
