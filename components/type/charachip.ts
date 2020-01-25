import Designer from '~/components/type/designer'
import Chara from '~/components/type/chara'

interface Charachip {
  id: number
  name: string
  designer: Designer
  description_url: string
  chara_list: Chara[]
}

export default Charachip
