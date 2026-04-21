import { explorerProfiles } from "@/lib/explorerProfiles";

/**
 * Shared mock messaging data for US7 frontend.
 *
 * WHY THIS FILE EXISTS:
 * - Keeps inbox page, chat page, and profile "Send Message" routing consistent
 * - Prevents hardcoded names from drifting out of sync with explorerProfiles.ts
 * - Makes testing easier because all mock conversation data lives in one place
 *
 * IMPORTANT:
 * - conversationId format must stay: conv-{profileId}
 * - That format will be reused anywhere we link into /message/[conversationId]
 */

/**
 * Raw mock message shape used by the chat page.
 */
export type MockMessage = {
  id: string;
  conversationId: string;
  sender: "self" | "other";
  text: string;
  timestamp: string;
  isRead?: boolean;
};

/**
 * Summary shape used by the inbox page.
 */
export type MockConversationSummary = {
  conversationId: string;
  profileId: string;
  name: string;
  avatar: string;
  preview: string;
  unreadCount: number;
  lastMessageAt: string;
};

/**
 * Build a stable mock conversation ID from a profile ID.
 *
 * TEST:
 * - profileId "1" should return "conv-1"
 * - profileId "5" should return "conv-5"
 */
export function getConversationIdForProfile(profileId: string) {
  return `conv-${profileId}`;
}

/**
 * Shared mock chat history keyed by conversationId.
 *
 * Gibson test notes:
 * - conv-1 should map to Maya
 * - conv-2 should map to Jordan
 * - conv-3 should map to Avery
 * - conv-4 should map to Taylor (age 30)
 * - conv-5 should map to Taylor (age 66)
 */
export const mockMessagesByConversation: Record<string, MockMessage[]> = {
  "conv-1": [
    {
      id: "conv-1-msg-1",
      conversationId: "conv-1",
      sender: "other",
      text: "Hey, I saw you like hiking too.",
      timestamp: "Saturday 10:21AM",
    },
    {
      id: "conv-1-msg-2",
      conversationId: "conv-1",
      sender: "self",
      text: "Yes, I usually go early in the morning.",
      timestamp: "Saturday 10:22AM",
      isRead: true,
    },
    {
      id: "conv-1-msg-3",
      conversationId: "conv-1",
      sender: "other",
      text: "Nice. I like sunrise trails and kayaking spots.",
      timestamp: "Saturday 10:25AM",
    },
  ],
  "conv-2": [
    {
      id: "conv-2-msg-1",
      conversationId: "conv-2",
      sender: "other",
      text: "Have you been camping anywhere good lately?",
      timestamp: "Friday 8:05PM",
    },
    {
      id: "conv-2-msg-2",
      conversationId: "conv-2",
      sender: "self",
      text: "Not recently, but I want to plan something soon.",
      timestamp: "Friday 8:11PM",
      isRead: true,
    },
  ],
  "conv-3": [
    {
      id: "conv-3-msg-1",
      conversationId: "conv-3",
      sender: "other",
      text: "Do you surf often or mostly bike trails?",
      timestamp: "Thursday 6:40PM",
    },
  ],
  "conv-4": [
    {
      id: "conv-4-msg-1",
      conversationId: "conv-4",
      sender: "other",
      text: "I’m planning a backpacking trip next month.",
      timestamp: "Wednesday 7:15PM",
    },
    {
      id: "conv-4-msg-2",
      conversationId: "conv-4",
      sender: "other",
      text: "Would love to hear your favorite ski spots too.",
      timestamp: "Wednesday 7:19PM",
    },
  ],
  "conv-5": [],
};

/**
 * Returns the explorer profile tied to a conversationId.
 *
 * TEST:
 * - "conv-1" should return Maya
 * - "conv-4" should return Taylor (id 4)
 * - unknown conversationId should return null
 */
export function getProfileForConversation(conversationId: string) {
  const profileId = conversationId.replace("conv-", "");
  return explorerProfiles.find((profile) => profile.id === profileId) || null;
}

/**
 * Returns all mock messages for one conversation.
 *
 * TEST:
 * - known conversationId should return an array
 * - unknown conversationId should return an empty array
 */
export function getMockMessagesForConversation(conversationId: string) {
  return mockMessagesByConversation[conversationId] || [];
}

/**
 * Builds inbox summary data from explorerProfiles + mock message history.
 *
 * Rules:
 * - Only conversations with at least one message appear in the inbox
 * - Latest message becomes the preview text
 * - Unread count only counts incoming messages from "other" that are not read
 * - Inbox is sorted newest first using the latest timestamp string order as entered
 *
 * NOTE:
 * Since this is mock frontend data, timestamps are display strings rather than
 * real ISO dates. We will use the order of the last message in each thread as-is.
 */
export function getMockInboxConversations(): MockConversationSummary[] {
  return explorerProfiles
    .map((profile) => {
      const conversationId = getConversationIdForProfile(profile.id);
      const messages = getMockMessagesForConversation(conversationId);

      if (messages.length === 0) {
        return null;
      }

      const latestMessage = messages[messages.length - 1];

      const preview =
        latestMessage.text.length > 40
          ? `${latestMessage.text.slice(0, 40)}...`
          : latestMessage.text;

      const unreadCount = messages.filter(
        (message) => message.sender === "other" && !message.isRead
      ).length;

      return {
        conversationId,
        profileId: profile.id,
        name: profile.name,
        avatar: profile.image,
        preview,
        unreadCount,
        lastMessageAt: latestMessage.timestamp,
      };
    })
    .filter((conversation): conversation is MockConversationSummary => conversation !== null)
    .sort((a, b) => b.profileId.localeCompare(a.profileId));
}

/**
 * Adds a new outgoing message to a conversation in a frontend-friendly way.
 *
 * IMPORTANT:
 * This helper returns a new message object, but because this file is static mock
 * data, page state should handle actually displaying the new message after submit.
 *
 * TEST:
 * - pass conversationId + text
 * - confirm returned object has sender "self"
 */
export function buildOutgoingMockMessage(
  conversationId: string,
  text: string
): MockMessage {
  return {
    id: `${conversationId}-${Date.now()}`,
    conversationId,
    sender: "self",
    text,
    timestamp: "Now",
    isRead: true,
  };
}
