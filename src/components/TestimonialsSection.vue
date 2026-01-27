<script setup lang="ts">
import { Star, Quote } from 'lucide-vue-next'
import { testimonials } from '@/data/testimonials'
</script>

<template>
  <section class="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 text-emerald-700 font-semibold">
          <Star class="w-6 h-6 fill-amber-400 text-amber-400" />
          客戶好評推薦
        </div>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
          他們都選擇大倉代領
        </h2>
        <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
          超過千位客戶的信賴，累積多年股東紀念品代領經驗
        </p>
      </div>

      <!-- Testimonials grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="testimonial in testimonials" 
          :key="testimonial.id"
          class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative"
        >
          <!-- Quote icon -->
          <Quote class="absolute top-4 right-4 w-8 h-8 text-emerald-100" />
          
          <!-- Rating -->
          <div class="flex gap-1 mb-4">
            <Star 
              v-for="i in testimonial.rating" 
              :key="i" 
              class="w-4 h-4 fill-amber-400 text-amber-400" 
            />
          </div>

          <!-- Content -->
          <p class="text-gray-600 mb-6 leading-relaxed">
            「{{ testimonial.content }}」
          </p>

          <!-- Author -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
              {{ testimonial.name.charAt(0) }}
            </div>
            <div>
              <p class="font-semibold text-gray-900">{{ testimonial.name }}</p>
              <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
