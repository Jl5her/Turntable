/* eslint-disable camelcase */

declare module "spotify" {

  export interface  CopyrightObject {
    text: string,
    type : 'C' | 'P'
  }

  export interface  ExternalIdObject {
    ean: string,
    isrc: string,
    upc: string
  }

  export interface  ExternalUrlObject {
    spotify: string
  }

  export interface  FollowersObject {
    href?: string,
    total: number
  }

  export interface  ImageObject {
    height?: number,
    url: string,
    width?: number
  }

  export interface  LinkedTrackObject {
    external_urls: ExternalUrlObject,
    href: string,
    id: string,
    type : 'track',
    uri: string
  }

  export interface  TrackRestrictionObject {
    reason: 'market' | 'product' | 'explicit'
  }

  export interface  ArtistObject {
    external_urls: ExternalUrlObject,
    followers: FollowersObject,
    genres: [string],
    href: string,
    id: string,
    images: [ImageObject],
    name: string,
    popularity: number,
    type: 'artist',
    uri: string
  }

  export interface  AlbumRestrictionObject {
    reason: 'market' | 'product' | 'explicit'
  }

  export interface  SimplifiedArtistObject {
    external_urls: ExternalUrlObject,
    href: string,
    id: string,
    name: string,
    type: 'artist',
    uri: string
  }

  export interface  SimplifiedTrackObject {
    artists: [SimplifiedArtistObject],
    available_markets: [string],
    disc_number: number,
    duration_ms: number,
    explicit: boolean,
    external_urls: ExternalUrlObject,
    href: string,
    id: string,
    is_local: boolean,
    is_playable: boolean,
    linked_from: LinkedTrackObject,
    name: string,
    preview_url: string,
    restrictions: TrackRestrictionObject,
    track_number: number,
    type : 'track',
    uri: string
  }

  export interface  AlbumObject {
    album_type : 'album' | 'single' | 'compilation',
    artists: [ArtistObject],
    available_markets: [string],
    copyrights: [CopyrightObject],
    external_ids: ExternalIdObject,
    external_urls: ExternalUrlObject,
    genres: [string],
    href: string,
    id: string,
    images: [ImageObject],
    label: string,
    name: string,
    popularity: number,
    release_date: string,
    release_date_precision: 'year' | 'month' | 'day',
    restrictions: AlbumRestrictionObject,
    tracks: [SimplifiedTrackObject],
    type : 'album',
    uri: string
  }

  export interface  AudioFeaturesObject {
    acousticness: number,
    analysis_url: string,
    danceability: number,
    duration_ms: number,
    energy: number,
    id: string,
    instrumentalness: number,
    key: number,
    liveness: number,
    loudness: number,
    mode: number,
    speechiness: number,
    tempo: number,
    time_signature: number,
    track_href: string,
    type : 'audio_features',
    uri: string,
    valence: number
  }

  export interface  CategoryObject {
    href: string,
    icons: [ImageObject],
    id: string,
    name: string
  }

  export interface  ContextObject {
    external_urls: ExternalUrlObject,
    href: string,
    type : 'artist' | 'playlist' | 'album' | 'show'
    url: string
  }

  export interface  DeviceObject {
    id?: string,
    is_active: boolean,
    is_private_session: boolean,
    is_restricted: boolean,
    name: string,
    type : 'computer' | 'smartphone' | 'speaker',
    volume_percent?: number
  }

  export interface  DevicesObject {
    devices: [DeviceObject]
  }

  export interface  DisallowsObject {
    interrupting_playback?: boolean,
    pausing?: boolean,
    resuming?: boolean,
    seeking?: boolean,
    skipping_next?: boolean,
    skipping_prev?: boolean,
    toggling_repeat_context?: boolean,
    toggling_repeat_track?: boolean,
    toggling_shuffle?: boolean,
    transferring_playback?: boolean
  }

  export interface  ResumePointObject {
    fully_played: boolean,
    resume_position_ms: number
  }

  export interface  EpisodeObject {
    audio_preview_url?: string,
    description: string,
    duration_msg: number,
    explicit: boolean,
    external_urls: ExternalUrlObject,
    href: string,
    id: string,
    images: [ImageObject],
    is_externally_hosted: boolean,
    is_playable: boolean,
    languages: [string],
    name: string,
    release_date: string,
    release_date_precision: 'year' | 'month' | 'day',
    resume_points: ResumePointObject,
    show: 'episode',
    uri: string
  }

