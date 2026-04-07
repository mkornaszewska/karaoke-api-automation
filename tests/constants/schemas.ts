export type SortOrder = 'asc' | 'desc';
export const BOOKING_STATUSES = ['confirmed', 'pending', 'cancelled', 'completed'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export interface RoomReview {
  id: number;
  user_id: number;
  booking_id: number;
  rating: number;
  comment: string;
  would_recommend: boolean;
  created_at: string;
}

export interface Room {
  id: number;
  name: string;
  size: string;
  capacity: number;
  hourly_rate: number;
  weekend_rate: number;
  amenities: string[];
  floor: number;
  has_window: boolean;
  theme: string;
  is_available: boolean;
  average_rating: number;
  image_url: string;
  reviews: RoomReview[];
}

export const roomTypeSchema = {
  id: 'number',
  name: 'string',
  size: 'string',
  capacity: 'number',
  hourly_rate: 'number',
  weekend_rate: 'number',
  amenities: 'object',
  floor: 'number',
  has_window: 'boolean',
  theme: 'string',
  is_available: 'boolean',
  average_rating: 'number',
  image_url: 'string',
  reviews: 'object',
} as const;

export interface CreateRoomRequest {
  name: string;
  size: string;
  capacity: number;
  hourly_rate: number;
  weekend_rate: number;
  amenities: string[];
  floor: number;
  has_window: boolean;
  theme: string;
  is_available: boolean;
}

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
