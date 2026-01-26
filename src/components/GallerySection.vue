<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-vue-next'

// Sample images from the original site
const galleryImages = [
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/240152_580163.jpeg',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/303791_342347.jpeg',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/71050_590858.jpeg',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/343587_574148.jpeg',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/487235_291855.jpeg',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/288498_499975.jpeg',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/878347_459029.jpeg',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/831078_624759.jpeg',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/524191_971264.jpeg',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/191143_539829.jpeg',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/105268_813114.jpeg',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/552746_216976.jpeg',
]

const currentPage = ref(0)
const selectedImage = ref<string | null>(null)
const imagesPerPage = 6
const totalPages = Math.ceil(galleryImages.length / imagesPerPage)

const currentImages = () => {
  const start = currentPage.value * imagesPerPage
  return galleryImages.slice(start, start + imagesPerPage)
}

const nextPage = () => {
  if (currentPage.value < totalPages - 1) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const openLightbox = (image: string) => {
  selectedImage.value = image
}

const closeLightbox = () => {
  selectedImage.value = null
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
        <div
          v-for="(image, index) in currentImages()"
          :key="index"
          @click="openLightbox(image)"
          class="relative group cursor-pointer overflow-hidden rounded-xl aspect-square bg-gray-200"
        >
          <img
            :src="image"
            :alt="`交貨照片 ${currentPage * imagesPerPage + index + 1}`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <ZoomIn class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-center gap-4 mt-8">
        <button
          @click="prevPage"
          :disabled="currentPage === 0"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
            currentPage === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          ]"
        >
          <ChevronLeft class="w-5 h-5" />
          上一頁
        </button>
        
        <span class="text-gray-600">
          {{ currentPage + 1 }} / {{ totalPages }}
        </span>

        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages - 1"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
            currentPage >= totalPages - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          ]"
        >
          下一頁
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="selectedImage"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        @click.self="closeLightbox"
      >
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        >
          <X class="w-8 h-8" />
        </button>
        <img
          :src="selectedImage"
          alt="放大圖片"
          class="max-w-full max-h-[90vh] object-contain"
        />
      </div>
    </Teleport>
  </section>
</template>
