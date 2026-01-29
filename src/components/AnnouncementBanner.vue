<script setup lang="ts">
import { Megaphone, ArrowRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useSupabaseAnnouncementManager } from '@/composables/useSupabaseAnnouncementManager'
import { Badge } from '@/components/ui/badge'
import { computed, onMounted } from 'vue'

const { announcements, fetchAnnouncements, subscribeToChanges } = useSupabaseAnnouncementManager()

// 初始化載入資料和訂閱實時更新
onMounted(() => {
  fetchAnnouncements()
  subscribeToChanges()
})

// 只顯示最新 2 則公告
const latestAnnouncements = computed(() => announcements.value.slice(0, 2))
</script>

<template>
  <section class="fixed top-16 left-0 right-0 z-40 py-3 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-4">
        <!-- Icon and title -->
        <div class="flex items-center gap-3 shrink-0">
          <div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
            <Megaphone class="w-5 h-5 text-white" />
          </div>
          <span class="font-bold text-gray-900">最新公告</span>
        </div>

        <!-- Announcements marquee -->
        <div class="flex-1 min-w-0">
          <div class="flex flex-col md:flex-row gap-4 md:gap-8 flex-wrap">
            <div 
              v-for="announcement in latestAnnouncements" 
              :key="announcement.id"
              class="flex items-center gap-2"
            >
              <Badge 
                :class="[
                  announcement.type === 'important' ? 'bg-red-100 text-red-700' :
                  announcement.type === 'new' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-blue-100 text-blue-700'
                ]"
              >
                {{ announcement.type === 'important' ? '重要' : announcement.type === 'new' ? '新' : '資訊' }}
              </Badge>
              <span class="text-gray-700 text-sm md:text-base">{{ announcement.title }}</span>
            </div>
          </div>
        </div>

        <!-- View all link -->
        <RouterLink 
          to="/announcements" 
          class="shrink-0 inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm"
        >
          查看全部
          <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>
