import { Session } from 'turntable'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Elink, Input } from 'components'
import { SocketContext } from 'context'
import './Join.scss'

import Turntable from './Turntable.png'

const Join = (): JSX.Element => {
  const history = useHistory()
  const socket = useContext(SocketContext)
  const [roomCode, setRoomCode] = useState<string>()

  const joinSession = () => {
    socket?.emit('join_session', roomCode)
    console.log('join_session ' + roomCode)
  }

  const joinedSession = ({ sessionId }: Session) => {
    history.push(`/${sessionId}`)
  }

  useEffect(() => {
    socket?.on('joined_session', joinedSession)
  }, [socket])

  return <div className='join'>
    <div className='join-logo'>
      <a href='/'><h1>Turntable</h1></a>
      <img src={Turntable} alt='turntable' />
    </div>
    <div className='join-menu'>
      <Input type='number' placeholder='Room Code' value={roomCode} setValue={setRoomCode} />
      <Button onClick={joinSession}>Join</Button>
      <div className='external-links'>
        <Elink href='' icon='paypal'>Donate</Elink>
        <Elink href='' icon='github'>Source Code</Elink>
      </div>
    </div>
  </div>
}

export default Join