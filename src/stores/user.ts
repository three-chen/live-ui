import { UserInfo } from 'live-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo | undefined>(undefined)
  const isLogin = ref(false)

  function setUser(userInfo: Partial<UserInfo>) {
    if (!isLogin.value) {
      console.log('未登录')
      return
    }
    // 更新用户信息
    if (!user.value) {
      user.value = userInfo as UserInfo
    } else {
      Object.keys(userInfo).forEach(key => {
        user.value![key] = userInfo[key as keyof UserInfo]
      })
    }
  }

  const setLogin = (loginState: boolean) => {
    isLogin.value = loginState
  }

  return {
    user,
    isLogin,
    setUser,
    setLogin
  }
})
