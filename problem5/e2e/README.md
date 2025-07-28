# E2E Tests for Problem 5

This directory contains end-to-end tests for the Express.js REST API with Prisma and PostgreSQL.

## Prerequisites

1. **Running Server**: The API server must be running and accessible
2. **Database**: The database must be accessible and have the correct schema
3. **Environment Variables**: Set the required environment variables

## Environment Variables

Set these environment variables before running tests:

```bash
# Base URL of the running server
export E2E_BASE_URL="http://localhost:3000"

# Database connection string
export DATABASE_URL="your_database_connection_string"
```

## Running Tests

### Run all e2e tests
```bash
npm run test:e2e
```

### Run tests in watch mode
```bash
npm run test:e2e:watch
```

### Run tests with coverage
```bash
npm run test:e2e:coverage
```

## Test Structure

### Configuration
- `config.ts` - Test configuration and environment variables
- `setup.ts` - Jest setup and database cleanup

### Test Files
- `api.test.ts` - Main API endpoint tests

### Utilities
- `utils/test-helpers.ts` - Helper functions for creating test data

## Test Coverage

The e2e tests cover:

### User Management
- ✅ Create users and retrieve user list
- ✅ User data validation

### Post Management
- ✅ Create posts with author association
- ✅ Retrieve posts by ID
- ✅ Update post view count
- ✅ Toggle post published status
- ✅ Delete posts
- ✅ Error handling for non-existent posts

### Draft Management
- ✅ Retrieve user drafts (unpublished posts)

### Feed Management
- ✅ Retrieve published posts feed
- ✅ Search posts by title and content
- ✅ Pagination support
- ✅ Ordering results

## Test Data

Tests create their own test data and clean up after each test to ensure isolation. The test helpers provide functions to:

- Create test users
- Create test posts
- Clean up test data
- Retrieve test data for verification

## Notes

- Tests run against an existing server (not started by the test suite)
- Database is cleaned before and after each test
- Tests are designed to be independent and can run in any order
- Timeout is set to 30 seconds for each test 