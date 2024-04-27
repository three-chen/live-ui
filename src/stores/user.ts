import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = reactive<{}>({
    userInfo: {
      username: '',
      useremail: '',
      token: '',
      role: ''
    }
  })

  function setUser() {}

  return {
    user,
    setUser
  }
})
