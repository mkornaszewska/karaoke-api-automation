export const ENDPOINTS = {
  BOOKINGS: 'bookings',
  BOOKINGS_BY_ID: (id: string) => `bookings/${id}`,
} as const;
