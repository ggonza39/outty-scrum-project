'use client';

import { explorerProfiles } from '@/lib/explorerProfiles';
import {
  getConversationIdForProfile,
  mockMessagesByConversation,
  MockConversationSummary,
  MockMessage,
} from '@/lib/mockMessages';

/**
 * Browser storage key for the shared mock messaging store.
 *
 * IMPORTANT:
 * - This lets the frontend keep message state across page navigation
 * - It also gives us one shared source of truth for inbox + chat pages
 */
const MOCK_MESSAGE_STORE_KEY = 'outty_mock_message_store_v1';

/**
 * Stored message shape used in localStorage.
 *
 * WHY THIS EXISTS:
 * - The chat page needs display text + sender + read state
 * - The inbox page needs a sortable timestamp
 */
export type StoredMockMessage = {
  id: string;
  conversationId: string;
  sender: 'self' | 'other';
  text: string;
  timestampLabel: string;
  createdAtMs: number;
  isRead?: boolean;
};

/**
 * Internal store shape keyed by conversation ID.
 */
export type MockMessageStore = Record<string, StoredMockMessage[]>;

/**
 * Convert older shared mock seed data into the browser store format.
 *
 * TEST:
 * - Initial load should seed known conversations like conv-1 through conv-5
 */
function buildInitialStore(): MockMessageStore {
  const store: MockMessageStore = {};

  Object.entries(mockMessagesByConversation).forEach(
    ([conversationId, messages]) => {
      store[conversationId] = messages.map((message, index) => {
        return {
          id: message.id,
          conversationId: message.conversationId,
          sender: message.sender,
          text: message.text,
          timestampLabel: message.timestamp,
          /**
           * Use a stable numeric timestamp for sorting.
           * This keeps inbox rows ordered consistently in the mock store.
           */
          createdAtMs: Date.now() - (messages.length - index) * 60000,
          isRead: message.isRead,
        };
      });
    }
  );

  return store;
}

/**
 * Safely read the browser message store from localStorage.
 *
 * If the store does not exist yet, seed it from the shared mock data.
 *
 * TEST:
 * - First load should create seeded store data
 * - Later loads should reuse stored values
 */
export function loadMockMessageStore(): MockMessageStore {
  if (typeof window === 'undefined') {
    return buildInitialStore();
  }

  const raw = window.localStorage.getItem(MOCK_MESSAGE_STORE_KEY);

  if (!raw) {
    const initialStore = buildInitialStore();
    window.localStorage.setItem(
      MOCK_MESSAGE_STORE_KEY,
      JSON.stringify(initialStore)
    );
    return initialStore;
  }

  try {
    return JSON.parse(raw) as MockMessageStore;
  } catch {
    const fallbackStore = buildInitialStore();
    window.localStorage.setItem(
      MOCK_MESSAGE_STORE_KEY,
      JSON.stringify(fallbackStore)
    );
    return fallbackStore;
  }
}

/**
 * Save the updated store back into localStorage.
 *
 * TEST:
 * - Send a new message
 * - Refresh page
 * - Confirm new message is still visible
 */
export function saveMockMessageStore(store: MockMessageStore) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(MOCK_MESSAGE_STORE_KEY, JSON.stringify(store));
}

/**
 * Return all stored messages for one conversation.
 *
 * TEST:
 * - Opening Maya's thread should only show conv-1 messages
 * - Opening Taylor's thread should only show conv-4 or conv-5 messages
 */
export function getStoredMessagesForConversation(
  conversationId: string
): StoredMockMessage[] {
  const store = loadMockMessageStore();
  return store[conversationId] || [];
}

/**
 * Build inbox rows from the browser-backed message store.
 *
 * Rules:
 * - Conversations with zero messages do not appear in the inbox
 * - Preview comes from the newest message
 * - Unread count only counts incoming "other" messages that are not read
 * - Rows are sorted newest first
 *
 * TEST:
 * - Send a new message in chat
 * - Go back to inbox
 * - Preview should reflect the latest text
 */
export function getStoredInboxConversations(): MockConversationSummary[] {
  const store = loadMockMessageStore();

  const conversations = explorerProfiles
    .map((profile) => {
      const conversationId = getConversationIdForProfile(profile.id);
      const messages = store[conversationId] || [];

      if (messages.length === 0) {
        return null;
      }

      const latestMessage = messages[messages.length - 1];

      const preview =
        latestMessage.text.length > 40
          ? `${latestMessage.text.slice(0, 40)}...`
          : latestMessage.text;

      const unreadCount = messages.filter(
        (message) => message.sender === 'other' && !message.isRead
      ).length;

      return {
        conversationId,
        profileId: profile.id,
        name: profile.name,
        avatar: profile.image,
        preview,
        unreadCount,
        /**
         * Convert numeric time into a string for inbox sorting compatibility.
         */
        lastMessageAt: String(latestMessage.createdAtMs),
      };
    })
    .filter(
      (conversation): conversation is MockConversationSummary =>
        conversation !== null
    )
    .sort((a, b) => Number(b.lastMessageAt) - Number(a.lastMessageAt));

  return conversations;
}

/**
 * Add a new outgoing message to one conversation in the browser store.
 *
 * TEST:
 * - Type and send a new message
 * - Confirm it appears in chat
 * - Confirm inbox preview updates after returning to /message
 */
export function appendOutgoingStoredMessage(
  conversationId: string,
  text: string
): StoredMockMessage {
  const store = loadMockMessageStore();

  const newMessage: StoredMockMessage = {
    id: `${conversationId}-${Date.now()}`,
    conversationId,
    sender: 'self',
    text,
    timestampLabel: 'Now',
    createdAtMs: Date.now(),
    isRead: true,
  };

  const existingMessages = store[conversationId] || [];
  const updatedStore: MockMessageStore = {
    ...store,
    [conversationId]: [...existingMessages, newMessage],
  };

  saveMockMessageStore(updatedStore);

  return newMessage;
}

/**
 * Mark all incoming messages in a conversation as read.
 *
 * TEST:
 * - Open a conversation with unread incoming messages
 * - Return to inbox
 * - Badge count should decrease or disappear
 */
export function markStoredConversationAsRead(conversationId: string) {
  const store = loadMockMessageStore();
  const messages = store[conversationId] || [];

  const updatedMessages = messages.map((message) => {
    if (message.sender === 'other' && !message.isRead) {
      return {
        ...message,
        isRead: true,
      };
    }

    return message;
  });

  const updatedStore: MockMessageStore = {
    ...store,
    [conversationId]: updatedMessages,
  };

  saveMockMessageStore(updatedStore);
}

/**
 * Reset the browser store back to the original seeded mock data.
 *
 * WHY THIS EXISTS:
 * - Makes repeated frontend testing easier
 * - Helpful if the message state gets messy while testing
 *
 * TEST:
 * - Run from browser console if needed:
 *   window.localStorage.removeItem('outty_mock_message_store_v1')
 * - Reload app
 * - Seeded message state should return
 */
export function resetMockMessageStore() {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(MOCK_MESSAGE_STORE_KEY);
  const resetStore = buildInitialStore();
  saveMockMessageStore(resetStore);
}
