<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import StatsSection from '@/components/StatsSection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import PlansSection from '@/components/PlansSection.vue'
import TestimonialsSection from '@/components/TestimonialsSection.vue'
import FAQSection from '@/components/FAQSection.vue'
import AdvantagesSection from '@/components/AdvantagesSection.vue'
import { useJsonLd } from '@/composables/useJsonLd'
import { testimonials } from '@/data/testimonials'

// 為首頁啟用 JSON-LD 結構化數據（包含客戶評價）
useJsonLd({ testimonials })
</script>

<template>
  <div>
    <HeroSection />
    <StatsSection />
    <ServicesSection />
    <PlansSection />
    <TestimonialsSection />
    <FAQSection />
    <AdvantagesSection />
  </div>
</template>
