'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import MobilePage from '@/components/MobilePage';
import { getStoredInboxConversations } from '@/lib/mockMessageStore';
import type { MockConversationSummary } from '@/lib/mockMessages';

/**
 * Message inbox page for US7 frontend.
 *
 * WHY THIS FILE EXISTS:
 * - Shows the user's active message threads
 * - Reads from the browser-backed mock message store
 * - Keeps inbox previews and unread counts in sync with the chat page
 *
 * GIBSON TEST NOTES:
 * - Inbox should show only conversations that have at least one message
 * - Clicking a row should open /message/[conversationId]
 * - Unread count should appear for conversations with unread incoming messages
 * - Preview text should update after sending a message in chat
 * - Refreshing the page should keep the latest inbox state
 */
export default function MessagePage() {
  // Holds the rendered inbox conversations from the browser-backed store.
  const [conversations, setConversations] = useState<MockConversationSummary[]>(
    []
  );

  /**
   * Load inbox conversations on first render.
   *
   * TEST:
   * - Open /message
   * - Confirm inbox rows load from shared browser-backed message data
   */
  useEffect(() => {
    setConversations(getStoredInboxConversations());
  }, []);

  // Determines whether to show inbox rows or the empty state.
  const hasMessages = conversations.length > 0;

  return (
    <MobilePage>
      <main className="content" style={{ paddingTop: 12 }}>
        <section
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden',
          }}
        >
          {/* Page header */}
          <div style={{ padding: '16px 16px 8px' }}>
            <Link
              href="/discover"
              style={{
                display: 'inline-block',
                fontSize: '0.85rem',
                color: '#8a8a8a',
                textDecoration: 'none',
                marginBottom: 14,
              }}
            >
              &lt; Back to discovery
            </Link>

            <h1
              style={{
                margin: 0,
                fontSize: '1.85rem',
                lineHeight: 1.1,
                fontWeight: 800,
                color: '#222',
              }}
            >
              {hasMessages ? 'Your Messages' : 'You have no messages'}
            </h1>
          </div>

          {/* Inbox list */}
          {hasMessages ? (
            <div>
              {conversations.map((conversation, index) => (
                <Link
                  key={conversation.conversationId}
                  href={`/message/${conversation.conversationId}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 12px',
                    textDecoration: 'none',
                    background:
                      index === 0 ? 'rgba(151, 206, 148, 0.28)' : '#f4f4f4',
                    borderTop: '1px solid #ececec',
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '3px solid #5ea646',
                      flexShrink: 0,
                      background: '#ddd',
                    }}
                  >
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>

                  {/* Name + latest preview */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 800,
                        color: '#1f1f1f',
                        fontSize: '1rem',
                        marginBottom: 2,
                      }}
                    >
                      {conversation.name}
                    </div>

                    <div
                      style={{
                        color: '#4d4d4d',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                      }}
                    >
                      {conversation.preview}
                    </div>
                  </div>

                  {/* Message icon + unread badge + trash icon */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        color: '#8e8e8e',
                        fontSize: '1rem',
                        lineHeight: 1,
                      }}
                    >
                      ✉
                      {conversation.unreadCount > 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: -8,
                            right: -9,
                            minWidth: 16,
                            height: 16,
                            borderRadius: 999,
                            background: '#d90429',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 4px',
                          }}
                        >
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Trash icon is visual only for now */}
                    <span
                      style={{
                        color: '#9a9a9a',
                        fontSize: '0.95rem',
                      }}
                    >
                      🗑
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /**
             * Empty state.
             *
             * Can test this by clearing the mock store or removing
             * all seeded messages from the shared store.
             */
            <div style={{ minHeight: 480 }} />
          )}
        </section>
      </main>
    </MobilePage>
  );
}
