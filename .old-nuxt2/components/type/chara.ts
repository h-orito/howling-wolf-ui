import CharaSize from '~/components/type/chara-size'
import CharaFace from '~/components/type/chara-face'
import CharaName from '~/components/type/chara-name'
import CharaDefaultMessage from '~/components/type/chara-default-message'

interface Chara {
  id: number
  chara_name: CharaName
  charachip_id: number
  default_message: CharaDefaultMessage
  display: CharaSize
  face_list: CharaFace[]
}

export default Chara
