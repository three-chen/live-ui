import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/MainHall.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/profile/MainProfile.vue'),
      redirect: '/profile/config',
      children: [
        {
          path: 'config',
          component: () => import('@/views/profile/UserConfig.vue')
        }
        // {
        //   path: 'posts',
        //   component: UserPosts,
        // },
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      redirect: '/auth/login',
      children: [
        {
          path: 'login',
          component: () => import('@/views/auth/LoginRegister.vue')
        }
      ]
    },
    {
      path: '/live/watcher/:room',
      name: 'liveWatcher',
      component: () => import('@/views/LiveWatcher.vue'),
      props: true
    },
    {
      path: '/live/uploader/:room',
      name: 'liveUploader',
      component: () => import('@/views/LiveUploader.vue'),
      props: true
    }
  ]
})

export default router
