<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import FooterSection from './components/FooterSection.vue'
import ScrollToTop from './components/ScrollToTop.vue'
import { useSEO } from '@/composables/useSEO'
import { reportWebVitals } from '@/composables/useResourcePreload'

// 啟用 SEO 管理
useSEO()

// 啟用 Web Vitals 監控（開發環境）
onMounted(() => {
  if (import.meta.env.DEV) {
    reportWebVitals()
  }
})
</script>

<template>
  <div class="min-h-screen">
    <Navbar />
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
