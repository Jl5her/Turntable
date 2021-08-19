import React from 'react'
import { Marquee } from 'components'
import './Queue.scss'
import FA from 'react-fontawesome'

type QueueProps = {
  queue?: any
}

const Queue = ({ queue }: QueueProps): JSX.Element => {
  return <>
    {queue ? <>
      <h2>Up Next</h2>
      <ul className='queue'>
        {queue.length > 0 ?
          queue?.map((song: any, index: number) =>
            <li key={`up-next-${index}`}>
              <img alt='album_cover' src={song.album.images[0].url}></img>
              <div className='content'>
                <h5>{song.name}</h5>
                <Marquee id='byline'>{song.artists[0].name} • {song.album.name}</Marquee>
              </div>
              {/* <FA name='heart' /> */}
            </li>) :
          <li className='placeholder'> <FA name='music' />Queue up some music!</li>}
      </ul>
    </> : <></>}
  </>
}

export default Queue