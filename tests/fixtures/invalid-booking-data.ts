// Invalid booking scenarios for negative testing

export const invalidBookings = {
  // Missing required fields
  missingUserId: {
    room_id: 3,
    date: '2024-04-15',
    start_time: '18:00',
    duration_hours: 2,
    party_size: 4,
    total_price: 80.0,
    status: 'confirmed',
  },

  missingRoomId: {
    user_id: 1,
    date: '2024-04-15',
    start_time: '18:00',
    duration_hours: 2,
    party_size: 4,
    total_price: 80.0,
    status: 'confirmed',
  },

  // Invalid data types
  invalidUserId: {
    user_id: 'not-a-number',
    room_id: 3,
    date: '2024-04-15',
    start_time: '18:00',
    duration_hours: 2,
    party_size: 4,
    total_price: 80.0,
    status: 'confirmed',
  },

  // Invalid date format
  invalidDateFormat: {
    user_id: 1,
    room_id: 3,
    date: '04/15/2024', // Wrong format (MM/DD/YYYY instead of YYYY-MM-DD)
    start_time: '18:00',
    duration_hours: 2,
    party_size: 4,
    total_price: 80.0,
    status: 'confirmed',
  },

  // Invalid time format
  invalidTimeFormat: {
    user_id: 1,
    room_id: 3,
    date: '2024-04-15',
    start_time: '6:00 PM', // Wrong format (12-hour instead of 24-hour)
    duration_hours: 2,
    party_size: 4,
    total_price: 80.0,
    status: 'confirmed',
  },

  // Invalid status enum
  invalidStatus: {
    user_id: 1,
    room_id: 3,
    date: '2024-04-15',
    start_time: '18:00',
    duration_hours: 2,
    party_size: 4,
    total_price: 80.0,
    status: 'blocked', // Invalid status
  },

  // Negative numbers
  negativePartySize: {
    user_id: 1,
    room_id: 3,
    date: '2024-04-15',
    start_time: '18:00',
    duration_hours: 2,
    party_size: -4,
    total_price: 80.0,
    status: 'confirmed',
  },

  // Zero values where not allowed
  zeroDuration: {
    user_id: 1,
    room_id: 3,
    date: '2024-04-15',
    start_time: '18:00',
    duration_hours: 0,
    party_size: 4,
    total_price: 80.0,
    status: 'confirmed',
  },

  // Past date (business logic)
  pastDate: {
    user_id: 1,
    room_id: 3,
    date: '2020-01-01',
    start_time: '18:00',
    duration_hours: 2,
    party_size: 4,
    total_price: 80.0,
    status: 'confirmed',
  },
};
