# Karaoke Booking API - Test Automation Suite

![API Tests](https://github.com/mkornaszewska/karaoke-api-automation/actions/workflows/api-tests.yml/badge.svg)

A comprehensive API test automation framework for a karaoke booking management system, built with Playwright and TypeScript.

## Tech Stack

- **[Playwright](https://playwright.dev/)** - Modern API testing framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[json-server](https://github.com/typicode/json-server)** - Local mock REST API
- **[my-json-server](https://my-json-server.typicode.com/)** - Live hosted mock API
- **[ESLint](https://eslint.org/)** - Code quality and consistency
- **[Prettier](https://prettier.io/)** - Code formatting

## Project Structure

```
tests/
├── api/
│   ├── bookings/
│   │   ├── bookings.get.spec.ts          # GET endpoint tests
│   │   ├── bookings.post.spec.ts         # POST endpoint tests (happy path)
│   │   ├── bookings.post.negative.spec.ts # POST validation & error scenarios
│   │   ├── bookings.put.spec.ts          # PUT & PATCH endpoint tests
│   │   └── bookings.delete.spec.ts       # DELETE endpoint tests
│   └── rooms/
│       ├── rooms.get.spec.ts             # GET endpoint tests
│       ├── rooms.post.spec.ts            # POST endpoint tests
│       ├── rooms.put.spec.ts             # PUT endpoint tests
│       └── rooms.delete.spec.ts          # DELETE endpoint tests
├── constants/
│   ├── endpoints.ts                      # API endpoint definitions
│   └── schemas.ts                        # TypeScript interfaces and data schemas
├── fixtures/
│   ├── booking-data.ts                   # Valid booking test data
│   ├── invalid-booking-data.ts           # Invalid data for error scenario testing
│   └── room-data.ts                      # Valid room test data
└── helpers/
    ├── api-helpers.ts                    # Reusable API request functions
    └── data-generators.ts               # Dynamic test data generation
```

## Test Coverage

### GET /bookings

- Returns 200 with `application/json` content-type
- Returns array of bookings with all required fields
- Correct primitive types (number, string, boolean)
- Date format: YYYY-MM-DD, time format: HH:MM, timestamps: ISO 8601
- Status enum validation (confirmed, pending, cancelled, completed)
- Numeric ranges (IDs, prices, counts > 0)
- 404 for non-existent and invalid booking IDs
- Filtering by status and room_id
- Sorting by date ascending

### POST /bookings

- Returns 201 with auto-generated numeric ID
- All submitted fields echoed back correctly
- Booking persists and is retrievable via GET
- Optional field (`special_requests`) absent when not submitted
- Multiple bookings created in parallel have unique IDs
- All valid status enum values accepted
- Response validated against `bookingTypeSchema`

### POST /bookings — negative scenarios

json-server performs no input validation; these tests document the gap between the mock and a real server. Each case asserts `201` and notes what a real server should return.

- Missing required fields (`user_id`, `room_id`)
- Invalid data types (string `user_id`)
- Invalid formats (MM/DD/YYYY date, 12-hour time)
- Invalid status enum value
- Business rule violations (negative party size, zero duration, past booking date)

### PUT & PATCH /bookings/:id

- PUT replaces the full resource and returns 200
- PUT response validated against `bookingTypeSchema`
- PUT persists — verified with follow-up GET
- PUT returns 404 for non-existent IDs
- PATCH updates only the specified field, leaving others unchanged
- PATCH persists — verified with follow-up GET

### DELETE /bookings/:id

- Returns 200 on successful deletion
- Deleted booking returns 404 on follow-up GET
- List count returns to original after POST then DELETE
- Returns 404 for non-existent IDs
- Returns 404 on second DELETE of the same resource (idempotency)

### GET /rooms

- Returns 200 with `application/json` content-type
- Returns array of rooms with correct field types
- Single room retrieval by ID
- Reviews array structure validation
- 404 for non-existent and invalid room IDs
- Filtering by size, availability, and floor
- Sorting by hourly rate and capacity ascending

### POST /rooms

- Returns 201 with auto-generated numeric ID
- Response body matches submitted payload
- Room persists — verified with follow-up GET
- Array fields (amenities, reviews) stored correctly
- Numeric and boolean field types preserved

### PUT /rooms/:id

- PUT replaces the full resource and returns 200
- PUT response validated against `roomTypeSchema`
- PUT persists — verified with follow-up GET
- PUT returns 404 for non-existent IDs

### DELETE /rooms/:id

- Returns 200 on successful deletion
- Deleted room returns 404 on follow-up GET
- Returns 404 for non-existent IDs
- Returns 404 on second DELETE of the same resource (idempotency)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/mkornaszewska/karaoke-api-automation.git
cd karaoke-api-automation

npm install
```

### Running Tests

```bash
# Run all tests (starts local json-server automatically)
npm test

# Run a specific test file
npx playwright test bookings.get.spec.ts

# Run tests in UI mode
npx playwright test --ui

# Open HTML report after a run
npx playwright show-report
```

## Environments

Tests run against two environments, configured via `.env`:

| Environment     | URL                                                                     |
| --------------- | ----------------------------------------------------------------------- |
| Local (default) | `http://localhost:3000`                                                 |
| Live            | `https://my-json-server.typicode.com/mkornaszewska/karaoke-booking-api` |

Copy `.env.example` to `.env` and set `BASE_URL` for the desired environment. When running locally, Playwright starts `json-server` automatically and resets the database to seed data before each run via `global-setup.ts`.

## Known Limitations

- **Sorting:** json-server does not support descending sort. Only ascending sort is tested.
- **Mutations on live API:** POST/PUT/PATCH/DELETE operations against my-json-server are simulated and not persisted. Local json-server persists mutations and resets before each run.
- **Input validation:** json-server accepts any payload regardless of field types, formats, or missing required fields. Negative tests assert `201` and document what a real server should enforce.

## Design Patterns

- **Schema-based validation** — TypeScript interfaces in `schemas.ts` define expected data structures; the `roomTypeSchema` and `bookingTypeSchema` maps are used to assert field types across both read and write operations
- **Reusable helpers** — `expectJsonResponse()` abstracts status and content-type assertions
- **Fixtures** — test data separated by validity (`booking-data.ts` / `room-data.ts` for happy path, `invalid-booking-data.ts` for error scenarios)
- **Centralized constants** — endpoints and schemas defined once and imported everywhere
- **Test isolation** — all mutation tests POST a fresh resource and use its returned ID; no test depends on seed data IDs

## Test Report

Latest test report: https://mkornaszewska.github.io/karaoke-api-automation/
