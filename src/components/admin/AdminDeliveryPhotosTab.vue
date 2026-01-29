<script setup lang="ts">
import { ref } from 'vue'
import { Trash2, Plus, Download, Upload, RotateCcw, Edit2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useDeliveryPhotoManager } from '@/composables/useDeliveryPhotoManager'
import type { DeliveryPhoto } from '@/data/deliveryPhotos'

// Props
defineProps<{
  hasToken: boolean
  isSyncing: boolean
}>()

// 交貨照管理
const { 
  deliveryPhotos, 
  addDeliveryPhoto, 
  updateDeliveryPhoto, 
  deleteDeliveryPhoto, 
  resetToDefault, 
  exportAsJson, 
  importFromJson, 
  stats 
} = useDeliveryPhotoManager()

// 表單狀態
const isFormOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const previewUrl = ref('')
const formData = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  location: '',
  description: '',
  url: ''
})

// 導入文件
const fileInput = ref<HTMLInputElement>()

// 重置表單
const resetForm = () => {
  formData.value = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    url: ''
  }
  previewUrl.value = ''
  isEditing.value = false
  editingId.value = null
}

// 打開新增對話框
const openNewForm = () => {
  resetForm()
  isFormOpen.value = true
}

// 打開編輯
const startEdit = (photo: DeliveryPhoto) => {
  formData.value = {
    title: photo.title,
    date: photo.date,
    location: photo.location,
    description: photo.description,
    url: photo.url
  }
  previewUrl.value = photo.url
  editingId.value = photo.id
  isEditing.value = true
  isFormOpen.value = true
}

// 監聽 URL 輸入以預覽圖片
const handleUrlChange = () => {
  if (formData.value.url) {
    previewUrl.value = formData.value.url
  }
}

// 提交表單
const handleSubmit = () => {
  if (!formData.value.title || !formData.value.url || !formData.value.location || !formData.value.date) {
    alert('請填寫標題、圖片 URL、位置和日期')
    return
  }

  const photoData = {
    title: formData.value.title,
    date: formData.value.date,
    location: formData.value.location,
    description: formData.value.description,
    url: formData.value.url
  }

  if (isEditing.value && editingId.value) {
    updateDeliveryPhoto(editingId.value, photoData)
    alert('交貨照已更新')
  } else {
    addDeliveryPhoto(photoData)
    alert('交貨照已新增')
  }

  isFormOpen.value = false
  resetForm()
}

// 刪除交貨照
const handleDelete = (id: string) => {
  if (confirm('確定要刪除此交貨照嗎？')) {
    deleteDeliveryPhoto(id)
    alert('交貨照已刪除')
  }
}

