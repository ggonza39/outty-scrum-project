'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const links = [
  { href: '/', label: 'Home' },
  { href: '/signin', label: 'Sign in' },
  { href: '/signup', label: 'Sign up' },
  { href: '/profile', label: 'Profile' },
  { href: '/match', label: 'Match' },
  { href: '/message', label: 'Messages' },
  { href: '/about', label: 'About' },
];

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

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

  const visibleLinks = links.filter((link) => {
    if (!isAuthenticated) {
      return !['/profile-setup', '/match', '/message'].includes(link.href);
    }

    return !['/signin', '/signup'].includes(link.href);
  });

  return (
    <>
      <header className="topbar">
        <div>
          <div className="brand">Outty</div>
          <div className="subtle">
            {isAuthenticated ? 'Welcome back' : 'Mobile-first social app demo'}
          </div>
        </div>

        <button
          type="button"
          className="icon-button"
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? '×' : '☰'}
        </button>
      </header>

      {open && (
        <nav className="menu-panel">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`menu-link ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <button
              type="button"
              className="menu-link"
              onClick={handleLogout}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
            >
              Log out
            </button>
          )}
        </nav>
      )}
    </>
  );
}
