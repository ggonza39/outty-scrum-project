'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import MobilePage from '@/components/MobilePage';
import { supabase } from '@/lib/supabase';
import { getAuthErrorMessage } from '@/lib/authErrors';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Session check error:', error);
        return;
      }

      console.log('Current session on sign-in page:', data.session);
    };

    checkSession();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      setIsSubmitting(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase sign in error:', error);
        setErrorMessage(getAuthErrorMessage(error));
        return;
      }

      if (!data.session) {
        setErrorMessage('Login failed. No active session was returned.');
        return;
      }

      router.push('/profile-setup');
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      setErrorMessage(getAuthErrorMessage(error instanceof Error ? error : null));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobilePage showBottomNav={false}>
      <section className="hero">
        <h1>Sign in</h1>
        <p>Enter your email and password to continue.</p>
      </section>

      <main className="content">
        <form className="card" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="signin-email">Email</label>
            <input
              id="signin-email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label className="label" htmlFor="signin-password">Password</label>
            <input
              id="signin-password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <p style={{ color: '#b00020', marginTop: 14 }}>{errorMessage}</p>
          )}

          <button
            type="submit"
            className="btn"
            style={{ width: '100%', marginTop: 18 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </main>
    </MobilePage>
  );
}