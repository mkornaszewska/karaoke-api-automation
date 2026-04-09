import { expect, test } from '@playwright/test';
import { ENDPOINTS } from '../../constants/endpoints';
import { expectJsonResponse } from '../../helpers/api-helpers';
import { validRoomData } from '../../fixtures/room-data';
import { Room, roomTypeSchema } from '../../constants/schemas';

const replacementRoom = {
  name: 'Harajuku Lounge Small',
  size: 'small',
  capacity: 5,
  hourly_rate: 1585,
  weekend_rate: 1898,
  amenities: ['echo', 'm4', 'tbar', 'nl'],
  floor: 2,
  has_window: false,
  theme: 'pop',
  is_available: true,
  average_rating: 3.7,
  image_url: '/r/1.jpg',
  reviews: [
    {
      id: 1,
      user_id: 8,
      booking_id: 5,
      rating: 3,
      comment: 'Staff was super helpful.',
      would_recommend: false,
      created_at: '2026-02-09T22:35:39Z',
    },
    {
      id: 2,
      user_id: 19,
      booking_id: 21,
      rating: 3,
      comment: 'Loved the atmosphere.',
      would_recommend: false,
      created_at: '2026-01-17T22:35:39Z',
    },
    {
      id: 3,
      user_id: 19,
      booking_id: 3,
      rating: 5,
      comment: 'Amazing experience overall.',
      would_recommend: true,
      created_at: '2026-02-06T22:35:39Z',
    },
  ],
};

test.describe('PUT /rooms/:id', () => {
  test.describe('Full update (PUT)', () => {
    test('should replace a room and return 200', async ({ request }) => {
      const postRes = await request.post(ENDPOINTS.ROOMS, { data: validRoomData });
      const { id } = await postRes.json();

      const response = await request.put(ENDPOINTS.ROOMS_BY_ID(id), { data: replacementRoom });
      expectJsonResponse(response, 200);

      const room: Room = await response.json();
      Object.entries(roomTypeSchema).forEach(([property, expectedType]) => {
        expect(typeof room[property as keyof Room]).toBe(expectedType);
      });

      expect(room.name).toEqual(replacementRoom.name);
      expect(room.capacity).toEqual(replacementRoom.capacity);
      expect(room.theme).toEqual(replacementRoom.theme);
    });

    test('should persist the update - GET after PUT', async ({ request }) => {
      const postRes = await request.post(ENDPOINTS.ROOMS, { data: validRoomData });
      const { id } = await postRes.json();

      await request.put(ENDPOINTS.ROOMS_BY_ID(id), { data: replacementRoom });

      const getRes = await request.get(ENDPOINTS.ROOMS_BY_ID(id));
      expectJsonResponse(getRes, 200);
      const persistedRoom: Room = await getRes.json();

      Object.entries(replacementRoom).forEach(([property, expectedValue]) => {
        expect(persistedRoom[property as keyof Room]).toEqual(expectedValue);
      });

      expect(persistedRoom.id).toEqual(id);
    });

    test('should return 404 when updating a non-existent room', async ({ request }) => {
      const response = await request.put(ENDPOINTS.ROOMS_BY_ID(9999), { data: replacementRoom });
      expect(response.status()).toBe(404);
    });
  });
});
