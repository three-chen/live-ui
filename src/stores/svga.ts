import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSvgaStore = defineStore('svga', () => {
  const isGifted = ref<boolean>(false)
  const gift = ref<string>('')

  const setIsGifted = (value: boolean) => {
    isGifted.value = value
  }

  const sendGift = (g: string) => {
    gift.value = g
  }

  return {
    isGifted,
    gift,
    setIsGifted,
    sendGift
  }
})
