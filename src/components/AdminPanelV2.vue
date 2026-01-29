<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Trash2, Plus, Download, Upload, RotateCcw, Edit2, Image as ImageIcon, Package, Eye, EyeOff, LogOut, Mail, Lock, AlertCircle, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/composables/useAuth'
import { useSupabaseAnnouncementManager } from '@/composables/useSupabaseAnnouncementManager'
import { useSupabaseProductManager } from '@/composables/useSupabaseProductManager'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { Announcement, Product } from '@/lib/database.types'

// 認證
const { 
  isAuthenticated, 
  loading: authLoading, 
  userEmail,
  signInWithEmail, 
  signOut,
  initialize
} = useAuth()

// 公告管理
const { 
  announcements, 
  loading: announcementLoading,
  addAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement, 
  resetToDefault, 
  exportAsJson, 
  importFromJson, 
  stats,
  fetchAnnouncements
} = useSupabaseAnnouncementManager()

// 產品管理
const { 
  products, 
  loading: productLoading,
  addProduct, 
  updateProduct, 
  deleteProduct, 
  toggleAvailability,
  uploadImage,
  resetToDefault: resetProductsToDefault,
  exportAsJson: exportProductsAsJson,
  importFromJson: importProductsFromJson,
  stats: productStats,
  fetchProducts
} = useSupabaseProductManager()

// 登入表單
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')

// 頁籤管理
const activeTab = ref<'announcements' | 'products'>('announcements')

// 處理登入
const handleLogin = async () => {
  loginError.value = ''
  
  if (!loginEmail.value || !loginPassword.value) {
    loginError.value = '請輸入 Email 和密碼'
    return
  }

  const result = await signInWithEmail(loginEmail.value, loginPassword.value)
  
  if (!result.success) {
    loginError.value = result.error || '登入失敗'
  } else {
    // 登入成功後重新載入數據
    await fetchAnnouncements()
    await fetchProducts()
  }
}

// 處理登出
const handleLogout = async () => {
  await signOut()
}

// 初始化
onMounted(async () => {
  await initialize()
  // 載入數據（公開讀取）
  await fetchAnnouncements()
  await fetchProducts()
})

// ===== 公告管理 =====
const isFormOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const formData = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  type: 'info' as 'important' | 'new' | 'info',
  tags: '',
  content: ''
})
const fileInput = ref<HTMLInputElement>()

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

const handleSubmit = async () => {
  if (!formData.value.title || !formData.value.content) {
    alert('請填寫標題和內容')
    return
  }

  const tags = formData.value.tags
    ? formData.value.tags.split(',').map(t => t.trim()).filter((t): t is string => !!t)
    : []

  const announcementData = {
    title: formData.value.title,
    date: formData.value.date,
    type: formData.value.type,
    content: formData.value.content,
    tags
  }

  if (isEditing.value && editingId.value) {
    const result = await updateAnnouncement(editingId.value, announcementData)
    if (!result.success) {
      alert('更新失敗：' + result.error)
      return
    }
  } else {
    const result = await addAnnouncement(announcementData)
    if (!result.success) {
      alert('新增失敗：' + result.error)
      return
    }
  }

  resetForm()
  isFormOpen.value = false
}

const handleDelete = async (id: string) => {
  if (!confirm('確定要刪除此公告嗎？')) return
  
  const result = await deleteAnnouncement(id)
  if (!result.success) {
    alert('刪除失敗：' + result.error)
  }
}

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

const handleImport = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    const content = (e.target?.result as string) || ''
    const result = await importFromJson(content)
    if (result.success) {
      alert('導入成功！')
    } else {
      alert('導入失敗：' + result.error)
    }
  }
  reader.readAsText(file)
}

const handleReset = async () => {
  const result = await resetToDefault()
  if (result.success) {
    alert('已重置為預設公告')
  } else {
    alert('重置失敗：' + result.error)
  }
}

// ===== 產品管理 =====
const isProductFormOpen = ref(false)
const isEditingProduct = ref(false)
const editingProductId = ref<string | null>(null)
const productFormData = ref({
  name: '',
  category: '',
  price: 0,
  image_url: '',
  description: '',
  available: true
})
const imagePreview = ref<string>('')
const imageFileInput = ref<HTMLInputElement>()
const productFileInput = ref<HTMLInputElement>()

