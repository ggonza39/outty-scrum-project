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
      <section className="hero">
        <h1>Sign Up</h1>
      </section>

      <main className="content">
        <form className="card" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label className="label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label className="label" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label className="label" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              className="input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: 18 }}>
            SIGN UP
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e7a8b5' }} />
            <span style={{ fontWeight: 700 }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e7a8b5' }} />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <p>Sign Up With</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: 10 }}>
            <button type="button" className="btn" style={{ width: 48 }}>
              G
            </button>
            <button type="button" className="btn" style={{ width: 48 }}>
              f
            </button>
            <button type="button" className="btn" style={{ width: 48 }}>
              X
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 18 }}>
          Already have an account? <Link href="/signin">Sign In.</Link>
        </p>
      </main>
    </MobilePage>
  );
}
