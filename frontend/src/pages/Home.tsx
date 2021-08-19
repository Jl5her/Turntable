import { Session } from 'turntable'
import React, { useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, Elink } from 'components'
import { SocketContext } from 'context'
import './Home.scss'

import Turntable from './Turntable.png'

const Home = (): JSX.Element => {
  const socket = useContext(SocketContext)
  const history = useHistory()
  const code = new URLSearchParams(useLocation().search).get('code')

  const createdSession = ({ sessionId }: Session) => {
    history.push(`/${sessionId}`)
  }

  useEffect(() => {
    if (code && socket) {
      socket?.emit('new_session', { code, token: localStorage.getItem('token') })
    }
    socket?.on('created_session', createdSession)
  }, [code, socket])

  return <div className='home'>
    <div className='home-logo'>
      <a href='/'><h1>Turntable</h1></a>
      <img src={Turntable} alt='turntable' />
    </div>
    <div className='home-menu'>
      <Button href='BACKEND_URI/authorize'>Connect with Spotify</Button>
      <Button href='/join'>Join Party</Button>
      <div className='external-links'>
        <Elink href='' icon='paypal'>Donate</Elink>
        <Elink href='' icon='github'>Source Code</Elink>
      </div>
    </div>
  </div>
}

export default Home