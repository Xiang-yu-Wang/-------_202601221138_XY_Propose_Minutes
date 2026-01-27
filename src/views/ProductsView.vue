<script setup lang="ts">
import ProductsSection from '@/components/ProductsSection.vue'
import { useJsonLd } from '@/composables/useJsonLd'
import { products } from '@/data/products'

// 為商品頁面啟用 JSON-LD 結構化數據
useJsonLd({ products })
</script>

<template>
  <div class="pt-16">
    <ProductsSection />
  </div>
</template>
