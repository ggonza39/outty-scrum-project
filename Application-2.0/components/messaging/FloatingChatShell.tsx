'use client'

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & DEPENDENCIES                                          */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useChat } from '@/context/ChatContext'
import { usePathname } from 'next/navigation'
import { supabase } from '@/app/supabaseClient'
import ChatWindow from './ChatWindow'
import ConversationList from './ConversationList'
import { usePresence } from '@/context/PresenceContext'


/* -------------------------------------------------------------------------- */
/* SECTION 2: COMPONENT DEFINITION & LOGIC                                    */
/* -------------------------------------------------------------------------- */
export default function FloatingChatShell() {
  const router = useRouter()
  const { onlineUsers } = usePresence()
  const { activeFloatingId, isFloatingOpen, closeFloatingChat, openFloatingChat, unreadCount } = useChat()
  const [view, setView] = useState<'list' | 'chat'>(activeFloatingId ? 'chat' : 'list')
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  // 2.1 Listen for Auth State
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])


  // 2.1.5 Sync Chat Context with Auth
  useEffect(() => {
    if (user) {
      // This tells your ChatContext to start listening for messages
      // for the NEWly logged-in user.
      // Replace 'refreshUnreads' with the actual function name in your useChat() if different.
      // If your useChat doesn't have a manual trigger, we simply ensure the context is aware.
      console.log("Syncing chat for user:", user.id);
    }
  }, [user]);


    // 2.3 Sync View with Active ID
      // When a specific conversation is targeted (from Dashboard or elsewhere),
      // flip the view to 'chat' automatically.
      useEffect(() => {
        if (activeFloatingId) {
          setView('chat');
        }
      }, [activeFloatingId]);

  // 2.2 Route & Auth Guard
  // Logic: Hide if not logged in OR if on restricted pages
  const restrictedPages = ['/messages', '/login', '/onboarding']
  if (!user || restrictedPages.includes(pathname)) return null


 /* -------------------------------------------------------------------------- */
 /* SECTION 3: RENDER                                                          */
 /* -------------------------------------------------------------------------- */
 return (
   <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">

     {/* 3.1 CHAT WINDOW CONTAINER */}
     <div className={`chat-container w-[360px] h-[520px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right mb-2 ${
       isFloatingOpen
         ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
         : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
     }`}>

       {/* 3.2 VIBRANT HEADER */}
       <div className="p-6 relative overflow-hidden flex justify-between items-center border-b border-white/10 bg-emerald-500 shadow-[inset_0_1px_20px_rgba(255,255,255,0.2)]">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

         <div className="flex items-center gap-3 relative z-10">
            {view === 'chat' && (
              <button onClick={() => setView('list')} className="p-2 -ml-2 text-[#022c22] hover:bg-black/10 rounded-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
            )}
            <span className="text-[11px] font-black text-[#022c22] uppercase tracking-[0.4em] drop-shadow-sm">
              {view === 'list' ? 'Explorers' : 'Encrypted Chat'}
            </span>
         </div>

         <button onClick={closeFloatingChat} className="relative z-10 p-2 text-[#022c22]/60 hover:text-[#022c22] transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
             <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
           </svg>
         </button>
       </div>

       {/* 3.3 GLASSY CONTENT AREA */}
       <div className="flex-1 overflow-y-auto relative bg-white/[0.03] custom-scrollbar">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />

          {view === 'list' ? (
            <ConversationList
              onSelect={(id) => {
                openFloatingChat(id);
                setView('chat');
              }}
            />
          ) : (
            /* Use a cleaner check here to avoid Turbopack confusion */
            activeFloatingId && isFloatingOpen ? (
              <ChatWindow key={activeFloatingId} conversationId={activeFloatingId} />
            ) : null
          )}
       </div>

     {/* 3.4 FLOATING ACTION BUTTON (FAB) */}
     <button
       onClick={() => {
         if (isFloatingOpen) closeFloatingChat();
         else openFloatingChat(activeFloatingId || '');
       }}
       className={`group relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500 shadow-2xl hover:scale-110 active:scale-95 pointer-events-auto ${
         isFloatingOpen
         ? 'bg-white text-emerald-900 rotate-90'
         : 'bg-emerald-500 text-emerald-950 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]'
       }`}
     >
       {!isFloatingOpen && unreadCount > 0 && (
         <span className="absolute -top-1 -right-1 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-black text-white shadow-[0_0_15px_rgba(220,38,38,0.6)] border-2 border-[#022c22] animate-bounce">
           {unreadCount}
         </span>
       )}

       {isFloatingOpen ? (
         <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
           <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
         </svg>
       ) : (
         <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform">
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping opacity-75"></span>
         </div>
       )}
     </button>
   </div>
 )
}