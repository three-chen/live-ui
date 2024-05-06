export default class EventEmitter {
  public static listeners: Map<string, Array<Function>> = new Map()
  /**
   * 监听事件
   * @param event 事件名
   * @param listener 监听函数
   */
  public static on(event: string, listener: Function) {
    if (!EventEmitter.listeners.has(event)) {
      EventEmitter.listeners.set(event, [])
    }
    EventEmitter.listeners.get(event)!.push(listener)
  }
  /**
   * 触发事件
   * @param event 事件名
   * @param args 参数
   */
  public static emit(event: string, ...args: any[]) {
    if (EventEmitter.listeners.has(event)) {
      const events = EventEmitter.listeners.get(event)
      events!.forEach(listener => listener(...args))
    }
  }
}
