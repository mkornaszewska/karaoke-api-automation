# Karaoke Booking API - Test Automation Suite

A comprehensive API test automation framework for a karaoke booking management system, built with Playwright and TypeScript.

## 🎯 Features

- ✅ HTTP contract validation (status codes, headers, response types)
- ✅ Response structure validation (required properties, data types)
- ✅ Data format validation (ISO 8601 dates, time formats, regex patterns)
- ✅ Business logic validation (enums, numeric ranges)
- ✅ Error scenario testing (404 handling, invalid inputs)
- ✅ Query parameter testing (filtering, sorting)
- ✅ TypeScript for type safety and better developer experience
- ✅ Reusable helpers, fixtures, and centralized constants
- ✅ Clean, maintainable test organization
- ✅ CI/CD pipeline via GitHub Actions

## 🛠️ Tech Stack

- **[Playwright](https://playwright.dev/)** - Modern API testing framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[json-server](https://github.com/typicode/json-server)** - Local mock REST API
- **[my-json-server](https://my-json-server.typicode.com/)** - Live hosted mock API
- **[ESLint](https://eslint.org/)** - Code quality and consistency
- **[Prettier](https://prettier.io/)** - Code formatting

## 📁 Project Structure

```
tests/
├── api/
│   └── bookings/
│       ├── bookings.get.spec.ts   # GET endpoint test suite
│       └── bookings.post.spec.ts  # POST endpoint test suite
├── constants/
│   ├── endpoints.ts               # API endpoint definitions
│   └── schemas.ts                 # TypeScript interfaces and data schemas
├── e2e/                           # End-to-end tests (coming soon)
├── fixtures/
│   ├── booking-data.ts            # Valid test data
│   └── invalid-booking-data.ts    # Invalid data for error scenario testing
└── helpers/
    ├── api-helpers.ts             # Reusable API request functions
    └── data-generators.ts         # Dynamic test data generation
```

## 🧪 Test Coverage

### GET /bookings

#### HTTP Contract
- ✅ Returns 200 OK status
- ✅ Returns `application/json` content-type
- ✅ Returns array of bookings

#### Response Structure
- ✅ All required properties present (id, user_id, room_id, date, start_time, duration_hours, party_size, total_price, status, special_requests, created_at)
- ✅ Correct primitive types (number, string)

#### Data Validation
- ✅ Date format: YYYY-MM-DD (regex + Date parsing)
- ✅ Time format: HH:MM in 24-hour format (00:00 to 23:59)
- ✅ Timestamp format: ISO 8601 with UTC timezone
- ✅ Status enum validation (confirmed, pending, cancelled, completed)
- ✅ Numeric ranges (all IDs, prices, and counts > 0)

#### Error Handling
- ✅ 404 for non-existent booking IDs
- ✅ 404 for invalid booking ID formats

#### Query Parameters
- ✅ Filtering by status (enum)
- ✅ Filtering by room_id (numeric)
- ✅ Sorting by date (ascending)

### POST /bookings

#### Happy Path
- ✅ Creates booking with valid complete data
- ✅ Returns 201 Created status
- ✅ Returns auto-generated ID
- ✅ All submitted fields echoed back correctly
- ✅ Booking persists and is retrievable via GET

### Coming Soon
- 🔜 PUT /bookings/:id - Update existing bookings
- 🔜 DELETE /bookings/:id - Delete bookings
- 🔜 GET /rooms - Room listings and details
- 🔜 GET /users - User management endpoints

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/mkornaszewska/karaoke-booking-api.git
cd karaoke-booking-api

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests (starts local json-server automatically)
npm test

# Run only API tests
npm run test:api

# Run tests in UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test tests/api/bookings/bookings.get.spec.ts

# Run tests with detailed output
npx playwright test --reporter=list

# Generate and open HTML report
npx playwright test --reporter=html
```

## 🌐 API Endpoints

Tests can run against two environments, configured via `.env`:

| Environment | URL |
|---|---|
| Local (default) | `http://localhost:3000` |
| Live | `https://my-json-server.typicode.com/mkornaszewska/karaoke-booking-api` |

Copy `.env.example` to `.env` and set `BASE_URL` for the desired environment. When running locally, Playwright starts `json-server` automatically before tests run.

## 📝 Known Limitations

- **Sorting:** json-server does not support descending sort with the `-field` syntax. Only ascending sort is tested.
- **Mutations:** POST/PUT/DELETE operations are not persisted by my-json-server (changes are simulated but not saved). Local json-server does persist mutations — the database is reset to seed data before each test run via `global-setup.ts`.

## 🏗️ Design Patterns

### Schema-Based Validation

TypeScript interfaces define expected data structures, enabling:

- Type-safe test code
- Centralized schema definitions
- Reusable validation logic

### Helper Functions

Common operations abstracted into reusable functions:

- `getBookings()` - Fetch and parse booking list
- `expectJsonResponse()` - Validate HTTP status and content-type

### Fixtures

Test data separated by validity:

- `booking-data.ts` - Valid scenarios (complete, minimal, multi-variant)
- `invalid-booking-data.ts` - Invalid scenarios for error case testing

### Constants Management

Centralized configuration for:

- API endpoints
- Expected enum values
- Type schemas

## 🎓 Learning Objectives

This project demonstrates:

- API contract testing best practices
- Comprehensive response validation strategies
- Error scenario handling
- Query parameter testing techniques
- TypeScript usage in test automation
- Clean code organization and reusability
- Professional documentation practices
