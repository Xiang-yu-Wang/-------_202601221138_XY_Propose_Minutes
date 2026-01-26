<script setup lang="ts">
import { ref } from 'vue'
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-vue-next'

const formData = ref({
  name: '',
  phone: '',
  message: '',
})

const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.phone) {
    alert('請填寫姓名和電話')
    return
  }
  
  isSubmitting.value = true
  
  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Here you would normally send the data to your backend
  console.log('Form submitted:', formData.value)
  
  isSubmitting.value = false
  submitStatus.value = 'success'
  
  // Reset form
  formData.value = { name: '', phone: '', message: '' }
  
  setTimeout(() => {
    submitStatus.value = 'idle'
  }, 3000)
}
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
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                姓名 <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="請輸入您的姓名"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                電話 <span class="text-red-500">*</span>
              </label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="請輸入您的電話"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                訊息
              </label>
              <textarea
                id="message"
                v-model="formData.message"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                placeholder="請輸入您的訊息..."
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              :class="[
                'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all',
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              ]"
            >
              <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
              <Send v-else class="w-5 h-5" />
              {{ isSubmitting ? '傳送中...' : '提交' }}
            </button>

            <div 
              v-if="submitStatus === 'success'"
              class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center"
            >
              訊息已成功送出！我們會盡快與您聯繫。
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
