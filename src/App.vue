<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import FooterSection from './components/FooterSection.vue'
import ScrollToTop from './components/ScrollToTop.vue'
import { useSEO } from '@/composables/useSEO'

// 啟用 SEO 管理
useSEO()
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
