import { Booking } from '../constants/schemas';

// Generate a random booking with current/future date

export function generateRandomBooking(): Omit<Booking, 'id' | 'created_at'> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);

  const hours = Math.floor(Math.random() * 12) + 12; // 12-23
  const minutes = Math.random() > 0.5 ? '00' : '30';

  return {
    user_id: Math.floor(Math.random() * 100) + 1,
    room_id: Math.floor(Math.random() * 10) + 1,
    date: futureDate.toISOString().split('T')[0],
    start_time: `${hours.toString().padStart(2, '0')}:${minutes}`,
    duration_hours: [1, 2, 3, 4][Math.floor(Math.random() * 4)],
    party_size: Math.floor(Math.random() * 10) + 1,
    total_price: parseFloat((Math.random() * 200 + 50).toFixed(2)),
    status: ['confirmed', 'pending'][Math.floor(Math.random() * 2)] as 'confirmed' | 'pending',
    special_requests: 'Test request',
  };
}

export function generateBooking(
  overrides: Partial<Omit<Booking, 'id' | 'created_at'>> = {}
): Omit<Booking, 'id' | 'created_at'> {
  const base = generateRandomBooking();
  return { ...base, ...overrides };
}
