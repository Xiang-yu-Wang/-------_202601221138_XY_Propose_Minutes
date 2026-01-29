<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  Trash2, Plus, Download, Upload, RotateCcw, Edit2, 
  Image as ImageIcon, Package, Eye, EyeOff, LogOut, 
  Mail, Lock, AlertCircle, Loader2, Megaphone, 
  BarChart3, CheckCircle, XCircle, Tag, Shield,
  Database, Cloud, HardDrive
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// ...existing code...
// 刪除未使用的 import
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// ...existing code...
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
const showPassword = ref(false)

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

  // 預覽
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // 上傳
  const url = await uploadImage(file)
  if (url) {
    productFormData.value.image_url = url
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
    price: productFormData.value.price || 0,
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
  await toggleAvailability(id)
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

// 工具函數
const getTypeColor = (type: string) => {
  switch (type) {
    case 'important':
      return 'bg-red-100 text-red-700 border-red-200'
    case 'new':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    default:
      return 'bg-blue-100 text-blue-700 border-blue-200'
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
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
    <!-- 頂部標題列 -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900">管理後台</h1>
              <p class="text-sm text-slate-500">大倉代領股東紀念品</p>
            </div>
          </div>
          
          <!-- 儲存模式指示 -->
          <div class="flex items-center gap-3">
            <div v-if="isConfigured" class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm">
              <Cloud class="w-4 h-4" />
              <span class="hidden sm:inline">雲端模式</span>
            </div>
            <div v-else class="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm">
              <HardDrive class="w-4 h-4" />
              <span class="hidden sm:inline">本地模式</span>
            </div>
            
            <!-- 用戶狀態 -->
            <div v-if="isAuthenticated" class="flex items-center gap-2">
              <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm text-slate-600">
                <Mail class="w-4 h-4" />
                {{ userEmail }}
              </div>
              <Button variant="ghost" size="sm" @click="handleLogout" class="text-slate-600 hover:text-red-600">
                <LogOut class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Supabase 未配置提示 -->
      <div v-if="!isConfigured" class="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <Database class="w-5 h-5 text-amber-600" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-amber-900">Supabase 尚未配置</h3>
            <p class="text-sm text-amber-700 mt-1">目前使用本地儲存模式，資料僅存於此瀏覽器。</p>
            <div class="mt-3 p-3 bg-white/60 rounded-xl">
              <code class="text-xs text-amber-800 font-mono">
                VITE_SUPABASE_URL=your_url<br/>
                VITE_SUPABASE_ANON_KEY=your_key
              </code>
            </div>
          </div>
        </div>
      </div>

      <!-- 登入表單 -->
      <div v-if="isConfigured && !isAuthenticated && !authLoading" class="flex items-center justify-center min-h-[60vh]">
        <div class="w-full max-w-md">
          <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
            <!-- 登入頭部 -->
            <div class="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 px-8 py-10 text-center">
              <div class="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield class="w-8 h-8 text-white" />
              </div>
              <h2 class="text-2xl font-bold text-white">歡迎回來</h2>
              <p class="text-emerald-100 mt-2">請登入管理後台</p>
            </div>
            
            <!-- 登入表單 -->
            <div class="p-8">
              <div v-if="loginError" class="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <AlertCircle class="w-5 h-5 shrink-0" />
                {{ loginError }}
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">電子郵件</label>
                  <div class="relative">
                    <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input 
                      v-model="loginEmail" 
                      type="email" 
                      placeholder="admin@example.com"
                      class="pl-10 h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      @keyup.enter="handleLogin"
                    />
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">密碼</label>
                  <div class="relative">
                    <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input 
                      v-model="loginPassword" 
                      :type="showPassword ? 'text' : 'password'" 
                      placeholder="••••••••"
                      class="pl-10 pr-10 h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      @keyup.enter="handleLogin"
                    />
                    <button 
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <Eye v-if="!showPassword" class="w-5 h-5" />
                      <EyeOff v-else class="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <Button 
                  @click="handleLogin" 
                  class="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25"
                  :disabled="authLoading"
                >
                  <Loader2 v-if="authLoading" class="w-5 h-5 mr-2 animate-spin" />
                  登入管理後台
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 載入中 -->
      <div v-else-if="authLoading" class="flex flex-col items-center justify-center py-20">
        <Loader2 class="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p class="text-slate-500">載入中...</p>
      </div>

      <!-- 已登入的管理界面 -->
      <template v-else-if="isAuthenticated || !isConfigured">
        <!-- 頁籤切換 -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5 mb-6 inline-flex">
          <button
            @click="activeTab = 'announcements'"
            :class="[
              'px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2',
              activeTab === 'announcements'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-600 hover:bg-slate-100'
            ]"
          >
            <Megaphone class="w-4 h-4" />
            公告管理
          </button>
          <button
            @click="activeTab = 'products'"
            :class="[
              'px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2',
              activeTab === 'products'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-600 hover:bg-slate-100'
            ]"
          >
            <Package class="w-4 h-4" />
            產品管理
          </button>
        </div>

        <!-- 公告管理 -->
        <div v-show="activeTab === 'announcements'" class="space-y-6">
          <!-- 統計卡片 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <BarChart3 class="w-5 h-5 text-slate-600" />
                </div>
              </div>
              <p class="text-3xl font-bold text-slate-900">{{ stats.total }}</p>
              <p class="text-sm text-slate-500 mt-1">總公告數</p>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <AlertCircle class="w-5 h-5 text-red-500" />
                </div>
              </div>
              <p class="text-3xl font-bold text-red-600">{{ stats.important }}</p>
              <p class="text-sm text-slate-500 mt-1">重要公告</p>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <CheckCircle class="w-5 h-5 text-emerald-500" />
                </div>
              </div>
              <p class="text-3xl font-bold text-emerald-600">{{ stats.new }}</p>
              <p class="text-sm text-slate-500 mt-1">新消息</p>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Megaphone class="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p class="text-3xl font-bold text-blue-600">{{ stats.info }}</p>
              <p class="text-sm text-slate-500 mt-1">一般公告</p>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex flex-wrap gap-3">
            <Dialog v-model:open="isFormOpen">
              <DialogTrigger as-child>
                <Button 
                  @click="resetForm" 
                  class="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 rounded-xl" 
                  :disabled="!isAuthenticated && isConfigured"
                >
                  <Plus class="w-4 h-4" />
                  新增公告
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[600px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle class="text-xl">{{ isEditing ? '編輯公告' : '新增公告' }}</DialogTitle>
                  <DialogDescription>
                    {{ isEditing ? '修改現有公告的內容' : '建立新的公告' }}
                  </DialogDescription>
                </DialogHeader>

                <div class="space-y-4 py-4">
                  <div>
                    <label class="text-sm font-medium text-slate-700">標題 *</label>
                    <Input v-model="formData.title" placeholder="例：春節服務公告" class="mt-1.5 rounded-xl" />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-sm font-medium text-slate-700">日期 *</label>
                      <Input v-model="formData.date" type="date" class="mt-1.5 rounded-xl" />
                    </div>
                    <div>
                      <label class="text-sm font-medium text-slate-700">類型 *</label>
                      <select v-model="formData.type" class="mt-1.5 w-full h-10 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                        <option value="important">🔴 重要</option>
                        <option value="new">🟢 新消息</option>
                        <option value="info">🔵 一般資訊</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="text-sm font-medium text-slate-700">標籤 (用逗號分隔)</label>
                    <Input v-model="formData.tags" placeholder="例：服務, 時程, 重要" class="mt-1.5 rounded-xl" />
                  </div>

                  <div>
                    <label class="text-sm font-medium text-slate-700">內容 *</label>
                    <Textarea v-model="formData.content" placeholder="詳細的公告內容..." rows="6" class="mt-1.5 rounded-xl" />
                  </div>
                </div>

                <DialogFooter class="gap-2">
                  <Button variant="outline" @click="isFormOpen = false" class="rounded-xl">取消</Button>
                  <Button @click="handleSubmit" :disabled="announcementLoading" class="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600">
                    <Loader2 v-if="announcementLoading" class="w-4 h-4 mr-2 animate-spin" />
                    {{ isEditing ? '更新' : '新增' }}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" @click="handleExport" class="gap-2 rounded-xl">
              <Download class="w-4 h-4" />
              導出
            </Button>

            <Button variant="outline" @click="fileInput?.click()" class="gap-2 rounded-xl" :disabled="!isAuthenticated && isConfigured">
              <Upload class="w-4 h-4" />
              導入
            </Button>
            <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleImport" />

            <Dialog>
              <DialogTrigger as-child>
                <Button variant="outline" class="gap-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50" :disabled="!isAuthenticated && isConfigured">
                  <RotateCcw class="w-4 h-4" />
                  重置
                </Button>
              </DialogTrigger>
              <DialogContent class="rounded-2xl">
                <DialogHeader>
                  <DialogTitle>確認重置</DialogTitle>
                  <DialogDescription>
                    此操作將清除所有公告並恢復預設值。建議先導出備份。
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter class="gap-2">
                  <Button variant="outline" class="rounded-xl">取消</Button>
                  <Button variant="destructive" @click="handleReset" class="rounded-xl">確認重置</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <!-- 載入中 -->
          <div v-if="announcementLoading" class="flex justify-center py-12">
            <Loader2 class="w-8 h-8 animate-spin text-emerald-600" />
          </div>

          <!-- 公告列表 -->
          <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-5 border-b border-slate-100">
              <h3 class="font-semibold text-slate-900">公告列表</h3>
              <p class="text-sm text-slate-500 mt-1">共 {{ announcements.length }} 則公告</p>
            </div>
            
            <div v-if="announcements.length === 0" class="p-12 text-center">
              <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Megaphone class="w-8 h-8 text-slate-400" />
              </div>
              <p class="text-slate-500">還沒有公告</p>
              <p class="text-sm text-slate-400 mt-1">點擊上方「新增公告」開始</p>
            </div>

            <div v-else class="divide-y divide-slate-100">
              <div
                v-for="announcement in announcements"
                :key="announcement.id"
                class="p-5 hover:bg-slate-50/50 transition-colors group"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <Badge :class="[getTypeColor(announcement.type), 'rounded-lg px-2.5 py-0.5 text-xs font-medium']">
                        {{ getTypeLabel(announcement.type) }}
                      </Badge>
                      <span class="text-sm text-slate-400">{{ announcement.date }}</span>
                    </div>
                    <h4 class="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{{ announcement.title }}</h4>
                    <p class="text-sm text-slate-600 mt-2 line-clamp-2">{{ announcement.content }}</p>
                    <div v-if="announcement.tags && announcement.tags.length > 0" class="flex flex-wrap gap-1.5 mt-3">
                      <span v-for="tag in announcement.tags" :key="tag" class="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                        <Tag class="w-3 h-3" />
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  <div v-if="isAuthenticated || !isConfigured" class="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" @click="startEdit(announcement)" class="gap-1.5 rounded-lg">
                      <Edit2 class="w-4 h-4" />
                      <span class="hidden sm:inline">編輯</span>
                    </Button>
                    <Button size="sm" variant="outline" @click="handleDelete(announcement.id)" class="gap-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200">
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 產品管理 -->
        <div v-show="activeTab === 'products'" class="space-y-6">
          <!-- 統計卡片 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Package class="w-5 h-5 text-slate-600" />
                </div>
              </div>
              <p class="text-3xl font-bold text-slate-900">{{ productStats.total }}</p>
              <p class="text-sm text-slate-500 mt-1">總產品數</p>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <CheckCircle class="w-5 h-5 text-emerald-500" />
                </div>
              </div>
              <p class="text-3xl font-bold text-emerald-600">{{ productStats.available }}</p>
              <p class="text-sm text-slate-500 mt-1">上架中</p>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <XCircle class="w-5 h-5 text-slate-400" />
                </div>
              </div>
              <p class="text-3xl font-bold text-slate-400">{{ productStats.unavailable }}</p>
              <p class="text-sm text-slate-500 mt-1">已下架</p>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Tag class="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p class="text-3xl font-bold text-blue-600">{{ productStats.categories }}</p>
              <p class="text-sm text-slate-500 mt-1">分類數</p>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex flex-wrap gap-3">
            <Dialog v-model:open="isProductFormOpen">
              <DialogTrigger as-child>
                <Button 
                  @click="resetProductForm" 
                  class="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 rounded-xl" 
                  :disabled="!isAuthenticated && isConfigured"
                >
                  <Plus class="w-4 h-4" />
                  新增產品
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[600px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle class="text-xl">{{ isEditingProduct ? '編輯產品' : '新增產品' }}</DialogTitle>
                  <DialogDescription>
                    {{ isEditingProduct ? '修改現有產品的資訊' : '建立新的產品' }}
                  </DialogDescription>
                </DialogHeader>

                <div class="space-y-4 py-4">
                  <div>
                    <label class="text-sm font-medium text-slate-700">產品名稱 *</label>
                    <Input v-model="productFormData.name" placeholder="例：7-11 商品卡 面額100" class="mt-1.5 rounded-xl" />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-sm font-medium text-slate-700">分類 *</label>
                      <Input v-model="productFormData.category" placeholder="例：超商卡" class="mt-1.5 rounded-xl" />
                    </div>
                    <div>
                      <label class="text-sm font-medium text-slate-700">價格</label>
                      <Input v-model.number="productFormData.price" type="number" placeholder="100" class="mt-1.5 rounded-xl" />
                    </div>
                  </div>

                  <div>
                    <label class="text-sm font-medium text-slate-700">產品圖片</label>
                    <div class="mt-2">
                      <div v-if="imagePreview" class="mb-3 relative inline-block">
                        <img :src="imagePreview" alt="預覽" class="w-32 h-32 object-cover rounded-xl border border-slate-200" />
                      </div>
                      <Button variant="outline" @click="imageFileInput?.click()" class="gap-2 rounded-xl">
                        <ImageIcon class="w-4 h-4" />
                        {{ imagePreview ? '更換圖片' : '上傳圖片' }}
                      </Button>
                      <input ref="imageFileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
                    </div>
                  </div>

                  <div>
                    <label class="text-sm font-medium text-slate-700">描述</label>
                    <Textarea v-model="productFormData.description" placeholder="產品描述..." rows="3" class="mt-1.5 rounded-xl" />
                  </div>

                  <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <input type="checkbox" v-model="productFormData.available" id="available" class="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    <label for="available" class="text-sm font-medium text-slate-700">上架販售</label>
                  </div>
                </div>

                <DialogFooter class="gap-2">
                  <Button variant="outline" @click="isProductFormOpen = false" class="rounded-xl">取消</Button>
                  <Button @click="handleProductSubmit" :disabled="productLoading" class="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600">
                    <Loader2 v-if="productLoading" class="w-4 h-4 mr-2 animate-spin" />
                    {{ isEditingProduct ? '更新' : '新增' }}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" @click="handleProductExport" class="gap-2 rounded-xl">
              <Download class="w-4 h-4" />
              導出
            </Button>

            <Button variant="outline" @click="productFileInput?.click()" class="gap-2 rounded-xl" :disabled="!isAuthenticated && isConfigured">
              <Upload class="w-4 h-4" />
              導入
            </Button>
            <input ref="productFileInput" type="file" accept=".json" class="hidden" @change="handleProductImport" />

            <Dialog>
              <DialogTrigger as-child>
                <Button variant="outline" class="gap-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50" :disabled="!isAuthenticated && isConfigured">
                  <RotateCcw class="w-4 h-4" />
                  重置
                </Button>
              </DialogTrigger>
              <DialogContent class="rounded-2xl">
                <DialogHeader>
                  <DialogTitle>確認重置</DialogTitle>
                  <DialogDescription>
                    此操作將清除所有產品並恢復預設值。建議先導出備份。
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter class="gap-2">
                  <Button variant="outline" class="rounded-xl">取消</Button>
                  <Button variant="destructive" @click="handleProductReset" class="rounded-xl">確認重置</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <!-- 載入中 -->
          <div v-if="productLoading" class="flex justify-center py-12">
            <Loader2 class="w-8 h-8 animate-spin text-emerald-600" />
          </div>

          <!-- 產品列表 -->
          <div v-else>
            <div v-if="products.length === 0" class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package class="w-8 h-8 text-slate-400" />
              </div>
              <p class="text-slate-500">還沒有產品</p>
              <p class="text-sm text-slate-400 mt-1">點擊上方「新增產品」開始</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div
                v-for="product in products"
                :key="product.id"
                class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
              >
                <div v-if="product.image_url" class="aspect-square bg-slate-100 overflow-hidden">
                  <img :src="product.image_url" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div v-else class="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                  <Package class="w-12 h-12 text-slate-300" />
                </div>
                
                <div class="p-4">
                  <div class="flex items-center justify-between mb-2">
                    <Badge :class="[product.available ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500', 'rounded-lg text-xs']">
                      {{ product.available ? '上架中' : '已下架' }}
                    </Badge>
                    <span class="font-bold text-emerald-600">${{ product.price }}</span>
                  </div>
                  <h4 class="font-semibold text-slate-900 line-clamp-1">{{ product.name }}</h4>
                  <p class="text-sm text-slate-500 mt-0.5">{{ product.category }}</p>
                  <p v-if="product.description" class="text-sm text-slate-600 mt-2 line-clamp-2">{{ product.description }}</p>
                  
                  <div v-if="isAuthenticated || !isConfigured" class="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                    <Button size="sm" variant="outline" @click="handleToggleAvailability(product.id)" class="flex-1 gap-1.5 rounded-lg">
                      <Eye v-if="!product.available" class="w-4 h-4" />
                      <EyeOff v-else class="w-4 h-4" />
                      {{ product.available ? '下架' : '上架' }}
                    </Button>
                    <Button size="sm" variant="outline" @click="startEditProduct(product)" class="rounded-lg">
                      <Edit2 class="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" @click="handleProductDelete(product.id)" class="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200">
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
