'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Bottom navigation used across the mobile UI.
 *
 * WHY THIS FILE EXISTS:
 * - Gives users quick access to the main app sections
 * - Highlights the current active route
 * - Keeps the message tab active on both:
 *   - /message
 *   - /message/[conversationId]
 *
 * GIBSON TEST NOTES:
 * - Home tab should highlight on "/"
 * - Discover tab should highlight on "/discover"
 * - Matches tab should highlight on "/matches"
 * - Chat tab should highlight on "/message" and "/message/conv-1"
 * - No fake unread badge should appear
 */

const items = [
  { href: '/', label: 'Home' },
  { href: '/discover', label: 'Discover' },
  { href: '/matches', label: 'Matches' },
  { href: '/message', label: 'Chat' },
];

export default function BottomNav() {
  // Current route path from Next.js navigation.
  const pathname = usePathname();

  /**
   * Determines whether a nav item should be styled as active.
   *
   * Special handling:
   * - Chat should stay active for both inbox and active conversation pages
   */
  const isItemActive = (href: string) => {
    if (href === '/message') {
      return pathname === '/message' || pathname.startsWith('/message/');
    }

    return pathname === href;
  };

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-link ${isItemActive(item.href) ? 'active' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
