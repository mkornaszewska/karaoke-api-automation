import { expect, test } from '@playwright/test';
import { ENDPOINTS } from '../../constants/endpoints';
import { expectJsonResponse } from '../../helpers/api-helpers';
import { Room } from '../../constants/schemas';

const newRoom = {
  name: 'Akihabara Neon',
  size: 'medium',
  capacity: 6,
  hourly_rate: 2200,
  weekend_rate: 2800,
  amenities: ['m4', 'tmb', 'nl'],
  floor: 4,
  has_window: true,
  theme: 'neon',
  is_available: true,
  average_rating: 0,
  image_url: '/r/test.jpg',
  reviews: [],
};

test.describe('POST /rooms', () => {
  test.describe('Happy path', () => {
    test('should create a room and return 201', async ({ request }) => {
      const response = await request.post(ENDPOINTS.ROOMS, { data: newRoom });

      expectJsonResponse(response, 201);

      const room: Room = await response.json();

      expect(room.id).toBeDefined();
      expect(typeof room.id).toBe('string');
    });

    test('should return the created room in the response body', async ({ request }) => {
      const response = await request.post(ENDPOINTS.ROOMS, { data: newRoom });

      expectJsonResponse(response, 201);

      const room: Room = await response.json();

      const fieldsToVerify = ['name', 'size', 'capacity', 'hourly_rate', 'is_available'] as const;

      fieldsToVerify.forEach((field) => {
        const expected = newRoom[field];
        const actual = room[field];
        expect(actual).toBe(expected);
      });
    });

    test('should persist the created room — GET after POST', async ({ request }) => {
      const response = await request.post(ENDPOINTS.ROOMS, { data: newRoom });

      expectJsonResponse(response, 201);

      const room: Room = await response.json();
      const roomId = room.id;

      const getResponse = await request.get(ENDPOINTS.ROOMS_BY_ID(roomId));

      expectJsonResponse(getResponse, 200);
      const roomById = await getResponse.json();

      expect(roomById.name).toEqual(newRoom.name);
      expect(roomById.capacity).toEqual(newRoom.capacity);
    });

    test('should store array fields correctly', async ({ request }) => {
      const response = await request.post(ENDPOINTS.ROOMS, { data: newRoom });

      expectJsonResponse(response, 201);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody.amenities)).toBe(true);
      expect(responseBody.amenities).toHaveLength(newRoom.amenities.length);

      expect(Array.isArray(responseBody.reviews)).toBe(true);
      expect(responseBody.reviews).toHaveLength(newRoom.reviews.length);
    });
  });

  test.describe('Response assertions', () => {
    test('should match expected shape using toMatchObject', async ({ request }) => {
      const response = await request.post(ENDPOINTS.ROOMS, { data: newRoom });

      expectJsonResponse(response, 201);

      const responseBody = await response.json();

      const expectedObject = {
        name: newRoom.name,
        size: newRoom.size,
        capacity: newRoom.capacity,
        hourly_rate: newRoom.hourly_rate,
      };

      expect(responseBody).toMatchObject(expectedObject);
    });

    test('should return numeric fields as numbers', async ({ request }) => {
      const response = await request.post(ENDPOINTS.ROOMS, { data: newRoom });

      expectJsonResponse(response, 201);

      const responseBody = await response.json();
      const numericFields = ['hourly_rate', 'weekend_rate', 'capacity', 'floor'] as const;

      numericFields.forEach((field) => {
        expect(typeof responseBody[field]).toBe('number');
      });
    });

    test('should return boolean fields as booleans', async ({ request }) => {
      const response = await request.post(ENDPOINTS.ROOMS, { data: newRoom });

      expectJsonResponse(response, 201);

      const responseBody = await response.json();
      const booleanFields = ['has_window', 'is_available'] as const;

      booleanFields.forEach((field) => {
        expect(typeof responseBody[field]).toBe('boolean');
      });

      expect(responseBody.has_window).toEqual(newRoom.has_window);
    });
  });
});
