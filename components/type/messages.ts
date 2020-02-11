import Message from '~/components/type/message'

interface Messages {
  list: Message[]
  all_page_count: number | null
  exist_pre_page: boolean | null
  exist_next_page: boolean | null
  current_page_num: number | null
  page_num_list: number[] | null
}

export default Messages
