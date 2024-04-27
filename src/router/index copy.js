import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/MainHall.vue'),
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
      path: '/live/:room',
      name: 'liveRoom',
      component: () => import('@/views/LiveRoom.vue'),
    },
    {
      path: '/stream/:room',
      name: 'liveStream',
      component: () => import('@/views/LiveStream.vue'),
    },
    {
      path: '/webrtc/:room',
      name: 'webrtcRoom',
      component: () => import('@/views/LiveHome.vue'),
    },
  ]
})

export default router
