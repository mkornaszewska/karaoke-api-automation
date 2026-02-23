export type SortOrder = 'asc' | 'desc';
export const BOOKING_STATUSES = ['confirmed', 'pending', 'cancelled', 'completed'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const bookingTypeSchema = {
  id: 'string',
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
  id: string;
  user_id: number;
  room_id: number;
  date: string;
  start_time: string;
  duration_hours: number;
  party_size: number;
  total_price: number;
  status: BookingStatus;
  special_requests: string;
  created_at: string;
}

export interface CreateBookingRequest {
  user_id: number;
  room_id: number;
  date: string;
  start_time: string;
  duration_hours: number;
  party_size: number;
  total_price: number;
  status: BookingStatus;
  special_requests?: string;
}
