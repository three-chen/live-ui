import { MediaFactory } from 'media-framework'
import { defineStore } from 'pinia'

export const useMediaFactoryStore = defineStore('MediaFactory', () => {
  MediaFactory.init()

  return {
    MediaFactory
  }
})
