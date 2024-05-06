import { UserInfoR } from 'live-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface BulletsInfo {
  // 发送者用户 id
  user: UserInfoR
  message: string
}

export const useBulletsStore = defineStore('bullets', () => {
  const emitedBullets = ref<BulletsInfo[]>([])
  const bullets = ref<BulletsInfo[]>([])

  function pushBullets(bullet: BulletsInfo) {
    bullets.value.push(bullet)
  }

  function emitBullets() {
    for (let i = 0; i < bullets.value.length; i++) {
      emitBullet()
    }
  }

  function emitBullet() {
    const bullet = bullets.value.shift()
  }

  function clearBullets() {
    emitedBullets.value = []
  }

  return {
    bullets,
    pushBullets
  }
})
