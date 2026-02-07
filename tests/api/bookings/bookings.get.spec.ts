import { expect, test } from '@playwright/test';
import { getBookings, expectJsonResponse } from '../../helpers/api-helpers';
import { Booking, bookingTypeSchema, BOOKING_STATUSES } from '../../constants/schemas';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('/GET bookings', () => {
  test.describe('HTTP contract', () => {
    test('should return 200 OK with JSON array', async ({ request }) => {
      const response = await request.get(ENDPOINTS.BOOKINGS);
      expectJsonResponse(response, 200);

      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
    });
  });

  test.describe('Response structure', () => {
    test('should return bookings with all required properties', async ({ request }) => {
      const bookings = await getBookings(request);
      // Note: Using my-json-server with static db.json - data is consistent
      const booking = bookings[0];

      const properties = Object.keys(bookingTypeSchema);
      properties.forEach((property) => {
        expect(booking).toHaveProperty(property);
      });
    });

    test('should return bookings with correct primitive types', async ({ request }) => {
      const bookings = await getBookings(request);
      const booking = bookings[0];

      Object.entries(bookingTypeSchema).forEach(([property, expectedType]) => {
        expect(typeof booking[property]).toBe(expectedType);
      });
    });
  });

  test.describe('Data validation', () => {
    test('should have valid date and time formats', async ({ request }) => {
      const bookings: Booking[] = await getBookings(request);

      bookings.forEach((booking) => {
        // YYYY-MM-DD format (e.g., 2026-02-01)
        expect(booking.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(new Date(booking.date).toString()).not.toBe('Invalid Date');
        // HH:MM 24-hour format (00:00 to 23:59)
        expect(booking.start_time).toMatch(/^([0-1]\d|2[0-3]):[0-5]\d$/);
        // ISO 8601 datetime with UTC timezone
        expect(booking.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
      });
    });

    test('should have valid enum values', async ({ request }) => {
      const bookings: Booking[] = await getBookings(request);
      bookings.forEach((booking) => {
        expect(BOOKING_STATUSES).toContain(booking.status);
      });
    });

    test('should have valid numeric ranges', async ({ request }) => {
      const bookings: Booking[] = await getBookings(request);
      bookings.forEach((booking) => {
        expect(booking.id).toBeGreaterThan(0);
        expect(booking.user_id).toBeGreaterThan(0);
        expect(booking.room_id).toBeGreaterThan(0);

        expect(booking.duration_hours).toBeGreaterThan(0);
        expect(booking.total_price).toBeGreaterThan(0);
        expect(booking.party_size).toBeGreaterThan(0);
      });
    });
  });
  test.describe('Error handling', () => {
    test('should return 404 Not Found for non-existent id', async ({ request }) => {
      // Request booking with ID that doesn't exist in static test data
      const response = await request.get(ENDPOINTS.BOOKINGS_BY_ID(99999));
      expect(response.status()).toBe(404);
    });
    test('should return 404 for invalid booking ID format', async ({ request }) => {
      const response = await request.get(`${ENDPOINTS.BOOKINGS}/invalid`);
      expect(response.status()).toBe(404);
    });
  });

  test.describe('Query parameters - Filtering', () => {
    test('should filter bookings by status', async ({ request }) => {
      const CONFIRMED = BOOKING_STATUSES[0];
      const response = await request.get(`${ENDPOINTS.BOOKINGS}?status=${CONFIRMED}`);
      expectJsonResponse(response, 200);

      const bookings: Booking[] = await response.json();

      for (const booking of bookings) {
        expect(booking.status).toBe(CONFIRMED);
      }
    });

    test('should filter bookings by room_id', async ({ request }) => {
      const response = await request.get(`${ENDPOINTS.BOOKINGS}?room_id=1`);
      expectJsonResponse(response, 200);

      const bookings: Booking[] = await response.json();
      for (const booking of bookings) {
        expect(booking.room_id).toBe(1);
      }
    });
  });

  test.describe('Query parameters - Sorting', () => {
    test('should sort bookings by date ascending', async ({ request }) => {
      const response = await request.get(`${ENDPOINTS.BOOKINGS}?_sort=date`);
      expectJsonResponse(response, 200);

      const bookings: Booking[] = await response.json();
      expect(bookings.length).toBeGreaterThan(1);

      for (let i = 1; i < bookings.length; i++) {
        const prevDate = new Date(bookings[i - 1].date);
        const currDate = new Date(bookings[i].date);

        expect(prevDate.getTime()).toBeLessThanOrEqual(currDate.getTime());
      }
    });
  });
  // Note: my-json-server does not support descending sort with -field syntax
});
