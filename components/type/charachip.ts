import Chara from '~/components/type/chara'

interface Charachip {
  id: number
  name: string
  designer_id: number
  description_utl: string
  chara_list: Chara[]
}

export default Charachip
