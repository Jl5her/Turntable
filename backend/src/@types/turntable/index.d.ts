declare module "turntable" {
  export interface Session {
    sessionId: number,
    deviceId: string | undefined,
    accessToken: string,
    hostToken: string,
    hostSocketId: string,
    createdAt: number
    queue: any[]
  }
}