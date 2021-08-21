import { Session } from 'turntable'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FA from 'react-fontawesome'
import { RecentlyPlayed, Search, Queue, CurrentlyPlaying } from 'components'
import { SocketContext } from 'context'
import Home from './Home'
import './Main.scss'

const Main = (): JSX.Element => {
  const { session_id } = useParams<{ session_id: string }>()
  const socket = useContext(SocketContext)
  const [currentlyPlaying, setCurrentlyPlaying] = useState()
  const [recentlyPlayed, setRecentlyPlayed] = useState()
  const [session, setSession] = useState<Session>()

  const my_token = localStorage.getItem('token')

  const joinedSession = (session: Session) => {
    setSession(session)
  }

  useEffect(() => {
    socket?.on('joined_session', joinedSession)
    socket?.on('status', ({ currently_playing, session }) => {
      setSession(session)
      setCurrentlyPlaying(currently_playing)
    })

    socket?.on('recently_played', (recently_played) => {
      setRecentlyPlayed(recently_played)
    })

    // window.sendNotification('Attempting to Reconnect...', 'Trying to reconnect to ' + session_id)
    socket?.emit('reconnect', { session_id, token: localStorage.getItem('token') })
  }, [socket, session_id])

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
      <h3>Room Code: <span className='roomCode'>{session_id}</span>
        {session?.host_token == my_token && <FA name='star' />}</h3>
    </div>

    <Search queue={session.queue} />
    <RecentlyPlayed recently_played={recentlyPlayed} />
    <Queue queue={session.queue} />

    <CurrentlyPlaying currently_playing={currentlyPlaying} />
  </>
}

export default Main