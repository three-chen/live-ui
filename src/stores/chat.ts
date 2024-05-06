import { UserInfoR } from 'live-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ChatInfo {
  // 发送者用户 id
  user: UserInfoR
  message: string
}

export const useChatsStore = defineStore('chats', () => {
  const chats = ref<ChatInfo[]>([])

  function pushChats(bullet: ChatInfo) {
    chats.value.push(bullet)
  }

  function emitChats() {
    for (let i = 0; i < chats.value.length; i++) {
      emitChat()
    }
  }

  function emitChat() {
    const bullet = chats.value.shift()
  }

  function clearChats() {
    chats.value = []
  }

  return {
    chats,
    pushChats,
    clearChats
  }
})
