declare module "turntable" {
  export interface Session {
    session_id: string,
    device_id: string | undefined,
    spotify_host_uri: string,
    access_token: string,
    refresh_token: string,
    expires_at: number,
    host_token: string,
    host_socket_id: string,
    created_at: number
    queue: any[]
  }
}