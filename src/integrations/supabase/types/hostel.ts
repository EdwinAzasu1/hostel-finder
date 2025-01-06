export type HostelRoomType = {
  id: string
  hostel_id: string | null
  room_type: string
  price: number
  created_at: string
}

export type Hostel = {
  id: string
  name: string
  description: string | null
  price: number
  available_rooms: number
  owner_name: string
  owner_contact: string
  thumbnail: string | null
  created_at: string
  updated_at: string
  roomTypes?: HostelRoomType[]
}