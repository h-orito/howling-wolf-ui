interface ReservedVillage {
  id: number
  village_create_datetime: string
  village_start_datetime: string
  organization: string
  silent_hours: number
  sayable_start: string
  sayable_end: string
  available_dummy_skill: boolean
}

export default ReservedVillage
