import CharaName from '~/components/type/chara/chara-name'
import CharaDefaultMessage from '~/components/type/chara/chara-default-message'
import CharaSize from '~/components/type/chara/chara-size'
import CharaFace from '~/components/type/chara/chara-face'

interface Chara {
  id: number
  chara_name: CharaName
  charachip_id: number
  default_message: CharaDefaultMessage
  display: CharaSize
  face_list: CharaFace[]
}

export default Chara
