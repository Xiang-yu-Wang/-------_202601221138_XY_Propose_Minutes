<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useScrollToTop } from '@/composables/useScrollToTop'

const { isVisible, scrollToTop } = useScrollToTop(300)
</script>

<template>
  <!-- 返回頂部按鈕 -->
  <transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <Button
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-40 rounded-full w-12 h-12 p-0 shadow-lg bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-110"
      title="返回頂部"
    >
      <ArrowUp class="w-5 h-5" />
    </Button>
  </transition>
</template>
