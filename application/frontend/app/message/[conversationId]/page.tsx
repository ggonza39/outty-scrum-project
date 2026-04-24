'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import MobilePage from '@/components/MobilePage';
import { getProfileForConversation } from '@/lib/mockMessages';
import {
  appendOutgoingStoredMessage,
  getStoredMessagesForConversation,
  markStoredConversationAsRead,
  type StoredMockMessage,
} from '@/lib/mockMessageStore';
import {
  createPresenceChannel,
  createTypingChannel,
  fetchConversationMessages,
  getCurrentUser,
  markConversationAsRead,
  sendConversationMessage,
  subscribeToConversationMessages,
  type ConversationRecord,
  type MessageRecord,
} from '@/lib/supabaseMessages';
import { supabase } from '@/lib/supabase';

/**
 * UI-friendly chat message shape.
 */
type ChatMessage = {
  id: string;
  text: string;
  self: boolean;
  timestamp: string;
  read?: boolean;
};

/**
 * Formats Supabase timestamps for chat display.
 */
function formatTimestamp(value: string) {
  return new Date(value).toLocaleString([], {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ConversationPage() {
  const { conversationId } = useParams();
  const conversationKey = conversationId as string;

  /**
   * Mock conversations use conv-{profileId}.
   * Real Supabase conversations use UUIDs.
   */
  const isMockConversation = conversationKey.startsWith('conv-');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [conversationName, setConversationName] = useState('Conversation');
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | 'unsupported'
  >('default');

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingChannelRef = useRef<ReturnType<typeof createTypingChannel> | null>(
    null
  );

  /**
   * Task 12: Request browser notification permission.
   *
   * Gibson test:
   * - Open a real Supabase conversation
   * - Browser should request notification permission if still unset
   */
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported');
      return;
    }

    setNotificationPermission(Notification.permission);

    const requestPermission = async () => {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
      }
    };

    requestPermission();
  }, []);

  /**
   * Task 12: Show notification for incoming realtime messages.
   *
   * Rules:
   * - only real Supabase conversations trigger browser notifications
   * - only messages from the other user trigger notifications
   * - notifications only fire when the tab is hidden
   * - notification click returns user to this chat
   */
  const showIncomingMessageNotification = (message: MessageRecord) => {
    if (
      typeof window === 'undefined' ||
      !('Notification' in window) ||
      notificationPermission !== 'granted' ||
      document.visibilityState !== 'hidden'
    ) {
      return;
    }

    const notification = new Notification(conversationName || 'New message', {
      body:
        message.content.length > 60
          ? `${message.content.slice(0, 60)}...`
          : message.content,
      tag: `outty-message-${conversationKey}`,
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = `/message/${conversationKey}`;
      notification.close();
    };
  };

  /**
   * MOCK MODE:
   * Loads browser-backed mock messages for conv-{profileId} routes.
   *
   * Gibson test:
   * - /message/conv-1 should show Maya
   * - Send message should work
   * - Return to /message and preview should update
   */
  useEffect(() => {
    if (!isMockConversation) return;

    setIsLoading(true);
    setLoadError('');

    const profile = getProfileForConversation(conversationKey);

    if (!profile) {
      setMessages([]);
      setConversationName('Conversation');
      setLoadError('Unable to load this demo conversation.');
      setIsLoading(false);
      return;
    }

    markStoredConversationAsRead(conversationKey);

    const storedMessages = getStoredMessagesForConversation(conversationKey);

    setConversationName(profile.name);
    setRecipientId(profile.id);
    setCurrentUserId('mock-current-user');

    setMessages(
      storedMessages.map((message: StoredMockMessage) => ({
        id: message.id,
        text: message.text,
        self: message.sender === 'self',
        timestamp: message.timestampLabel,
        read: message.isRead,
      }))
    );

    setDraft('');
    setIsOtherUserTyping(false);
    setOnlineUserIds([]);
    setIsLoading(false);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationKey, isMockConversation]);

  /**
   * REAL SUPABASE MODE:
   * Loads real conversation, message history, realtime, typing, and presence.
   *
   * Gibson test:
   * - Open /message/[real UUID]
   * - Messages load from Supabase
   * - Sending inserts into Supabase
   * - Realtime messages appear without refresh
   * - Typing indicator works across tabs/users
   * - Presence updates online/offline status
   * - Notifications appear when tab is hidden
   */
  useEffect(() => {
    if (isMockConversation) return;

    let cleanupMessages: (() => void) | undefined;
    let cleanupPresence: (() => void) | undefined;
    let cleanupTyping: (() => void) | undefined;

    const loadConversation = async () => {
      try {
        setIsLoading(true);
        setLoadError('');

        const user = await getCurrentUser();
        setCurrentUserId(user.id);

        const { data: conversationData, error: conversationError } =
          await supabase
            .from('conversations')
            .select('*')
            .eq('id', conversationKey)
            .single();

        if (conversationError) throw conversationError;

        const conversation = conversationData as ConversationRecord;

        const otherUserId =
          conversation.user1_id === user.id
            ? conversation.user2_id
            : conversation.user1_id;

        setRecipientId(otherUserId);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', otherUserId)
          .maybeSingle();

        setConversationName(profileData?.display_name || 'Conversation');

        const rows = await fetchConversationMessages(conversationKey);

        setMessages(
          rows.map((message: MessageRecord) => ({
            id: message.id,
            text: message.content,
            self: message.sender_id === user.id,
            timestamp: formatTimestamp(message.created_at),
            read: message.is_read,
          }))
        );

        await markConversationAsRead(conversationKey);

        cleanupMessages = subscribeToConversationMessages(
          conversationKey,
          async (message) => {
            setMessages((current) => {
              const alreadyExists = current.some(
                (currentMessage) => currentMessage.id === message.id
              );

              if (alreadyExists) return current;

              return [
                ...current,
                {
                  id: message.id,
                  text: message.content,
                  self: message.sender_id === user.id,
                  timestamp: formatTimestamp(message.created_at),
                  read: message.is_read,
                },
              ];
            });

            if (message.sender_id !== user.id) {
              await markConversationAsRead(conversationKey);
              showIncomingMessageNotification(message);
            }
          }
        );

        const typing = createTypingChannel(conversationKey, ({ userId }) => {
          if (userId === user.id) return;

          setIsOtherUserTyping(true);

          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }

          typingTimeoutRef.current = setTimeout(() => {
            setIsOtherUserTyping(false);
          }, 3000);
        });

        typingChannelRef.current = typing;
        cleanupTyping = typing.cleanup;

        cleanupPresence = createPresenceChannel(
          conversationKey,
          user.id,
          setOnlineUserIds
        );
      } catch (error) {
        console.error('Error loading conversation:', error);
        setLoadError('Unable to load this conversation.');
      } finally {
        setIsLoading(false);
      }
    };

    loadConversation();

    return () => {
      cleanupMessages?.();
      cleanupPresence?.();
      cleanupTyping?.();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingChannelRef.current = null;
    };
  }, [conversationKey, isMockConversation, notificationPermission]);

  /**
   * Task 9: Sticky scroll keeps newest activity visible.
   */
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOtherUserTyping]);

  const typingDots = useMemo(() => '• • •', []);

  /**
   * Task 10:
   * - Mock mode shows a local typing indicator for UI testing
   * - Real mode sends a Supabase broadcast typing event
   */
  const handleDraftChange = async (value: string) => {
    setDraft(value);

    if (isMockConversation) {
      setIsOtherUserTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsOtherUserTyping(false);
      }, 3000);

      return;
    }

    if (!currentUserId || !typingChannelRef.current) return;

    await typingChannelRef.current.sendTyping(currentUserId);
  };

  /**
   * Task 9:
   * - Blocks empty messages
   * - Mock mode appends to browser-backed mock store
   * - Real mode inserts into Supabase
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = draft.trim();

    if (!trimmed) return;

    if (isMockConversation) {
      const newMessage = appendOutgoingStoredMessage(conversationKey, trimmed);

      setMessages((current) => [
        ...current,
        {
          id: newMessage.id,
          text: newMessage.text,
          self: true,
          timestamp: newMessage.timestampLabel,
          read: newMessage.isRead,
        },
      ]);

      setDraft('');
      return;
    }

    if (!recipientId) {
      setLoadError('Recipient is not available yet.');
      return;
    }

    try {
      await sendConversationMessage(conversationKey, recipientId, trimmed);
      setDraft('');
    } catch (error) {
      console.error('Error sending message:', error);
      setLoadError('Unable to send message.');
    }
  };

  const isOtherUserOnline = onlineUserIds.some((id) => id !== currentUserId);

  return (
    <MobilePage>
      <main className="content" style={{ paddingTop: 10 }}>
        <section
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden',
            minHeight: 650,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 14px 10px',
              borderBottom: '1px solid #ececec',
            }}
          >
            <Link
              href="/message"
              style={{
                display: 'inline-block',
                fontSize: '0.85rem',
                color: '#8a8a8a',
                textDecoration: 'none',
                marginBottom: 12,
              }}
            >
              &lt; Back to message board
            </Link>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #5ea646',
                    flexShrink: 0,
                    background: '#ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: '#555',
                  }}
                >
                  {conversationName.charAt(0)}
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: '#222',
                    }}
                  >
                    {conversationName}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {isMockConversation
                      ? 'Demo conversation'
                      : isOtherUserOnline
                      ? 'Online'
                      : 'Offline'}
                  </div>
                </div>
              </div>

              <div style={{ color: '#7d7d7d', fontSize: '1rem' }}>✉</div>
            </div>
          </div>

          {/* Loading/Error */}
          {isLoading && (
            <div style={{ padding: 16 }}>
              <p style={{ margin: 0 }}>Loading conversation...</p>
            </div>
          )}

          {!isLoading && loadError && (
            <div style={{ padding: 16 }}>
              <p style={{ margin: 0, color: '#b91c1c' }}>{loadError}</p>
            </div>
          )}

          {/* Message list */}
          {!isLoading && !loadError && (
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '14px 12px 10px',
                background: '#f7f7f7',
              }}
            >
              {messages.length === 0 ? (
                <p style={{ margin: 0, color: '#6b7280' }}>No messages yet.</p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#8b8b8b',
                        marginBottom: 4,
                        textAlign: message.self ? 'right' : 'left',
                      }}
                    >
                      {message.timestamp}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: message.self ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '76%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          background: message.self ? '#f5b22d' : '#049640',
                          color: message.self ? '#1f1f1f' : '#fff',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                        }}
                      >
                        {message.text}
                      </div>
                    </div>

                    {message.self && (
                      <div
                        style={{
                          marginTop: 4,
                          textAlign: 'right',
                          fontSize: '0.72rem',
                          color: '#8b8b8b',
                        }}
                      >
                        {message.read ? 'Read' : 'Sent'}
                      </div>
                    )}
                  </div>
                ))
              )}

              {isOtherUserTyping && (
                <div style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 78,
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: '#049640',
                      color: '#fff',
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: 2,
                    }}
                  >
                    {typingDots}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: 12,
              borderTop: '1px solid #ececec',
              background: '#f7f7f7',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#f5b22d',
                borderRadius: 8,
                padding: '10px 12px',
              }}
            >
              <input
                type="text"
                value={draft}
                onChange={(event) => handleDraftChange(event.target.value)}
                placeholder="Input here........"
                disabled={isLoading || !!loadError}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.9rem',
                  color: '#222',
                }}
              />

              <button
                type="submit"
                disabled={isLoading || !!loadError}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#049640',
                  fontSize: '1.2rem',
                  cursor: isLoading || loadError ? 'not-allowed' : 'pointer',
                  padding: 0,
                }}
                aria-label="Send message"
              >
                💬
              </button>
            </div>
          </form>
        </section>
      </main>
    </MobilePage>
  );
}
