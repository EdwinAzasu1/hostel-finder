export type HostelRoomType = {
  id: string;
  hostel_id: string | null;
  room_type: string;
  price: number;
  created_at: string;
}

export type Hostel = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  available_rooms: number;
  owner_name: string;
  owner_contact: string;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
  roomTypes?: HostelRoomType[];
}

// Interface for the UI components that use camelCase
export interface HostelUI {
  id: string;
  name: string;
  description?: string;
  price: string;
  availableRooms: number;
  ownerName: string;
  ownerContact: string;
  thumbnail: string;
  roomTypes?: HostelRoomType[];
}

// Utility function to convert database model to UI model
export const toHostelUI = (hostel: Hostel): HostelUI => ({
  id: hostel.id,
  name: hostel.name,
  description: hostel.description || undefined,
  price: hostel.price.toString(),
  availableRooms: hostel.available_rooms,
  ownerName: hostel.owner_name,
  ownerContact: hostel.owner_contact,
  thumbnail: hostel.thumbnail || '',
  roomTypes: hostel.roomTypes,
});

// Utility function to convert UI model to database model
export const toHostelDB = (hostel: HostelUI): Omit<Hostel, 'created_at' | 'updated_at' | 'roomTypes'> => ({
  id: hostel.id,
  name: hostel.name,
  description: hostel.description || null,
  price: parseFloat(hostel.price),
  available_rooms: hostel.availableRooms,
  owner_name: hostel.ownerName,
  owner_contact: hostel.ownerContact,
  thumbnail: hostel.thumbnail || null,
});