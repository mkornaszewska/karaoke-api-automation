import { expect, test } from '@playwright/test';
import { ENDPOINTS } from '../../constants/endpoints';
import { validRoomData } from '../../fixtures/room-data';

test.describe('DELETE /rooms/:id', () => {
  test('should delete existing room', async ({ request }) => {
    const postRes = await request.post(ENDPOINTS.ROOMS, { data: validRoomData });
    const { id } = await postRes.json();

    const response = await request.delete(ENDPOINTS.ROOMS_BY_ID(id));
    expect(response.status()).toBe(200);
  });

  test('should return 404 for deleted room', async ({ request }) => {
    const postRes = await request.post(ENDPOINTS.ROOMS, { data: validRoomData });
    const { id } = await postRes.json();

    await request.delete(ENDPOINTS.ROOMS_BY_ID(id));

    const getRes = await request.get(ENDPOINTS.ROOMS_BY_ID(id));
    expect(getRes.status()).toBe(404);
  });

  test('should return 404 for non-existent room', async ({ request }) => {
    const response = await request.delete(ENDPOINTS.ROOMS_BY_ID(9999));
    expect(response.status()).toBe(404);
  });

  test('should return 404 after second deletion', async ({ request }) => {
    const postRes = await request.post(ENDPOINTS.ROOMS, { data: validRoomData });
    const { id } = await postRes.json();

    const firstDeletion = await request.delete(ENDPOINTS.ROOMS_BY_ID(id));
    expect(firstDeletion.status()).toBe(200);
    const secondDeletion = await request.delete(ENDPOINTS.ROOMS_BY_ID(id));
    expect(secondDeletion.status()).toBe(404);
  });
});
