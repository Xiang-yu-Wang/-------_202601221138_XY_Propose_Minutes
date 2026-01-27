import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

// 統一的異步組件配置
const createAsyncComponent = (loader: () => Promise<any>) => {
  return defineAsyncComponent({
    loader,
    loadingComponent: LoadingSpinner,
    delay: 150,
    timeout: 15000,
    onError(error, retry, fail, attempts) {
      void error
      if (attempts <= 2) retry()
      else fail()
    }
  })
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: createAsyncComponent(() => import('@/views/HomeView.vue')),
      meta: { title: '首頁' }
    },
    {
      path: '/announcements',
      name: 'announcements',
      component: createAsyncComponent(() => import('@/views/AnnouncementsView.vue')),
      meta: { title: '公告區' }
    },
    {
      path: '/products',
      name: 'products',
      component: createAsyncComponent(() => import('@/views/ProductsView.vue')),
      meta: { title: '商品區' }
    },
    {
      path: '/recruitment',
      name: 'recruitment',
      component: createAsyncComponent(() => import('@/views/RecruitmentView.vue')),
      meta: { title: '招募業務' }
    },
    {
      path: '/community',
      name: 'community',
      component: createAsyncComponent(() => import('@/views/CommunityView.vue')),
      meta: { title: '加入社群' }
    },
    {
      path: '/services',
      name: 'services',
      component: createAsyncComponent(() => import('@/views/ServicesView.vue')),
      meta: { title: '服務介紹' }
    },
    {
      path: '/plans',
      name: 'plans',
      component: createAsyncComponent(() => import('@/views/PlansView.vue')),
      meta: { title: '方案說明' }
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: createAsyncComponent(() => import('@/views/GalleryView.vue')),
      meta: { title: '交貨實績' }
    },
    {
      path: '/upload',
      name: 'upload',
      component: createAsyncComponent(() => import('@/views/UploadView.vue')),
      meta: { title: '文件上傳' }
    },
    {
      path: '/contact',
      name: 'contact',
      component: createAsyncComponent(() => import('@/views/ContactView.vue')),
      meta: { title: '聯絡我們' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: createAsyncComponent(() => import('@/views/AdminView.vue')),
      meta: { title: '管理後台' }
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Update page title on navigation
router.beforeEach((to, _from, next) => {
  const baseTitle = '大倉代領股東紀念品'
  document.title = to.meta.title 
    ? `${to.meta.title} - ${baseTitle}` 
    : baseTitle
  next()
})

export default router
