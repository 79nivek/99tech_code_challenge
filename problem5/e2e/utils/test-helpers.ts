// Wait utility for async operations
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 