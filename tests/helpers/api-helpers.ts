import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { ENDPOINTS } from '../constants/endpoints';

export async function getBookings(request: APIRequestContext): Promise<any[]> {
  const response = await request.get(ENDPOINTS.BOOKINGS);
  return response.json();
}

export async function getRooms(request: APIRequestContext): Promise<any[]> {
  const response = await request.get(ENDPOINTS.ROOMS);
  return response.json();
}

export function expectJsonResponse(response: APIResponse, expectedStatus = 200): void {
  expect(response.status()).toBe(expectedStatus);
  expect(response.headers()['content-type']).toMatch(/application\/json/);
}
