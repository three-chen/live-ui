import { UserInfoR } from 'live-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface BulletsInfo {
  // 发送者用户 id
  user: UserInfoR
  message: string
}

export const useBulletsStore = defineStore('bullets', () => {
  const bullets = ref<BulletsInfo[]>([])

  function pushBullets(bullet: BulletsInfo) {
    bullets.value.push(bullet)
  }

  function clearAllBullets() {
    bullets.value = []
  }

  return {
    bullets,
    pushBullets,
    clearAllBullets
  }
})
