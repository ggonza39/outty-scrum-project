'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import MobilePage from '@/components/MobilePage';
import { getStoredInboxConversations } from '@/lib/mockMessageStore';
import {
  fetchInboxConversations,
  type InboxConversation,
} from '@/lib/supabaseMessages';

/**
 * Shared display type for inbox rows.
 *
 * WHY THIS EXISTS:
 * - Supabase conversations and mock conversations use slightly different shapes
 * - This lets the UI render both with one consistent structure
 */
type InboxDisplayRow = {
  conversationId: string;
  displayName: string;
  avatarLabel: string;
  preview: string;
  unreadCount: number;
  source: 'supabase' | 'mock';
};

/**
 * Message inbox page for US7.
 *
 * WHY THIS FILE EXISTS:
 * - Loads real conversations for the signed-in user from Supabase
 * - Falls back to mock conversations when Supabase has no data or fails
 * - Shows latest message preview, unread counts, and newest conversations first
 *
 * GIBSON TEST NOTES:
 * - If Supabase conversations exist, real conversations should show
 * - If Supabase has no conversations, mock conversations should still show
 * - Clicking a real conversation opens /message/[real-conversation-id]
 * - Clicking a mock conversation opens /message/conv-{profileId}
 */
export default function MessagePage() {
  const [conversations, setConversations] = useState<InboxDisplayRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadNotice, setLoadNotice] = useState('');

  /**
   * Convert Supabase inbox rows into the shared display format.
   */
  const mapSupabaseRows = (rows: InboxConversation[]): InboxDisplayRow[] => {
    return rows.map((conversation) => ({
      conversationId: conversation.conversationId,
      displayName: conversation.otherUserName,
      avatarLabel: conversation.otherUserName.charAt(0),
      preview: conversation.preview || 'No messages yet.',
      unreadCount: conversation.unreadCount,
      source: 'supabase',
    }));
  };

  /**
   * Convert mock inbox rows into the shared display format.
   */
  const loadMockRows = (): InboxDisplayRow[] => {
    return getStoredInboxConversations().map((conversation) => ({
      conversationId: conversation.conversationId,
      displayName: conversation.name,
      avatarLabel: conversation.name.charAt(0),
      preview: conversation.preview || 'No messages yet.',
      unreadCount: conversation.unreadCount,
      source: 'mock',
    }));
  };

  /**
   * Load inbox rows.
   *
   * Best behavior:
   * - Try Supabase first
   * - Use real conversations if they exist
   * - Fall back to mock conversations if Supabase is empty or unavailable
   */
  useEffect(() => {
    const loadInbox = async () => {
      try {
        setIsLoading(true);
        setLoadNotice('');

        const supabaseRows = await fetchInboxConversations();

        if (supabaseRows.length > 0) {
          setConversations(mapSupabaseRows(supabaseRows));
          return;
        }

        setConversations(loadMockRows());
        setLoadNotice('Showing demo conversations until real messages are available.');
      } catch (error) {
        console.error('Error loading Supabase inbox. Showing mock fallback:', error);
        setConversations(loadMockRows());
        setLoadNotice('Showing demo conversations because real messages could not load.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInbox();
  }, []);

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

            {loadNotice && (
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: '0.78rem',
                  color: '#6b7280',
                }}
              >
                {loadNotice}
              </p>
            )}
          </div>

          {/* Loading state */}
          {isLoading && (
            <div style={{ padding: '16px' }}>
              <p style={{ margin: 0, color: '#6b7280' }}>
                Loading messages...
              </p>
            </div>
          )}

          {/* Inbox list */}
          {!isLoading && hasMessages && (
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
                  {/* Avatar fallback */}
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
                    {conversation.avatarLabel}
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
                      {conversation.displayName}
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
          {!isLoading && !hasMessages && <div style={{ minHeight: 480 }} />}
        </section>
      </main>
    </MobilePage>
  );
}
