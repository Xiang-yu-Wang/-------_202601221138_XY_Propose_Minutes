<script setup lang="ts">
import { ref } from 'vue'
import { Trash2, Plus, Download, Upload, RotateCcw, Edit2, Image as ImageIcon, Eye, EyeOff, Github } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useProductManager } from '@/composables/useProductManager'
import type { Product } from '@/data/products'

// Props
const props = defineProps<{
  hasToken: boolean
  isSyncing: boolean
}>()

// Emits
const emit = defineEmits<{
  syncToGitHub: []
}>()

// 產品管理
const { 
  products, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  toggleAvailability,
  resetToDefault: resetProductsToDefault,
  exportAsJson: exportProductsAsJson,
  importFromJson: importProductsFromJson,
  imageToBase64,
  stats: productStats
} = useProductManager()

// 表單狀態
const isProductFormOpen = ref(false)
const isEditingProduct = ref(false)
const editingProductId = ref<number | null>(null)
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

// 重置產品表單
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

// 打開產品編輯
const startEditProduct = (product: Product) => {
  productFormData.value = {
    name: product.name,
    category: product.category,
    price: product.price,
    image_url: product.image_url,
    description: product.description,
    available: product.available
  }
  imagePreview.value = product.image_url
  editingProductId.value = product.id
  isEditingProduct.value = true
  isProductFormOpen.value = true
}

// 處理圖片上傳
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const base64 = await imageToBase64(file)
    productFormData.value.image_url = base64
    imagePreview.value = base64
  } catch (error) {
    alert(error instanceof Error ? error.message : '圖片上傳失敗')
  }
}

// 提交產品表單
const handleProductSubmit = () => {
  if (!productFormData.value.name || !productFormData.value.category || !productFormData.value.image_url) {
    alert('請填寫產品名稱、分類和上傳圖片')
    return
  }

  const productData = {
    name: productFormData.value.name,
    category: productFormData.value.category,
    price: Number(productFormData.value.price),
    image_url: productFormData.value.image_url,
    description: productFormData.value.description,
    available: productFormData.value.available
  }

  if (isEditingProduct.value && editingProductId.value) {
    updateProduct(editingProductId.value, productData)
  } else {
    addProduct(productData)
  }

  resetProductForm()
  isProductFormOpen.value = false
}

// 導出產品
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

// 導入產品
const handleProductImport = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = (e.target?.result as string) || ''
    if (importProductsFromJson(content)) {
      alert('導入成功！')
    } else {
      alert('導入失敗，請檢查 JSON 格式')
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="space-y-6">
    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
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
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-purple-600">總價值</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-purple-600">${{ productStats.totalValue }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- 操作按鈕 -->
    <div class="flex flex-wrap gap-3">
      <Dialog v-model:open="isProductFormOpen">
        <DialogTrigger as-child>
          <Button @click="resetProductForm" class="gap-2">
            <Plus class="w-4 h-4" />
            新增產品
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{{ isEditingProduct ? '編輯產品' : '新增產品' }}</DialogTitle>
            <DialogDescription>
              {{ isEditingProduct ? '修改產品資訊與圖片' : '建立新產品，圖片大小限制 500KB' }}
            </DialogDescription>
          </DialogHeader>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium">產品名稱 *</label>
              <Input v-model="productFormData.name" placeholder="例：高級禮盒組合" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium">分類 *</label>
                <Input v-model="productFormData.category" placeholder="例：禮品盒" />
              </div>
              <div>
                <label class="text-sm font-medium">價格 (元) *</label>
                <Input v-model.number="productFormData.price" type="number" placeholder="450" />
              </div>
            </div>

            <div>
              <label class="text-sm font-medium">產品描述 *</label>
              <Textarea v-model="productFormData.description" placeholder="詳細描述產品特色..." rows="3" />
            </div>

            <div>
              <label class="text-sm font-medium flex items-center gap-2 mb-2">
                <ImageIcon class="w-4 h-4" />
                產品圖片 * (限制 500KB)
              </label>
              <div class="space-y-3">
                <Button variant="outline" @click="imageFileInput?.click()" type="button" class="w-full">
                  <Upload class="w-4 h-4 mr-2" />
                  選擇圖片
                </Button>
                <input
                  ref="imageFileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageUpload"
                />
                <div v-if="imagePreview" class="border rounded-lg p-4 bg-gray-50">
                  <img :src="imagePreview" alt="預覽" class="w-full h-48 object-cover rounded" />
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                v-model="productFormData.available"
                id="available"
                class="w-4 h-4 text-emerald-600"
              />
              <label for="available" class="text-sm font-medium cursor-pointer">
                立即上架販售
              </label>
            </div>
          </div>

          <DialogFooter class="gap-2">
            <Button variant="outline" @click="isProductFormOpen = false">取消</Button>
            <Button @click="handleProductSubmit">{{ isEditingProduct ? '更新' : '新增' }}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="outline" @click="handleProductExport" class="gap-2">
        <Download class="w-4 h-4" />
        導出
      </Button>

      <Button variant="outline" @click="productFileInput?.click()" class="gap-2">
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
              此操作將恢復到預設產品列表。請先導出備份。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter class="gap-2">
            <Button variant="outline">取消</Button>
            <Button variant="destructive" @click="resetProductsToDefault">確認重置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <!-- 產品列表 -->
    <Card>
      <CardHeader>
        <CardTitle>產品列表</CardTitle>
        <CardDescription>管理販售中的產品，點擊編輯或切換上架狀態</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="products.length === 0" class="text-center py-8 text-gray-500">
          還沒有產品，點擊上方「新增產品」按鈕新增。
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="product in products"
            :key="product.id"
            class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <!-- 產品圖片 -->
            <div class="relative h-48 bg-gray-200">
              <img :src="product.image_url" :alt="product.name" class="w-full h-full object-cover" />
              <Badge
                :class="[
                  'absolute top-3 right-3',
                  product.available ? 'bg-emerald-500' : 'bg-gray-500'
                ]"
              >
                {{ product.available ? '上架中' : '已下架' }}
              </Badge>
            </div>

            <!-- 產品資訊 -->
            <div class="p-4 space-y-3">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-emerald-600 font-medium">{{ product.category }}</span>
                  <span class="text-xl font-bold text-emerald-700">${{ product.price }}</span>
                </div>
                <h3 class="font-bold text-gray-900">{{ product.name }}</h3>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ product.description }}</p>
              </div>

              <!-- 操作按鈕 -->
              <div class="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  @click="startEditProduct(product)"
                  class="gap-1 flex-1"
                >
                  <Edit2 class="w-3 h-3" />
                  編輯
                </Button>
                <Button
                  size="sm"
                  :variant="product.available ? 'outline' : 'default'"
                  @click="toggleAvailability(product.id)"
                  class="gap-1 flex-1"
                >
                  <component :is="product.available ? EyeOff : Eye" class="w-3 h-3" />
                  {{ product.available ? '下架' : '上架' }}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  @click="deleteProduct(product.id)"
                  class="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 class="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
