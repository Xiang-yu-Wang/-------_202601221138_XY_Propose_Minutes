<script setup lang="ts">
import { MapPin, Phone, Mail, Send } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
</script>

<template>
  <section id="contact" class="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="text-cyan-200 font-semibold tracking-wide uppercase">Contact Us</span>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-white">聯絡我們</h2>
        <p class="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
          歡迎隨時與我們聯絡，讓我們共同為您的股東紀念品需求提供最佳解決方案
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Contact info -->
        <div class="space-y-8">
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin class="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 class="text-lg font-bold text-white mb-1">地址</h4>
                <p class="text-white/80">板橋區民治街71巷58號1樓</p>
                <p class="text-cyan-300 text-sm mt-1">（倉庫需預約）</p>
              </div>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone class="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 class="text-lg font-bold text-white mb-1">電話</h4>
                <a href="tel:0982571134" class="text-white/80 hover:text-white transition-colors text-xl">
                  0982-571-134
                </a>
                <p class="text-cyan-300 mt-1">聯絡人：贊哥</p>
              </div>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail class="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 class="text-lg font-bold text-white mb-1">Email / LINE</h4>
                <a href="mailto:playegg903@gmail.com" class="text-white/80 hover:text-white transition-colors block">
                  playegg903@gmail.com
                </a>
                <a href="https://line.me/R/ti/p/@792nvftc" target="_blank" class="text-cyan-300 hover:text-cyan-200 transition-colors mt-1 block">
                  LINE: @792nvftc
                </a>
              </div>
            </div>
          </div>

          <!-- Quick action buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <a 
              href="tel:0982571134"
              class="flex-1 bg-white text-emerald-700 px-6 py-4 rounded-xl font-bold text-center hover:bg-gray-100 transition-colors"
            >
              立刻去電
            </a>
            <a 
              href="https://line.me/R/ti/p/@792nvftc"
              target="_blank"
              class="flex-1 bg-green-500 text-white px-6 py-4 rounded-xl font-bold text-center hover:bg-green-600 transition-colors"
            >
              加入 LINE
            </a>
          </div>
        </div>

        <!-- Contact form -->
        <div class="bg-white rounded-2xl p-8 shadow-xl">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">傳送訊息給我們</h3>
          
          <div class="space-y-6">
            <p class="text-gray-600">
              請填寫 Google 表單與我們聯繫，我們會盡快回覆您。
            </p>

            <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 space-y-3">
              <div class="flex items-center gap-2 text-gray-700">
                <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                <span>填寫您的基本資訊</span>
              </div>
              <div class="flex items-center gap-2 text-gray-700">
                <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                <span>告訴我們您的需求</span>
              </div>
              <div class="flex items-center gap-2 text-gray-700">
                <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                <span>我們會盡快與您聯繫</span>
              </div>
            </div>

            <Button
              as-child
              class="w-full py-6 text-lg"
              size="lg"
            >
              <a 
                href="https://forms.gle/WZii479HvP3ptzqs7" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send class="w-5 h-5 mr-2" />
                前往填寫表單
              </a>
            </Button>

            <p class="text-sm text-gray-500 text-center">
              點擊後將開啟 Google 表單新視窗
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
