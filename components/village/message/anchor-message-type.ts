import AnchorType from '~/components/village/message/anchor-type'
import { MESSAGE_TYPE } from '~/components/const/consts'

const anchorTypeToMessageType = (anchorType: AnchorType): string => {
  let type: string = ''
  switch (anchorType) {
    case AnchorType.Normal:
      type = MESSAGE_TYPE.NORMAL_SAY
      break
    case AnchorType.Grave:
      type = MESSAGE_TYPE.GRAVE_SAY
      break
    case AnchorType.Wolf:
      type = MESSAGE_TYPE.WEREWOLF_SAY
      break
    case AnchorType.Mason:
      type = MESSAGE_TYPE.MASON_SAY
      break
    case AnchorType.Spectate:
      type = MESSAGE_TYPE.SPECTATE_SAY
      break
    case AnchorType.Monologue:
      type = MESSAGE_TYPE.MONOLOGUE_SAY
      break
    case AnchorType.Creator:
      type = MESSAGE_TYPE.CREATOR_SAY
      break
    default:
      break
  }
  return type
}

export default anchorTypeToMessageType
