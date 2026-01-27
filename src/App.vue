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
      <RouterView />
    </main>
    <FooterSection />
    <ScrollToTop />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
