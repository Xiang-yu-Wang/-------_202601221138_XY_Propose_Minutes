<script setup lang="ts">
import { Upload, ImageIcon, AlertCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const uploadFeatures = [
  '上傳股東大會電子投票截圖（電投圖）',
  '包含投票權憑證與投票內容',
  '方便我們快速確認您的股東身份',
  '支援 JPG、PNG、PDF 格式',
]

// 示範圖片 URL（替換為實際的示範圖片）
const exampleImages = [
  {
    title: '電腦版示範',
    description: '顯示投票權憑證、股東編號等資訊',
    url: 'https://via.placeholder.com/500x400?text=Computer+Version+Example'
  },
  {
    title: '手機版示範',
    description: '手機上的投票截圖範例',
    url: 'https://via.placeholder.com/350x600?text=Mobile+Version+Example'
  }
]

const googleFormUrl = 'https://forms.gle/eRKucMuQ8PCJawzX9'
</script>

<template>
  <section id="upload" class="py-20 bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="text-emerald-600 font-semibold tracking-wide uppercase">電投圖上傳</span>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">股東電子投票截圖上傳</h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          上傳股東大會電子投票截圖，幫助我們快速確認您的股東身份與投票紀錄
        </p>
      </div>

      <div class="max-w-4xl mx-auto space-y-12">
        <!-- Main upload card -->
        <Card class="border-2 border-emerald-200 shadow-xl">
          <CardHeader class="text-center space-y-2">
            <div class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload class="w-10 h-10 text-white" />
            </div>
            <CardTitle class="text-2xl md:text-3xl">上傳電投圖</CardTitle>
            <CardDescription class="text-base">
              透過 Google 表單上傳您的股東大會電子投票截圖
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
                <ImageIcon class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span class="text-gray-700">{{ feature }}</span>
              </div>
            </div>

            <!-- Upload instructions -->
            <div class="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-6 space-y-4">
              <div class="flex items-center gap-3">
                <AlertCircle class="w-6 h-6 text-emerald-700" />
                <h3 class="text-lg font-bold text-gray-900">上傳須知</h3>
              </div>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  需包含投票權憑證與投票內容
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  股東編號、公司名稱需清晰可見
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  建議使用截圖功能，確保完整顯示
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  檔案大小建議不超過 5MB
                </li>
                <li class="flex items-center gap-2 font-semibold text-emerald-800 bg-emerald-200 -mx-2 px-2 py-1 rounded">
                  <span class="w-2 h-2 bg-emerald-800 rounded-full"></span>
                  ⚠️ 上傳完成後，請加 LINE @792nvftc 留聯繫資料
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
                  前往上傳電投圖
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

        <!-- Screenshots Examples Section -->
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">截圖示範</h3>
          <p class="text-gray-600 text-center mb-8">
            以下為電子投票截圖的示範，請確保您的截圖包含類似的完整資訊
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card v-for="example in exampleImages" :key="example.title" class="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle class="text-lg">{{ example.title }}</CardTitle>
                <CardDescription>{{ example.description }}</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="rounded-lg overflow-hidden bg-gray-100 h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <img 
                    :src="example.url" 
                    :alt="example.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <p class="text-xs text-gray-500 mt-3 text-center">
                  示意圖片（需使用實際的投票截圖）
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Important Notice -->
        <div class="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 max-w-3xl mx-auto">
          <h4 class="font-bold text-yellow-900 mb-3">⚠️ 重要提醒</h4>
          <ul class="text-sm text-yellow-800 space-y-2">
            <li>✓ 請勿上傳個人敏感資訊（如身分證字號、帳號密碼）</li>
            <li>✓ 只需上傳電投平台的投票權憑證截圖</li>
            <li>✓ 確認股東資訊清晰後再上傳</li>
            <li>✓ 上傳完成後請留下聯絡方式，我們會盡快處理</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
