<script setup lang="ts">
import { Upload, CheckCircle, ImageIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const uploadFeatures = [
  '上傳您的股東會通知單照片',
  '提供委託書或相關文件',
  '方便我們快速處理您的申請',
  '支援多種圖片格式',
]

const googleFormUrl = 'https://forms.gle/eRKucMuQ8PCJawzX9'
</script>

<template>
  <section id="upload" class="py-20 bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="text-emerald-600 font-semibold tracking-wide uppercase">Upload Documents</span>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">文件上傳</h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          透過 Google 表單快速上傳您的股東會通知單或委託書，我們將盡快為您處理
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <Card class="border-2 border-emerald-200 shadow-xl">
          <CardHeader class="text-center space-y-2">
            <div class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload class="w-10 h-10 text-white" />
            </div>
            <CardTitle class="text-2xl md:text-3xl">上傳您的文件</CardTitle>
            <CardDescription class="text-base">
              點擊下方按鈕，透過 Google 表單安全上傳您的文件
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-8">
            <!-- Features -->
            <div class="grid sm:grid-cols-2 gap-4">
              <div 
                v-for="feature in uploadFeatures" 
                :key="feature"
                class="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl"
              >
                <CheckCircle class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span class="text-gray-700">{{ feature }}</span>
              </div>
            </div>

            <!-- Upload instructions -->
            <div class="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-6 space-y-4">
              <div class="flex items-center gap-3">
                <ImageIcon class="w-6 h-6 text-emerald-700" />
                <h3 class="text-lg font-bold text-gray-900">上傳說明</h3>
              </div>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  請確保照片清晰可辨識
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  股東會開會通知單需包含完整資訊
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  如有多份文件，可分別上傳
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  上傳後請保持電話暢通，我們會聯繫您確認
                </li>
              </ul>
            </div>

            <!-- CTA Button -->
            <div class="text-center pt-4">
              <Button 
                as-child
                size="lg"
                class="w-full sm:w-auto text-lg px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <a 
                  :href="googleFormUrl" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Upload class="w-5 h-5 mr-2" />
                  前往上傳文件
                </a>
              </Button>
              <p class="mt-4 text-sm text-gray-500">
                點擊後將開啟 Google 表單新視窗
              </p>
            </div>

            <!-- Contact info -->
            <div class="border-t pt-6 text-center text-gray-600">
              <p>如有任何問題，歡迎聯繫我們</p>
              <div class="flex flex-col sm:flex-row gap-2 justify-center mt-3 text-sm">
                <a href="tel:0982571134" class="text-emerald-600 hover:text-emerald-700 font-medium">
                  📞 0982-571-134
                </a>
                <span class="hidden sm:inline">|</span>
                <a href="https://line.me/R/ti/p/@792nvftc" target="_blank" class="text-emerald-600 hover:text-emerald-700 font-medium">
                  💬 LINE: @792nvftc
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
