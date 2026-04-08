"use client";

/* -------------------------------------------------------------------------- */
/* SECTION 0: IMPORTS & DEPENDENCIES                                          */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, MessageSquare } from "lucide-react";
import Inbox from "@/components/messaging/Inbox";
import ChatWindow from "@/components/messaging/ChatWindow";
import styles from "./Messages.module.css";

/* -------------------------------------------------------------------------- */
/* SECTION 1: INBOX & CHAT WRAPPER (MessagingContent)                         */
/* -------------------------------------------------------------------------- */
// 1. Accept props from the parent
function MessagingContent({
  selectedConversationId,
  setSelectedConversationId,
}: {
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
}) {
  const searchParams = useSearchParams();

  // 1.1 Deep-Linking Logic (Reads ?conv= from URL)
  useEffect(() => {
    const convId = searchParams.get("conv"); // This matches the key above
    if (convId) {
      setSelectedConversationId(convId);

      // Clean up the URL so that if the user refreshes or shares the link,
      // it doesn't "lock" them into that one conversation forever.
      const newUrl = window.location.pathname;
      window.history.replaceState({ ...window.history.state }, "", newUrl);
    }
  }, [searchParams]);

  return (
    /* 1.2 Master Split-Pane Container */
    <div className="z-10 flex w-full max-w-7xl mx-auto border border-emerald-500/20 overflow-hidden bg-[#022c22]/75 backdrop-blur-lg mb-10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] text-lg md:text-xl h-[750px]">

      {/* 1.3 Left Rail: Inbox List */}
      <div
        className={`flex flex-col border-r border-white/5 text-base md:text-lg flex-none transition-all
        w-full md:w-[450px] lg:w-[550px]
        ${selectedConversationId ? "hidden md:flex" : "flex"}
        overflow-y-auto overflow-x-hidden`}
      >
        <Inbox
          selectedId={selectedConversationId}
          onSelectConversation={(id) => setSelectedConversationId(id)}
        />
      </div>

      {/* 1.4 Right Rail: Active Chat Window */}
      <div
        className={`flex-1 flex flex-col bg-white/[0.04] text-lg md:text-xl font-medium min-h-0
              ${!selectedConversationId ? "hidden md:flex" : "flex"}`}
      >
        {selectedConversationId ? (
          <>
            {/* 1.4.a Mobile Back Button */}
            <div className="md:hidden flex items-center p-4 bg-black/40 border-b border-white/10 backdrop-blur-md">
              <button
                onClick={() => setSelectedConversationId(null)}
                className="group flex items-center gap-2 text-emerald-400 font-black uppercase text-[10px] tracking-[0.2em]
                        px-4 py-2 rounded-full border border-emerald-500/0
                        hover:border-emerald-500/30 hover:bg-emerald-500/10
                        transition-all duration-300
                        hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                <ChevronLeft
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] transition-all">
                  Back to Inbox
                </span>
              </button>
            </div>

            {/* 1.4.b The Active Chat */}
            <ChatWindow
              key={selectedConversationId}
              conversationId={selectedConversationId}
            />
          </>
        ) : (

          /* 1.4.c Empty State (No Chat Selected) */
          <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500/15 flex items-center justify-center mb-10 border border-emerald-400/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <MessageSquare size={48} className="text-emerald-400" />
            </div>
            <h2 className="text-white font-black uppercase tracking-[0.4em] text-2xl mb-4">
              Outty Inbox
            </h2>
            <p className="text-white/80 text-base max-w-[360px] leading-relaxed font-bold">
              Select an adventurer from the list to start planning your next
              trip.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION 2: MAIN PAGE COMPONENT (Next.js Root)                              */
/* -------------------------------------------------------------------------- */
export default function MessagesPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  // 2.1 Hydration Mount Check
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className={styles.mainWrapper}>
      {/* 2.2 Visual Environment: Particles & Fog */}
      <div className={styles.fixedBg} />
      <div className={styles.gradientOverlay} />

      <div className={styles.particleLayer}>
        {mounted &&
          [...Array(60)].map((_, i) => (
            <div
              key={i}
              className={styles.windParticle}
              style={{
                width: Math.random() * 100 + 50 + "px",
                height: "1px",
                left: "-20%",
                top: Math.random() * 100 + "%",
                animationDuration: Math.random() * 2 + 1.5 + "s",
                animationDelay: Math.random() * 5 + "s",
                opacity: Math.random() * 0.5,
              }}
            />
          ))}
      </div>

      {/* 2.3 Header Section */}
      <div
        className={`z-20 w-full max-w-7xl mx-auto px-8 pt-32 md:pt-40 pb-12 flex-none ${selectedConversationId ? "hidden md:block" : "block"}`}
      >
        <header className="flex items-center gap-8">
          <button
            onClick={() => router.back()}
            className="group p-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-500 shadow-xl shadow-black/20"
          >
            <ChevronLeft
              size={28}
              className="text-white group-hover:-translate-x-1 transition-transform duration-300"
            />
          </button>

          <div>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-2xl">
              Messages
            </h1>
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Secure Transmission
            </p>
          </div>
        </header>
      </div>

      {/* 2.4 Action Layer (Pulls in the Sub-Component) */}
      <div
        className={`z-20 w-full max-w-7xl mx-auto flex flex-col transition-all duration-500 ${selectedConversationId ? "pt-20 md:pt-0" : ""}`}
      >
        <Suspense
          fallback={
            <div className="z-10 flex-1 flex items-center justify-center text-emerald-900 font-bold uppercase tracking-widest min-h-[400px]">
              Linking...
            </div>
          }
        >
          <MessagingContent
            selectedConversationId={selectedConversationId}
            setSelectedConversationId={setSelectedConversationId}
          />
        </Suspense>
      </div>
    </main>
  );
}
