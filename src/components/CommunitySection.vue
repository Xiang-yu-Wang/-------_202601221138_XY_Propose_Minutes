<script setup lang="ts">
import { Users, MessageCircle, Share2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// 社群 QR code 圖片 URL（使用用戶提供的 QR code 圖片）
const qrCodeUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

const communityLinks = [
  {
    title: 'LINE 社群',
    description: '加入 LINE 官方帳號，即時獲得最新消息與服務',
    icon: '💬',
    link: 'https://line.me/R/ti/p/@792nvftc',
    target: '_blank'
  },
  {
    title: 'Facebook 社團',
    description: '加入 FB 社團，與其他股東交流與分享',
    icon: '👥',
    link: 'https://www.facebook.com/groups/call0982571134',
    target: '_blank'
  },
  {
    title: '直接聯絡',
    description: '電話洽詢，獲得專人服務',
    icon: '📞',
    link: 'tel:0982571134',
    target: ''
  }
]
</script>

<template>
  <section class="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-emerald-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 text-emerald-700 font-semibold">
          <Users class="w-6 h-6" />
          加入我們的社群
        </div>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">與我們保持聯繫</h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          加入大倉代領股東紀念品的官方社群，即時獲得最新消息、服務更新與優惠資訊
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
        <!-- QR Code Section -->
        <div class="lg:col-span-1 flex justify-center">
          <Card class="bg-white shadow-xl hover:shadow-2xl transition-shadow w-full max-w-sm">
            <CardHeader class="text-center pb-4">
              <CardTitle class="text-lg">掃描 QR Code</CardTitle>
              <CardDescription class="text-sm">使用手機掃描加入官方 LINE</CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col items-center space-y-4">
              <!-- QR Code Image -->
              <div class="bg-white p-4 rounded-lg border-4 border-gray-200">
                <img 
                  :src="qrCodeUrl" 
                  alt="LINE QR Code - 大倉代領股東紀念品"
                  class="w-56 h-56 object-contain"
                />
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-600 mb-3">掃描二維碼快速加入</p>
                <Button
                  as-child
                  class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                >
                  <a href="https://line.me/R/ti/p/@792nvftc" target="_blank" rel="noopener noreferrer">
                    <MessageCircle class="w-4 h-4 mr-2" />
                    點擊加入 LINE
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Social Links Section -->
        <div class="lg:col-span-2 space-y-4">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">其他加入方式</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card 
              v-for="link in communityLinks"
              :key="link.title"
              class="bg-white hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <a 
                :href="link.link"
                :target="link.target"
                class="block h-full"
                rel="noopener noreferrer"
              >
                <CardHeader>
                  <div class="text-4xl mb-2">{{ link.icon }}</div>
                  <CardTitle class="text-lg group-hover:text-emerald-600 transition-colors">
                    {{ link.title }}
                  </CardTitle>
                  <CardDescription class="text-sm">{{ link.description }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="flex items-center gap-2 text-emerald-600 group-hover:translate-x-1 transition-transform">
                    <span class="font-medium">前往</span>
                    <Share2 class="w-4 h-4" />
                  </div>
                </CardContent>
              </a>
            </Card>
          </div>
        </div>
      </div>

      <!-- Benefits Section -->
      <div class="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-200">
        <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span class="text-2xl">⭐</span>
          加入社群的好處
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-start gap-3">
            <span class="text-xl">✓</span>
            <div>
              <p class="font-semibold text-gray-900">即時通知</p>
              <p class="text-sm text-gray-600">最新服務資訊與方案調整立即知道</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-xl">✓</span>
            <div>
              <p class="font-semibold text-gray-900">優先服務</p>
              <p class="text-sm text-gray-600">社群成員享有優先回覆與諮詢服務</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-xl">✓</span>
            <div>
              <p class="font-semibold text-gray-900">交流平台</p>
              <p class="text-sm text-gray-600">與其他股東分享經驗與心得</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-xl">✓</span>
            <div>
              <p class="font-semibold text-gray-900">獨家優惠</p>
              <p class="text-sm text-gray-600">社群成員專享的特殊優惠與活動</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
