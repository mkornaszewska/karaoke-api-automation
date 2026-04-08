import { test, expect } from '@playwright/test';
import { ENDPOINTS } from '../../constants/endpoints';
import { minimalBookingData, validBookingData, validBookings } from '../../fixtures/booking-data';
import { expectJsonResponse } from '../../helpers/api-helpers';
import { Booking, BOOKING_STATUSES, bookingTypeSchema } from '../../constants/schemas';

const created_at = new Date().toISOString();

const bookingPayload = {
  ...validBookingData,
  created_at,
};

test.describe('/POST bookings', () => {
  test.describe('Happy Path', () => {
    test('should create a booking with valid complete data', async ({ request }) => {
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

    test('should create a booking with minimal data', async ({ request }) => {
      const response = await request.post(ENDPOINTS.BOOKINGS, { data: minimalBookingData });
      expectJsonResponse(response, 201);

      const booking: Booking = await response.json();
      expect(booking.special_requests).toBeUndefined();
    });

    test('should create multiple bookings', async ({ request }) => {
      const responses = await Promise.all(
        validBookings.map((booking) => request.post(ENDPOINTS.BOOKINGS, { data: booking }))
      );

      const bookings: Booking[] = await Promise.all(responses.map((r) => r.json()));
      const ids = bookings.map((b) => b.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    test('should create a booking for each valid status', async ({ request }) => {
      for (const status of BOOKING_STATUSES) {
        const response = await request.post(ENDPOINTS.BOOKINGS, {
          data: { ...validBookingData, status },
        });
        expectJsonResponse(response, 201);
        const booking: Booking = await response.json();
        expect(booking.status).toBe(status);
      }
    });
  });

  test.describe('Response Schema', () => {
    test('should return a response with correct property types', async ({ request }) => {
      const response = await request.post(ENDPOINTS.BOOKINGS, { data: bookingPayload });
      expectJsonResponse(response, 201);

      const booking: Booking = await response.json();
      Object.entries(bookingTypeSchema).forEach(([property, expectedType]) => {
        expect(typeof booking[property as keyof Booking]).toBe(expectedType);
      });
    });
  });
});
