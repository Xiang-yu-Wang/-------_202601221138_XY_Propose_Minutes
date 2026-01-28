<template>
  <footer class="bg-gray-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div>
          <h3 class="text-2xl font-bold mb-4">大倉代領股東紀念品</h3>
          <p class="text-gray-400">
            專業的股東紀念品代領服務，讓您輕鬆享受股東權益
          </p>
        </div>

        <!-- Main links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">主要服務</h4>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/" class="text-gray-400 hover:text-white transition-colors">首頁</RouterLink>
            </li>
            <li>
              <RouterLink to="/services" class="text-gray-400 hover:text-white transition-colors">服務介紹</RouterLink>
            </li>
            <li>
              <RouterLink to="/plans" class="text-gray-400 hover:text-white transition-colors">方案說明</RouterLink>
            </li>
            <li>
              <RouterLink to="/products" class="text-gray-400 hover:text-white transition-colors">商品</RouterLink>
            </li>
          </ul>
        </div>

        <!-- More info links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">更多資訊</h4>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/gallery" class="text-gray-400 hover:text-white transition-colors">交貨實績</RouterLink>
            </li>
            <li>
              <RouterLink to="/announcements" class="text-gray-400 hover:text-white transition-colors">公告</RouterLink>
            </li>
            <li>
              <RouterLink to="/admin" class="text-gray-400 hover:text-white transition-colors">管理後台</RouterLink>
            </li>
            <li>
              <RouterLink to="/recruitment" class="text-gray-400 hover:text-white transition-colors">招募</RouterLink>
            </li>
            <li>
              <RouterLink to="/community" class="text-gray-400 hover:text-white transition-colors">社群</RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact info -->
        <div>
          <h4 class="text-lg font-semibold mb-4">聯絡資訊</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li>📞 電話：0982-571-134（贊哥）</li>
            <li>💬 LINE：@792nvftc</li>
            <li>📧 Email：playegg903@gmail.com</li>
            <li>📍 地址：板橋區民治街71巷58號1樓</li>
          </ul>
        </div>
      </div>

      <!-- Social links -->
      <div class="flex justify-center gap-4 mb-8">
        <a 
          href="https://www.facebook.com/groups/call0982571134"
          target="_blank"
          class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a 
          href="https://line.me/R/ti/p/@792nvftc"
          target="_blank"
          class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
        </a>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-800 pt-8 text-center">
        <p class="text-gray-400 flex items-center justify-center gap-1">
          © {{ new Date().getFullYear() }} 大倉代領股東紀念品.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
