import { describe, it, expect } from 'vitest';
import { validatePassword } from './validation';

describe('Password Validation Unit Tests', () => {
  // --- LENGTH TESTS ---
  it('1. should return error for empty string', () => {
    expect(validatePassword('')).toBe('Password must be at least 8 characters long.');
  });

  it('2. should return error for short password (3 chars)', () => {
    expect(validatePassword('Ab1')).toBe('Password must be at least 8 characters long.');
  });

  it('3. should return error for boundary case (7 chars)', () => {
    expect(validatePassword('Abcdef1')).toBe('Password must be at least 8 characters long.');
  });

  // --- UPPERCASE TESTS ---
  it('4. should return error for missing uppercase (lowercase + numbers)', () => {
    expect(validatePassword('password123')).toBe('Password must include at least one uppercase letter.');
  });

  it('5. should return error for only numbers (8+ chars)', () => {
    expect(validatePassword('1234567890')).toBe('Password must include at least one uppercase letter.');
  });

  // --- NUMBER TESTS ---
  it('6. should return error for missing number (uppercase + lowercase)', () => {
    expect(validatePassword('PasswordOnly')).toBe('Password must include at least one number.');
  });

  it('7. should return error for uppercase only (8+ chars)', () => {
    expect(validatePassword('ABCDEFGH')).toBe('Password must include at least one number.');
  });

  // --- EDGE CASES & SYMBOLS ---
  it('8. should return error if password is just 8 spaces', () => {
    // Spaces don't count as Uppercase or Numbers
    expect(validatePassword('        ')).toBe('Password must include at least one uppercase letter.');
  });

  it('9. should handle special characters but still check for numbers/uppercase', () => {
    expect(validatePassword('!@#$%^&*')).toBe('Password must include at least one uppercase letter.');
  });

  // --- SUCCESS CASE ---
  it('10. should return null for a valid password (8 chars, 1 upper, 1 number)', () => {
    expect(validatePassword('Secure12')).toBeNull();
  });
});