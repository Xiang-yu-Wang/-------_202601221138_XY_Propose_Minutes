<script setup lang="ts">
import { ShoppingBag, Plus, Minus } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useProductManager } from '@/composables/useProductManager'
import { useCart } from '@/composables/useCart'

const { products } = useProductManager()
const { cart, addToCart, removeFromCart, getCartCount, getTotalPrice } = useCart()
</script>

<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 text-emerald-700 font-semibold">
          <ShoppingBag class="w-6 h-6" />
          商品區
        </div>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">精選禮品與伴手禮</h2>
        <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
          嚴選優質商品，為您的股東紀念品代領服務增添特色選項。
        </p>
      </div>

      <!-- Products grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card v-for="product in products" :key="product.id" class="overflow-hidden hover:shadow-lg transition-shadow">
          <!-- Product image -->
          <div class="relative w-full h-48 overflow-hidden bg-gray-200">
            <img
              :src="product.image"
              :alt="product.name"
              loading="lazy"
              class="w-full h-full object-cover hover:scale-105 transition-transform"
            />
            <!-- Stock badge -->
            <div class="absolute top-3 right-3">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  product.available
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-200 text-gray-600'
                ]"
              >
                {{ product.available ? '現貨' : '缺貨' }}
              </span>
            </div>
          </div>

          <!-- Product info -->
          <CardHeader>
            <div>
              <span class="text-sm text-emerald-600 font-medium">{{ product.category }}</span>
              <CardTitle class="text-lg font-bold text-gray-900 mt-1">{{ product.name }}</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <p class="text-gray-600 text-sm leading-relaxed">{{ product.description }}</p>
          </CardContent>

          <CardFooter class="bg-gray-50 border-t flex flex-col gap-4">
            <!-- Price -->
            <div class="w-full">
              <p class="text-2xl font-bold text-emerald-700">$ {{ product.price }}</p>
              <p class="text-xs text-gray-500 mt-1">單位：元</p>
            </div>

            <!-- Cart controls -->
            <div v-if="product.available" class="w-full flex items-center gap-2">
              <Button
                @click="removeFromCart(product.id)"
                :disabled="getCartCount(product.id) === 0"
                variant="outline"
                size="icon"
                class="h-8 w-8"
              >
                <Minus class="w-4 h-4" />
              </Button>
              <span class="flex-1 text-center font-semibold text-gray-900">{{ getCartCount(product.id) }}</span>
              <Button
                @click="addToCart(product.id)"
                variant="default"
                size="icon"
                class="h-8 w-8 bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus class="w-4 h-4" />
              </Button>
            </div>

            <!-- Out of stock button -->
            <Button v-else disabled class="w-full" variant="outline">
              缺貨
            </Button>
          </CardFooter>
        </Card>
      </div>

      <!-- Cart summary -->
      <div v-if="Object.keys(cart).length > 0" class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 max-w-md mx-auto">
        <h3 class="font-bold text-lg text-gray-900 mb-4">購物車小計</h3>
        <div class="space-y-2 mb-4 max-h-40 overflow-y-auto">
          <div v-for="[productIdStr, count] in Object.entries(cart)" :key="productIdStr" class="flex justify-between text-sm text-gray-600">
            <span>{{ products.find(p => p.id === parseInt(productIdStr))?.name }} x {{ count }}</span>
            <span>$ {{ (products.find(p => p.id === parseInt(productIdStr))?.price || 0) * count }}</span>
          </div>
        </div>
        <div class="border-t pt-4">
          <div class="flex justify-between items-center mb-4">
            <span class="font-bold text-lg text-gray-900">合計：</span>
            <span class="text-2xl font-bold text-emerald-700">$ {{ getTotalPrice() }}</span>
          </div>
          <p class="text-sm text-gray-600 mb-4">
            若要購買，請聯絡 LINE：<span class="font-semibold">@792nvftc</span> 或電話 <span class="font-semibold">0982-571-134</span>
          </p>
          <Button
            as-child
            class="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <a href="https://line.me/ti/p/@792nvftc" target="_blank">
              聯絡客服 (LINE)
            </a>
          </Button>
        </div>
      </div>

      <!-- Empty cart message -->
      <div v-else class="text-center py-8 text-gray-500">
        <p>選擇商品加入購物車，查看合計金額</p>
      </div>
    </div>
  </section>
</template>