// 導出數據
const handleExport = () => {
  const json = exportAsJson()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `delivery-photos-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// 導入數據
const handleImport = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (importFromJson(content)) {
      alert('交貨照數據已導入')
      input.value = ''
    } else {
      alert('導入失敗，請檢查檔案格式')
    }
  }
  reader.readAsText(file)
}

// 觸發導入
const triggerImport = () => {
  fileInput.value?.click()
}

// 重置為預設
const handleReset = () => {
  if (confirm('確定要重置為預設數據嗎？這會刪除所有自訂的交貨照。')) {
    resetToDefault()
    alert('已重置為預設數據')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium">總交貨照數</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.total }}</div>
          <p class="text-xs text-gray-500 mt-1">來自全台各地</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium">服務地點</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ Object.keys(stats.byLocation).length }}</div>
          <p class="text-xs text-gray-500 mt-1">個城市地區</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium">存儲狀態</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-emerald-600">✓</div>
          <p class="text-xs text-gray-500 mt-1">本地存儲已啟用</p>
        </CardContent>
      </Card>
    </div>

    <!-- 操作按鈕 -->
    <div class="flex flex-wrap gap-2">
      <Dialog v-model:open="isFormOpen">
        <DialogTrigger as-child>
          <Button @click="openNewForm" class="gap-2">
            <Plus class="w-4 h-4" />
            新增交貨照
          </Button>
        </DialogTrigger>
        <DialogContent class="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{{ isEditing ? '編輯交貨照' : '新增交貨照' }}</DialogTitle>
            <DialogDescription>
              填寫交貨照的相關信息。圖片 URL 支援 Strikingly CDN、Imgur 或其他圖床服務。
            </DialogDescription>
          </DialogHeader>

          <div class="space-y-4">
            <!-- 標題 -->
            <div>
              <label class="text-sm font-semibold mb-2 block">標題 *</label>
              <Input
                v-model="formData.title"
                placeholder="例: 台北地區交貨"
              />
            </div>

            <!-- 日期和位置 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-semibold mb-2 block">日期 *</label>
                <Input
                  v-model="formData.date"
                  type="date"
                />
              </div>
              <div>
                <label class="text-sm font-semibold mb-2 block">位置 *</label>
                <Input
                  v-model="formData.location"
                  placeholder="例: 台北市"
                />
              </div>
            </div>

            <!-- 圖片 URL -->
            <div>
              <label class="text-sm font-semibold mb-2 block">圖片 URL *</label>
              <Input
                v-model="formData.url"
                @input="handleUrlChange"
                placeholder="粘貼圖片網址，例: https://..."
                type="url"
              />
              <p class="text-xs text-gray-500 mt-1">
                支援: Strikingly CDN、Imgur、Cloudinary 等公開圖床
              </p>
            </div>

            <!-- 圖片預覽 -->
            <div v-if="previewUrl" class="border rounded-lg overflow-hidden bg-gray-50">
              <img 
                :src="previewUrl" 
                :alt="formData.title"
                class="w-full h-auto max-h-64 object-cover"
                @error="previewUrl = ''"
              />
              <p class="text-xs text-gray-500 p-2 text-center">圖片預覽</p>
            </div>

            <!-- 說明 -->
            <div>
              <label class="text-sm font-semibold mb-2 block">說明 (選填)</label>
              <Textarea
                v-model="formData.description"
                placeholder="例: 客戶滿意收到紀念品"
                rows="3"
              />
            </div>
          </div>

          <DialogFooter class="gap-2">
            <Button
              variant="outline"
              @click="() => { isFormOpen = false; resetForm() }"
            >
              取消
            </Button>
            <Button @click="handleSubmit">
              {{ isEditing ? '更新' : '新增' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="outline" @click="handleExport" class="gap-2">
        <Download class="w-4 h-4" />
        導出 JSON
      </Button>

      <Button variant="outline" @click="triggerImport" class="gap-2">
        <Upload class="w-4 h-4" />
        導入 JSON
      </Button>
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        hidden
        @change="handleImport"
      />

      <Button
        variant="outline"
        @click="handleReset"
        class="gap-2 text-amber-600 hover:text-amber-700"
      >
        <RotateCcw class="w-4 h-4" />
        重置為預設
      </Button>
    </div>

    <!-- 交貨照列表 -->
    <Card>
      <CardHeader>
        <CardTitle>交貨照列表</CardTitle>
        <CardDescription>
          管理所有交貨照，可新增、編輯或刪除
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="deliveryPhotos.length === 0" class="text-center py-8">
          <p class="text-gray-500">還沒有任何交貨照，點擊「新增交貨照」開始添加</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="photo in deliveryPhotos"
            :key="photo.id"
            class="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <!-- 縮圖 -->
            <div class="flex-shrink-0">
              <img
                :src="photo.url"
                :alt="photo.title"
                class="w-24 h-24 object-cover rounded-lg"
              />
            </div>

            <!-- 內容 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ photo.title }}</h4>
                  <p v-if="photo.description" class="text-sm text-gray-600 mt-1">
                    {{ photo.description }}
                  </p>
                </div>
              </div>

              <!-- 元數據 -->
              <div class="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                <Badge variant="outline" class="gap-1">
                  📍 {{ photo.location }}
                </Badge>
                <Badge variant="outline" class="gap-1">
                  📅 {{ new Date(photo.date).toLocaleDateString('zh-TW') }}
                </Badge>
              </div>

              <!-- 操作按鈕 -->
              <div class="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  @click="startEdit(photo)"
                  class="gap-2"
                >
                  <Edit2 class="w-4 h-4" />
                  編輯
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  @click="handleDelete(photo.id)"
                  class="gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 class="w-4 h-4" />
                  刪除
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
