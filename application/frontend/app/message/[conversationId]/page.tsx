'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import MobilePage from '@/components/MobilePage';
import {
  buildOutgoingMockMessage,
  getMockMessagesForConversation,
  getProfileForConversation,
  MockMessage,
} from '@/lib/mockMessages';

/**
 * UI-friendly chat message shape used only by this page.
 *
 * WHY THIS EXISTS:
 * - The shared mock data layer stores raw mock message data
 * - This page maps it into a format that is easy to render in chat bubbles
 */
type ChatMessage = {
  id: string;
  text: string;
  self: boolean;
  timestamp: string;
  read?: boolean;
};

export default function ConversationPage() {
  // Read the conversation ID directly from the URL route.
  const { conversationId } = useParams();
  const conversationKey = conversationId as string;

  /**
   * Look up the explorer profile tied to this conversation.
   *
   * Gibson test:
   * - /message/conv-1 should show Maya
   * - /message/conv-2 should show Jordan
   * - /message/conv-3 should show Avery
   * - /message/conv-4 should show Taylor
   */
  const profile = getProfileForConversation(conversationKey);

  /**
   * Load the starting message history for this conversation from shared mock data.
   *
   * IMPORTANT:
   * This runs only once on page load for the active conversation.
   */
  const initialMessages = useMemo(() => {
    return getMockMessagesForConversation(conversationKey).map(
      (message: MockMessage) => ({
        id: message.id,
        text: message.text,
        self: message.sender === 'self',
        timestamp: message.timestamp,
        read: message.isRead,
      })
    );
  }, [conversationKey]);

  // Local chat state for rendering and sending messages.
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Controlled input state for the draft message box.
  const [draft, setDraft] = useState('');

  // Mock typing indicator state for frontend-only testing.
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  // Ref used for sticky auto-scroll behavior.
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Ref used to clear the mock typing timeout.
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Reset the visible messages whenever the route changes.
   *
   * Gibson test:
   * - open one conversation
   * - go back to inbox
   * - open another conversation
   * - confirm the second chat shows the correct message history
   */
  useEffect(() => {
    setMessages(initialMessages);
    setDraft('');
    setIsOtherUserTyping(false);
  }, [initialMessages]);

  /**
   * Task 9: Sticky scroll
   *
   * Whenever messages change or the typing indicator appears,
   * scroll the message list to the newest content at the bottom.
   *
   * Gibson test:
   * - send a new message
   * - confirm the newest message stays in view
   */
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOtherUserTyping]);

  /**
   * Task 10: Mock typing indicator trigger
   *
   * For frontend-only testing, typing in the input briefly shows
   * a typing indicator as if the other person is active.
   *
   * Gibson test:
   * - type in the message field
   * - confirm the typing indicator appears
   * - stop typing
   * - confirm it disappears after 3 seconds
   */
  const handleDraftChange = (value: string) => {
    setDraft(value);

    setIsOtherUserTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsOtherUserTyping(false);
    }, 3000);
  };

  /**
   * Task 9: Send a message
   *
   * Validation:
   * - prevents sending empty/blank messages
   *
   * Behavior:
   * - creates a new outgoing mock message
   * - appends it to local state
   * - clears the input
   *
   * Gibson test:
   * - type a normal message and send it
   * - confirm it appears in the chat
   * - try sending an empty string
   * - confirm nothing is added
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = draft.trim();

    if (!trimmed) return;

    const newMessage = buildOutgoingMockMessage(conversationKey, trimmed);

    setMessages((current) => [
      ...current,
      {
        id: newMessage.id,
        text: newMessage.text,
        self: true,
        timestamp: newMessage.timestamp,
        read: newMessage.isRead,
      },
    ]);

    setDraft('');
  };

  /**
   * Static typing indicator dots for the chat UI.
   */
  const typingDots = useMemo(() => '• • •', []);

  /**
   * Safety fallback for invalid conversation IDs.
   *
   * Gibson test:
   * - manually visit an invalid route like /message/conv-999
   * - confirm the page shows "Conversation not found."
   */
  if (!profile) {
    return (
      <MobilePage>
        <main className="content">
          <section className="card" style={{ padding: 16 }}>
            <p style={{ margin: 0 }}>Conversation not found.</p>
          </section>
        </main>
      </MobilePage>
    );
  }

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
                  }}
                >
                  <img
                    src={profile.image}
                    alt={profile.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: '#222',
                    }}
                  >
                    {profile.name}
                  </div>

                  {/* Mock online label for UI match */}
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Offline
                  </div>
                </div>
              </div>

              <div style={{ color: '#7d7d7d', fontSize: '1rem' }}>✉</div>
            </div>
          </div>

          {/* Message list */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px 12px 10px',
              background: '#f7f7f7',
            }}
          >
            {messages.map((message) => (
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
            ))}

            {/* Typing indicator */}
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

          {/* Input area */}
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
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#049640',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
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
