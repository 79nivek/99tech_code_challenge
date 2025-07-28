// Configuration for e2e tests
export const E2E_CONFIG = {
  // Base URL of the running server
  BASE_URL: process.env.E2E_BASE_URL || 'http://localhost:3000',
  // Test timeout
  TIMEOUT: 30000,
};

