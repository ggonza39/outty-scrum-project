'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import MobilePage from '@/components/MobilePage';
import { supabase } from '../../lib/supabase';
import { getAuthErrorMessage } from '../../lib/authErrors';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace('/profile-setup');
      }
    };

    checkSession();
  }, [router]);
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Email is required.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Password is required.');
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase sign in error:', error);
        setErrorMessage(getAuthErrorMessage(error));
        return;
      }

      router.replace('/profile-setup');
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      setErrorMessage(getAuthErrorMessage(error instanceof Error ? error : null));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobilePage showBottomNav={false}>
      <main
        style={{
          padding: '32px 24px 40px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            color: '#000',
            marginBottom: '40px',
            lineHeight: 1.05,
          }}
        >
          Sign In
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '28px' }}>
            <label
              htmlFor="signin-email"
              style={{
                display: 'block',
                fontSize: '0.95rem',
                color: '#888',
                marginBottom: '10px',
              }}
            >
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '18px 20px',
                borderRadius: '18px',
                border: '2px solid #e2aa00',
                backgroundColor: 'transparent',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label
              htmlFor="signin-password"
              style={{
                display: 'block',
                fontSize: '0.95rem',
                color: '#888',
                marginBottom: '10px',
              }}
            >
              Password
            </label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '18px 20px',
                borderRadius: '18px',
                border: '2px solid #e2aa00',
                backgroundColor: 'transparent',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          <p
            style={{
              textAlign: 'right',
              color: '#e77797',
              fontWeight: 600,
              marginBottom: '28px',
            }}
          >
            Forgot password?
          </p>

          {errorMessage && (
            <p style={{ color: '#b00020', marginBottom: 14 }}>{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '18px',
              border: 'none',
              backgroundColor: '#f2b600',
              color: '#fff',
              fontSize: '1.2rem',
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e7a8b5' }} />
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#000' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e7a8b5' }} />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '42px' }}>
          <p style={{ color: '#777', fontSize: '1rem', marginBottom: '18px' }}>Sign In With</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '18px' }}>
            <button
              type="button"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                fontSize: '1.2rem',
                cursor: 'pointer',
              }}
            >
              G
            </button>
            <button
              type="button"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                fontSize: '1.2rem',
                cursor: 'pointer',
              }}
            >
              f
            </button>
            <button
              type="button"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                fontSize: '1.2rem',
                cursor: 'pointer',
              }}
            >
              X
            </button>
          </div>
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '42px',
            color: '#777',
            fontSize: '1rem',
          }}
        >
          Don’t have an account?{' '}
          <Link href="/signup" style={{ color: '#e77797', fontWeight: 700 }}>
            Sign Up.
          </Link>
        </p>
      </main>
    </MobilePage>
  );
}
