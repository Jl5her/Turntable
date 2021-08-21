import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { SocketContext } from 'context'
import { io, Socket } from 'socket.io-client'
import { Home, Join, Main } from 'pages'
import Notifications from 'Notifications'
import './App.scss'

const App = (): JSX.Element => {
  const [socket, setSocket] = useState<Socket>()

  const appHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--app-height', `${window.innerHeight}px`)
  }

  const onError = (error: any) => {
    window.sendNotification('Error!', error, 'error')
    console.error(error)
  }

  const onConnected = (token: string) => {
    console.log('Connected to socket server')
    localStorage.setItem('token', token)
  }

  useEffect(() => {
    const socket = io('BACKEND_URI', {
      query: {
        token: localStorage.getItem('token') || 'undefined'
      }
    })

    socket.on('connection', onConnected)
    socket.on('error', onError)

    setSocket(socket)

    window.addEventListener('resize', appHeight)
    appHeight()
  }, [])

  return <div id='root'>
    <Notifications />
    <SocketContext.Provider value={socket}>
      <div id='app'>
        <Router>
          <Switch>
            <Route path='/join' component={Join} />
            <Route path='/:session_id' component={Main} />
            <Route path='/' component={Home} />
          </Switch>
        </Router>
      </div>
    </SocketContext.Provider>
  </div>
}

export default App