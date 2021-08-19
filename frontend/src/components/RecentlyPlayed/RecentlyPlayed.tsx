import React from 'react'
import { Marquee } from 'components'
import './RecentlyPlayed.scss'

type RecentlyPlayedProps = {
  recently_played?: any
}

const RecentlyPlayed = ({ recently_played }: RecentlyPlayedProps): JSX.Element =>
  <>
    <h2 style={{ marginBottom: 0 }}>Recently Played</h2>
    <ul className='recently_played'>
      {!(recently_played?.items.length) &&
        <li key={`recently-played-${-1}`}>
          <img style={{ opacity: '0.25' }} alt='album_cover' src={'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ffc08.deviantart.net%2Ffs71%2Ff%2F2014%2F153%2F9%2Fe%2Fno_album_art__no_cover___placeholder_picture_by_cmdrobot-d7kpm65.jpg&f=1&nofb=1l'} />
          <h3>Play Something</h3>
          <Marquee>As you play music, recently played items will show here</Marquee>
        </li>}

      {recently_played?.items.map(({ track }: any, index: number) =>
        <li key={`recently-played-${index}`}>
          <img alt='album_cover' src={track.album.images[0].url} />
          <Marquee id='title'>{track.name}</Marquee>
          <Marquee id='byline'>{track.artists[0].name} • {track.album.name}</Marquee>
        </li>
      )}
    </ul>
  </>


export default RecentlyPlayed