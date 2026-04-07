import { test, expect } from '@playwright/test';
import { ENDPOINTS } from '../../constants/endpoints';
import { validBookingData } from '../../fixtures/booking-data';
import { expectJsonResponse } from '../../helpers/api-helpers';
import { Booking } from '../../constants/schemas';

test.describe('/POST bookings', () => {
  test.describe('Happy Path', () => {
    test('should create a booking with valid complete data', async ({ request }) => {
      const created_at = new Date().toISOString();

      const bookingPayload = {
        ...validBookingData,
        created_at,
      };
      const response = await request.post(ENDPOINTS.BOOKINGS, { data: bookingPayload });

      expectJsonResponse(response, 201);
      const booking: Booking = await response.json();

      expect(booking.id).toBeDefined();
      expect(typeof booking.id).toBe('string');

      const fieldsToVerify = [
        'user_id',
        'room_id',
        'date',
        'start_time',
        'duration_hours',
        'party_size',
        'total_price',
        'status',
        'special_requests',
      ] as const;

      fieldsToVerify.forEach((field) => {
        expect(booking[field]).toBe(validBookingData[field]);
      });

      expect(booking.created_at).toBeDefined();

      const createdAt = new Date(booking.created_at);
      expect(createdAt.getTime()).toBeGreaterThan(Date.now() - 60_000);
      expect(createdAt.getTime()).toBeLessThanOrEqual(Date.now());

      const getResponse = await request.get(`${ENDPOINTS.BOOKINGS}/${booking.id}`);
      expect(getResponse.status()).toBe(200);
      const fetched = await getResponse.json();
      expect(fetched.id).toBe(booking.id);
    });
  });
});
