declare module 'turntable' {
  export interface Session {
    sessionId: number,
    deviceId: string | undefined,
    accessToken: string,
    hostToken: string,
    hostSocketId: string,
    createdAt: number
  }
  
  export interface Notification {
    title: string
    message: string
    id?: string
    type: 'success' | 'warn' | 'info' | 'error'
  }
}