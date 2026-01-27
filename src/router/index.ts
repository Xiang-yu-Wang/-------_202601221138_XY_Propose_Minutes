import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: '首頁' }
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('@/views/ServicesView.vue'),
      meta: { title: '服務介紹' }
    },
    {
      path: '/plans',
      name: 'plans',
      component: () => import('@/views/PlansView.vue'),
      meta: { title: '方案說明' }
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('@/views/GalleryView.vue'),
      meta: { title: '交貨實績' }
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('@/views/UploadView.vue'),
      meta: { title: '文件上傳' }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
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
