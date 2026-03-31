'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/app/supabaseClient'

/* -------------------------------------------------------------------------- */
/* SECTION 1: INTERFACES & CONTEXT DEFINITION                                 */
/* -------------------------------------------------------------------------- */
interface ChatContextType {
  activeFloatingId: string | null;
  isFloatingOpen: boolean;
  openFloatingChat: (id: string) => void;
  closeFloatingChat: () => void;
  setActiveFloatingId: (id: string | null) => void;
  unreadCount: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

/* -------------------------------------------------------------------------- */
/* SECTION 2: PROVIDER COMPONENT & STATE                                      */
/* -------------------------------------------------------------------------- */
export function ChatProvider({ children }: { children: ReactNode }) {
  const [activeFloatingId, setActiveFloatingId] = useState<string | null>(null)
  const [isFloatingOpen, setIsFloatingOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: CORE CHAT ACTIONS (OPEN/CLOSE)                                  */
  /* -------------------------------------------------------------------------- */
  const openFloatingChat = (id: string) => {
    setActiveFloatingId(id);
    setIsFloatingOpen(true);
  }

  const closeFloatingChat = () => {
    setIsFloatingOpen(false);
  }

  /* -------------------------------------------------------------------------- */
    /* SECTION 4: DATA INITIALIZATION & REAL-TIME SYNC                            */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
      let channel: any;

      const setupChatSync = async (userId: string) => {
        // 4.1 Initial Unread Message Check (to set active ID)
        const { data: unreadMsg } = await supabase
          .from('messages')
          .select('conversation_id')
          .eq('receiver_id', userId)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (unreadMsg) setActiveFloatingId(unreadMsg.conversation_id);

        // 4.2 Initial Unread Count Fetch
        const fetchCount = async () => {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', userId)
            .eq('is_read', false);
          setUnreadCount(count || 0);
        };

        await fetchCount();

        // 4.3 Real-time Listener
        channel = supabase
          .channel(`chat-sync-${userId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${userId}`
          }, () => fetchCount())
          .subscribe();
      };

      // 4.4 Auth Listener: The "Wake Up" Call
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
          setupChatSync(session.user.id);
        }
        if (event === 'SIGNED_OUT') {
          if (channel) supabase.removeChannel(channel);
          setUnreadCount(0);
          setActiveFloatingId(null);
        }
      });

      return () => {
        subscription.unsubscribe();
        if (channel) supabase.removeChannel(channel);
      };
    }, []); // The listener stays active for the app lifecycle
  /* -------------------------------------------------------------------------- */
  /* SECTION 5: RENDER PROVIDER                                                 */
  /* -------------------------------------------------------------------------- */
  return (
    <ChatContext.Provider
      value={{
        activeFloatingId,
        isFloatingOpen,
        openFloatingChat,
        closeFloatingChat,
        setActiveFloatingId,
        unreadCount
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/* SECTION 6: CUSTOM HOOK                                                     */
/* -------------------------------------------------------------------------- */
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
}