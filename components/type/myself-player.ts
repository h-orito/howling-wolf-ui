import Player from '~/components/type/player'
import Villages from '~/components/type/villages'

interface MyselfPlayer {
  id: number
  nickname: string
  twitter_user_name: string | null
  available_create_village: boolean
  participate_progress_villages: Villages
  participate_finished_villages: Villages
  create_progress_villages: Villages
  create_finished_villages: Villages
  blacklist_players: Player[]
  introduce_players: Player[]
  introduced_players: Player[]
}

export default MyselfPlayer
