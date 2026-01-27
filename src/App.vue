<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import FooterSection from './components/FooterSection.vue'
</script>

<template>
  <div class="min-h-screen">
    <Navbar />
    <main>
      <RouterView />
    </main>
    <FooterSection />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