  export interface  SimplifiedAlbumObject {
    album_group: 'album' | 'single' | 'compilation' | 'appears_on',
    album_type : 'album' | 'single' | 'compilation',
    artists: [SimplifiedArtistObject],
    available_markets: [string],
    external_urls: ExternalUrlObject,
    href: string,
    id: string,
    images: [ImageObject],
    name: string,
    release_date: string,
    release_date_precision: 'year' | 'month' | 'day',
    restrictions: AlbumRestrictionObject,
    type : 'album',
    uri: string
  }

  export interface  TrackObject {
    album: SimplifiedAlbumObject,
    artists: [ArtistObject],
    available_markets: [string],
    disc_number: number,
    duration_ms: number,
    explicit: boolean,
    external_ids: ExternalIdObject,
    external_urls: ExternalUrlObject,
    href: string,
    id: string,
    is_local: boolean,
    is_playable: boolean,
    linked_from: LinkedTrackObject,
    name: string,
    popularity: number,
    preview_url?: string,
    restrictions: TrackRestrictionObject,
    track_number: number,
    type : 'track',
    uri: string
  }

  export interface  CurrentlyPlayingContextObject {
    actions: DisallowsObject,
    context?: ContextObject,
    currently_playing_type : 'track' | 'episode' | 'ad' | 'unknown',
    device: DeviceObject,
    is_playing: boolean,
    item: TrackObject | EpisodeObject | null,
    progress_msg?: number,
    repeat_state: 'off' | 'track' | 'context',
    shuffle_state: 'off' | 'on',
    timestamp: number
  }

  export interface  CurrentlyPlayingObject {
    context?: ContextObject,
    currently_playing_type : 'track' | 'episode' | 'ad' | 'unknown',
    is_playing: boolean,
    item: TrackObject | EpisodeObject,
    progress_ms?: number,
    timestamp: number
  }

  export interface  CursorObject {
    after: string
  }

  export interface  CursorPagingObject {
    cursors: CursorObject,
    href: string,
    items: [object],
    limit: number,
    next?: string,
    total: number
  }

  export interface  ErrorObject {
    message: string,
    status: number
  }

  export interface  ExplicitContentSettingsObject {
    filter_enabled: boolean,
    filter_locked: boolean
  }

  export interface  PagingObject {
    href: string,
    items: [object],
    limit: number,
    next?: string,
    offset: number,
    previous?: string,
    total: number
  }

  export interface  PlayerErrorObject {
    message: string,
    reason: 'NO_PREV_TRACK' | 'NO_NEXT_TRACK' | 'NO_SPECIFIC_TRACK' | 'ALREADY_PAUSED' | 'NOT_PAUSED' | 'NOT_PLAYING_LOCALLY' | 'NOT_PLAYING_TRACK' | 'NOT_PLAYING_CONTEXT' | 'ENDLESS_CONTEXT' | 'CONTEXT_DISALLOW' | 'ALREADY_PLAYING' | 'RATE_LIMITED' | 'REMOTE_CONTROL_DISALLOW' | 'DEVICE_NOT_CONTROLLABLE' | 'VOLUME_CONTROL_DISALLOW' | 'NO_ACTIVE_DEVICE' | 'PREMIUM_REQUIRED' | 'UNKNOWN',
    status: 404 | 403
  }

  export interface  PlayHistoryObject {
    context: ContextObject,
    played_at: number,
    track: SimplifiedTrackObject
  }

  export interface  PublicUserObject {
    display_name?: string,
    external_urls: ExternalUrlObject,
    followers: FollowersObject,
    href: string,
    id: string,
    images: [ImageObject],
   type: 'user',
    uri: string
  }

  export interface  PlaylistTrackObject {
    added_at?: number,
    added_by?: PublicUserObject,
    is_local: boolean,
    track: TrackObject | EpisodeObject
  }

  export interface  PlaylistObject {
    collaborative: boolean,
    description?: string,
    external_urls: ExternalUrlObject,
    followers: FollowersObject,
    href: string,
    id: string,
    images: [ImageObject],
    name: string,
    owner: PublicUserObject,
    public?: boolean,
    snapshot_id: string,
    tracks: [PlaylistTrackObject?],
    type : 'playlist',
    uri: string
  }

