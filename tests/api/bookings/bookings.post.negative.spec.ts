import { test } from '@playwright/test';
import { ENDPOINTS } from '../../constants/endpoints';
import { expectJsonResponse } from '../../helpers/api-helpers';
import { invalidBookings } from '../../fixtures/invalid-booking-data';

test.describe('/POST bookings', () => {
  test.describe('Negative tests', () => {
    test('should accept booking with missing user_id', async ({ request }) => {
      // Real server should return 400 Bad Request - user_id is a required field
      const response = await request.post(ENDPOINTS.BOOKINGS, {
        data: invalidBookings.missingUserId,
      });
      expectJsonResponse(response, 201);
    });

    test('should accept booking with missing room_id', async ({ request }) => {
      // Real server should return 400 Bad Request - room_id is a required field
      const response = await request.post(ENDPOINTS.BOOKINGS, {
        data: invalidBookings.missingRoomId,
      });
      expectJsonResponse(response, 201);
    });

    test('should accept booking with invalid user_id type', async ({ request }) => {
      // Real server should return 400 Bad Request when user_id type is invalid
      const response = await request.post(ENDPOINTS.BOOKINGS, {
        data: invalidBookings.invalidUserId,
      });
      expectJsonResponse(response, 201);
    });

    test('should accept booking with invalid date format', async ({ request }) => {
      // Real server should return 400 Bad Request when date format is invalid
      const response = await request.post(ENDPOINTS.BOOKINGS, {
        data: invalidBookings.invalidDateFormat,
      });
      expectJsonResponse(response, 201);
    });

    test('should accept booking with invalid time format', async ({ request }) => {
      // Real server should return 400 Bad Request when time format is invalid
      const response = await request.post(ENDPOINTS.BOOKINGS, {
        data: invalidBookings.invalidTimeFormat,
      });
      expectJsonResponse(response, 201);
    });

    test('should accept booking with invalid status', async ({ request }) => {
      // Real server should return 400 Bad Request when status is invalid
      const response = await request.post(ENDPOINTS.BOOKINGS, {
        data: invalidBookings.invalidStatus,
      });
      expectJsonResponse(response, 201);
    });

    test('should accept booking with negative party size', async ({ request }) => {
      // Real server should return 400 Bad Request when party size is a negative number
      const response = await request.post(ENDPOINTS.BOOKINGS, {
        data: invalidBookings.negativePartySize,
      });
      expectJsonResponse(response, 201);
    });

    test('should accept booking with 0 duration', async ({ request }) => {
      // Real server should return 400 Bad Request when duration is 0
      const response = await request.post(ENDPOINTS.BOOKINGS, {
        data: invalidBookings.zeroDuration,
      });
      expectJsonResponse(response, 201);
    });

    test('should accept booking with booking date in the past', async ({ request }) => {
      // Real server should return 400 Bad Request when booking date is in the past
      const response = await request.post(ENDPOINTS.BOOKINGS, {
        data: invalidBookings.pastDate,
      });
      expectJsonResponse(response, 201);
    });
  });
});
