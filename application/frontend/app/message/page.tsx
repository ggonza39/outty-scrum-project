'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import MobilePage from '@/components/MobilePage';
import {
  fetchInboxConversations,
  type InboxConversation,
} from '@/lib/supabaseMessages';

/**
 * Message inbox page for US7.
 *
 * WHY THIS FILE EXISTS:
 * - Loads real conversations for the signed-in user from Supabase
 * - Shows the latest message preview for each thread
 * - Shows unread message counts
 * - Sorts conversations by most recent activity
 *
 * GIBSON TEST NOTES:
 * - Sign in before opening this page
 * - Open /message
 * - Confirm conversations load from Supabase
 * - Confirm newest conversation appears first
 * - Confirm unread badge appears when messages have is_read = false
 * - Click a conversation and confirm it opens /message/[conversationId]
 */
export default function MessagePage() {
  // Inbox rows returned from Supabase.
  const [conversations, setConversations] = useState<InboxConversation[]>([]);

  // Loading state for the initial inbox query.
  const [isLoading, setIsLoading] = useState(true);

  // Error state shown if Supabase query fails.
  const [loadError, setLoadError] = useState('');

  /**
   * Load conversations when the inbox page opens.
   *
   * Acceptance criteria covered:
   * - Complex Query
   * - Chronological Sort
   * - Snippet Extraction
   * - Unread Count
   */
  useEffect(() => {
    const loadInbox = async () => {
      try {
        setIsLoading(true);
        setLoadError('');

        const results = await fetchInboxConversations();
        setConversations(results);
      } catch (error) {
        console.error('Error loading inbox:', error);
        setLoadError('Unable to load messages right now.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInbox();
  }, []);

  // Controls whether the list or empty state should be shown.
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

          {/* Loading state */}
          {isLoading && (
            <div style={{ padding: '16px' }}>
              <p style={{ margin: 0, color: '#6b7280' }}>
                Loading messages...
              </p>
            </div>
          )}

          {/* Error state */}
          {!isLoading && loadError && (
            <div style={{ padding: '16px' }}>
              <p style={{ margin: 0, color: '#b91c1c' }}>{loadError}</p>
            </div>
          )}

          {/* Inbox list */}
          {!isLoading && !loadError && hasMessages && (
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
                  {/* Avatar fallback using first letter of the other user's name */}
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '3px solid #5ea646',
                      flexShrink: 0,
                      background: '#ddd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#555',
                      fontWeight: 800,
                    }}
                  >
                    {conversation.otherUserName.charAt(0)}
                  </div>

                  {/* Name + latest message preview */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 800,
                        color: '#1f1f1f',
                        fontSize: '1rem',
                        marginBottom: 2,
                      }}
                    >
                      {conversation.otherUserName}
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
                      {conversation.preview || 'No messages yet.'}
                    </div>
                  </div>

                  {/* Message icon + unread badge + visual trash icon */}
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
          )}

          {/* Empty state */}
          {!isLoading && !loadError && !hasMessages && (
            <div style={{ minHeight: 480 }} />
          )}
        </section>
      </main>
    </MobilePage>
  );
}
