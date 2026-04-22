'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Navigation links shown in the slide-out menu.
 *
 * IMPORTANT:
 * - Some links are hidden depending on auth state
 * - Filtering logic is kept below in visibleLinks
 */
const links = [
  { href: '/', label: 'Home' },
  { href: '/signin', label: 'Sign in' },
  { href: '/signup', label: 'Sign up' },
  { href: '/profile', label: 'Profile' },
  { href: '/discover', label: 'Discover' },
  { href: '/message', label: 'Messages' },
  { href: '/about', label: 'About' },
];

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  // Controls whether the slide-out menu is open.
  const [open, setOpen] = useState(false);

  // Tracks whether the user is currently authenticated.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Small subtext shown under the brand/logo area.
  const [welcomeMessage, setWelcomeMessage] = useState('');

  /**
   * Read the auth session on mount and listen for auth changes.
   *
   * Gibson test:
   * - logged-out user should see public links only
   * - logged-in user should see profile/discover/messages links
   * - header subtitle should change based on auth state
   */
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      setIsAuthenticated(!!session);

      if (session?.user) {
        const displayName =
          session.user.user_metadata?.display_name ||
          session.user.email ||
          'Welcome back';

        setWelcomeMessage(`Welcome, ${displayName}`);
      } else {
        setWelcomeMessage('');
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);

      if (session?.user) {
        const displayName =
          session.user.user_metadata?.display_name ||
          session.user.email ||
          'Welcome back';

        setWelcomeMessage(`Welcome, ${displayName}`);
      } else {
        setWelcomeMessage('');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Log the user out and route them back to sign-in.
   *
   * Gibson test:
   * - open menu
   * - click Log out
   * - user should be redirected to /signin
   */
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });

      if (error) {
        console.error('Supabase sign out error:', error);
        return;
      }

      setOpen(false);
      alert('You have been successfully logged out.');
      router.replace('/signin');
    } catch (error) {
      console.error('Unexpected sign out error:', error);
    }
  };

  /**
   * Show only the links appropriate for the current auth state.
   *
   * Logged out:
   * - hide profile/discover/message
   *
   * Logged in:
   * - hide sign in / sign up
   */
  const visibleLinks = links.filter((link) => {
    if (!isAuthenticated) {
      return !['/profile', '/discover', '/message'].includes(link.href);
    }

    return !['/signin', '/signup'].includes(link.href);
  });

  return (
    <>
      {/* Header bar */}
      <header
        className="topbar"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '14px 16px 10px',
          background: '#f5f3ee',
        }}
      >
        {/* Brand / logo area */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          {/* Official logo image.
              IMPORTANT:
              Put the file in: application/frontend/public/outty-logo-full.jpg
              If the file is renamed, update src below to match. */}
          <img
            src="/outty-logo-full.jpg"
            alt="Outty"
            style={{
              height: 34,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />

          {/* Keep text fallback hidden for accessibility only if image fails visually. */}
          <span style={{ display: 'none' }}>Outty</span>
        </Link>

        {/* Hamburger button */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            background: '#102019',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: open ? '1.5rem' : '1.2rem',
            lineHeight: 1,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {open ? '×' : '☰'}
        </button>
      </header>

      {/* Small subtitle row under the main header area */}
      <div
        style={{
          padding: '0 16px 12px',
          background: '#f5f3ee',
          color: '#5d6f87',
          fontSize: '0.92rem',
          lineHeight: 1.2,
        }}
      >
        {isAuthenticated ? 'Welcome back' : 'Mobile-first social app demo'}
      </div>

      {/* Slide-out menu panel */}
      {open && (
        <nav
          className="menu-panel"
          style={{
            margin: '0 16px 12px',
            borderRadius: 18,
            background: '#ffffff',
            border: '1px solid #d8d8d8',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          }}
        >
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`menu-link ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '14px 16px',
                textDecoration: 'none',
                color: pathname === link.href ? '#0f5132' : '#1f2937',
                fontWeight: pathname === link.href ? 700 : 500,
                borderBottom: '1px solid #eeeeee',
                background: pathname === link.href ? '#edf7ef' : '#ffffff',
              }}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <button
              type="button"
              className="menu-link"
              onClick={handleLogout}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '14px 16px',
                background: '#ffffff',
                border: 'none',
                color: '#1f2937',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Log out
            </button>
          )}
        </nav>
      )}
    </>
  );
}
