export const bookingTypeSchema = {
  id: 'number',
  user_id: 'number',
  room_id: 'number',
  date: 'string',
  start_time: 'string',
  duration_hours: 'number',
  party_size: 'number',
  total_price: 'number',
  status: 'string',
  special_requests: 'string',
  created_at: 'string',
} as const;

export interface Booking {
  id: number;
  user_id: number;
  room_id: number;
  date: string;
  start_time: string;
  duration_hours: number;
  party_size: number;
  total_price: number;
  status: 'confirmed' | 'pending' | 'cancelled'; // ← Union type for enum
  special_requests: string;
  created_at: string;
}

export const BOOKING_STATUSES = ['confirmed', 'pending', 'cancelled'] as const;
