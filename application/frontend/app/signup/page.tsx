'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import MobilePage from '@/components/MobilePage';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      window.alert('Passwords need to match before continuing.');
      return;
    }

    router.push('/profile-setup');
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
          Sign Up
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '28px' }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                fontSize: '0.95rem',
                color: '#888',
                marginBottom: '10px',
              }}
            >
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div style={{ marginBottom: '28px' }}>
            <label
              htmlFor="signup-email"
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
              id="signup-email"
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

          <div style={{ marginBottom: '28px' }}>
            <label
              htmlFor="signup-password"
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
              id="signup-password"
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

          <div style={{ marginBottom: '32px' }}>
            <label
              htmlFor="confirm-password"
              style={{
                display: 'block',
                fontSize: '0.95rem',
                color: '#888',
                marginBottom: '10px',
              }}
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '18px',
              border: 'none',
              backgroundColor: '#f2b600',
              color: '#fff',
              fontSize: '1.2rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            SIGN UP
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
          <p style={{ color: '#777', fontSize: '1rem', marginBottom: '18px' }}>Sign Up With</p>

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
          Already have an account?{' '}
          <Link href="/signin" style={{ color: '#e77797', fontWeight: 700 }}>
            Sign In.
          </Link>
        </p>
      </main>
    </MobilePage>
  );
}
