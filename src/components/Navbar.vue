<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const navItems = [
  { name: '首頁', href: '#hero' },
  { name: '服務介紹', href: '#services' },
  { name: '方案說明', href: '#plans' },
  { name: '交貨實績', href: '#gallery' },
  { name: '聯絡我們', href: '#contact' },
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <a href="#" class="text-xl font-bold text-emerald-700">大倉代領股東紀念品</a>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-8">
            <a
              v-for="item in navItems"
              :key="item.name"
              :href="item.href"
              class="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              {{ item.name }}
            </a>
            <a
              href="https://www.facebook.com/groups/call0982571134"
              target="_blank"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              FB 社團
            </a>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="toggleMenu"
            class="text-gray-700 hover:text-emerald-600 p-2"
          >
            <Menu v-if="!isMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="isMenuOpen" class="md:hidden bg-white border-t">
      <div class="px-4 py-2 space-y-1">
        <a
          v-for="item in navItems"
          :key="item.name"
          :href="item.href"
          @click="isMenuOpen = false"
          class="block py-2 text-gray-700 hover:text-emerald-600 transition-colors"
        >
          {{ item.name }}
        </a>
        <a
          href="https://www.facebook.com/groups/call0982571134"
          target="_blank"
          class="block py-2 text-blue-600 font-medium"
        >
          FB 社團
        </a>
      </div>
    </div>
  </nav>
</template>
