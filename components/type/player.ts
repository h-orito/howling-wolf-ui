interface Player {
  id: number
  nickname: string
  twitter_user_name: string
  other_site_name: string | null
  introduction: string | null
  introduced: boolean
}

export default Player
