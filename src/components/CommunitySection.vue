<script setup lang="ts">
import { Users, MessageCircle, Share2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { qrCodeUrl, communityGroupQrCodeUrl, communityLinks } from '@/data/community'
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

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
        <!-- Official LINE QR Code Section -->
        <div class="flex justify-center">
          <Card class="bg-white shadow-xl hover:shadow-2xl transition-shadow w-full max-w-sm">
            <CardHeader class="text-center pb-4">
              <CardTitle class="text-lg">官方 LINE</CardTitle>
              <CardDescription class="text-sm">加入官方帳號，獲得即時服務</CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col items-center space-y-4">
              <!-- QR Code Image -->
              <div class="bg-white p-4 rounded-lg border-4 border-gray-200">
                <img 
                  :src="qrCodeUrl" 
                  alt="LINE 官方帳號 QR Code"
                  loading="lazy"
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

        <!-- LINE Group QR Code Section -->
        <div class="flex justify-center">
          <Card class="bg-white shadow-xl hover:shadow-2xl transition-shadow w-full max-w-sm">
            <CardHeader class="text-center pb-4">
              <CardTitle class="text-lg">LINE 社群</CardTitle>
              <CardDescription class="text-sm">加入官方社群，與股東交流</CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col items-center space-y-4">
              <!-- QR Code Image -->
              <div class="bg-white p-4 rounded-lg border-4 border-gray-200">
                <img 
                  :src="communityGroupQrCodeUrl" 
                  alt="LINE 社群 QR Code"
                  loading="lazy"
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
                    點擊加入社群
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Other Ways to Join Section -->
      <div class="mt-12 max-w-4xl mx-auto">
        <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">其他加入方式</h3>
        
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
