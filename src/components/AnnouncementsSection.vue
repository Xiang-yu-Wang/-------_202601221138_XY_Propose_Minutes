<script setup lang="ts">
import { Megaphone } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAnnouncementManager } from '@/composables/useAnnouncementManager'

const { announcements } = useAnnouncementManager()
</script>

<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 text-emerald-700 font-semibold">
          <Megaphone class="w-6 h-6" />
          公告區
        </div>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">最新通知與服務更新</h2>
        <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
          提供近期服務時程、方案調整、文件上傳注意事項等重要訊息。
        </p>
      </div>

      <!-- Announcements list -->
      <div v-if="announcements.length === 0" class="text-center py-12 text-gray-500">
        目前沒有公告
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card v-for="item in announcements" :key="item.id" class="bg-white/80">
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle class="text-lg font-bold text-gray-900">{{ item.title }}</CardTitle>
              <span class="text-sm text-gray-500">{{ item.date }}</span>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <Badge v-for="tag in item.tags" :key="tag" variant="default">{{ tag }}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-gray-700 leading-relaxed">{{ item.content }}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
