'use client'

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & INTERFACES                                            */
/* -------------------------------------------------------------------------- */
import { useEffect, useState } from 'react'
import { supabase } from '@/app/supabaseClient'
import { usePresence } from '@/context/PresenceContext'
import { useRouter } from 'next/navigation'


/* -------------------------------------------------------------------------- */
/* SECTION 2: COMPONENT DEFINITION & STATE                                    */
/* -------------------------------------------------------------------------- */
export default function ConversationList({ onSelect }: { onSelect: (id: string) => void }) {
  const [conversations, setConversations] = useState<any[]>([])
  const { onlineUsers } = usePresence()
  const router = useRouter()

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: DATA FETCHING & LOGIC                                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    // 3.1 Fetch Conversations and Associated Messages
    async function fetchConvos() {

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('conversations')
        .select(`
          id,
          participant_1,
          participant_2,
          profiles_p1:participant_1 (first_name, last_name, profile_pictures),
          profiles_p2:participant_2 (first_name, last_name, profile_pictures),
          messages(id, is_read, receiver_id)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)


      if (data) {
              const formatted = data.map(c => {
                // Identify the other user's ID and Profile
                const isP1Me = c.participant_1 === user.id;
                const otherUserId = isP1Me ? c.participant_2 : c.participant_1; //
                const otherUser = isP1Me ? c.profiles_p2 : c.profiles_p1;

                const unreadCount = c.messages?.filter((m: any) =>
                  !m.is_read && m.receiver_id === user.id
                ).length || 0;

                return {
                  id: c.id,
                  userId: otherUserId, //
                  ...otherUser,
                  unread: unreadCount
                };
              });

        // 3.4 Sort by Unread Priority
        const sorted = formatted.sort((a, b) => b.unread - a.unread);
        setConversations(sorted);
      }

    }
    fetchConvos()

    // 3.3 Set up real-time listener (Now outside the function, inside the effect)
    const channel = supabase
          .channel('list-updates')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          }, () => {
            fetchConvos();
          })
          .subscribe();

        // 3.4 Cleanup
        return () => {
          supabase.removeChannel(channel);
        };
      }, []) // <--- End of useEffect



  /* -------------------------------------------------------------------------- */
  /* SECTION 4: RENDER MAIN UI                                                  */
  /* -------------------------------------------------------------------------- */
  return (
     <div className="flex flex-col h-full overflow-y-auto pr-1 bg-black/20 custom-scrollbar rounded-b-[2.5rem]">
      {conversations.map((convo) => (
        <button
          key={convo.id}
          onClick={() => onSelect(convo.id)}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left mb-1 group relative"
        >
        {/* 4.1 Avatar & Unread Badge */}
                <div
                  className="relative flex-shrink-0 cursor-pointer hover:scale-110 transition-transform active:scale-95 w-12 h-12 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profile/${convo.userId}`);
                  }}
                >
                  {/* THE GLOW RING: Set to z-10 so it sits ON TOP of the image edge */}
                  <div className={`absolute inset-0 rounded-full border-2 border-emerald-500 z-10 pointer-events-none transition-all duration-700 ${
                    onlineUsers.includes(convo.userId)
                      ? 'animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)] opacity-100 scale-105'
                      : 'opacity-40 scale-100'
                  }`} />

                  {/* THE AVATAR IMAGE: Set to 100% so it fills the space behind the ring */}
                  <img
                    src={convo.profile_pictures?.[0] || 'https://via.placeholder.com/150'}
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }}
                    className="w-full h-full rounded-full object-cover relative z-0"
                    alt={`${convo.first_name} avatar`}
                  />



                  {/* Unread Badge */}
                  {convo.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 border-2 border-[#022c22] rounded-full animate-pulse shadow-lg z-20"></span>
                  )}
                </div>
          {/* 4.2 Text Content & Status */}
          <div className="flex-1 overflow-hidden">
            <p className="text-white font-bold text-sm truncate">
              {convo.first_name} {convo.last_name}
            </p>
            <p className={`text-[10px] uppercase font-black tracking-wider transition-colors ${
              convo.unread > 0 ? 'text-emerald-400' : 'text-emerald-400/50'
            }`}>
              {convo.unread > 0
                  ? `${convo.unread} New Message${convo.unread > 1 ? 's' : ''}`
                  : 'View Conversation'}
            </p>
          </div>

          {/* 4.3 UI Indicators */}
          <div className="flex flex-col items-end gap-1">
            <svg
              className={`transition-all ${convo.unread > 0 ? 'text-emerald-400 opacity-100' : 'opacity-0 group-hover:opacity-100 text-emerald-500'}`}
              xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </button>
      ))}
    </div>
  )
}