import React, { useContext, useEffect, useState } from 'react'
import { RecentlyPlayed, Search, Queue, CurrentlyPlaying } from 'components'
import { SocketContext } from 'context'
import './Main.scss'
import { useParams } from 'react-router-dom'
import { Session } from 'turntable'
import Home from './Home'

const Main = (): JSX.Element => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const socket = useContext(SocketContext)
  const [currentlyPlaying, setCurrentlyPlaying] = useState()
  const [recentlyPlayed, setRecentlyPlayed] = useState()
  const [queue, setQueue] = useState()
  const [session, setSession] = useState<Session>()

  const joinedSession = (session: Session) => {
    setSession(session)
  }

  useEffect(() => {
    if (socket) {
      socket.on('joined_session', joinedSession)
      socket?.on('status', ({ currentlyPlaying, queue }) => {
        setCurrentlyPlaying(currentlyPlaying)
        setQueue(queue)
      })

      socket?.on('recently-played', (recentlyPlayed) => {
        setRecentlyPlayed(recentlyPlayed)
      })
    }
    if (sessionId && socket) {
      // window.sendNotification('Attempting to Reconnect...', 'Trying to reconnect to ' + sessionId)
      socket?.emit('reconnect', { sessionId, token: localStorage.getItem('token') })
    }
  }, [socket, sessionId])

  const share = () => {
    if (navigator.share)
      navigator.share({
        title: 'Turntable',
        text: 'Join my Turntable Session!',
        url: `WEBSITE/${sessionId}`
      })
  }

  if (!session) return <Home />

  return <>
    <div onClick={share} className='header'>
      <h1>Turntable</h1>
      <h3>Room Code: <span className='roomCode'>{sessionId}</span></h3>
    </div>

    <Search queue={queue} />
    <RecentlyPlayed recently_played={recentlyPlayed} />
    <Queue queue={queue} />

    <CurrentlyPlaying currently_playing={currentlyPlaying} />
  </>
}

export default Main