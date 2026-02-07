export const ENDPOINTS = {
  BOOKINGS: 'bookings',
  BOOKINGS_BY_ID: (id: number) => `bookings/${id}`,
} as const;
