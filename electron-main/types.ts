export enum EncodeProtocolEnum {
  RTMP = 'RTMP',
  WEBRTC = 'WEBRTC',
  SRT = 'SRT'
}
export type EncodeProtocol = keyof typeof EncodeProtocolEnum // other protocol types
