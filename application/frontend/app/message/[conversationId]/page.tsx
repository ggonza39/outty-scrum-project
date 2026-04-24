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
 *
 * WHY THIS EXISTS:
 * - Keeps UI simple and consistent between mock + real messages
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
   * Mock conversations use conv-{profileId}
   * Real conversations use UUIDs
   */
  const isMockConversation = conversationKey.startsWith('conv-');

  // Core chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [recipientId, setRecipientId] = useState('');

  // UI display state
  const [conversationName, setConversationName] = useState('Conversation');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Realtime + UX state
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  // Loading + error state
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Refs for scroll + typing debounce
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingChannelRef = useRef<ReturnType<typeof createTypingChannel> | null>(null);

  /**
   * ============================
   * MOCK MODE
   * ============================
   *
   * Loads browser-stored messages for demo conversations.
   *
   * Gibson test:
   * - Open /message/conv-1
   * - Profile name + image should show
   * - Messages load from local store
   * - Sending messages updates UI immediately
   */
  useEffect(() => {
    if (!isMockConversation) return;

    setIsLoading(true);
    setLoadError('');

    const profile = getProfileForConversation(conversationKey);

    if (!profile) {
      setMessages([]);
      setConversationName('Conversation');
      setAvatarUrl(null);
      setLoadError('Unable to load this demo conversation.');
      setIsLoading(false);
      return;
    }

    /**
     * Mark mock messages as read
     */
    markStoredConversationAsRead(conversationKey);

    const storedMessages = getStoredMessagesForConversation(conversationKey);

    /**
     * Set UI state
     */
    setConversationName(profile.name);

    /**
     * Pulls image from explorerProfiles via mockMessages helper
     */
    setAvatarUrl(profile.image);

    setRecipientId(profile.id);
    setCurrentUserId('mock-current-user');

    /**
     * Convert stored messages into UI format
     */
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
   * ============================
   * REAL SUPABASE MODE
   * ============================
   *
   * Loads real conversations, messages, typing, and presence.
   *
   * Gibson test:
   * - Open real conversation (UUID)
   * - Messages load from Supabase
   * - Typing works across tabs
   * - Presence shows online/offline
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

        /**
         * Load conversation record
         */
        const { data: conversationData, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationKey)
          .single();

        if (error) throw error;

        const conversation = conversationData as ConversationRecord;

        /**
         * Determine recipient
         */
        const otherUserId =
          conversation.user1_id === user.id
            ? conversation.user2_id
            : conversation.user1_id;

        setRecipientId(otherUserId);

        /**
         * Load display name
         */
        const { data: profileData } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', otherUserId)
          .maybeSingle();

        setConversationName(profileData?.display_name || 'Conversation');

        /**
         * Real users do not have mock avatars
         * → fallback to first letter
         */
        setAvatarUrl(null);

        /**
         * Load messages
         */
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

        /**
         * Mark as read
         */
        await markConversationAsRead(conversationKey);

        /**
         * Realtime subscription
         */
        cleanupMessages = subscribeToConversationMessages(
          conversationKey,
          async (message) => {
            setMessages((current) => {
              if (current.some((m) => m.id === message.id)) return current;

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
            }
          }
        );

        /**
         * Typing channel
         */
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

        /**
         * Presence channel
         */
        cleanupPresence = createPresenceChannel(
          conversationKey,
          user.id,
          setOnlineUserIds
        );
      } catch (error) {
        console.error(error);
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
    };
  }, [conversationKey, isMockConversation]);

  /**
   * Sticky scroll (always shows newest message)
   */
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOtherUserTyping]);

  const typingDots = useMemo(() => '• • •', []);

  /**
   * Send message handler
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = draft.trim();
    if (!trimmed) return;

    /**
     * Mock mode
     */
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

    /**
     * Real mode
     */
    if (!recipientId) return;

    await sendConversationMessage(conversationKey, recipientId, trimmed);
    setDraft('');
  };

  const isOtherUserOnline = onlineUserIds.some((id) => id !== currentUserId);

  return (
    <MobilePage>
      <main className="content">
        <section className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* HEADER */}
          <div style={{ padding: 12 }}>
            <Link href="/message">&lt; Back</Link>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              
              {/* Avatar */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={conversationName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  conversationName.charAt(0)
                )}
              </div>

              {/* Name + status */}
              <div>
                <div>{conversationName}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {isMockConversation
                    ? 'Demo conversation'
                    : isOtherUserOnline
                    ? 'Online'
                    : 'Offline'}
                </div>
              </div>
            </div>
          </div>

          {/* MESSAGE LIST */}
          <div ref={scrollRef} style={{ flex: 1 }}>
            {messages.map((m) => (
              <div key={m.id}>{m.text}</div>
            ))}

            {isOtherUserTyping && <div>{typingDots}</div>}
          </div>

          {/* INPUT */}
          <form onSubmit={handleSubmit}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>

        </section>
      </main>
    </MobilePage>
  );
}
