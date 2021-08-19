import { Notification } from 'turntable'
import { useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { v4 as uuidv4 } from 'uuid'
import FA from 'react-fontawesome'
import './Notifications.scss'

declare global {
  interface Window {
    notifications: Notification[]
    sendNotification: (title: string, message: string, type?: 'success' | 'warn' | 'info' | 'error') => void
  }
}

type DismissFunction = (id?: string) => void

const NotificationDiv = ({ notification, dismiss }: { notification: Notification, dismiss: DismissFunction }): JSX.Element => {

  return <div className={`notification ${notification.type}`}>
    <h1>{notification.title}</h1>
    <p>{notification.message}</p>
    <FA name='times' onClick={() => dismiss(notification.id)} />
  </div>
}

const Notifications = (): JSX.Element => {
  const [notifications, setNotifications] = useState<Notification[]>(window.notifications || [])

  const dismissNotification = (id?: string) => {
    setNotifications(notifications => notifications.filter(notification => notification.id !== id))
  }

  window.sendNotification = (title: string, message: string, type?: 'success' | 'warn' | 'info' | 'error') => {
    const id = uuidv4()
    setNotifications(notifications =>
      notifications.concat({
        title,
        message,
        type: type || 'info',
        id
      } as Notification))

    setTimeout(() => {
      setNotifications(notifications =>
        notifications.filter(notification =>
          notification.id !== id
        )
      )
    }, 5 * 1000)
  }

  return <TransitionGroup className='notifications'>
    {notifications.map(notification =>
      <CSSTransition
        unmountOnExit
        key={notification.id}
        timeout={500}
        className='notification-container'>
        <NotificationDiv
          notification={notification}
          dismiss={dismissNotification}
        />
      </CSSTransition>)}
  </TransitionGroup>
}

export default Notifications