'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
  const [open, setOpen] = useState(false);

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
        </nav>
      )}
    </>
  );
}
