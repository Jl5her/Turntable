import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Input, Marquee } from 'components'
import { SocketContext } from 'context'
import './Search.scss'
import AddToList from './add-to-list.png'
import Check from './check.png';

type SearchProps = {
  queue?: any
}

const Search = ({ queue }: SearchProps): JSX.Element => {
  const socket = useContext(SocketContext)
  const { sessionId } = useParams<{ sessionId: string }>()
  const [searchQuery, setSearchQuery] = useState<string>()
  const [searchResults, setSearchResults] = useState([])

  const queue_ids = useMemo<any[]>(() =>
    queue ? queue.map((track: any) => track.id) : []
    , [queue])

  const addToQueue = (track: any) => {
    console.log(track)
    socket?.emit('queue', {
      sessionId,
      track
    })
  }

  const isEmpty = (text?: string) => {
    return !text || text === undefined || text === null || text === ''
  }

  useEffect(() => {
    socket?.on('search_results', (data) => setSearchResults(data))
  }, [socket])

  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== '') {
      socket?.emit('search', {
        query: searchQuery,
        sessionId
      })
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  return <>
    <Input value={searchQuery} setValue={setSearchQuery} icon='search' id='search' placeholder='Search for song or artist....' />
    <ul id='search_results'>
      {!isEmpty(searchQuery) ? searchResults?.map((track: any, index: number) =>
        <li key={`search-track-${track.id}`}>
          <img className='album' src={track.album.images[0].url} alt='album_cover' />
          <div className='content'>
            <h5>{track.name}</h5>
            <Marquee id='byline'>{track.artists[0].name}</Marquee>
          </div>
          {queue_ids.indexOf(track.id) > -1 ?
            <img id='already-added' alt="Already Added" src={Check} /> :
            <img id='add-to-queue' alt='Add to Queue' onClick={() => addToQueue(track)} src={AddToList} />
          }
        </li>
      ) : <></>}
    </ul>
  </>
}

export default Search