<script setup lang="ts">
import { TrendingUp, Package, Truck, Clock } from 'lucide-vue-next'

const stats = [
  { icon: TrendingUp, value: '870+', label: '精選高發放率股票' },
  { icon: Package, value: '10,000+', label: '年度代領紀念品數' },
  { icon: Truck, value: '免費', label: '宅配到府服務' },
  { icon: Clock, value: '5+', label: '年服務經驗' }
]
</script>

<template>
  <section class="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div 
          v-for="(stat, index) in stats" 
          :key="index"
          class="text-center"
        >
          <div class="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl mb-4">
            <component :is="stat.icon" class="w-7 h-7 text-white" />
          </div>
          <div class="text-3xl md:text-4xl font-bold text-white mb-2">{{ stat.value }}</div>
          <div class="text-white/80 text-sm md:text-base">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
