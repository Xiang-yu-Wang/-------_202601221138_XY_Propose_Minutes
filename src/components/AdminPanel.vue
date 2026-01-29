<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Package, Github, Key, Megaphone, Image } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAnnouncementManager } from '@/composables/useAnnouncementManager'
import { useProductManager } from '@/composables/useProductManager'
import { useGitHubSync } from '@/composables/useGitHubSync'
import AdminAnnouncementsTab from '@/components/admin/AdminAnnouncementsTab.vue'
import AdminProductsTab from '@/components/admin/AdminProductsTab.vue'
import AdminDeliveryPhotosTab from '@/components/admin/AdminDeliveryPhotosTab.vue'

// 公告管理 (只取 announcements 給 GitHub 同步用)
const { announcements } = useAnnouncementManager()

// 產品管理 (只取 products 給 GitHub 同步用)
const { products } = useProductManager()

// GitHub 同步
const { token, loadToken, saveToken, clearToken, syncAnnouncementsToGitHub, syncProductsToGitHub } = useGitHubSync()
const isTokenDialogOpen = ref(false)
const tokenInput = ref('')
const isSyncing = ref(false)

onMounted(() => {
  loadToken()
})

// GitHub Token 設定
const handleSaveToken = () => {
  if (tokenInput.value.trim()) {
    saveToken(tokenInput.value.trim())
    tokenInput.value = ''
    isTokenDialogOpen.value = false
    alert('GitHub Token 已儲存')
  }
}

// 同步公告到 GitHub
const handleSyncAnnouncements = async () => {
  if (!token.value) {
    alert('請先設定 GitHub Token')
    isTokenDialogOpen.value = true
    return
  }

  if (!confirm('確定要同步公告到 GitHub？這將更新遠端倉庫的檔案。')) {
    return
  }

  isSyncing.value = true
  try {
    await syncAnnouncementsToGitHub(announcements.value)
    alert('公告已同步到 GitHub！\n\n請等待 GitHub Actions 自動部署完成（約 1-2 分鐘）。')
  } catch (error) {
    alert('同步失敗：' + (error instanceof Error ? error.message : String(error)))
  } finally {
    isSyncing.value = false
  }
}

// 同步產品到 GitHub
const handleSyncProducts = async () => {
  if (!token.value) {
    alert('請先設定 GitHub Token')
    isTokenDialogOpen.value = true
    return
  }

  if (!confirm('確定要同步產品到 GitHub？這將更新遠端倉庫的檔案。')) {
    return
  }

  isSyncing.value = true
  try {
    await syncProductsToGitHub(products.value)
    alert('產品已同步到 GitHub！\n\n請等待 GitHub Actions 自動部署完成（約 1-2 分鐘）。')
  } catch (error) {
    alert('同步失敗：' + (error instanceof Error ? error.message : String(error)))
  } finally {
    isSyncing.value = false
  }
}

// 頁籤管理
const activeTab = ref<'announcements' | 'products' | 'deliveryPhotos'>('announcements')
</script>

<template>
  <div class="space-y-6">
    <!-- GitHub Token 設定 -->
    <Card v-if="!token" class="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-amber-900">
          <Key class="w-5 h-5" />
          首次使用：設定 GitHub Token
        </CardTitle>
        <CardDescription class="text-amber-800">
          為了將編輯的內容同步到 GitHub，需要設定 Personal Access Token。
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="text-sm text-amber-900 space-y-2">
          <p class="font-semibold">取得 Token 步驟：</p>
          <ol class="list-decimal list-inside space-y-1">
            <li>前往 <a href="https://github.com/settings/tokens" target="_blank" class="underline">GitHub Settings → Personal access tokens</a></li>
            <li>點擊「Generate new token (classic)」</li>
            <li>勾選 <code class="bg-white px-1 rounded">repo</code> 權限</li>
            <li>產生並複製 Token</li>
          </ol>
        </div>
        <div class="flex gap-2">
          <Input
            v-model="tokenInput"
            type="password"
            placeholder="貼上 GitHub Token (ghp_...)"
            class="flex-1"
          />
          <Button @click="handleSaveToken" :disabled="!tokenInput.trim()">
            儲存
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Token 已設定提示 -->
    <div v-else class="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
      <div class="flex items-center gap-2 text-emerald-800">
        <Github class="w-5 h-5" />
        <span class="font-medium">GitHub 同步已啟用</span>
      </div>
      <Dialog v-model:open="isTokenDialogOpen">
        <DialogTrigger as-child>
          <Button variant="outline" size="sm">更換 Token</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>更換 GitHub Token</DialogTitle>
            <DialogDescription>
              輸入新的 Personal Access Token
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-4">
            <Input
              v-model="tokenInput"
              type="password"
              placeholder="貼上新的 GitHub Token"
            />
          </div>
          <DialogFooter class="gap-2">
            <Button variant="outline" @click="isTokenDialogOpen = false">取消</Button>
            <Button variant="destructive" @click="clearToken(); isTokenDialogOpen = false">清除 Token</Button>
            <Button @click="handleSaveToken">儲存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <!-- 頁籤切換 -->
    <div class="flex gap-2 border-b">
      <button
        @click="activeTab = 'announcements'"
        :class="[
          'px-6 py-3 font-semibold transition-colors flex items-center gap-2',
          activeTab === 'announcements'
            ? 'border-b-2 border-emerald-600 text-emerald-600'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        <Megaphone class="w-4 h-4" />
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
      <button
        @click="activeTab = 'deliveryPhotos'"
        :class="[
          'px-6 py-3 font-semibold transition-colors flex items-center gap-2',
          activeTab === 'deliveryPhotos'
            ? 'border-b-2 border-emerald-600 text-emerald-600'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        <Image class="w-4 h-4" />
        交貨照管理
      </button>
    </div>

    <!-- 公告管理 -->
    <AdminAnnouncementsTab 
      v-show="activeTab === 'announcements'" 
      :has-token="!!token"
      :is-syncing="isSyncing"
      @sync-to-git-hub="handleSyncAnnouncements"
    />

    <!-- 產品管理 -->
    <AdminProductsTab 
      v-show="activeTab === 'products'" 
      :has-token="!!token"
      :is-syncing="isSyncing"
      @sync-to-git-hub="handleSyncProducts"
    />

    <!-- 交貨照管理 -->
    <AdminDeliveryPhotosTab 
      v-show="activeTab === 'deliveryPhotos'" 
      :has-token="!!token"
      :is-syncing="isSyncing"
    />
  </div>
</template>
