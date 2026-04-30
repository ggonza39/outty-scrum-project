'use client';

import { supabase } from '@/lib/supabase';

/**
 * Raw conversation row from Supabase.
 *
 * Backend source:
 * - conversations table
 * - user1_id and user2_id identify the two participants
 */
export type ConversationRecord = {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at?: string;
};

/**
 * Raw message row from Supabase.
 *
 * Backend source:
 * - messages table
 */
export type MessageRecord = {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

/**
 * Inbox row formatted for the Message Center UI.
 */
export type InboxConversation = {
  conversationId: string;
  otherUserId: string;
  otherUserName: string;
  preview: string;
  unreadCount: number;
  lastMessageAt: string;
};

/**
 * Gets the currently authenticated Supabase user.
 *
 * Gibson test:
 * - If user is signed in, this should return the user object.
 * - If user is not signed in, messaging pages should show an auth-related error.
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error('No authenticated user found.');

  return user;
}

/**
 * Fetches all conversations where the current user is either user1 or user2.
 *
 * This supports Task 11:
 * - active conversation list for the current user
 */
export async function fetchUserConversations() {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

  if (error) throw error;

  return (data || []) as ConversationRecord[];
}

/**
 * Fetches all messages for one conversation in chronological order.
 *
 * This supports Task 9:
 * - dynamic message rendering
 * - message history display
 */
export async function fetchConversationMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []) as MessageRecord[];
}

/**
 * Sends a new message to Supabase.
 *
 * This supports Task 9:
 * - input field submit
 * - validation happens in the UI before this function is called
 */
export function sanitizeString(input: string): string {
    const truncated = input.length > 2000 ? input.slice(0, 2000) : input
    return truncated.replace(/<([^>]*)>/g, '$1')
}
export async function sendConversationMessage(
  conversationId: string,
  recipientId: string,
  content: string
) {
  const user = await getCurrentUser();

  content = sanitizeString(content);

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      recipient_id: recipientId,
      content,
    })
    .select('*')
    .single();

  if (error) throw error;

  return data as MessageRecord;
}

/**
 * Marks messages in a conversation as read.
 *
 * Backend source:
 * - Hunter added the mark_conversation_as_read RPC.
 *
 * This supports Task 11:
 * - unread count should drop after opening a conversation
 */
export async function markConversationAsRead(conversationId: string) {
  const { error } = await supabase.rpc('mark_conversation_as_read', {
    p_conversation_id: conversationId,
  });

  if (error) throw error;
}

/**
 * Builds inbox rows using:
 * - conversations table
 * - messages table
 * - profiles table for display names
 *
 * This supports Task 11:
 * - complex conversation list
 * - latest message preview
 * - unread count
 * - newest thread first
 */
export async function fetchInboxConversations(): Promise<InboxConversation[]> {
  const user = await getCurrentUser();
  const conversations = await fetchUserConversations();

  if (conversations.length === 0) {
    return [];
  }

  const conversationIds = conversations.map((conversation) => conversation.id);

  const otherUserIds = conversations.map((conversation) =>
    conversation.user1_id === user.id
      ? conversation.user2_id
      : conversation.user1_id
  );

  /**
   * Fetch profile display names for the other participants.
   *
   * NOTE:
   * This only depends on id and display_name so it avoids image-column issues.
   */
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', otherUserIds);

  if (profileError) throw profileError;

  const profileMap = new Map(
    (profiles || []).map((profile) => [
      profile.id,
      profile.display_name || 'Unknown User',
    ])
  );

  /**
   * Fetch all messages for the user's conversations.
   * Newest first makes it easy to find the latest message per thread.
   */
  const { data: messageRows, error: messageError } = await supabase
    .from('messages')
    .select('*')
    .in('conversation_id', conversationIds)
    .order('created_at', { ascending: false });

  if (messageError) throw messageError;

  const messages = (messageRows || []) as MessageRecord[];

  const messagesByConversation = new Map<string, MessageRecord[]>();

  for (const message of messages) {
    const current = messagesByConversation.get(message.conversation_id) || [];
    current.push(message);
    messagesByConversation.set(message.conversation_id, current);
  }

  const inboxRows = conversations.map((conversation) => {
    const threadMessages = messagesByConversation.get(conversation.id) || [];
    const latestMessage = threadMessages[0];

    const otherUserId =
      conversation.user1_id === user.id
        ? conversation.user2_id
        : conversation.user1_id;

    const previewSource = latestMessage?.content || '';

    const preview =
      previewSource.length > 40
        ? `${previewSource.slice(0, 40)}...`
        : previewSource;

    const unreadCount = threadMessages.filter(
      (message) => message.recipient_id === user.id && !message.is_read
    ).length;

    return {
      conversationId: conversation.id,
      otherUserId,
      otherUserName: profileMap.get(otherUserId) || 'Unknown User',
      preview,
      unreadCount,
      lastMessageAt: latestMessage?.created_at || conversation.created_at || '',
    };
  });

  return inboxRows.sort(
    (a, b) =>
      new Date(b.lastMessageAt || 0).getTime() -
      new Date(a.lastMessageAt || 0).getTime()
  );
}

/**
 * Subscribes to realtime INSERT events for one active conversation.
 *
 * Backend source:
 * - Hunter enabled realtime replication on messages.
 *
 * This supports Task 9 and backend Task 6:
 * - new messages appear without refresh
 */
export function subscribeToConversationMessages(
  conversationId: string,
  onMessage: (message: MessageRecord) => void
) {
  const channel = supabase
    .channel(`messages-${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onMessage(payload.new as MessageRecord);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Creates a typing broadcast channel for one conversation.
 *
 * This supports Task 10:
 * - sends typing events without writing to the database
 * - recipient can show a temporary typing indicator
 */
export function createTypingChannel(
  conversationId: string,
  onTyping: (payload: { userId: string }) => void
) {
  const channel = supabase.channel(`typing-${conversationId}`);

  channel.on('broadcast', { event: 'typing' }, ({ payload }) => {
    onTyping(payload as { userId: string });
  });

  channel.subscribe();

  return {
    sendTyping: async (userId: string) => {
      await channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId },
      });
    },

    cleanup: () => {
      supabase.removeChannel(channel);
    },
  };
}

/**
 * Creates a Supabase Presence channel for one conversation.
 *
 * Backend source:
 * - Hunter added presence tracking on the test route.
 *
 * This supports backend Task 8:
 * - online/offline participant status
 */
export function createPresenceChannel(
  conversationId: string,
  userId: string,
  onPresenceChange: (onlineUserIds: string[]) => void
) {
  const channel = supabase.channel(`presence-${conversationId}`);

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();

      const users = Object.values(state)
        .flat()
        .map((entry) => {
          const presenceEntry = entry as { user_id?: string };
          return presenceEntry.user_id;
        })
        .filter((userId): userId is string => Boolean(userId));

      onPresenceChange([...new Set(users)]);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
 
