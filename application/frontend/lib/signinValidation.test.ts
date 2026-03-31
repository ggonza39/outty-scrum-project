import { describe, it, expect, vi } from 'vitest';
import { validateInput } from './signinValidation';

// 2. Mock Supabase to prevent "supabaseUrl is required" error
vi.mock('../../lib/supabase', () => ({
    supabase: {
        auth: {
            signUp: vi.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
        },
    },
}));

describe('Input Validation Unit Tests', () => {
    it('1. should return error for empty email', () => {
        expect(validateInput('', 'Password123')).toBe('Email is required.');
    });

    it('2. should return error for empty password', () => {
        expect(validateInput('asdf@gmail.com', '')).toBe('Password is required.');
    });

    it('3. should return error for empty email and password', () => {
        expect(validateInput('', '')).toBe('Email is required.');
    });

    it('4. should return null for valid email and password', () => {
        expect(validateInput('asdf@gmail.com', 'Password123')).toBe(null);
    });

});