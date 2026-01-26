<script setup lang="ts">
import { Check, Star, ArrowRight } from 'lucide-vue-next'

const plans = [
  {
    name: '全餐方案一',
    subtitle: '物品分配',
    description: '每年以實際領到公司數量均分，不收任何費用',
    features: [
      '客戶可自選當年度熱門物品會幫入箱',
      '不能選超商卡，以物品為主',
      '未勾選完之數量將分配有使用期限之物品與票券',
      '送貨前會做最後核對',
      '全台免費送貨到府',
    ],
    highlight: '物品愛好者首選',
    popular: true,
  },
  {
    name: '全餐方案二',
    subtitle: '超商卡分配',
    description: '年輕人在外租屋，無法領取大量生活用品者',
    features: [
      '採審核機制通過者適用',
      '只單分配當年7-11與全家超商卡',
      '不取物品，純卡片',
      '視各倉庫容納程度審核人數',
      '同一地址家人可一半人選全餐1、一半人選全餐2',
    ],
    highlight: '租屋族首選',
    popular: false,
  },
]

const traditionalPricing = [
  { range: '價值 1-35 元', fee: '10 元' },
  { range: '價值 36-99 元', fee: '20 元' },
  { range: '價值 100 元以上', fee: '30 元' },
]
</script>

<template>
  <section id="plans" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="text-emerald-600 font-semibold tracking-wide uppercase">Pricing Plans</span>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">方案說明</h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          提供多種靈活方案，滿足不同客戶的需求
        </p>
      </div>

      <!-- Main plans -->
      <div class="grid md:grid-cols-2 gap-8 mb-16">
        <div
          v-for="plan in plans"
          :key="plan.name"
          :class="[
            'relative rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl',
            plan.popular 
              ? 'border-emerald-500 bg-gradient-to-b from-emerald-50 to-white' 
              : 'border-gray-200 bg-white hover:border-emerald-300'
          ]"
        >
          <!-- Popular badge -->
          <div 
            v-if="plan.popular"
            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
          >
            <Star class="w-4 h-4" />
            推薦方案
          </div>

          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">{{ plan.name }}</h3>
            <p class="text-emerald-600 font-medium">{{ plan.subtitle }}</p>
          </div>

          <p class="text-gray-600 text-center mb-6">{{ plan.description }}</p>

          <div class="space-y-3 mb-8">
            <div 
              v-for="feature in plan.features" 
              :key="feature"
              class="flex items-start gap-3"
            >
              <Check class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span class="text-gray-700">{{ feature }}</span>
            </div>
          </div>

          <div class="text-center">
            <span class="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
              {{ plan.highlight }}
            </span>
          </div>
        </div>
      </div>

      <!-- Traditional pricing -->
      <div class="bg-gray-50 rounded-2xl p-8">
        <h3 class="text-2xl font-bold text-gray-900 text-center mb-8">傳統散單代領</h3>
        
        <div class="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div 
            v-for="item in traditionalPricing"
            :key="item.range"
            class="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
          >
            <p class="text-gray-600 mb-2">{{ item.range }}</p>
            <p class="text-3xl font-bold text-emerald-600">{{ item.fee }}</p>
            <p class="text-sm text-gray-500">代領費</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-12 text-center">
        <p class="text-lg text-gray-600 mb-6">
          想了解更多？歡迎聯繫我們
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="tel:0982571134"
            class="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            聯絡贊哥 0982-571-134
            <ArrowRight class="w-5 h-5" />
          </a>
          <a 
            href="https://line.me/R/ti/p/@792nvftc"
            target="_blank"
            class="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-colors"
          >
            LINE: @792nvftc
            <ArrowRight class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
