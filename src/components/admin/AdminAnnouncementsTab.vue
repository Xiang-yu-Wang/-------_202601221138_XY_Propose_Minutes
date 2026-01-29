<script setup lang="ts">
import { ref } from 'vue'
import { Trash2, Plus, Download, Upload, RotateCcw, Edit2, Github } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAnnouncementManager } from '@/composables/useAnnouncementManager'
import type { Announcement } from '@/data/announcements'

// Props
const props = defineProps<{
  hasToken: boolean
  isSyncing: boolean
}>()

// Emits
const emit = defineEmits<{
  syncToGitHub: []
}>()

// 公告管理
const { 
  announcements, 
  addAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement, 
  resetToDefault, 
  exportAsJson, 
  importFromJson, 
  stats 
} = useAnnouncementManager()

// 表單狀態
const isFormOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const formData = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  type: 'info' as 'important' | 'new' | 'info',
  tags: '',
  content: ''
})

// 導入文件
const fileInput = ref<HTMLInputElement>()

// 重置表單
const resetForm = () => {
  formData.value = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'info',
    tags: '',
    content: ''
  }
  isEditing.value = false
  editingId.value = null
}

// 打開編輯
const startEdit = (announcement: Announcement) => {
  formData.value = {
    title: announcement.title,
    date: announcement.date,
    type: announcement.type,
    tags: announcement.tags?.join(', ') || '',
    content: announcement.content
  }
  editingId.value = announcement.id
  isEditing.value = true
  isFormOpen.value = true
}

// 提交表單
const handleSubmit = () => {
  if (!formData.value.title || !formData.value.content) {
    alert('請填寫標題和內容')
    return
  }

  const tags = formData.value.tags
    ? formData.value.tags.split(',').map(t => t.trim()).filter((t): t is string => !!t)
    : undefined

  const announcementData = {
    title: formData.value.title,
    date: formData.value.date,
    type: formData.value.type as 'important' | 'new' | 'info',
    content: formData.value.content,
    ...(tags && tags.length > 0 ? { tags } : {})
  }

  if (isEditing.value && editingId.value) {
    updateAnnouncement(editingId.value, announcementData)
  } else {
    addAnnouncement(announcementData as Omit<Announcement, 'id'>)
  }

  resetForm()
  isFormOpen.value = false
}

// 導出公告
const handleExport = () => {
  const json = exportAsJson()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `announcements_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// 導入公告
const handleImport = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = (e.target?.result as string) || ''
    if (importFromJson(content)) {
      alert('導入成功！')
    } else {
      alert('導入失敗，請檢查 JSON 格式')
    }
  }
  reader.readAsText(file)
}

// 類型標籤顏色
const getTypeColor = (type: string) => {
  switch (type) {
    case 'important':
      return 'bg-red-100 text-red-700'
    case 'new':
      return 'bg-emerald-100 text-emerald-700'
    default:
      return 'bg-blue-100 text-blue-700'
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'important':
      return '重要'
    case 'new':
      return '新'
    default:
      return '資訊'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-gray-600">總公告數</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats.total }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-red-600">重要</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-red-600">{{ stats.important }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-emerald-600">新消息</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-emerald-600">{{ stats.new }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-blue-600">一般</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-blue-600">{{ stats.info }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- 操作按鈕 -->
    <div class="flex flex-wrap gap-3">
      <Dialog v-model:open="isFormOpen">
        <DialogTrigger as-child>
          <Button @click="resetForm" class="gap-2">
            <Plus class="w-4 h-4" />
            新增公告
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{{ isEditing ? '編輯公告' : '新增公告' }}</DialogTitle>
            <DialogDescription>
              {{ isEditing ? '修改現有公告的內容' : '建立新的公告，將即時顯示在首頁' }}
            </DialogDescription>
          </DialogHeader>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium">標題 *</label>
              <Input v-model="formData.title" placeholder="例：春節服務公告" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium">日期 *</label>
                <Input v-model="formData.date" type="date" />
              </div>
              <div>
                <label class="text-sm font-medium">類型 *</label>
                <select v-model="formData.type" class="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="important">重要</option>
                  <option value="new">新消息</option>
                  <option value="info">一般資訊</option>
                </select>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium">標籤 (用逗號分隔)</label>
              <Input v-model="formData.tags" placeholder="例：服務, 時程, 重要" />
            </div>

            <div>
              <label class="text-sm font-medium">內容 *</label>
              <Textarea v-model="formData.content" placeholder="詳細的公告內容..." rows="6" />
            </div>
          </div>

          <DialogFooter class="gap-2">
            <Button variant="outline" @click="isFormOpen = false">取消</Button>
            <Button @click="handleSubmit">{{ isEditing ? '更新' : '新增' }}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="outline" @click="handleExport" class="gap-2">
        <Download class="w-4 h-4" />
        導出
      </Button>

      <Button variant="outline" @click="fileInput?.click()" class="gap-2">
        <Upload class="w-4 h-4" />
        導入
      </Button>
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        class="hidden"
        @change="handleImport"
      />

      <Button 
        v-if="hasToken"
        @click="emit('syncToGitHub')" 
        :disabled="isSyncing"
        class="gap-2 bg-emerald-600 hover:bg-emerald-700"
      >
        <Github class="w-4 h-4" />
        {{ isSyncing ? '同步中...' : '同步到 GitHub' }}
      </Button>

      <Dialog>
        <DialogTrigger as-child>
          <Button variant="outline" class="gap-2">
            <RotateCcw class="w-4 h-4" />
            重置
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認重置</DialogTitle>
            <DialogDescription>
              此操作將恢復到預設公告。請先導出備份。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter class="gap-2">
            <Button variant="outline">取消</Button>
            <Button variant="destructive" @click="resetToDefault">確認重置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <!-- 公告列表 -->
    <Card>
      <CardHeader>
        <CardTitle>公告列表</CardTitle>
        <CardDescription>點擊編輯按鈕修改或刪除公告</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="announcements.length === 0" class="text-center py-8 text-gray-500">
          還沒有公告，點擊上方「新增公告」按鈕新增。
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="announcement in announcements"
            :key="announcement.id"
            class="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <Badge :class="getTypeColor(announcement.type)">
                    {{ getTypeLabel(announcement.type) }}
                  </Badge>
                  <span class="text-sm text-gray-500">{{ announcement.date }}</span>
                </div>
                <h3 class="font-semibold text-gray-900 break-words">{{ announcement.title }}</h3>
                <p class="text-sm text-gray-600 mt-2 break-words">{{ announcement.content }}</p>
                <div v-if="announcement.tags && announcement.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                  <span v-for="tag in announcement.tags" :key="tag" class="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  @click="startEdit(announcement)"
                  class="gap-1"
                >
                  <Edit2 class="w-4 h-4" />
                  <span class="hidden sm:inline">編輯</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  @click="deleteAnnouncement(announcement.id)"
                  class="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 class="w-4 h-4" />
                  <span class="hidden sm:inline">刪除</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
