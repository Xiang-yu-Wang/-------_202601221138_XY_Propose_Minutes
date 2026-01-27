<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import PlansSection from './components/PlansSection.vue'
import GallerySection from './components/GallerySection.vue'
import AdvantagesSection from './components/AdvantagesSection.vue'
import UploadSection from './components/UploadSection.vue'
import ContactSection from './components/ContactSection.vue'
import FooterSection from './components/FooterSection.vue'

// Use VueUse for dynamic page title
useTitle('大倉代領股東紀念品 - 一股全餐方案 | 0982-571-134')
</script>

<template>
  <div class="min-h-screen">
    <Navbar />
    <main>
      <HeroSection />
      <ServicesSection />
      <PlansSection />
      <GallerySection />
      <AdvantagesSection />
      <UploadSection />
      <ContactSection />
    </main>
    <FooterSection />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
