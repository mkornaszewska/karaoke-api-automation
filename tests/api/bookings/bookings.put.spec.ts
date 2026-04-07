import { expect, test } from '@playwright/test';
import { ENDPOINTS } from '../../constants/endpoints';
import { expectJsonResponse } from '../../helpers/api-helpers';
import { validBookingData } from '../../fixtures/booking-data';

const replacementBooking = {
  user_id: 1,
  room_id: 2,
  date: '2026-06-15',
  start_time: '19:00',
  duration_hours: 3,
  party_size: 5,
  total_price: 7500,
  status: 'pending',
  special_requests: 'Updated via PUT',
  created_at: '2026-01-25T10:30:00Z',
};

test.describe('PUT /bookings/:id', () => {
  test.describe('Full update (PUT)', () => {
    test('should replace a booking and return 200', async ({ request }) => {
      const response = await request.put(ENDPOINTS.BOOKINGS_BY_ID(1), { data: replacementBooking });

      expectJsonResponse(response, 200);

      const responseBody = await response.json();

      expect(responseBody.status).toEqual('pending');
      expect(responseBody.special_requests).toEqual('Updated via PUT');
      expect(responseBody.party_size).toEqual(5);
    });

    test('should persist the update — GET after PUT', async ({ request }) => {
      const response = await request.put(ENDPOINTS.BOOKINGS_BY_ID(2), { data: replacementBooking });

      expectJsonResponse(response, 200);

      const getBooking = await request.get(ENDPOINTS.BOOKINGS_BY_ID(2));
      expectJsonResponse(getBooking, 200);

      const getResponse = await getBooking.json();

      expect(getResponse.status).toEqual('pending');
      expect(getResponse.party_size).toEqual(5);
      expect(getResponse.total_price).toEqual(7500);
    });

    test('should return 404 when updating a non-existent booking', async ({ request }) => {
      const response = await request.put(ENDPOINTS.BOOKINGS_BY_ID(9999), {
        data: replacementBooking,
      });
      expect(response.status()).toBe(404);
    });
  });

  test.describe('Partial update (PATCH)', () => {
    test('should update only the status with PATCH', async ({ request }) => {
      const postRes = await request.post(ENDPOINTS.BOOKINGS, { data: validBookingData });
      const { id } = await postRes.json();

      const response = await request.patch(ENDPOINTS.BOOKINGS_BY_ID(id), {
        data: { status: 'cancelled' },
      });

      expectJsonResponse(response, 200);

      const responseBody = await response.json();
      expect(responseBody.status).toEqual('cancelled');
      expect(responseBody.user_id).toBeDefined();
      expect(responseBody.room_id).toBeDefined();
    });

    test('should update only special_requests with PATCH', async ({ request }) => {
      const postRes = await request.post(ENDPOINTS.BOOKINGS, { data: validBookingData });
      const { id } = await postRes.json();

      const response = await request.patch(ENDPOINTS.BOOKINGS_BY_ID(id), {
        data: { special_requests: 'Extra mic needed' },
      });

      expectJsonResponse(response, 200);

      const responseBody = await response.json();

      expect(responseBody.special_requests).toEqual('Extra mic needed');
      expect(responseBody.room_id).toEqual(validBookingData.room_id);
      expect(responseBody.duration_hours).toEqual(validBookingData.duration_hours);
    });

    test('should persist PATCH changes — GET after PATCH', async ({ request }) => {
      const postRes = await request.post(ENDPOINTS.BOOKINGS, {
        data: validBookingData,
      });
      const postResBody = await postRes.json();
      const postBookingId = postResBody.id;

      await request.patch(ENDPOINTS.BOOKINGS_BY_ID(postBookingId), {
        data: { party_size: 10 },
      });

      const getRes = await request.get(ENDPOINTS.BOOKINGS_BY_ID(postBookingId));
      expectJsonResponse(getRes, 200);

      const getResBody = await getRes.json();
      expect(getResBody.party_size).toEqual(10);
    });
  });
});
