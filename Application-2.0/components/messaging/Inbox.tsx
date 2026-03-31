'use client'

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS, INTERFACES & DEPENDENCIES                              */
/* -------------------------------------------------------------------------- */
import { useEffect, useState } from 'react'
import { supabase } from '@/app/supabaseClient'
import { usePresence } from '@/context/PresenceContext'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  profile_pictures: string[];
}

interface Conversation {
  id: string;
  otherUser: Profile;
  lastMessage: string;
  unreadCount: number;
}

/* -------------------------------------------------------------------------- */
/* SECTION 2: COMPONENT DEFINITION & STATE (BACKEND LOGIC)                    */
/* -------------------------------------------------------------------------- */
export default function Inbox({ onSelectConversation, selectedId }: { onSelectConversation: (id: string) => void, selectedId?: string | null }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const { onlineUsers } = usePresence()
  const router = useRouter()

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: DATA FETCHING & REAL-TIME LOGIC (BACKEND LOGIC)                 */
  /* -------------------------------------------------------------------------- */

  // 3.1 Initial Fetch of Conversations
  async function fetchConversations() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          last_message,
          unread_count_p1,
          unread_count_p2,
          participant_1:profiles!participant_1(id, first_name, last_name, age, profile_pictures),
          participant_2:profiles!participant_2(id, first_name, last_name, age, profile_pictures)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted = data.map((conv: any) => {
          const isP1 = conv.participant_1.id === user.id;
          return {
            id: conv.id,
            otherUser: isP1 ? conv.participant_2 : conv.participant_1,
            lastMessage: conv.last_message,
            unreadCount: isP1 ? conv.unread_count_p1 : conv.unread_count_p2
          };
        });
        setConversations(formatted);
      }
    } catch (err) {
      console.error("Inbox fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConversations();
  }, []);

  // 3.2 Real-time State Patching (Prevents Refetch Lag)
  useEffect(() => {
      let currentUserId: string | null = null;

      const setupUserId = async () => {
        const { data } = await supabase.auth.getUser();
        currentUserId = data.user?.id || null;
      };
      setupUserId();

      const channel = supabase
      .channel('inbox-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
                  const isForMe = payload.new.receiver_id === currentUserId;

                  setConversations(current =>
                    current.map(conv =>
                      conv.id === payload.new.conversation_id
                        ? {
                            ...conv,
                            lastMessage: payload.new.content,
                            unreadCount: isForMe ? conv.unreadCount + 1 : conv.unreadCount
                          }
                        : conv
                    )
                  );
                }
                )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  /* -------------------------------------------------------------------------- */
  /* SECTION 4: LOADING STATES (FRONTEND)                                       */
  /* -------------------------------------------------------------------------- */
  if (loading) return <div className="p-8 text-white/20 animate-pulse uppercase text-[10px] tracking-widest">Loading Inbox...</div>

  /* -------------------------------------------------------------------------- */
  /* SECTION 5: RENDER MAIN UI (FRONTEND)                                       */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="w-full border-r border-white/10 h-full bg-[#022c22]/50 backdrop-blur-xl flex flex-col overflow-x-hidden">

      {/* 5.1 Inbox Header */}
      <div className="p-6 border-b border-white/10 bg-[#022c22]/80">
        <h2 className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[11px]">Messages</h2>
      </div>

      {/* 5.2 Conversation List Feed */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-white/20 text-xs italic">No conversations yet.</div>
        ) : (
          conversations.map((conv) => {
            const avatarUrl = conv.otherUser.profile_pictures?.[0] || 'https://via.placeholder.com/150';
            const isOnline = onlineUsers.includes(conv.otherUser.id);

            return (
              /* BUTTON SECTION: Conversation Item */
              <button
                key={conv.id}
                onClick={() => {
                  onSelectConversation(conv.id);
                  setConversations(prev => prev.map(c =>
                    c.id === conv.id ? { ...c, unreadCount: 0 } : c
                  ));
                }}
                className={`w-full p-5 flex items-center gap-4 transition-all duration-200 will-change-transform border-b border-white/5 group text-left ${
                  selectedId === conv.id
                    ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500'
                    : 'hover:bg-emerald-500/5 hover:translate-x-1'
                }`}
              >
                {/* 5.3 Avatar & Status Dot Section */}
                                <div
                                  className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform active:scale-95 z-0"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevents selecting the conversation row
                                    router.push(`/profile/${conv.otherUser.id}`);
                                  }}
                                >
                                  {/* THE GLOW RING */}
                                  <div className={`absolute inset-0 rounded-full border-2 transition-all duration-700 z-10 pointer-events-none ${
                                    isOnline
                                      ? 'border-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)] opacity-100 scale-105'
                                      : selectedId === conv.id
                                        ? 'border-emerald-500 opacity-100 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                        : 'border-emerald-500/30 opacity-40 group-hover:border-emerald-500 group-hover:opacity-100 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                                  }`} />

                                  {/* THE AVATAR IMAGE */}
                                  <img
                                    src={avatarUrl}
                                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }}
                                    className="w-full h-full rounded-full object-cover relative z-0"
                                    alt={`${conv.otherUser.first_name} avatar`}
                                  />

                                  {/* Presence Indicator Dot */}
                                  {isOnline && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-[#022c22] rounded-full shadow-[0_0_10px_#10b981] animate-pulse z-20"></div>
                                  )}
                                </div>

                {/* 5.4 Text Content Section */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-sm truncate uppercase tracking-tight transition-colors ${
                    selectedId === conv.id ? 'text-emerald-400' : 'text-white group-hover:text-emerald-400'
                  }`}>
                    {conv.otherUser.first_name} {conv.otherUser.last_name}, {conv.otherUser.age}
                  </h3>
                  <p className={`text-[11px] truncate mt-1 font-black uppercase tracking-widest transition-opacity ${
                                      conv.unreadCount > 0 ? 'text-white' : 'text-white/40'
                                    }`}>
                                      {!conv.lastMessage ? "Start Conversation" : conv.lastMessage}
                                    </p>
                </div>

                {/* 5.5 Notifications Badge Section */}
                {conv.unreadCount > 0 && (
                  <div className="flex-shrink-0 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] border-2 border-[#022c22] animate-bounce">
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}