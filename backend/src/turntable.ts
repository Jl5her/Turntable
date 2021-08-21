/* eslint-disable no-console */
import { Session } from 'turntable'
import { Socket, Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import spotify from './spotify'
import { log } from './utils'

export const sessions: { [key: string]: Session } = {}

export const setupSocket = (socket: Socket) => {
  socket.on('new_session', newSession)
  socket.on('join_session', joinSession)
  socket.on('search', search)
  socket.on('reconnect', reconnect)
  socket.on('get_devices', getDevices)
  socket.on('queue', queueSong)
  socket.on('pause', pause)
  socket.on('play', play)

  const { token } = socket.handshake.query

  socket.emit('connection', token !== 'undefined' ? token : uuidv4())
}

function newSession(this: Socket, { code, token }: { code: string, token: string }) {
  spotify.authorize(code)
    .then((data: any) => {
      let session_id
      do {
        session_id = '' + (10000 + Math.floor(Math.random() * 10000))
      } while (session_id in sessions)

      this.join(`${session_id}`)

      sessions[session_id] = {
        session_id,
        spotify_host_uri: data.host.uri,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + (data.expires_in * 1000),
        created_at: Date.now(),
        device_id: undefined,
        host_token: token,
        host_socket_id: this.id,
        queue: []
      }

      log(`New Room Created! (Room: ${session_id}) (Host: '${token}')`)

      this.emit('created_session', sessions[session_id])
    }).catch((error: any) => {
      console.error(error.message)
      this.emit('error', error.message)
    })
}

function reconnect(this: Socket, data: { session_id: string, token?: string }) {
  const {
    session_id,
    token,
  } = data
  log(`User with token '${token}' is trying to reconnect to Room ${session_id}.`)

  if (!(session_id in sessions)) {
    log('Room no longer exists!')
    this.emit('error', 'Error reconnecting')
  } else if (sessions[session_id]?.host_token === token) {
    log(`Host reconnecting to ${session_id}`)
    sessions[session_id].host_token = token
    sessions[session_id].host_socket_id = this.id


    this.join(`${session_id}`)

    this.emit('joined_session', sessions[session_id])
  } else {
    log(`Successfully reconnected to Room ${session_id}`)
    this.join(`${session_id}`)
    this.emit('joined_session', sessions[session_id])
  }
}

function joinSession(this: Socket, session_id: string) {
  if (session_id in sessions) {
    this.join(`${session_id}`)
    log(`Socket joining ${session_id}`)
    this.emit('joined_session', sessions[session_id])
  } else {
    this.emit('error', 'Session does not exist!')
  }
}

function search(this: Socket, data: any) {
  if (data.session_id in sessions) {
    const { access_token } = sessions[data.session_id]
    spotify.search(access_token, data.query)
      .then((results: any) => {
        this.emit('search_results', results)
      })
  }
}

function getDevices(this: Socket, data: any) {
  const { device_id, access_token } = sessions[data.session_id]
  spotify.get_devices(access_token).then((devices: any) => {
      this.emit('device_list', {
        devices,
        current_device: device_id,
      })
    })
}

function queueSong(this: Socket, { session_id, track }: any) {
  if (!(session_id in sessions)) {
    this.emit('error', "Room does not exist!")
    return
  }

  const { access_token } = sessions[session_id]

  spotify.queue_song(access_token, track.uri)
  sessions[session_id].queue.push(track)
}

function pause(this: Socket, { session_id, token }: any) {
  if (!(session_id in sessions)) {
    this.emit('error', "Room does not exist!")
    return
  }
  if (sessions[session_id].host_token !== token) {
    this.emit('error', "You are not authorized to perform that action!")
    return
  }
  spotify.pause(sessions[session_id].access_token).catch((error: any) => {
    console.error(error.message)
    this.emit('error', error.message)
  })
}

function play(this: Socket, { session_id, token }: any) {
  if (!(session_id in sessions)) {
    this.emit('error', "Room does not exist!")
    return
  }
  if (sessions[session_id].host_token !== token) {
    this.emit('error', "You are not authorized to perform that action!")
    return
  }
  spotify.play(sessions[session_id].access_token).catch((error: any) => {
    console.error(error.message)
    this.emit('error', error.message)
  })
}

export const initializeApp = (io: Server) => {
  setInterval(() => {
    for (const session of Object.values(sessions)) {
      if (Date.now() + 5000 > session.expires_at) {
        spotify.refresh_token(session.refresh_token).then((data: any) => {
          session.access_token = data.access_token
          session.expires_at = Date.now() + (data.expires_in * 1000)
        })
      } else if (session.access_token) {
        spotify.get_status(session.access_token).then((currently_playing: any) => {
          session.queue = session.queue.filter(track => track.id !== currently_playing?.item?.id)

          io.to(`${session.session_id}`).emit('status', {
            session,
            currently_playing,
          })
        })
      }
    }
  }, 200)

  setInterval(() => {
    for (const session of Object.values(sessions)) {
      if (session.access_token) {
        spotify.get_recently_played(session.access_token, session.created_at).then((recently_played: any) => {
          io.to(session.session_id).emit('recently_played', recently_played)
        })
      }
    }
  }, 2000)
}
