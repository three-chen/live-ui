import { UserInfoR } from 'live-service'

interface DataInfo {
  roomId?: string // 房间名
  message?: string // 要发送的消息
  userId?: string // 创建的userId
  user?: UserInfoR // 发送者
}

export interface RoomSocketEvent {
  eventName: string
  data: DataInfo
}
