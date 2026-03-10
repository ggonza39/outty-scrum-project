'use client';

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
        <h1>Create your account</h1>
        <p>Set up your basics now and finish your profile in the next step.</p>
      </section>

      <main className="content">
        <form className="card" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="name">Name</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label className="label" htmlFor="signup-email">Email</label>
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
            <label className="label" htmlFor="signup-password">Password</label>
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
            <label className="label" htmlFor="confirm-password">Confirm password</label>
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
            Continue to profile
          </button>
        </form>
      </main>
    </MobilePage>
  );
}
