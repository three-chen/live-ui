// import { defineStore } from 'pinia'
// import { ref } from 'vue'

// export const useLiveStateStore = defineStore('liveState', () => {
//   const liveState = ref<LiveInfo | undefined>(undefined)
//   const isCreated = ref(false)

//   function setLive(liveStateInfo: Partial<LiveInfo>) {
//     // 更新直播信息
//     if (!liveState.value) {
//       liveState.value = liveStateInfo as LiveInfo
//     } else {
//       Object.keys(liveStateInfo).forEach(key => {
//         liveState.value![key] = liveStateInfo[key as keyof LiveInfo]
//       })
//     }
//   }

//   function setCreate(created: boolean) {
//     isCreated.value = created
//   }

//   return {
//     liveState,
//     isCreated,
//     setLive,
//     setCreate
//   }
// })