  export interface  PlaylistTracksRefObject {
    href: string,
    total: number
  }

  export interface  PrivateUserObject {
    country: string,
    display_name?: string,
    email: string,
    explicit_content: ExplicitContentSettingsObject,
    external_urls: ExternalUrlObject,
    followers: FollowersObject,
    href: string,
    id: string,
    images: [ImageObject],
    product: string,
    type : 'user',
    uri: string
  }

  export interface  RecommendationSeedObject {
    afterFilteringSize: number,
    afterRelinkingSize: number,
    href?: string,
    id: string,
    initialPoolSize: number,
    type: 'artist' | 'track' | 'genre'
  }

  export interface  RecommendationsObject {
    seeds: [RecommendationSeedObject],
    tracks: [SimplifiedTrackObject]
  }

  export interface  SavedAlbumObject {
    added_at: number,
    album: AlbumObject
  }

  export interface  SimplifiedShowObject {
    available_markets: [string],
    copyrights: [CopyrightObject],
    description: string,
    explicit: boolean,
    external_urls: ExternalUrlObject,
    href: string,
    id: string,
    images: [ImageObject],
    is_externally_hosted?: boolean,
    languages: [string],
    media_type : string,
    name: string,
    publisher: string,
    type : 'show',
    uri: string
  }

  export interface  SavedShowObject {
    added_at: number,
    show: SimplifiedShowObject
  }

  export interface  SavedTrackObject {
    added_at: number,
    track: TrackObject
  }

  export interface  SimplifiedEpisodeObject {
    audio_preview_url?: string,
    description: string,
    duration_ms: number,
    explicit: boolean,
    external_urls: ExternalUrlObject,
    href: string,
    id: string,
    images: [ImageObject],
    is_externally_hosted: boolean,
    is_playable: boolean,
    languages: [string],
    name: string,
    release_date: string,
    release_date_precision: 'year' | 'month' | 'day',
    resume_point: ResumePointObject,
    type: 'episode',
    uri: string
  }

  export interface  ShowObject {
    available_markets: [string],
    copyrights: [CopyrightObject],
    description: string,
    episodes: [SimplifiedEpisodeObject],
    explicit: boolean,
    external_urls: ExternalUrlObject,
    href: string,
    id: string,
    images: [ImageObject],
    is_externally_hosted?: boolean,
    languages: [string],
    media_type : string,
    name: string,
    publisher: string,
    type: 'show',
    uri: string
  }

  export interface  SimplifiedPlaylistObject {
    collaborative: boolean,
    description?: string,
    external_urls: ExternalUrlObject,
    href: string,
    id: string,
    images: [ImageObject],
    name: string,
    owner: PublicUserObject,
    public?: boolean,
    snapshot_id: string,
    tracks?: PlaylistTracksRefObject,
    type : 'playlist',
    uri: string
  }

  export interface  TuneableTrackObject {
    acousticness: number,
    danceability: number,
    duration_ms: number,
    energy: number,
    instrumentalness: number,
    key: number,
    liveness: number,
    loudness: number,
    mode: number,
    popularity: number,
    speechiness: number,
    tempo: number,
    time_signature: number,
    valence: number
  }
}

// export export interface  {
//   AlbumObject, AlbumRestrictionObject, ArtistObject,
//   AudioFeaturesObject, CategoryObject, ContextObject,
//   CopyrightObject, CurrentlyPlayingContextObject,
//   CurrentlyPlayingObject, CursorObject, CursorPagingObject,
//   DeviceObject, DevicesObject, DisallowsObject, EpisodeObject,
//   ErrorObject, ExplicitContentSettingsObject, ExternalIdObject,
//   ExternalUrlObject, FollowersObject, ImageObject, LinkedTrackObject,
//   PagingObject, PlayHistoryObject, PlayerErrorObject, PlaylistObject,
//   PlaylistTrackObject, PlaylistTracksRefObject, PrivateUserObject, PublicUserObject,
//   RecommendationSeedObject, RecommendationsObject, ResumePointObject, SavedAlbumObject,
//   SavedShowObject, SavedTrackObject, ShowObject, SimplifiedAlbumObject,
//   SimplifiedArtistObject, SimplifiedEpisodeObject, SimplifiedPlaylistObject,
//   SimplifiedShowObject, SimplifiedTrackObject, TrackObject, TrackRestrictionObject,
//   TuneableTrackObject,
// }
