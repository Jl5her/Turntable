/* eslint-disable no-console */
import { Session } from 'turntable'
import { Socket, Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import spotify from './spotify'

const sessions: { [key: string]: Session } = {}

export const setupSocket = (socket: Socket) => {
  socket.on('new_session', newSession)
  socket.on('join_session', joinSession)
  socket.on('search', search)
  socket.on('reconnect', reconnect)
  socket.on('get_devices', getDevices)
  socket.on('queue', queueSong)
  socket.on('pause', pause)
  socket.on('play', play)

  const {token} = socket.handshake.query

  socket.emit('connection', token !== 'undefined' ? token : uuidv4())
}

function newSession(this: Socket, {code, token}: {code: string, token: string}) {
  spotify.authorize(code)
    .then((accessToken: string) => {
      const sessionId = 10000 + Math.floor(Math.random() * 10000)
      this.join(`${sessionId}`)

      sessions[sessionId] = {
        sessionId,
        accessToken,
        createdAt: Date.now(),
        deviceId: undefined,
        hostToken: token,
        hostSocketId: this.id,
        queue: []
      }

      console.log(`New Room Created! (Room: ${sessionId}) (Host: '${token}')`)

      this.emit('created_session', sessions[sessionId])
    }).catch((error: any) => {
      console.error(error.message)
      this.emit('error', error.message)
    })
}

function reconnect(this: Socket, data: { sessionId: string, token?: string }) {
  const {
    sessionId,
    token,
  } = data
  console.log(`User with token '${token}' is trying to reconnect to Room ${sessionId}.`)

  if (!(sessionId in sessions)) {
    console.log('Room no longer exists!')
    this.emit('error', 'Error reconnecting')
  } else if (sessions[sessionId]?.hostToken === token) {
    console.log(`Host reconnecting to ${sessionId}`)
    sessions[sessionId].hostToken = token
    sessions[sessionId].hostSocketId = this.id


    this.join(`${sessionId}`)

    this.emit('joined_session', sessions[sessionId])
  } else {
    console.log(`Successfully reconnected to Room ${sessionId}`)
    this.join(`${sessionId}`)
    this.emit('joined_session', sessions[sessionId])
  }
}

function joinSession(this: Socket, sessionId: string) {
  if (sessionId in sessions) {
    this.join(`${sessionId}`)
    console.log(`Socket joining ${sessionId}`)
    this.emit('joined_session', sessions[sessionId])
  } else {
    this.emit('error', 'Session does not exist!')
  }
}

function search(this: Socket, data: any) {
  if (data.sessionId in sessions) {
    const { accessToken } = sessions[data.sessionId]
    spotify.search(accessToken, data.query)
      .then((results: any) => {
        this.emit('search_results', results)
      })
  }
}

function getDevices(this: Socket, data: any) {
  const { deviceId } = sessions[data.sessionId]
  spotify.getDevices()
    .then((devices: any) => {
      this.emit('device_list', {
        devices,
        current_device: deviceId,
      })
    })
}

function queueSong (this: Socket, {sessionId, track}: any) {
  if(!(sessionId in sessions)) {
    this.emit('error', "Room does not exist!")
    return
  }

  spotify.queue(sessions[sessionId].accessToken, track.uri)
  sessions[sessionId].queue.push(track)
}

function pause(this: Socket, { sessionId , token}: any) {
  if (!(sessionId in sessions)) {
    this.emit('error', "Room does not exist!")
    return
  }
  if (sessions[sessionId].hostToken !== token) {
    this.emit('error', "You are not authorized to perform that action!")
    return
  }
  spotify.pause(sessions[sessionId].accessToken).catch((error: any) => {
    console.error(error.message)
    this.emit('error', error.message)
  })
}

function play(this: Socket, { sessionId, token }: any) {
  if (!(sessionId in sessions)) {
    this.emit('error', "Room does not exist!")
    return
  }
  if (sessions[sessionId].hostToken !== token) {
    this.emit('error', "You are not authorized to perform that action!")
    return
  }
  spotify.play(sessions[sessionId].accessToken).catch((error: any) => {
    console.error(error.message)
    this.emit('error', error.message)
  })
}

export const initializeApp = (io: Server) => {
  setInterval(() => {
    Object.values(sessions).forEach(({ sessionId, accessToken }) => {
      if (accessToken) {
        spotify.status(accessToken).then((currentlyPlaying: any) => {
          sessions[sessionId].queue = sessions[sessionId].queue.filter(track => track.id != currentlyPlaying.item.id)

          io.to(`${sessionId}`).emit('status', {
            queue: sessions[sessionId].queue,
            currentlyPlaying,
          })
        })
      }
    })
  }, 200)

  setInterval(() => {
    Object.values(sessions).forEach(({ accessToken, sessionId, createdAt }) => {
      if (accessToken) {
        spotify.recentlyPlayed(accessToken, createdAt).then((recentlyPlayed: any) => {
          io.to(`${sessionId}`).emit('recently-played', recentlyPlayed)
        })
      }
    })
  }, 2000)
}
