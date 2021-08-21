import axios from 'axios'
import qs from 'qs'
import btoa from 'btoa'

const ACCOUNTS_URL = 'https://accounts.spotify.com'
const API_URL = 'https://api.spotify.com/v1'

export default {
  get_authorize_url: (): string => {
    const { client_id, redirect_uri } = process.env
    const scopes = 'user-read-playback-state user-read-recently-played user-modify-playback-state user-read-currently-playing user-read-playback-position'

    return `${ACCOUNTS_URL}/authorize` +
      '?response_type=code' +
      '&client_id=' + client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri || '')
  },

  authorize: async (code: string): Promise<any> => {
    const { client_id, client_secret, redirect_uri } = process.env
    try {
      let response = await axios({
        method: 'POST',
        url: `${ACCOUNTS_URL}/api/token`,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
        },
        data: qs.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri,
        }),
      })

      const data = { ...response.data }

      response = await axios({
        method: 'GET',
        url: `${API_URL}/me`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.access_token}`
        }
      })

      data.host = response.data
      return data
    } catch (e) {
      console.error(e)
      throw new Error(`Error occurred while authorizing`)
    }
  },

  refresh_token: async (refresh_token: string): Promise<any> => {
    try {
      const { client_id, client_secret } = process.env
      const response = await axios({
        method: 'POST',
        url: `${ACCOUNTS_URL}/api/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`
        },
        data: qs.stringify({
          grant_type: 'refresh_token',
          refresh_token
        })
      })

      return response.data
    } catch (e) {
      console.error(e)
      throw new Error('Error occurred while refreshing token!')
    }
  },

  get_devices: async (access_token: string): Promise<any> => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${API_URL}/me/player/devices`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        }
      })

      return response.data
    } catch (e) {
      console.error(e)
      throw new Error('Error occurred while getting devices')
    }
  },

  setup: async (access_token: string, device_id: string): Promise<void> => {
    try {
      await axios({
        method: 'PUT',
        url: `${API_URL}/player/repeat?device_id=${device_id}&state=off`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })

      await axios({
        method: 'PUT',
        url: `${API_URL}/me/player/shuffle?device=id=${device_id}&state=false`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    } catch (e) {
      console.error(e)
      throw new Error('Error occurred while trying to setup device')
    }
  },

  play_song: async (access_token: string, song_id: string): Promise<void> => {
    try {
      await axios({
        method: 'PUT',
        url: `${API_URL}/me/player/play`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        data: qs.stringify({
          uris: [song_id],
          position_ms: 10000,
        }),
      })
    } catch (e) {
      console.error(e)
      throw new Error(`Error occurred while trying to play song (${song_id})`)
    }
  },

  play: async (access_token: string): Promise<void> => {
    try {
      await axios({
        method: 'PUT',
        url: `${API_URL}/me/player/play`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    } catch (e) {
      console.error(e)
      throw new Error('Error occurred while trying to play media')
    }
  },

  pause: async (access_token: string): Promise<void> => {
    try {
      await axios({
        method: 'PUT',
        url: `${API_URL}/me/player/pause`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    } catch (e) {
      console.error(e)
      throw new Error('Error occurred while trying to pause media')
    }
  },

  search: async (access_token: string, query: string): Promise<any> => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${API_URL}/search`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          q: query,
          type: 'track',
          market: 'US',
        },
      })
      return response.data.tracks.items
    } catch (e) {
      console.error(e)
      throw new Error(`Error occurred while trying to search (q=${query})`)
    }
  },

  get_status: async (access_token: string): Promise<any> => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${API_URL}/me/player/currently_playing`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      return response.data
    } catch (e) {
      console.error(e)
      throw new Error('Error occurred while trying to get status')
    }
  },

  get_recently_played: async (access_token: string, after?: number): Promise<any> => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${API_URL}/me/player/recently-played` + (after ? `?after=${after}` : ''),
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      return response.data
    } catch (e) {
      console.error(e)
      throw new Error('Error occurred while trying to get recently played item(s).')
    }
  },

  queue_song: async (access_token: string, uri: string): Promise<any> => {
    try {
      await axios({
        method: 'POST',
        url: `${API_URL}/me/player/queue?uri=${uri}`,
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
    } catch (e) {
      console.error(e)
      throw new Error('Error occurred while trying to queue song!')
    }
  }
}