<script setup lang="ts">
import { ref } from 'vue'
import { Phone, MessageCircle, Gift, CheckCircle } from 'lucide-vue-next'

const imageLoaded = ref(false)
const heroImageUrl = 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1920&q=80'
</script>

<template>
  <section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    <!-- Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700"></div>
    <!-- Background image with blur placeholder -->
    <img 
      :src="heroImageUrl"
      alt="背景圖"
      loading="lazy"
      @load="imageLoaded = true"
      :class="[
        'absolute inset-0 w-full h-full object-cover opacity-10 transition-opacity duration-500',
        imageLoaded ? 'opacity-10' : 'opacity-0'
      ]"
    />
    <!-- Blur placeholder (visible until image loads) -->
    <div 
      :class="[
        'absolute inset-0 w-full h-full object-cover opacity-10 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 transition-opacity duration-500',
        imageLoaded ? 'opacity-0' : 'opacity-100'
      ]"
    ></div>
    
    <!-- Floating decorations -->
    <div class="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white mb-6">
          <Gift class="w-5 h-5" />
          <span class="text-sm font-medium">一股即可領取股東紀念品</span>
        </div>

        <!-- Main title -->
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          大倉代領<br />
          <span class="text-cyan-300">股東紀念品</span>
        </h1>

        <p class="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
          只要一股即可領取，協助你抵銷生活開支、對抗通膨<br />
          870檔高機率發放公司，一鍵買齊，省時省力
        </p>

        <!-- Feature tags -->
        <div class="flex flex-wrap justify-center gap-3 mb-10">
          <span v-for="tag in ['一股全餐', '一鍵買齊', '自動投票', '免費送貨']" :key="tag" 
                class="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
            <CheckCircle class="w-4 h-4 text-cyan-300" />
            {{ tag }}
          </span>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:0982571134" 
             class="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
            <Phone class="w-5 h-5" />
            立刻去電 0982-571-134
          </a>
          <a href="https://line.me/R/ti/p/@792nvftc" 
             target="_blank"
             class="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
            <MessageCircle class="w-5 h-5" />
            加LINE @792nvftc
          </a>
        </div>

        <!-- Contact info -->
        <p class="mt-8 text-white/80">
          聯絡人：贊哥
        </p>
      </div>
    </div>
  </section>
</template>
