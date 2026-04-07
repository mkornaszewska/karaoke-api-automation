export const ENDPOINTS = {
  BOOKINGS: 'bookings',
  BOOKINGS_BY_ID: (id: string | number) => `bookings/${id}`,
  ROOMS: 'rooms',
  ROOMS_BY_ID: (id: string | number) => `rooms/${id}`,
} as const;
