<script setup lang="ts">
import { ref } from 'vue'
import { Lock, AlertTriangle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import AdminPanel from '@/components/AdminPanel.vue'
import { useTitle } from '@vueuse/core'

useTitle('公告管理後台 - 大倉代領股東紀念品')

// 簡單的密碼保護
const password = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
const isAuthenticated = ref(false)
const inputPassword = ref('')

const handleLogin = () => {
  if (inputPassword.value === password) {
    isAuthenticated.value = true
    inputPassword.value = ''
  } else {
    alert('密碼錯誤！')
    inputPassword.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 標題 -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">公告管理後台</h1>
        <p class="text-gray-600">簡易的公告編輯工具，編輯內容即時同步到網站</p>
      </div>

      <!-- 警告提示 -->
      <div class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
        <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div class="text-sm text-amber-800">
          <strong>提示：</strong>本頁面的編輯內容使用瀏覽器本地儲存，僅在此設備上保存。建議定期使用「導出」功能備份數據。
        </div>
      </div>

      <!-- 登入表單 -->
      <div v-if="!isAuthenticated" class="max-w-md mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="flex items-center justify-center mb-6">
            <Lock class="w-8 h-8 text-slate-600" />
          </div>
          <h2 class="text-2xl font-bold text-center text-gray-900 mb-6">登入管理後台</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">密碼</label>
              <input
                v-model="inputPassword"
                type="password"
                placeholder="請輸入密碼"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                @keyup.enter="handleLogin"
              />
            </div>
            <Button @click="handleLogin" class="w-full">登入</Button>
          </div>
        </div>
      </div>

      <!-- 管理面板 -->
      <div v-else class="bg-white rounded-lg shadow-lg p-8">
        <AdminPanel />
      </div>
    </div>
  </div>
</template>
