'use client'

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & DEPENDENCIES                                          */
/* -------------------------------------------------------------------------- */
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/app/supabaseClient'
import { usePresence } from '@/context/PresenceContext'
import { useRouter } from 'next/navigation'

/* -------------------------------------------------------------------------- */
/* SECTION 2: COMPONENT DEFINITION & STATE                                    */
/* -------------------------------------------------------------------------- */
export default function ChatWindow({ conversationId }: { conversationId: string }) {
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [otherUser, setOtherUser] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Presence/Online Status Logic
  const { onlineUsers } = usePresence()
  const isOnline = otherUser ? onlineUsers.includes(otherUser.id) : false

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: REAL-TIME SUBSCRIPTIONS & DATA FETCHING                         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!conversationId) return;

    // Real-time listener for new messages and read status updates
    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((currentMessages) => {
              const isDuplicate = currentMessages.some(m => m.id === payload.new.id);
              if (isDuplicate) return currentMessages;
              return [...currentMessages, payload.new];
            });
          } else if (payload.eventType === 'UPDATE') {
            setMessages((currentMessages) =>
              currentMessages.map((m) => (m.id === payload.new.id ? payload.new : m))
            );
          }
        }
      )
      .subscribe();

    // Fetch User Profiles and Message History
    async function fetchChatDetails() {
      setIsLoading(true); // Start loading
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, messagesRes] = await Promise.all([
        supabase.from('conversations').select(`
          participant_1:profiles!participant_1(id, first_name, last_name, profile_pictures),
          participant_2:profiles!participant_2(id, first_name, last_name, profile_pictures)
        `).eq('id', conversationId).single(),
        supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true })
      ]);

      if (profileRes.data) {
        const conv = profileRes.data;
        setOtherUser(conv.participant_1.id === user.id ? conv.participant_2 : conv.participant_1);
      }
      if (messagesRes.data) setMessages(messagesRes.data);

      setIsLoading(false);
          }

          fetchChatDetails();

     return () => {
           supabase.removeChannel(channel);
         };
       }, [conversationId]);// This closes the first useEffect
  /* -------------------------------------------------------------------------- */
  /* SECTION 4: SIDE EFFECTS (Scrolling & Read Receipts)                        */
  /* -------------------------------------------------------------------------- */

  // 4.1 Auto-scroll to bottom (Targeted to Container)
  useEffect(() => {
    if (scrollRef.current) {
      // block: 'nearest' prevents the whole page from jumping
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  }, [messages]);

  // Mark incoming messages as read when window is active
  useEffect(() => {
    const markAsRead = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user || !conversationId) return;

          await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', conversationId)
            .eq('receiver_id', user.id) // Ensure only MY incoming messages are marked
            .eq('is_read', false);
        };

    markAsRead();
  }, [conversationId, messages]);

  /* -------------------------------------------------------------------------- */
  /* SECTION 5: MESSAGE ACTIONS                                                 */
  /* -------------------------------------------------------------------------- */
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !otherUser) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return;

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      receiver_id: otherUser.id,
      content: newMessage,
      is_read: false
    })

    if (!error) setNewMessage('')
    else console.error("Send error:", error)
  }

  /* -------------------------------------------------------------------------- */
  /* SECTION 6: RENDER                                                          */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="flex flex-col h-full min-h-0 bg-black/40">

     {/* 6.1 Header: Partner Profile & Presence Status */}
           <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-[#022c22]/80 backdrop-blur-md">

             {/* CLICKABLE AVATAR AREA */}
             <div
               className="relative w-10 h-10 cursor-pointer group/avatar"
               onClick={() => otherUser?.id && router.push(`/profile/${otherUser.id}`)}
             >
               {/* THE GLOW RING: Matches the FAB and List style */}
               <div className={`absolute inset-0 rounded-full border border-emerald-500 transition-all duration-700 ${
                 isOnline && !isLoading
                   ? 'animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)] opacity-100 scale-105'
                   : 'opacity-40 scale-100'
               }`} />

               <img
                 src={otherUser?.profile_pictures?.[0] || 'https://via.placeholder.com/150'}
                 className={`w-full h-full rounded-full object-cover relative z-0 transition-all duration-300 group-hover/avatar:scale-110 ${
                   isLoading ? 'opacity-50' : 'opacity-100'
                 }`}
                 alt="Avatar"
               />

               {isOnline && !isLoading && (
                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#022c22] rounded-full animate-pulse shadow-[0_0_8px_#10b981] z-10"></span>
               )}
             </div>

             {/* CLICKABLE NAME AREA */}
             <div
               className="cursor-pointer group/name"
               onClick={() => otherUser?.id && router.push(`/profile/${otherUser.id}`)}
             >
               <h2 className="text-white font-black uppercase tracking-widest text-xs group-hover/name:text-emerald-400 transition-colors">
                 {otherUser?.first_name} {otherUser?.last_name}
               </h2>
               <p className={`${isOnline ? 'text-emerald-500' : 'text-white/50'} text-[13px] font-bold uppercase tracking-tighter transition-colors`}>
                 {isOnline ? 'Online' : 'Offline'}
               </p>
             </div>
           </div>
      {/* 6.2 Message Feed Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar min-h-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-2">
             <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
             <span className="text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.3em]">Decrypting...</span>
          </div>
        ) : (
        messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === otherUser?.id ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium backdrop-blur-xl border transition-all ${
              msg.sender_id === otherUser?.id
              ? 'bg-white/5 border-white/10 text-white rounded-tl-none shadow-2xl'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-50 rounded-tr-none shadow-[0_0_20px_rgba(16,185,129,0.1)]'
            }`}>
              <p className="leading-relaxed drop-shadow-md">{msg.content}</p>
              <div className={`text-[13px] mt-1.5 font-black uppercase tracking-tighter transition-all flex items-center gap-1 ${
                msg.sender_id === otherUser?.id ? 'text-white/30' : 'text-emerald-300/50'
              }`}>
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

                {/* Sender Read Receipts */}
                {msg.sender_id !== otherUser?.id && (
                  <span className={`text-[13px] font-bold ${msg.is_read ? 'text-emerald-400 opacity-100' : 'opacity-40'}`}>
                    {msg.is_read ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* 6.3 Input Controls */}
      <form onSubmit={sendMessage} className="p-4 bg-white/5 border-t border-white/10 flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type an adventure plan..."
          className="flex-1 bg-black/40 border border-white/10 rounded-full px-6 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
        />
        <button type="submit" className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-400 transition-all active:scale-90 shadow-lg shadow-emerald-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#022c22" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </form>

      {/* 6.4 Local Scoped Styles (Preserving Scrollbars) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.6);
        }
      `}</style>

     </div>
   )
 }