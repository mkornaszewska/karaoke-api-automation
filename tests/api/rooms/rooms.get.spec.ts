import { expect, test } from '@playwright/test';
import { ENDPOINTS } from '../../constants/endpoints';
import { expectJsonResponse } from '../../helpers/api-helpers';
import { Room } from '../../constants/schemas';

test.describe('GET /rooms', () => {
  test.describe('HTTP contract', () => {
    test('should return 200 with a JSON array', async ({ request }) => {
      const response = await request.get(ENDPOINTS.ROOMS);
      expectJsonResponse(response, 200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
    });

    test('should return a single room by id', async ({ request }) => {
      const response = await request.get(ENDPOINTS.ROOMS_BY_ID(1));
      expectJsonResponse(response, 200);

      const responseBody = await response.json();
      expect(typeof responseBody.id).toBe('number');
      expect(responseBody.id).toBe(1);
      expect(typeof responseBody.name).toBe('string');
    });
  });

  test.describe('Response structure', () => {
    test('should return rooms with expected field types', async ({ request }) => {
      const response = await request.get(ENDPOINTS.ROOMS);
      expectJsonResponse(response, 200);

      const responseBody = await response.json();
      expect(responseBody.length).toBeGreaterThan(0);
      responseBody.forEach((room: Room) => {
        expect(typeof room.name).toBe('string');
        expect(typeof room.capacity).toBe('number');
        expect(typeof room.hourly_rate).toBe('number');
        expect(typeof room.is_available).toBe('boolean');
        expect(Array.isArray(room.amenities)).toBe(true);
      });
    });

    test('should include reviews with correct structure', async ({ request }) => {
      const response = await request.get(ENDPOINTS.ROOMS_BY_ID(1));
      expectJsonResponse(response, 200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody.reviews)).toBe(true);

      expect(typeof responseBody.reviews[0].rating).toBe('number');
      expect(typeof responseBody.reviews[0].comment).toBe('string');
      expect(typeof responseBody.reviews[0].would_recommend).toBe('boolean');
    });
  });

  test.describe('Error handling', () => {
    test('should return 404 for a non-existent room id', async ({ request }) => {
      const response = await request.get(ENDPOINTS.ROOMS_BY_ID(9999));
      expect(response.status()).toBe(404);
    });

    test('should return 404 for an invalid room id format', async ({ request }) => {
      const response = await request.get(ENDPOINTS.ROOMS_BY_ID('abc'));
      expect(response.status()).toBe(404);
    });
  });

  test.describe('Query parameters — Filtering', () => {
    test('should filter rooms by size', async ({ request }) => {
      const response = await request.get(`${ENDPOINTS.ROOMS}?size=small`);
      expectJsonResponse(response, 200);

      const responseBody = await response.json();
      responseBody.forEach((room: Room) => {
        expect(room).toHaveProperty('size');
        expect(room.size).toBe('small');
      });
    });

    test('should filter rooms by availability', async ({ request }) => {
      const response = await request.get(`${ENDPOINTS.ROOMS}?is_available=true`);
      expectJsonResponse(response, 200);

      const responseBody = await response.json();
      responseBody.forEach((room: Room) => {
        expect(room).toHaveProperty('is_available');
        expect(room.is_available).toBe(true);
      });
    });

    test('should filter rooms by floor', async ({ request }) => {
      const response = await request.get(`${ENDPOINTS.ROOMS}?floor=3`);
      expectJsonResponse(response, 200);

      const responseBody = await response.json();
      responseBody.forEach((room: Room) => {
        expect(room).toHaveProperty('floor');
        expect(room.floor).toBe(3);
      });
    });
  });

  test.describe('Query parameters — Sorting', () => {
    test('should sort rooms by hourly rate ascending', async ({ request }) => {
      const response = await request.get(`${ENDPOINTS.ROOMS}?_sort=hourly_rate`);
      expectJsonResponse(response, 200);

      const responseBody = await response.json();
      responseBody.forEach((room: Room) => {
        expect(room).toHaveProperty('hourly_rate');
      });

      for (let i = 1; i < responseBody.length; i++) {
        expect(responseBody[i - 1].hourly_rate).toBeLessThanOrEqual(responseBody[i].hourly_rate);
      }
    });

    test('should sort rooms by capacity ascending', async ({ request }) => {
      const response = await request.get(`${ENDPOINTS.ROOMS}?_sort=capacity`);
      expectJsonResponse(response, 200);

      const responseBody = await response.json();
      responseBody.forEach((room: Room) => {
        expect(room).toHaveProperty('capacity');
      });
      for (let i = 1; i < responseBody.length; i++) {
        expect(responseBody[i - 1].capacity).toBeLessThanOrEqual(responseBody[i].capacity);
      }
    });
  });
});
