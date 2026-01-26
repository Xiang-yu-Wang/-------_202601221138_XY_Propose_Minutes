<script setup lang="ts">
import { Check, Star, ArrowRight } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
        <Card
          v-for="plan in plans"
          :key="plan.name"
          :class="[
            'relative transition-all duration-300 hover:shadow-xl',
            plan.popular 
              ? 'border-emerald-500 bg-gradient-to-b from-emerald-50 to-white' 
              : ''
          ]"
        >
          <!-- Popular badge -->
          <Badge 
            v-if="plan.popular"
            class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500"
          >
            <Star class="w-3 h-3 mr-1" />
            推薦方案
          </Badge>

          <CardHeader class="text-center">
            <CardTitle class="text-2xl">{{ plan.name }}</CardTitle>
            <CardDescription class="text-emerald-600 font-medium">{{ plan.subtitle }}</CardDescription>
          </CardHeader>

          <CardContent>
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
              <Badge variant="secondary" class="bg-emerald-100 text-emerald-700">
                {{ plan.highlight }}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Traditional pricing -->
      <div class="bg-gray-50 rounded-2xl p-8">
        <h3 class="text-2xl font-bold text-gray-900 text-center mb-8">傳統散單代領</h3>
        
        <div class="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Card 
            v-for="item in traditionalPricing"
            :key="item.range"
            class="text-center hover:shadow-lg transition-shadow"
          >
            <CardContent class="pt-6">
              <p class="text-gray-600 mb-2">{{ item.range }}</p>
              <p class="text-3xl font-bold text-emerald-600">{{ item.fee }}</p>
              <p class="text-sm text-gray-500">代領費</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-12 text-center">
        <p class="text-lg text-gray-600 mb-6">
          想了解更多？歡迎聯繫我們
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            as-child
            size="lg"
            class="text-lg"
          >
            <a href="tel:0982571134">
              聯絡贊哥 0982-571-134
              <ArrowRight class="w-5 h-5 ml-2" />
            </a>
          </Button>
          <Button 
            as-child
            size="lg"
            variant="secondary"
            class="bg-green-500 hover:bg-green-600 text-white text-lg"
          >
            <a 
              href="https://line.me/R/ti/p/@792nvftc"
              target="_blank"
            >
              LINE: @792nvftc
              <ArrowRight class="w-5 h-5 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>
