import { LiveChat } from './chat-websocket-module'

// 聊天模块
export class Chat {
  public static room: string
  public static url: string
  public static liveChat: LiveChat
  public static onStartLive: Function

  public static init(room: string, onMessage: Function, onGift: Function, onStopLive: Function, userId?: string) {
    Chat.room = room
    Chat.url = `ws://localhost:3000`
    Chat.liveChat = new LiveChat(Chat.room, onMessage, onGift, onStopLive, userId)
    if (Chat.onStartLive) {
      Chat.liveChat.setOnStartLive(Chat.onStartLive)
    }
  }

  public static connect() {
    Chat.liveChat.connect(Chat.url)
  }

  public static sendMessage(msg: string) {
    try {
      Chat.liveChat.sendMessage(msg)
    } catch (error) {
      console.log('sendMessage error', error)
    }
  }

  public static sendGift(msg: string) {
    try {
      Chat.liveChat.sendGift(msg)
    } catch (error) {
      console.log('sendMessage error', error)
    }
  }

  public static setOnStartLive(onStartLive: Function) {
    if (Chat.liveChat) {
      Chat.liveChat.setOnStartLive(onStartLive)
    } else {
      Chat.onStartLive = onStartLive
    }
  }

  public static destroy() {
    this.liveChat.destroy()
    console.log('chat destroy')
  }
}