const resetProductForm = () => {
  productFormData.value = {
    name: '',
    category: '',
    price: 0,
    image_url: '',
    description: '',
    available: true
  }
  imagePreview.value = ''
  isEditingProduct.value = false
  editingProductId.value = null
}

const startEditProduct = (product: Product) => {
  productFormData.value = {
    name: product.name,
    category: product.category,
    price: product.price,
    image_url: product.image_url || '',
    description: product.description || '',
    available: product.available
  }
  imagePreview.value = product.image_url || ''
  editingProductId.value = product.id
  isEditingProduct.value = true
  isProductFormOpen.value = true
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const url = await uploadImage(file)
    if (url) {
      productFormData.value.image_url = url
      imagePreview.value = url
    } else {
      alert('圖片上傳失敗')
    }
  } catch (error) {
    alert(error instanceof Error ? error.message : '圖片上傳失敗')
  }
}

const handleProductSubmit = async () => {
  if (!productFormData.value.name || !productFormData.value.category) {
    alert('請填寫產品名稱和分類')
    return
  }

  const productData = {
    name: productFormData.value.name,
    category: productFormData.value.category,
    price: Number(productFormData.value.price),
    image_url: productFormData.value.image_url || null,
    description: productFormData.value.description || null,
    available: productFormData.value.available
  }

  if (isEditingProduct.value && editingProductId.value) {
    const result = await updateProduct(editingProductId.value, productData)
    if (!result.success) {
      alert('更新失敗：' + result.error)
      return
    }
  } else {
    const result = await addProduct(productData)
    if (!result.success) {
      alert('新增失敗：' + result.error)
      return
    }
  }

  resetProductForm()
  isProductFormOpen.value = false
}

const handleProductDelete = async (id: string) => {
  if (!confirm('確定要刪除此產品嗎？')) return
  
  const result = await deleteProduct(id)
  if (!result.success) {
    alert('刪除失敗：' + result.error)
  }
}

const handleToggleAvailability = async (id: string) => {
  const result = await toggleAvailability(id)
  if (!result.success) {
    alert('切換狀態失敗：' + result.error)
  }
}

