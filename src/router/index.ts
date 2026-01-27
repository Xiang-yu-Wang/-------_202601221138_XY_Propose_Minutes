import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: defineAsyncComponent({
        loader: () => import('@/views/HomeView.vue'),
        loadingComponent: LoadingSpinner,
        delay: 150,
        timeout: 15000,
        onError(error, retry, fail, attempts) {
          void error
          if (attempts <= 2) retry()
          else fail()
        }
      }),
      meta: { title: '首頁' }
    },
    {
      path: '/announcements',
      name: 'announcements',
      component: defineAsyncComponent({
        loader: () => import('@/views/AnnouncementsView.vue'),
        loadingComponent: LoadingSpinner,
        delay: 150,
        timeout: 15000,
        onError(error, retry, fail, attempts) {
          void error
          if (attempts <= 2) retry()
          else fail()
        }
      }),
      meta: { title: '公告區' }
    },
    {
      path: '/products',
      name: 'products',
      component: defineAsyncComponent({
        loader: () => import('@/views/ProductsView.vue'),
        loadingComponent: LoadingSpinner,
        delay: 150,
        timeout: 15000,
        onError(error, retry, fail, attempts) {
          void error
          if (attempts <= 2) retry()
          else fail()
        }
      }),
      meta: { title: '商品區' }
    },
    {
      path: '/recruitment',
      name: 'recruitment',
      component: defineAsyncComponent({
        loader: () => import('@/views/RecruitmentView.vue'),
        loadingComponent: LoadingSpinner,
        delay: 150,
        timeout: 15000,
        onError(error, retry, fail, attempts) {
          void error
          if (attempts <= 2) retry()
          else fail()
        }
      }),
      meta: { title: '招募業務' }
    },
    {
      path: '/community',
      name: 'community',
      component: defineAsyncComponent({
        loader: () => import('@/views/CommunityView.vue'),
        loadingComponent: LoadingSpinner,
        delay: 150,
        timeout: 15000,
        onError(error, retry, fail, attempts) {
          void error
          if (attempts <= 2) retry()
          else fail()
        }
      }),
      meta: { title: '加入社群' }
    },
    {
      path: '/services',
      name: 'services',
      component: defineAsyncComponent({
        loader: () => import('@/views/ServicesView.vue'),
        loadingComponent: LoadingSpinner,
        delay: 150,
        timeout: 15000,
        onError(error, retry, fail, attempts) {
          void error
          if (attempts <= 2) retry()
          else fail()
        }
      }),
      meta: { title: '服務介紹' }
    },
    {
      path: '/plans',
      name: 'plans',
      component: defineAsyncComponent({
        loader: () => import('@/views/PlansView.vue'),
        loadingComponent: LoadingSpinner,
        delay: 150,
        timeout: 15000,
        onError(error, retry, fail, attempts) {
          void error
          if (attempts <= 2) retry()
          else fail()
        }
      }),
      meta: { title: '方案說明' }
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: defineAsyncComponent({
        loader: () => import('@/views/GalleryView.vue'),
        loadingComponent: LoadingSpinner,
        delay: 150,
        timeout: 15000,
        onError(error, retry, fail, attempts) {
          void error
          if (attempts <= 2) retry()
          else fail()
        }
      }),
      meta: { title: '交貨實績' }
    },
    {
      path: '/upload',
      name: 'upload',
      component: defineAsyncComponent({
        loader: () => import('@/views/UploadView.vue'),
        loadingComponent: LoadingSpinner,
        delay: 150,
        timeout: 15000,
        onError(error, retry, fail, attempts) {
          void error
          if (attempts <= 2) retry()
          else fail()
        }
      }),
      meta: { title: '文件上傳' }
    },
    {
      path: '/contact',
      name: 'contact',
      component: defineAsyncComponent({
        loader: () => import('@/views/ContactView.vue'),
        loadingComponent: LoadingSpinner,
        delay: 150,
        timeout: 15000,
        onError(error, retry, fail, attempts) {
          void error
          if (attempts <= 2) retry()
          else fail()
        }
      }),
      meta: { title: '聯絡我們' }
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
