<script setup lang="ts">
import { HelpCircle, ChevronDown } from 'lucide-vue-next'
import { ref } from 'vue'
import { faqItems } from '@/data/faq'

// 首頁只顯示前 5 個 FAQ
const displayedFaqs = faqItems.slice(0, 5)

// 追蹤每個 FAQ 的展開狀態
const expandedItems = ref<Set<number>>(new Set())

const toggleItem = (id: number) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
  }
}

const isExpanded = (id: number) => expandedItems.value.has(id)
</script>

<template>
  <section class="py-20 bg-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 text-emerald-700 font-semibold">
          <HelpCircle class="w-6 h-6" />
          常見問題
        </div>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
          新手必讀 FAQ
        </h2>
        <p class="mt-4 text-gray-600">
          快速了解股東紀念品代領服務
        </p>
      </div>

      <!-- FAQ accordion -->
      <div class="space-y-4">
        <div 
          v-for="faq in displayedFaqs" 
          :key="faq.id"
          class="border border-gray-200 rounded-xl overflow-hidden"
        >
          <!-- Question -->
          <button
            @click="toggleItem(faq.id)"
            class="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
          >
            <span class="font-semibold text-gray-900 pr-4">{{ faq.question }}</span>
            <ChevronDown 
              :class="[
                'w-5 h-5 text-gray-500 transition-transform shrink-0',
                isExpanded(faq.id) ? 'rotate-180' : ''
              ]" 
            />
          </button>

          <!-- Answer -->
          <div 
            v-show="isExpanded(faq.id)"
            class="px-5 pb-5 pt-0"
          >
            <p class="text-gray-600 leading-relaxed">{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <!-- More questions CTA -->
      <div class="mt-10 text-center">
        <p class="text-gray-600 mb-4">還有其他問題？</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="https://line.me/R/ti/p/@792nvftc" 
            target="_blank"
            class="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            LINE 詢問
          </a>
          <a 
            href="tel:0982571134"
            class="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            電話諮詢
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
