"use client";

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & CONFIGURATION                                         */
/* -------------------------------------------------------------------------- */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/app/supabaseClient";

/* -------------------------------------------------------------------------- */
/* SECTION 2: CONTEXT & HOOK DEFINITIONS                                      */
/* -------------------------------------------------------------------------- */
const PresenceContext = createContext<{ onlineUsers: string[] }>({
  onlineUsers: [],
});

export const PresenceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  /* -------------------------------------------------------------------------- */
  /* SECTION 3: STATE MANAGEMENT (BACKEND LOGIC)                                */
  /* -------------------------------------------------------------------------- */
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  /* -------------------------------------------------------------------------- */
  /* SECTION 4: PRESENCE & AUTH LIFECYCLE (BACKEND LOGIC)                       */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    let channel: any;

    // 4.1: PRESENCE SETUP LOGIC
    const startPresence = async (userId: string) => {
      // Clean up any existing channel before starting a new one
      if (channel) supabase.removeChannel(channel);

      channel = supabase.channel("global-presence", {
        config: { presence: { key: userId } },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState();
          setOnlineUsers(Object.keys(state));
        })
        .subscribe(async (status: string) => {
          if (status === "SUBSCRIBED") {
            await channel.track({ online_at: new Date().toISOString() });

            // Database Sync
            await supabase
              .from("profiles")
              .update({ is_online: true, last_seen: new Date().toISOString() })
              .eq("id", userId);
          }
        });
    };

    // 4.2: AUTH STATE LISTENER (Login/Logout Events)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        (event === "SIGNED_IN" || event === "INITIAL_SESSION") &&
        session?.user
      ) {
        startPresence(session.user.id);
      }

      if (event === "SIGNED_OUT") {
        if (channel) supabase.removeChannel(channel);
        setOnlineUsers([]);
      }
    });

    // 4.3: CLEANUP SECTION
    return () => {
      subscription.unsubscribe();
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /* SECTION 5: RENDER LOGIC (FRONTEND PROVIDER)                                */
  /* -------------------------------------------------------------------------- */
  return (
    <PresenceContext.Provider value={{ onlineUsers }}>
      {children}
    </PresenceContext.Provider>
  );
};

// 5.1: EXPORTED HOOK
export const usePresence = () => useContext(PresenceContext);
