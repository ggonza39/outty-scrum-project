'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getStoredInboxConversations } from '@/lib/mockMessageStore';

/**
 * Bottom navigation used across the mobile UI.
 *
 * WHY THIS FILE EXISTS:
 * - Matches the latest wireframe layout
 * - Shows only Home, Discover, Chat, and Profile
 * - Keeps Chat active on both the inbox and conversation routes
 * - Displays the unread message count on the Chat tab
 *
 * GIBSON TEST NOTES:
 * - Home highlights on "/"
 * - Discover highlights on "/discover"
 * - Chat highlights on "/message" and "/message/[conversationId]"
 * - Profile highlights on "/profile"
 * - Chat badge shows the total unread count from the shared browser-backed store
 */

const items = [
  { href: '/', label: 'Home', icon: '⌂' },
  { href: '/discover', label: 'Discover', icon: '⌘' },
  { href: '/message', label: 'Chat', icon: '◔' },
  { href: '/profile', label: 'Profile', icon: '◡' },
];

export default function BottomNav() {
  // Current route path from Next.js navigation.
  const pathname = usePathname();

  // Stores the total unread count shown on the Chat tab badge.
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  /**
   * Reload unread count whenever the route changes.
   *
   * WHY THIS WORKS:
   * - Inbox and chat both read/write from the same browser-backed store
   * - Navigating between pages should refresh the unread badge total
   *
   * Gibson test:
   * - Open a conversation with unread messages
   * - Return to another page
   * - Confirm the Chat badge updates
   */
  useEffect(() => {
    const conversations = getStoredInboxConversations();

    const unreadTotal = conversations.reduce((sum, conversation) => {
      return sum + conversation.unreadCount;
    }, 0);

    setTotalUnreadCount(unreadTotal);
  }, [pathname]);

  /**
   * Determines whether a nav item should be styled as active.
   *
   * Special handling:
   * - Chat stays active for both inbox and individual conversation pages
   */
  const isItemActive = (href: string) => {
    if (href === '/message') {
      return pathname === '/message' || pathname.startsWith('/message/');
    }

    return pathname === href;
  };

  /**
   * Memoized items used for rendering.
   * Only Chat gets the unread badge count.
   */
  const renderedItems = useMemo(() => {
    return items.map((item) => {
      const isActive = isItemActive(item.href);

      return {
        ...item,
        isActive,
        badgeCount: item.href === '/message' ? totalUnreadCount : 0,
      };
    });
  }, [pathname, totalUnreadCount]);

  return (
    <nav
      className="bottom-nav"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        alignItems: 'center',
        padding: '8px 8px 10px',
        borderTop: '1px solid #d9d9d9',
        background: '#f8f8f8',
      }}
    >
      {renderedItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-link ${item.isActive ? 'active' : ''}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            textDecoration: 'none',
            color: '#4b5563',
            fontSize: '0.72rem',
            fontWeight: item.isActive ? 700 : 500,
            position: 'relative',
            padding: '6px 4px',
            borderRadius: 16,
            background: item.isActive ? '#cfe0d4' : 'transparent',
          }}
        >
          {/* Icon + optional unread badge */}
          <span
            style={{
              position: 'relative',
              fontSize: '1.15rem',
              lineHeight: 1,
            }}
          >
            {item.icon}

            {item.href === '/message' && item.badgeCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -10,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 999,
                  background: '#d90429',
                  color: '#fff',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                {item.badgeCount}
              </span>
            )}
          </span>

          {/* Label */}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
