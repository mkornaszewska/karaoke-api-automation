const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);
const futureDate = nextMonth.toISOString().split('T')[0];

// Valid booking data template
export const validBookingData = {
  user_id: 1,
  room_id: 3,
  date: futureDate,
  start_time: '18:00',
  duration_hours: 2,
  party_size: 4,
  total_price: 80.0,
  status: 'confirmed',
  special_requests: 'Need microphone stand',
};

// Minimal valid booking (only required fields)
export const minimalBookingData = {
  user_id: 1,
  room_id: 3,
  date: futureDate,
  start_time: '18:00',
  duration_hours: 2,
  party_size: 4,
  total_price: 80.0,
  status: 'confirmed',
};

// Multiple valid bookings for batch testing
export const validBookings = [
  {
    ...validBookingData,
    start_time: '18:00',
  },
  {
    ...validBookingData,
    start_time: '20:00',
    party_size: 6,
    total_price: 120.0,
  },
  {
    ...validBookingData,
    start_time: '19:00',
    status: 'pending',
  },
];
