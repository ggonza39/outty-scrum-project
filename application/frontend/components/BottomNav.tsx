'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Home' },
  { href: '/match', label: 'Discover' },
  { href: '/matches', label: 'Matches' },
  { href: '/message', label: 'Chat' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? 'active' : ''}`}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
