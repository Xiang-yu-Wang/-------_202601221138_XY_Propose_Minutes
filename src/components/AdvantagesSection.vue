<script setup lang="ts">
import { Shield, Heart, Users, Headphones } from 'lucide-vue-next'

const advantages = [
  {
    icon: Shield,
    title: '安全可靠的互惠模式',
    subtitle: '不須綁約',
    description: '不代購、不索取客戶帳密，完全安全透明的服務模式',
  },
  {
    icon: Heart,
    title: '客製化服務',
    subtitle: '與社群交流',
    description: '提供客製化選項，根據客戶需求設計全餐1與全餐2分配方式',
  },
  {
    icon: Users,
    title: '活躍社群',
    subtitle: 'FB社團交流',
    description: '加入我們的FB社團，與其他股東交流領取經驗與心得',
  },
  {
    icon: Headphones,
    title: '專業團隊支持',
    subtitle: '隨時為您服務',
    description: '專業團隊隨時準備為您解答疑問，提供全面的支持與協助',
  },
]
</script>

<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="text-emerald-600 font-semibold tracking-wide uppercase">Why Choose Us</span>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">我們的服務優勢</h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          我們致力於為客戶提供最優質的服務，讓每一位股東都能獲得滿意的體驗
        </p>
      </div>

      <!-- Advantages grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="(advantage, index) in advantages"
          :key="index"
          class="text-center group"
        >
          <div class="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow group-hover:scale-110 transform duration-300">
            <component :is="advantage.icon" class="w-10 h-10 text-white" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-1">{{ advantage.title }}</h3>
          <p class="text-emerald-600 font-medium mb-3">{{ advantage.subtitle }}</p>
          <p class="text-gray-600">{{ advantage.description }}</p>
        </div>
      </div>

      <!-- Info cards -->
      <div class="mt-16 grid md:grid-cols-2 gap-8">
        <!-- Safe mode card -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield class="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 class="text-xl font-bold text-gray-900 mb-2">安全互惠模式</h4>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  不代購、不需提供帳號密碼
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  不須綁約，彈性合作
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  透明公開的分配方式
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Community card -->
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users class="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 class="text-xl font-bold text-gray-900 mb-2">加入我們的社群</h4>
              <p class="text-gray-700 mb-4">
                請加LINE: @792nvftc 告知暱稱以擋詐騙號進入
              </p>
              <div class="flex flex-wrap gap-3">
                <a 
                  href="https://www.facebook.com/groups/call0982571134"
                  target="_blank"
                  class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  加入 FB 社團
                </a>
                <a 
                  href="https://line.me/R/ti/p/@792nvftc"
                  target="_blank"
                  class="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  加入 LINE
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
