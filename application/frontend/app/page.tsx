'use client';

import Image from 'next/image';
import Link from 'next/link';
import MobilePage from '@/components/MobilePage';

export default function HomePage() {
  return (
    <MobilePage showBottomNav={false}>
      <main
        style={{
          minHeight: '100%',
          padding: '32px 24px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        {/* LOGO + HEADER */}
        <section
          style={{
            textAlign: 'center',
            marginBottom: '36px',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <Image
              src="/outty-logo-full.jpg"
              alt="Outty logo"
              width={220}
              height={80}
              style={{
                width: '220px',
                height: 'auto',
                margin: '0 auto',
              }}
            />
          </div>

          <h1
            style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#1f1f1f',
              marginBottom: '14px',
            }}
          >
            Find your next adventure partner
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: '#666',
              lineHeight: 1.6,
              maxWidth: '320px',
              margin: '0 auto',
            }}
          >
            Connect with people who share your interests, activity level, and adventure style.
          </p>
        </section>

        {/* BUTTON CARD */}
        <section
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '24px 20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <Link
              href="/signup"
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '18px',
                border: 'none',
                backgroundColor: '#F2B600',
                color: '#ffffff',
                fontSize: '1.1rem',
                fontWeight: 700,
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Create Account
            </Link>

            <Link
              href="/signin"
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '18px',
                border: '2px solid #37A443',
                backgroundColor: '#ffffff',
                color: '#37A443',
                fontSize: '1.1rem',
                fontWeight: 700,
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* FOOTER TEXT */}
        <section
          style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '0.95rem',
            lineHeight: 1.6,
          }}
        >
          Build your profile, explore matches, and start conversations in one place.
        </section>
      </main>
    </MobilePage>
  );
}
