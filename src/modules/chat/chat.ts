import { LiveChat } from './chat-websocket-module'

// 聊天模块
export class Chat {
  public static room: string
  public static url: string
  public static liveChat: LiveChat

  public static init(room: string, onMessage: Function, onStopLive: Function, userId?: string) {
    Chat.room = room
    Chat.url = `ws://localhost:3000`
    Chat.liveChat = new LiveChat(Chat.room, onMessage, onStopLive, userId)
  }

  public static connect() {
    Chat.liveChat.connect(Chat.url)
  }

  public static sendMessage(msg: string) {
    Chat.liveChat.sendMessage(msg)
  }

  public static destroy() {}
}
