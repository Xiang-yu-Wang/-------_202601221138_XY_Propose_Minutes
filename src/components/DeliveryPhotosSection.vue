<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useSupabaseDeliveryPhotoManager } from '@/composables/useSupabaseDeliveryPhotoManager'

// 使用 Supabase composable 讀取動態數據（雲端同步）
const { deliveryPhotos } = useSupabaseDeliveryPhotoManager()

// Pagination state
const currentPage = ref(1)
const pageSize = 6

// 優化圖片 URL 支援多格式
const buildOptimizedUrl = (url: string, width: number, format: string = 'auto') => {
  // Strikingly CDN 已支援 webp/avif，直接修改參數
  if (url.includes('strikinglycdn.com')) {
    return url.replace(/w_\d+/, `w_${width}`).replace(/f_auto/, `f_${format}`)
  }
  return url
}

// 生成響應式縮圖 srcset（支援多格式）
const widths = [320, 480, 640, 960, 1200]
const buildSrcSet = (url: string, format: string = 'auto') =>
  widths.map(w => `${buildOptimizedUrl(url, w, format)} ${w}w`).join(', ')

const thumbnailUrl = (url: string) => buildOptimizedUrl(url, 640, 'auto')

// Computed pagination values
const pageCount = computed(() => Math.ceil(deliveryPhotos.value.length / pageSize))
const isFirstPage = computed(() => currentPage.value === 1)
const isLastPage = computed(() => currentPage.value >= pageCount.value)

const currentPageSize = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return deliveryPhotos.value.slice(start, start + pageSize)
})

const prev = () => {
  if (!isFirstPage.value) currentPage.value--
}

const next = () => {
  if (!isLastPage.value) currentPage.value++
}
</script>

<template>
  <section id="delivery-photos" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="text-emerald-600 font-semibold tracking-wide uppercase">交貨實況</span>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">交貨照照片</h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          全台各地客戶收到紀念品的實況照片，真實記錄每次的服務成果
        </p>
      </div>

      <!-- Gallery grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Dialog v-for="photo in currentPageSize" :key="photo.id">
          <DialogTrigger as-child>
            <div
              class="relative group cursor-pointer overflow-hidden rounded-xl aspect-square bg-gray-200"
            >
              <img
                :src="thumbnailUrl(photo.url)"
                :srcset="buildSrcSet(photo.url, 'auto')"
                sizes="(max-width: 768px) 50vw, 360px"
                :alt="photo.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <ZoomIn class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <!-- 位置和標題標籤 -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p class="text-white font-semibold text-sm">{{ photo.title }}</p>
                <p class="text-gray-200 text-xs">{{ photo.location }}</p>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent class="max-w-4xl">
            <div class="space-y-4">
              <!-- Optimized lightbox image with picture element -->
              <picture>
                <source :srcset="buildSrcSet(photo.url, 'webp')" type="image/webp" />
                <source :srcset="buildSrcSet(photo.url, 'auto')" type="image/jpeg" />
                <img
                  :src="photo.url"
                  :alt="photo.title"
                  class="w-full h-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <!-- 照片詳情 -->
              <div class="border-t pt-4">
                <h3 class="font-semibold text-gray-900">{{ photo.title }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ photo.description }}</p>
                <div class="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>📍 {{ photo.location }}</span>
                  <span>📅 {{ new Date(photo.date).toLocaleDateString('zh-TW') }}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <!-- Pagination Controls -->
      <div class="mt-12 flex items-center justify-center gap-4">
        <Button
          @click="prev"
          :disabled="isFirstPage"
          variant="outline"
          class="rounded-lg"
        >
          <ChevronLeft class="w-4 h-4" />
        </Button>
        <span class="text-sm text-gray-600">
          第 {{ currentPage }} / {{ pageCount }} 頁
        </span>
        <Button
          @click="next"
          :disabled="isLastPage"
          variant="outline"
          class="rounded-lg"
        >
          <ChevronRight class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </section>
</template>
