<script setup lang="ts">
import { useToggle, useEventListener, useThrottleFn } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { navItems } from '@/data/navigation'

const [isMenuOpen, toggleMenu] = useToggle(false)
const route = useRoute()

// Route 路徑到視圖的映射
const routeMap: Record<string, () => Promise<any>> = {
  '/': () => import('@/views/HomeView.vue'),
  '/announcements': () => import('@/views/AnnouncementsView.vue'),
  '/products': () => import('@/views/ProductsView.vue'),
  '/recruitment': () => import('@/views/RecruitmentView.vue'),
  '/community': () => import('@/views/CommunityView.vue'),
  '/services': () => import('@/views/ServicesView.vue'),
  '/plans': () => import('@/views/PlansView.vue'),
  '/gallery': () => import('@/views/GalleryView.vue'),
  '/upload': () => import('@/views/UploadView.vue'),
  '/contact': () => import('@/views/ContactView.vue'),
}

// 預取 route components（節流以避免過度加載）
const prefetchRoute = useThrottleFn(async (path: string) => {
  const loader = routeMap[path]
  if (loader) {
    try {
      await loader()
    } catch (error) {
      // Silently fail prefetch errors
      void error
    }
  }
}, 500)

// Check if current route matches
const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// Close menu on navigation click
const closeMenu = () => {
  isMenuOpen.value = false
}

// Close menu on escape key
useEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen.value) {
    closeMenu()
  }
})
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <RouterLink to="/" class="text-xl font-bold text-emerald-700">大倉代領股東紀念品</RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-8">
            <RouterLink
              v-for="item in navItems"
              :key="item.name"
              :to="item.to"
              @mouseenter="prefetchRoute(item.to)"
              :class="[
                'text-gray-700 hover:text-emerald-600 transition-colors font-medium relative',
                isActive(item.to) && 'text-emerald-600'
              ]"
            >
              {{ item.name }}
              <span 
                v-if="isActive(item.to)"
                class="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600"
              />
            </RouterLink>
            <RouterLink
              to="/admin"
              class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold shadow-sm hover:bg-emerald-700 transition-colors"
              @mouseenter="prefetchRoute('/admin')"
            >
              管理後台
            </RouterLink>
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
          <Button
            @click="toggleMenu()"
            variant="ghost"
            size="icon"
            class="text-gray-700 hover:text-emerald-600"
          >
            <Menu v-if="!isMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="isMenuOpen" class="md:hidden bg-white border-t">
      <div class="px-4 py-2 space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          @click="closeMenu"
          class="block py-2 text-gray-700 hover:text-emerald-600 transition-colors"
        >
          {{ item.name }}
        </RouterLink>
        <RouterLink
          to="/admin"
          @click="closeMenu"
          class="block py-2 text-emerald-700 font-semibold"
        >
          管理後台
        </RouterLink>
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
