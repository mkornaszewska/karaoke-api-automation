import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { ENDPOINTS } from '../constants/endpoints';

export async function getBookings(request: APIRequestContext): Promise<any[]> {
  const response = await request.get(ENDPOINTS.BOOKINGS);
  return response.json();
}
async function getBookingById(request: APIRequestContext, id: number): Promise<any> {
  const response = await request.get(`bookings/${id}`);
  return response.json();
}

export function expectJsonResponse(response: APIResponse, expectedStatus = 200): void {
  expect(response.status()).toBe(expectedStatus);
  expect(response.headers()['content-type']).toMatch(/application\/json/);
}
