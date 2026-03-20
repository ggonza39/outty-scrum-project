'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const links = [
  { href: '/', label: 'Home' },
  { href: '/signin', label: 'Sign in' },
  { href: '/signup', label: 'Sign up' },
  { href: '/profile-setup', label: 'Profile' },
  { href: '/match', label: 'Match' },
  { href: '/message', label: 'Messages' },
  { href: '/about', label: 'About' },
];

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
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
      router.replace('/signin');
    } catch (error) {
      console.error('Unexpected sign out error:', error);
    }
  };

  return (
    <>
      <header className="topbar">
        <div>
          <div className="brand">Outty</div>
          <div className="subtle">Mobile-first social app demo</div>
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
          {links.map((link) => (
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
