// Mock for the types module to avoid Supabase initialization
export * from '../src/types/types';

// Mock the supabase export specifically
export const supabase = {
  from: jest.fn(),
  channel: jest.fn(),
  auth: {
    getSession: jest.fn(),
    signInAnonymously: jest.fn(),
  },
};