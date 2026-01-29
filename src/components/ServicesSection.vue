<script setup lang="ts">
import { Vote, ShoppingCart, Truck } from 'lucide-vue-next'

const services = [
    description: '透過合作軟體廠商的系統，您可以輕鬆進行自動投票，不再需要繁瑣的手動操作。',
    icon: Vote,
    title: '自動投票功能',
    description: '透過我們的系統，您可以輕鬆進行自動投票，不再需要繁瑣的手動操作。',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: ShoppingCart,
    title: '一鍵購買',
    description: '我們提供一鍵購買一股全餐功能，讓您能夠快速選擇一鍵掛單買進高機率發放870檔公司。',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: Truck,
    title: '全方位服務',
    description: '只要是全餐客戶，全台免費送貨到府，且不需任何費用。',
    color: 'from-orange-500 to-red-500'
  }
]
</script>

<template>
  <section id="services" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="text-emerald-600 font-semibold tracking-wide uppercase">Our Services</span>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">服務項目</h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          目前設置高機率發放約870檔公司的一股全餐模組可一鍵買齊，不必自己一股一股買，省時省力
        </p>
      </div>

      <!-- Services grid -->
      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(service, index) in services"
          :key="index"
          class="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          <!-- Icon container -->
          <div 
            :class="['w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6', service.color]"
          >
            <component :is="service.icon" class="w-8 h-8 text-white" />
          </div>

          <h3 class="text-xl font-bold text-gray-900 mb-3">{{ service.title }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ service.description }}</p>

          <!-- Decorative corner -->
          <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-100 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      <!-- Additional info -->
      <div class="mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white">
        <div class="max-w-3xl mx-auto text-center">
          <h3 class="text-2xl md:text-3xl font-bold mb-4">享受每年收到幾百個禮物一一拆箱的快感</h3>
          <p class="text-white/90 text-lg">
            食品類、沐浴類、清潔類、保健品、保養品、票券卡及各上市櫃公司產品抵用金等等，
            在這通膨的年代，可省下不少生活開支
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