const handleProductExport = () => {
  const json = exportProductsAsJson()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `products_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const handleProductImport = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    const content = (e.target?.result as string) || ''
    const result = await importProductsFromJson(content)
    if (result.success) {
      alert('導入成功！')
    } else {
      alert('導入失敗：' + result.error)
    }
  }
  reader.readAsText(file)
}

const handleProductReset = async () => {
  const result = await resetProductsToDefault()
  if (result.success) {
    alert('已重置為預設產品')
  } else {
    alert('重置失敗：' + result.error)
  }
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

// Supabase 配置狀態
const isConfigured = computed(() => isSupabaseConfigured())
</script>

<template>
  <div class="space-y-6">
    <!-- Supabase 未配置警告 -->
    <Card v-if="!isConfigured" class="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-amber-900">
          <AlertCircle class="w-5 h-5" />
          Supabase 尚未配置
        </CardTitle>
        <CardDescription class="text-amber-800">
          目前使用本地儲存模式。請設定環境變數以啟用雲端功能。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-amber-900">
          請在 <code class="bg-white px-1 rounded">.env.local</code> 檔案中設定：
        </p>
        <pre class="mt-2 p-2 bg-white rounded text-xs overflow-x-auto">
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key</pre>
        <p class="mt-2 text-sm text-amber-900">
          詳細說明請參考 <code class="bg-white px-1 rounded">SUPABASE_SETUP.md</code>
        </p>
      </CardContent>
    </Card>

    <!-- 登入表單 -->
    <Card v-if="isConfigured && !isAuthenticated && !authLoading" class="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>管理員登入</CardTitle>
        <CardDescription>請使用 Supabase 帳號登入</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-if="loginError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle class="w-4 h-4" />
          {{ loginError }}
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium flex items-center gap-2">
            <Mail class="w-4 h-4" />
            Email
          </label>
          <Input 
            v-model="loginEmail" 
            type="email" 
            placeholder="admin@example.com"
            @keyup.enter="handleLogin"
          />
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium flex items-center gap-2">
            <Lock class="w-4 h-4" />
            密碼
          </label>
          <Input 
            v-model="loginPassword" 
            type="password" 
            placeholder="••••••••"
            @keyup.enter="handleLogin"
          />
        </div>
        
        <Button @click="handleLogin" class="w-full" :disabled="authLoading">
          <Loader2 v-if="authLoading" class="w-4 h-4 mr-2 animate-spin" />
          登入
        </Button>
      </CardContent>
    </Card>

    <!-- 載入中 -->
    <div v-else-if="authLoading" class="flex justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-emerald-600" />
    </div>

    <!-- 已登入的管理界面 -->
    <template v-else-if="isAuthenticated || !isConfigured">
      <!-- 用戶資訊欄 -->
      <div v-if="isAuthenticated" class="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <div class="flex items-center gap-2 text-emerald-800">
          <Mail class="w-5 h-5" />
          <span class="font-medium">{{ userEmail }}</span>
        </div>
        <Button variant="outline" size="sm" @click="handleLogout">
          <LogOut class="w-4 h-4 mr-2" />
          登出
        </Button>
      </div>

      <!-- 頁籤切換 -->
      <div class="flex gap-2 border-b">
        <button
          @click="activeTab = 'announcements'"
          :class="[
            'px-6 py-3 font-semibold transition-colors',
            activeTab === 'announcements'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          公告管理
        </button>
        <button
          @click="activeTab = 'products'"
          :class="[
            'px-6 py-3 font-semibold transition-colors flex items-center gap-2',
            activeTab === 'products'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          <Package class="w-4 h-4" />
          產品管理
        </button>
      </div>

      <!-- 公告管理 -->
      <div v-show="activeTab === 'announcements'" class="space-y-6">
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
              <Button @click="resetForm" class="gap-2" :disabled="!isAuthenticated && isConfigured">
                <Plus class="w-4 h-4" />
                新增公告
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{{ isEditing ? '編輯公告' : '新增公告' }}</DialogTitle>
                <DialogDescription>
                  {{ isEditing ? '修改現有公告的內容' : '建立新的公告' }}
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
                <Button @click="handleSubmit" :disabled="announcementLoading">
                  <Loader2 v-if="announcementLoading" class="w-4 h-4 mr-2 animate-spin" />
                  {{ isEditing ? '更新' : '新增' }}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" @click="handleExport" class="gap-2">
            <Download class="w-4 h-4" />
            導出
          </Button>

          <Button variant="outline" @click="fileInput?.click()" class="gap-2" :disabled="!isAuthenticated && isConfigured">
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

          <Dialog>
            <DialogTrigger as-child>
              <Button variant="outline" class="gap-2" :disabled="!isAuthenticated && isConfigured">
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
                <Button variant="destructive" @click="handleReset">確認重置</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <!-- 載入中 -->
        <div v-if="announcementLoading" class="flex justify-center py-8">
          <Loader2 class="w-6 h-6 animate-spin text-emerald-600" />
        </div>

        <!-- 公告列表 -->
        <Card v-else>
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
                  <div v-if="isAuthenticated || !isConfigured" class="flex gap-2 shrink-0">
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
                      @click="handleDelete(announcement.id)"
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

      <!-- 產品管理 -->
      <div v-show="activeTab === 'products'" class="space-y-6">
        <!-- 統計卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm font-medium text-gray-600">總產品數</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold">{{ productStats.total }}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm font-medium text-emerald-600">上架中</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold text-emerald-600">{{ productStats.available }}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm font-medium text-gray-600">已下架</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold text-gray-600">{{ productStats.unavailable }}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm font-medium text-blue-600">分類數</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold text-blue-600">{{ productStats.categories }}</div>
            </CardContent>
          </Card>
        </div>

        <!-- 操作按鈕 -->
        <div class="flex flex-wrap gap-3">
          <Dialog v-model:open="isProductFormOpen">
            <DialogTrigger as-child>
              <Button @click="resetProductForm" class="gap-2" :disabled="!isAuthenticated && isConfigured">
                <Plus class="w-4 h-4" />
                新增產品
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{{ isEditingProduct ? '編輯產品' : '新增產品' }}</DialogTitle>
                <DialogDescription>
                  {{ isEditingProduct ? '修改現有產品的資訊' : '建立新的產品' }}
                </DialogDescription>
              </DialogHeader>

              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium">產品名稱 *</label>
                  <Input v-model="productFormData.name" placeholder="例：7-11 商品卡 面額100" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium">分類 *</label>
                    <Input v-model="productFormData.category" placeholder="例：超商卡" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">價格</label>
                    <Input v-model.number="productFormData.price" type="number" placeholder="100" />
                  </div>
                </div>

                <div>
                  <label class="text-sm font-medium">產品圖片</label>
                  <div class="mt-2">
                    <div v-if="imagePreview" class="mb-2">
                      <img :src="imagePreview" alt="預覽" class="w-32 h-32 object-cover rounded-lg" />
                    </div>
                    <Button variant="outline" @click="imageFileInput?.click()" class="gap-2">
                      <ImageIcon class="w-4 h-4" />
                      {{ imagePreview ? '更換圖片' : '上傳圖片' }}
                    </Button>
                    <input
                      ref="imageFileInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleImageUpload"
                    />
                  </div>
                </div>

                <div>
                  <label class="text-sm font-medium">描述</label>
                  <Textarea v-model="productFormData.description" placeholder="產品描述..." rows="3" />
                </div>

                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="productFormData.available"
                    id="available"
                    class="w-4 h-4"
                  />
                  <label for="available" class="text-sm">上架販售</label>
                </div>
              </div>

              <DialogFooter class="gap-2">
                <Button variant="outline" @click="isProductFormOpen = false">取消</Button>
                <Button @click="handleProductSubmit" :disabled="productLoading">
                  <Loader2 v-if="productLoading" class="w-4 h-4 mr-2 animate-spin" />
                  {{ isEditingProduct ? '更新' : '新增' }}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" @click="handleProductExport" class="gap-2">
            <Download class="w-4 h-4" />
            導出
          </Button>

          <Button variant="outline" @click="productFileInput?.click()" class="gap-2" :disabled="!isAuthenticated && isConfigured">
            <Upload class="w-4 h-4" />
            導入
          </Button>
          <input
            ref="productFileInput"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleProductImport"
          />

          <Dialog>
            <DialogTrigger as-child>
              <Button variant="outline" class="gap-2" :disabled="!isAuthenticated && isConfigured">
                <RotateCcw class="w-4 h-4" />
                重置
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>確認重置</DialogTitle>
                <DialogDescription>
                  此操作將恢復到預設產品。請先導出備份。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter class="gap-2">
                <Button variant="outline">取消</Button>
                <Button variant="destructive" @click="handleProductReset">確認重置</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <!-- 載入中 -->
        <div v-if="productLoading" class="flex justify-center py-8">
          <Loader2 class="w-6 h-6 animate-spin text-emerald-600" />
        </div>

        <!-- 產品列表 -->
        <Card v-else>
          <CardHeader>
            <CardTitle>產品列表</CardTitle>
            <CardDescription>管理販售中的產品</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="products.length === 0" class="text-center py-8 text-gray-500">
              還沒有產品，點擊上方「新增產品」按鈕新增。
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="product in products"
                :key="product.id"
                class="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div v-if="product.image_url" class="mb-3">
                  <img :src="product.image_url" :alt="product.name" class="w-full h-32 object-cover rounded-lg" />
                </div>
                <div class="flex items-center justify-between mb-2">
                  <Badge :class="product.available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'">
                    {{ product.available ? '上架中' : '已下架' }}
                  </Badge>
                  <span class="font-bold text-emerald-600">${{ product.price }}</span>
                </div>
                <h3 class="font-semibold text-gray-900">{{ product.name }}</h3>
                <p class="text-sm text-gray-500">{{ product.category }}</p>
                <p v-if="product.description" class="text-sm text-gray-600 mt-1 line-clamp-2">{{ product.description }}</p>
                
                <div v-if="isAuthenticated || !isConfigured" class="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" @click="handleToggleAvailability(product.id)" class="gap-1">
                    <Eye v-if="!product.available" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" @click="startEditProduct(product)" class="gap-1">
                    <Edit2 class="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    @click="handleProductDelete(product.id)"
                    class="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>
  </div>
</template>
