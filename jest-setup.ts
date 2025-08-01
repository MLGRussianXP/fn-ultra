import '@testing-library/react-native/extend-expect';

// react-hook form setup for testing
// @ts-ignore
global.window = {};
// @ts-ignore
global.window = global;

// Set timeout for async operations
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

// Ensure all timers are cleaned up
afterAll(() => {
  jest.useRealTimers();
});
