import axios from 'axios'
import qs from 'qs'
import btoa from 'btoa'

export default {
  getAuthorizeUrl: (): string => {
    const { client_id, redirect_uri } = process.env
    const scopes = 'user-read-playback-state user-read-recently-played user-modify-playback-state user-read-currently-playing user-read-playback-position'

    return 'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri || '')
  },

  authorize: async (code: string) => {
    const { client_id, client_secret, redirect_uri } = process.env
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
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

      return response.data.access_token
    } catch (e) {
      console.error(e)
      throw new Error('Could not authenticate')
    }
  },

  getDevices: async () => {
    const { client_id, client_secret } = process.env
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/player/devices',
        headers: {
          'content-type': 'application/json',
          Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
        }
      })

      return response.data
    } catch {
      throw new Error('Could not get devices!')
    }
  },

  setup: async (accessToken: string, deviceId: string) => {
    await axios({
      method: 'PUT',
      url: `https://api.spotify.com/v1/player/repeat?device_id=${deviceId}&state=off`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    await axios({
      method: 'PUT',
      url: `https://api.spotify.com/v1/me/player/shuffle?device=id=${deviceId}&state=false`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  playSong: async (accessToken: string, deviceId: string, song_id: string) => {
    await axios({
      method: 'PUT',
      url: `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: qs.stringify({
        uris: [song_id],
        position_ms: 10000,
      }),
    })
  },

  play: async (accessToken: string, _deviceId?: string) => {
    try {
      await axios({
        method: 'PUT',
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      throw new Error(error.response.statusText)
    }
  },

  pause: async (accessToken: string, deviceId?: string) => {
    try {
      await axios({
        method: 'PUT',
        url: 'https://api.spotify.com/v1/me/player/pause' + (deviceId ? `?device_id=${deviceId}` : ''),
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      throw new Error(error.response.statusText)
    }
  },

  search: async (accessToken: string, query: string) => {
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/search',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: query,
          type: 'track',
          market: 'US',
        },
      })
      return response.data.tracks.items
    } catch (error) {
      throw new Error(error.response.statusText)
    }
  },

  status: async (accessToken: string) => {
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/player/currently_playing',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    } catch (error) {
      throw new Error(error.response.statusText)
    }
  },

  recentlyPlayed: async (accessToken: string, startTime?: number) => {
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/player/recently-played' + (startTime ? `?after=${startTime}` : ''),
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response.statusText)
    }
  },

  queue: async (accessToken: string, uri: string) => {
    await axios({
      method: 'POST',
      url: `https://api.spotify.com/v1/me/player/queue?uri=${uri}`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}

/*
 GET https://api.spotify.com/v1/albums (Authorization, ids, market)
 GET https://api.spotify.com/v1/albums/{id} (Authorization, {id}, market)
 GET https://api.spotify.com/v1/albums/{id}/tracks (Authorization, {id}, market, limit, offset)
 GET https://api.spotify.com/v1/artists (Authorization, ids)
 GET https://api.spotify.com/v1/artists/{id} (Authorization, {id})
 GET https://api.spotify.com/v1/artists/{id}/top-tracks (Authorization, {id}, market)
 GET https://api.spotify.com/v1/artists/{id}/related-artists (Authorization, {id})
 GET https://api.spotify.com/v1/artists/{id}/albums (Authorization, {id}, include_groups, market, limit, offset)
 GET https://api.spotify.com/v1/browse/new-releases (Authorization, country, limit, offset)
 GET https://api.spotify.com/v1/browse/featured-playlist (Authorization, country, locale, timestamp, limit, offset)
 GET https://api.spotify.com/v1/me/player (Authorization, market, additional_types)
 PUT https://api.spotify.com/v1/me/player (Authorization, device_ids, play)
 GET https://api.spotify.com/v1/me/player/devices (Authorization)
 GET https://api.spotify.com/v1/me/player/currently-playing (Authorization, market, additional_types)
 PUT https://api.spotify.com/v1/me/player/play (Authorization, device_id, context_uri, uris, offset, position_ms)
 PUT https://api.spotify.com/v1/player/pause (Authorization, device_id)
 POST https://api.spotify.com/v1/me/player/next (Authorization, device_id)
 POST https://api.spotify.com/v1/me/player/previous (Authorization, device_id)
 PUT https://api.spotify.com/v1/me/player/seek (Authorization, position_ms, device_id)
 PUT https://api.spotify.com/v1/me/player/repeat (Authorization, state, device_id)
 PUT https://api.spotify.com/v1/me/player/volume (Authorization, volume_percent, device_id)
 PUT https://api.spotify.com/v1/me/player/shuffle (Authorization, state, device_id)
 GET https://api.spotify.com/v1/me/player/recently-played (Authorization, limit, after, before)
 POST https://api.spotify.com/v1/me/player/queue (Authorization, uri, device_id)
 GET https://api.spotify.com/v1/search (Authorization, q, type, market, limit, offset, include_external)
 GET https://api.spotify.com/v1/tracks (Authorization, ids, market)
 GET https://api.spotify.com/v1/tracks/{id} (Authorization, {id}, market)
 GET https://api.spotify.com/v1/audio-features (Authorization, ids)
 GET https://api.spotify.com/v1/audio-features/{id} (Authorization, {id})
*/