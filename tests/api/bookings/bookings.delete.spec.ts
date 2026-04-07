import { expect, test } from '@playwright/test';
import { ENDPOINTS } from '../../constants/endpoints';
import { expectJsonResponse, getBookings } from '../../helpers/api-helpers';
import { validBookingData } from '../../fixtures/booking-data';

test.describe('DELETE /bookings/:id', () => {
  const newBooking = {
    ...validBookingData,
    created_at: new Date().toISOString(),
  };

  test.describe('Successful deletion', () => {
    test('should delete a booking and return 200', async ({ request }) => {
      const response = await request.delete(ENDPOINTS.BOOKINGS_BY_ID(3));
      expectJsonResponse(response, 200);
    });

    test('should return 404 on GET after DELETE', async ({ request }) => {
      const response = await request.delete(ENDPOINTS.BOOKINGS_BY_ID(2));
      expectJsonResponse(response, 200);
      const getRes = await request.get(ENDPOINTS.BOOKINGS_BY_ID(2));
      expect(getRes.status()).toBe(404);
    });

    test('should delete a newly created booking', async ({ request }) => {
      const postRes = await request.post(ENDPOINTS.BOOKINGS, { data: newBooking });
      const postResBody = await postRes.json();

      const delRes = await request.delete(ENDPOINTS.BOOKINGS_BY_ID(postResBody.id));
      expectJsonResponse(delRes, 200);

      const getRes = await request.get(ENDPOINTS.BOOKINGS_BY_ID(postResBody.id));
      expect(getRes.status()).toBe(404);
    });

    test('should return to original count after POST then DELETE', async ({ request }) => {
      const beforeBookings = await getBookings(request);

      const postRes = await request.post(ENDPOINTS.BOOKINGS, { data: newBooking });
      const { id } = await postRes.json();

      await request.delete(ENDPOINTS.BOOKINGS_BY_ID(id));

      const afterBookings = await getBookings(request);
      expect(afterBookings.length).toBe(beforeBookings.length);
    });
  });

  test.describe('Error handling', () => {
    test('should return 404 when deleting a non-existent booking', async ({ request }) => {
      const response = await request.delete(ENDPOINTS.BOOKINGS_BY_ID(9999));
      expect(response.status()).toBe(404);
    });

    test('should return 404 on second DELETE of the same booking', async ({ request }) => {
      const postRes = await request.post(ENDPOINTS.BOOKINGS, { data: newBooking });
      const { id } = await postRes.json();

      const delRes = await request.delete(ENDPOINTS.BOOKINGS_BY_ID(id));
      expectJsonResponse(delRes, 200);
      const delRes2 = await request.delete(ENDPOINTS.BOOKINGS_BY_ID(id));
      expect(delRes2.status()).toBe(404);
    });
  });
});
