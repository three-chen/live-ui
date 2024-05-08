import EventEmitter from './EventEmitter'
import HWebSocket from './hWebSocket/hWebSocket'

import type { RoomSocketEvent } from './hWebSocket/types'

import { LiveInfoR, UserInfoR } from 'live-service'
import { g4, getObjectValues } from './utils'

const giftTranslate = {
  Rocket: '火箭',
  angel: '天使',
  heartbeat: '心动',
  TwitterHeart: '爱心'
}

export class LiveChat extends EventEmitter {
  // 本地的socket
  private socket: HWebSocket | null = null
  private userId: string
  private roomId: string
  private onMessage: Function
  private onGift: Function
  private onStopLive: Function
  private onStartLive: Function | undefined

  public setOnStartLive(onStartLive: Function) {
    this.onStartLive = onStartLive
  }

  public constructor(roomId: string, onMessage: Function, onGift: Function, onStopLive: Function, userId?: string) {
    super()
    // 将EventEmiiter调用的this指定为LiveChat的this
    this.LiveChatenv = this
    this.roomId = roomId
    this.userId = userId || `anony-${g4()}${g4()}-${g4()}${g4()}`
    this.onMessage = onMessage
    this.onGift = onGift
    this.onStopLive = onStopLive
    this.init()
  }

  public init() {
    this.on('_message', this.handleMessage)
    this.on('_gift', this.handleGift)
    this.on('_joined', this.handleJoined)
    this.on('_new_user', this.handleNewUser)
    this.on('_remove_user', this.handleRemoveUser)
    this.on('_stop_live', this.handleStopLive)
    this.on('_start_live', this.handleStartLive)
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

  /**
   * @param wsUrl : websocket url
   *
   */
  reconnect(wsUrl: string) {
    const that = this
    that.socket = new HWebSocket(wsUrl)
    that.socket.ws.onopen = () => {
      console.log('websocket connected', this.userId)
      const roomSocketEvent: RoomSocketEvent = {
        eventName: '__reconnect',
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

    // 如果socket断开，则重新连接
    if (that.socket!.ws.readyState === 3) {
      that.reconnect('ws://localhost:3000')
      setTimeout(() => {
        that.socket!.ws.send(JSON.stringify(roomSocketEvent))
      }, 500)
    } else {
      that.socket!.ws.send(JSON.stringify(roomSocketEvent))
    }
  }

  public sendGift(message: string) {
    const that = this
    // @ts-ignore
    that.sendMessage(`送出了${giftTranslate[message]}`)
    const roomSocketEvent: RoomSocketEvent = {
      eventName: '__gift',
      data: {
        message: message
      }
    }

    // 如果socket断开，则重新连接
    if (that.socket!.ws.readyState === 3) {
      that.reconnect('ws://localhost:3000')
      setTimeout(() => {
        that.socket!.ws.send(JSON.stringify(roomSocketEvent))
      }, 500)
    } else {
      that.socket!.ws.send(JSON.stringify(roomSocketEvent))
    }
  }

  public handleMessage(user: UserInfoR, message: string) {
    this.onMessage(user, message)
  }

  public handleGift(message: string) {
    this.onGift(message)
  }

  public handleStartLive(live: LiveInfoR) {
    console.log('handleStartLive', live)
    this.onStartLive?.(live)
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
  public handleNewUser(user: string) {}

  /**
   *
   * @param user 删除的user
   */
  public handleRemoveUser(user: string) {}

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

  public destroy() {
    const that = this
    that.disconnect()
    that.socket!.ws.close()
  }

  public handleRemovePeer(userId: string) {}

  public handleHeartBeat(pong: string) {
    const that = this
    that.socket!.resetHeartBeat()
    console.log('heart beat', pong, this.userId)
  }
}
