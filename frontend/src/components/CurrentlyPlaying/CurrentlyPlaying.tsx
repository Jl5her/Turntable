import { Marquee } from 'components'
import { SocketContext } from 'context'
import React, { useContext } from 'react'
import FA from 'react-fontawesome'
import { useParams } from 'react-router-dom'
import './CurrentlyPlaying.scss'

type CurrentlyPlayingProps = {
  currently_playing?: any
}

const CurrentlyPlaying = ({ currently_playing }: CurrentlyPlayingProps): JSX.Element => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const socket = useContext(SocketContext)

  const pause = () => {
    console.log("trying to pause")
    socket?.emit('pause', { sessionId, token: localStorage.getItem('token') })
  }

  const play = () => {
    console.log("trying to play")
    socket?.emit('play', { sessionId, token: localStorage.getItem('token') })
  }

  const progress = (currently_playing?.progress_ms / currently_playing?.item.duration_ms)

  return <div id='currently_playing'>
    <div className='content'>

      <div className='album'>
        <svg className="progress-circle" viewBox="0 0 106 106" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="ProgressBar" transform="translate(-17.000000, -17.000000)">
            <path className="progress-circle__path" strokeDasharray={`${Math.PI * 100 * progress},9999`} d="
            M70,120 
            C97.6142375,120 120,97.6142375 120,70 
            C120,42.3857625 97.6142375,20 70,20 
            C42.3857625,20 20,42.3857625 20,70 
            C20,97.6142375 42.3857625,120 70,120 Z" id="Oval-Copy" stroke="#E045C5" strokeWidth="8" fillRule="nonzero" transform="translate(70.000000, 70.000000) rotate(-125.000000) translate(-70.000000, -70.000000) "></path>
          </g>
        </g>
        </svg>
        <img alt='album_cover' src={currently_playing?.item?.album.images[0].url} />
      </div>

      <div className='song'>
        <Marquee id='title'>{currently_playing?.item?.name}</Marquee>
        <Marquee id='byline'> {currently_playing?.item?.artists[0].name} • {currently_playing?.item?.album.name}</Marquee>
      </div>

      {currently_playing?.is_playing ?
        <button onClick={pause}>
          <FA name='play' />
        </button> :
        <button onClick={play}>
          <FA name='pause' />
        </button>
      }
    </div>
    <div className='background' />
  </div>
}


export default CurrentlyPlaying