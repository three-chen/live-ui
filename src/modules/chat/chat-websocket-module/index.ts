import EventEmitter from './EventEmitter'
import HWebSocket from './hWebSocket/hWebSocket'

import type { RoomSocketEvent } from './hWebSocket/types'

import { LiveInfoR, UserInfoR } from 'live-service'
import { g4, getObjectValues } from './utils'

export class LiveChat extends EventEmitter {
  // 本地的socket
  private socket: HWebSocket | null = null
  private userId: string
  private roomId: string
  private onMessage: Function
  private onStopLive: Function

  public constructor(roomId: string, onMessage: Function, onStopLive: Function, userId?: string) {
    super()
    // 将EventEmiiter调用的this指定为LiveChat的this
    this.LiveChatenv = this
    this.roomId = roomId
    this.userId = userId || `anony-${g4()}${g4()}-${g4()}${g4()}`
    this.onMessage = onMessage
    this.onStopLive = onStopLive
    this.init()
  }

  public init() {
    this.on('_message', this.handleMessage)
    this.on('_joined', this.handleJoined)
    this.on('_new_user', this.handleNewUser)
    this.on('_stop_live', this.handleStopLive)
    this.on('_heart_beat', this.handleHeartBeat)
  }

  /**
   * @param wsUrl : websocket url
   *
   */
  connect(wsUrl: string) {
    const that = this
    that.socket = new HWebSocket(wsUrl)
    that.socket.ws.onopen = () => {
      console.log('websocket connected', this.userId)
      const roomSocketEvent: RoomSocketEvent = {
        eventName: '__joinRoom',
        data: {
          roomId: that.roomId,
          userId: that.userId
        }
      }
      that.socket!.ws.send(JSON.stringify(roomSocketEvent))
    }

    that.socket.ws.addEventListener('message', e => {
      const roomSocketEvent: RoomSocketEvent = JSON.parse(e.data)
      that.emit(roomSocketEvent.eventName, getObjectValues(roomSocketEvent.data))
    })

    that.socket.ws.onclose = () => {
      console.log('websocket closed', this.userId)
    }
  }

  public sendMessage(message: string) {
    const that = this
    const roomSocketEvent: RoomSocketEvent = {
      eventName: '__message',
      data: {
        message: message
      }
    }

    that.socket!.ws.send(JSON.stringify(roomSocketEvent))
  }

  public handleMessage(user: UserInfoR, message: string) {
    this.onMessage(user, message)
  }

  public handleStopLive(live: LiveInfoR) {
    console.log('handleStopLive', live)
    this.onStopLive(live)
  }

  /**
   *
   * @param roomId roomId 加入的房间名
   * @param mySocketId 本地的userId
   */
  public async handleJoined(roomId: string, mySocketId: string) {
    console.log('joined ', roomId, mySocketId)
  }

  /**
   *
   * @param userId 新增的远程userId
   */
  public handleNewUser(userId: string) {}

  public async handleReady() {
    const that = this
  }

  public disconnect() {
    const that = this
    const roomSocketEvent: RoomSocketEvent = {
      eventName: '__remove_user',
      data: {}
    }
    that.socket!.ws.send(JSON.stringify(roomSocketEvent))
  }

  public handleRemovePeer(userId: string) {}

  public handleHeartBeat(pong: string) {
    const that = this
    that.socket!.resetHeartBeat()
    console.log('heart beat', pong, this.userId)
  }
}
