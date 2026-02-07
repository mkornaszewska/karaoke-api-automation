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
- ✅ Reusable helpers and centralized constants
- ✅ Clean, maintainable test organization

## 🛠️ Tech Stack

- **[Playwright](https://playwright.dev/)** - Modern API testing framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[ESLint](https://eslint.org/)** - Code quality and consistency
- **[Prettier](https://prettier.io/)** - Code formatting
- **[my-json-server](https://my-json-server.typicode.com/)** - Mock REST API for testing

## 📁 Project Structure

```
tests/
├── constants/
│   ├── endpoints.ts       # API endpoint definitions
│   └── schemas.ts         # TypeScript interfaces and data schemas
├── helpers/
│   └── api-helpers.ts     # Reusable API request functions
└── specs/
    └── bookings/
        └── get.spec.ts    # GET endpoint test suite
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
- ✅ Status enum validation (confirmed, pending, cancelled)
- ✅ Numeric ranges (all IDs, prices, and counts > 0)

#### Error Handling

- ✅ 404 for non-existent booking IDs
- ✅ 404 for invalid booking ID formats

#### Query Parameters

- ✅ Filtering by status (enum)
- ✅ Filtering by room_id (numeric)
- ✅ Sorting by date (ascending)

### Coming Soon

- 🔜 POST /bookings - Create new bookings
- 🔜 PUT /bookings/:id - Update existing bookings
- 🔜 DELETE /bookings/:id - Delete bookings

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mkornaszewska/karaoke-booking-api.git
cd karaoke-booking-api

# Install dependencies
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test bookings/get.spec.ts

# Run tests with detailed output
npx playwright test --reporter=list

# Generate HTML report
npx playwright test --reporter=html
```

## 🌐 API Endpoint

Tests run against: `https://my-json-server.typicode.com/mkornaszewska/karaoke-booking-api`

**Note:** This project uses my-json-server with a static `db.json` file for consistent, reproducible test data.

## 📝 Known Limitations

- **Sorting:** my-json-server does not support descending sort with the `-field` syntax. Only ascending sort is tested.
- **Mutations:** POST/PUT/DELETE operations are not persisted by my-json-server (changes are simulated but not saved).

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
