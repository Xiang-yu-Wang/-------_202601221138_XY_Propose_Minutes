<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { galleryImages } from '@/data/gallery'

// Pagination state
const currentPage = ref(1)
const pageSize = 6

// 生成響應式縮圖 srcset
const widths = [320, 480, 640, 960, 1200]
const buildSrcSet = (url: string) =>
  widths.map(w => `${url.replace(/w_\d+/, `w_${w}`)} ${w}w`).join(', ')

const thumbnailUrl = (url: string) => url.replace(/w_\d+/, 'w_640')

// Computed pagination values
const pageCount = computed(() => Math.ceil(galleryImages.length / pageSize))
const isFirstPage = computed(() => currentPage.value === 1)
const isLastPage = computed(() => currentPage.value >= pageCount.value)

const currentPageSize = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return galleryImages.slice(start, start + pageSize)
})

const prev = () => {
  if (!isFirstPage.value) currentPage.value--
}

const next = () => {
  if (!isLastPage.value) currentPage.value++
}
</script>

<template>
  <section id="gallery" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="text-emerald-600 font-semibold tracking-wide uppercase">Gallery</span>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">各地交貨照</h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          全台各地客戶收到紀念品的實況照片，真實記錄每次的服務成果
        </p>
      </div>

      <!-- Gallery grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Dialog v-for="(image, index) in currentPageSize" :key="index">
          <DialogTrigger as-child>
            <div
              class="relative group cursor-pointer overflow-hidden rounded-xl aspect-square bg-gray-200"
            >
              <img
                :src="thumbnailUrl(image)"
                :srcset="buildSrcSet(image)"
                sizes="(max-width: 768px) 50vw, 360px"
                :alt="`交貨照片 ${(currentPage - 1) * 6 + index + 1}`"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <ZoomIn class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent class="max-w-4xl">
            <img
              :src="image"
              alt="放大圖片"
              class="w-full h-auto object-contain"
            />
          </DialogContent>
        </Dialog>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-center gap-4 mt-8">
        <Button
          @click="prev()"
          :disabled="isFirstPage"
          variant="outline"
          size="lg"
        >
          <ChevronLeft class="w-5 h-5 mr-2" />
          上一頁
        </Button>
        
        <span class="text-gray-600">
          {{ currentPage }} / {{ pageCount }}
        </span>

        <Button
          @click="next()"
          :disabled="isLastPage"
          variant="outline"
          size="lg"
        >
          下一頁
          <ChevronRight class="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  </section>
</template>
