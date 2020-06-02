interface VillageTime {
  term_type: string
  start_datetime: string
  day_change_interval_seconds: number
  silent_hours: number | null
  sayable_start: string
  sayable_end: string
}

export default VillageTime
