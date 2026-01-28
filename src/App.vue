<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import AnnouncementBanner from './components/AnnouncementBanner.vue'
import FooterSection from './components/FooterSection.vue'
import ScrollToTop from './components/ScrollToTop.vue'
import { useSEO } from '@/composables/useSEO'
import { useJsonLd } from '@/composables/useJsonLd'
import { reportWebVitals } from '@/composables/useResourcePreload'

// 啟用 SEO 管理
useSEO()

// 啟用 JSON-LD 結構化資料（Google Rich Results）
useJsonLd()

// 啟用 Web Vitals 監控（開發環境，靜默模式）
// 如需查看性能數據，請傳入回調函數：
// reportWebVitals((metric) => console.log(metric))
onMounted(() => {
  if (import.meta.env.DEV) {
    reportWebVitals()
  }
})
</script>

<template>
  <div class="min-h-screen">
    <Navbar />
    <AnnouncementBanner />
    <main>
      <Transition
        name="fade"
        mode="out-in"
      >
        <RouterView :key="$route.path" />
      </Transition>
    </main>
    <FooterSection />
    <ScrollToTop />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
html {
  scroll-behavior: smooth;
}
</style>
