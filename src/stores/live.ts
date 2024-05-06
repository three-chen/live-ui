import { LiveInfo } from 'live-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLiveStore = defineStore('live', () => {
  const live = ref<LiveInfo | undefined>(undefined)
  const isCreated = ref(false)
  const isEnded = ref(false)

  function setLive(liveInfo: Partial<LiveInfo>) {
    // 更新直播信息
    if (!live.value) {
      live.value = liveInfo as LiveInfo
    } else {
      Object.keys(liveInfo).forEach(key => {
        live.value![key] = liveInfo[key as keyof LiveInfo]
      })
    }
  }

  function setCreate(created: boolean) {
    isCreated.value = created
  }

  function setEnded(ended: boolean) {
    isEnded.value = ended
  }

  return {
    live,
    isCreated,
    isEnded,
    setLive,
    setCreate,
    setEnded
  }
})
