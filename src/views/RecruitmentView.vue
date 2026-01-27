<script setup lang="ts">
import RecruitmentSection from '@/components/RecruitmentSection.vue'
import { useJsonLd } from '@/composables/useJsonLd'
import { positions } from '@/data/positions'

// 為招募頁面啟用 JSON-LD 結構化數據
useJsonLd({ positions })
</script>

<template>
  <div class="pt-16">
    <RecruitmentSection />
  </div>
</template>
