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
 * - Filtering logic is handled in visibleLinks below
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

  // Controls whether the full menu overlay is open.
  const [open, setOpen] = useState(false);

  // Tracks whether the current user has an active session.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Stores the smaller subtitle text shown under the logo row.
  const [welcomeMessage, setWelcomeMessage] = useState('');

  /**
   * Read the auth session on mount and listen for auth changes.
   *
   * Gibson test:
   * - logged-out user should only see public links
   * - logged-in user should see app links like Profile, Discover, and Messages
   * - subtitle should say "Welcome back" for authenticated users
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
   * Locks page scrolling while the menu overlay is open.
   *
   * Gibson test:
   * - open the menu
   * - page should not scroll behind it
   * - close the menu
   * - page scrolling should return to normal
   */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /**
   * Log the user out and return them to the sign-in page.
   *
   * Gibson test:
   * - open menu
   * - click Log out
   * - confirm redirect to /signin
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
   * Only show the links appropriate for the current auth state.
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
      {/* Header row */}
      <header
        className="topbar"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '12px 16px 6px',
          background: '#f5f3ee',
          position: 'relative',
          zIndex: 1100,
        }}
      >
        {/* Left side: official logo */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          {/* IMPORTANT:
              This file should exist at:
              application/frontend/public/outty-logo-01.svg
          */}
          <img
            src="/outty-logo-01.svg"
            alt="Outty"
            style={{
              height: 28,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </Link>

        {/* Right side: circular hamburger / close button */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            border: 'none',
            background: '#102019',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: open ? '1.55rem' : '1.15rem',
            lineHeight: 1,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {open ? '×' : '☰'}
        </button>
      </header>

      {/* Subtitle row under the header */}
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

      {/* Full-screen menu overlay */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            background: 'rgba(0, 0, 0, 0.18)',
          }}
          onClick={() => setOpen(false)}
        >
          {/* Sliding panel */}
          <nav
            className="menu-panel"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 'min(82vw, 320px)',
              height: '100%',
              background: '#f5f3ee',
              boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              padding: '72px 16px 20px',
              overflowY: 'auto',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Menu links */}
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: pathname === link.href ? '#0f5132' : '#1f2937',
                  background: pathname === link.href ? '#e4efe7' : 'transparent',
                  borderRadius: 14,
                  padding: '14px 16px',
                  marginBottom: 8,
                  fontWeight: pathname === link.href ? 700 : 500,
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Logout button for authenticated users */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 16px',
                  marginTop: 4,
                  border: 'none',
                  borderRadius: 14,
                  background: 'transparent',
                  color: '#1f2937',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Log out
              </button>
            )}

            {/* Optional helper text at bottom */}
            <div
              style={{
                marginTop: 'auto',
                paddingTop: 18,
                color: '#7b8794',
                fontSize: '0.82rem',
              }}
            >
              {isAuthenticated ? 'Welcome back' : welcomeMessage || 'Outty'}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
