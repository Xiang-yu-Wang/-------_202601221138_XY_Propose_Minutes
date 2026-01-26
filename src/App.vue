<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import PlansSection from './components/PlansSection.vue'
import GallerySection from './components/GallerySection.vue'
import AdvantagesSection from './components/AdvantagesSection.vue'
import ContactSection from './components/ContactSection.vue'
import FooterSection from './components/FooterSection.vue'
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
