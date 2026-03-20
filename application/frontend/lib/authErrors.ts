// Helper file for translating Supabase authentication errors into user-facing messages
// Other files can import `getAuthErrorMessage` from this file when handling signup, sign-in, or other authentication-related failures.

import { AuthError } from '@supabase/supabase-js'

export function getAuthErrorMessage(error: AuthError | Error | null): string {
  if (!error) {
    return 'An unexpected authentication error occurred.'
  }

  const message = error.message.toLowerCase()

  if (message.includes('user already registered')) {
    return 'An account with this email already exists.'
  }

  if (message.includes('invalid email')) {
    return 'Please enter a valid email address.'
  }

  if (
    message.includes('password should be at least') || message.includes('password is too short')
  ) {
    return 'Password must be at least 6 characters long.'
  }

  if (message.includes('signup is disabled')) {
    return 'Account creation is currently unavailable.'
  }
  if (
    message.includes('invalid login credentials') || message.includes('email not confirmed') || message.includes('invalid credentials')
  ) {
  return 'Invalid email or password. Please try again.'
}

  return error.message || 'An unexpected authentication error occurred.'
}
