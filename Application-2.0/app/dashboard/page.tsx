"use client";

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & CONFIGURATION                                         */
/* -------------------------------------------------------------------------- */
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// API & Context
import { supabase } from "../supabaseClient";
import { usePresence } from "@/context/PresenceContext";
import { useChat } from "@/context/ChatContext";

// Components & Data
import DashboardFilters from "@/components/DashboardFilters";
import zipData from "us-zips";

// Styles & Icons
import styles from "./Dashboard.module.css";
import {
  Settings,
  ChevronLeft,
  Home,
  MessagesSquare,
  User,
  LogOut,
  Shield,
  Eye,
  Trash2,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  X,
} from "lucide-react";

// 1. Define the interface so TypeScript knows what customCoords is
interface FilterState {
  adventureType: string[];
  skillLevel: string[];
  city: string;
  zipCode: string;
  radius: string;
  gender: string[];
  minAge: string;
  maxAge: string;
  states: string[];
  customCoords: { lat: number; lng: number } | null;
}

export default function Dashboard() {
  /* -------------------------------------------------------------------------- */
  /* SECTION 2: STATE MANAGEMENT                                                */
  /* -------------------------------------------------------------------------- */

  // UI State
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  /* -------------------------------------------------------------------------- */
  /* FIX: PREVENT BACKGROUND SCROLL WHEN FILTER IS OPEN                         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (isFilterOpen) {
      // Lock the scroll
      document.body.style.overflow = "hidden";
    } else {
      // Unlock the scroll
      document.body.style.overflow = "unset";
    }

    // Cleanup function to ensure scroll is restored if component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterOpen]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Data State
  const [profiles, setProfiles] = useState<any[]>([]);
  const { onlineUsers } = usePresence();
  const [unreadCount, setUnreadCount] = useState(0);
  const { openFloatingChat } = useChat();

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    adventureType: [],
    skillLevel: [],
    city: "",
    zipCode: "",
    radius: "50",
    gender: [],
    minAge: "18",
    maxAge: "",
    states: [],
    customCoords: null,
  });

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: SESSION STORAGE PERSISTENCE (FIXED)                             */
  /* -------------------------------------------------------------------------- */

  // 3.1 Load filters from storage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("outty_filters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Directly update the state with saved data
        setFilters(parsed);
      } catch (e) {
        console.error("Failed to parse saved filters", e);
      }
    }
  }, []); // Only runs ONCE on mount

  // 3.2 Sync filters to storage ONLY on change, and avoid overwriting with defaults
  useEffect(() => {
    // Safety Check: Don't save if it's the absolute default state on a fresh boot
    // This prevents the "Save" effect from wiping the "Load" effect's data
    if (
      filters.radius !== "50" ||
      filters.adventureType.length > 0 ||
      filters.zipCode !== ""
    ) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("outty_filters", JSON.stringify(filters));
      }
    }
  }, [filters]);

  /* -------------------------------------------------------------------------- */
  /* SECTION 4: UTILITY FUNCTIONS                                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Robust Array Parser for Postgres {item,item} or JSON ["item"] format
   */
  const getArrayData = useCallback((data: any) => {
    if (Array.isArray(data)) return data;
    if (!data) return [];
    if (typeof data === "string") {
      if (data.startsWith("{")) {
        return data
          .replace(/[{}]/g, "")
          .split(",")
          .map((s) => s.trim().replace(/^"|"$/g, ""))
          .filter((s) => s !== "");
      }
      if (data.startsWith("[")) {
        try {
          return JSON.parse(data);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  }, []);

  /* -------------------------------------------------------------------------- */
  /* SECTION 5: DATA FETCHING & FILTERING LOGIC                                 */
  /* -------------------------------------------------------------------------- */

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      // 1. Determine the Search Center (Lat/Long)
      let targetLat = 34.0522; // Default fallback
      let targetLong = -118.2437;

      // Priority 1: Custom Coords (GPS) from the filter
      if (filters.customCoords?.lat && filters.customCoords?.lng) {
        targetLat = filters.customCoords.lat;
        targetLong = filters.customCoords.lng;
      }
      // Priority 2: Zip Code Lookup
      else if (filters.zipCode && filters.zipCode.length === 5) {
        const coords = (zipData as any)[filters.zipCode];
        if (coords) {
          targetLat = coords.latitude;
          targetLong = coords.longitude;
        }
      }
      // Priority 3: Current User's Home Location
      else {
        const { data: currentUser } = await supabase
          .from("profiles")
          .select("latitude, longitude")
          .eq("id", session.user.id)
          .single();

        if (currentUser?.latitude && currentUser?.longitude) {
          targetLat = currentUser.latitude;
          targetLong = currentUser.longitude;
        }
      }

      // 2. Call the RPC (Ensure this matches the SQL function name exactly)
      // Note: Make sure your RPC is named 'get_profiles_within_radius' or 'search_profiles_within_radius'
      const { data, error } = await supabase.rpc("get_profiles_within_radius", {
        target_lat: targetLat,
        target_long: targetLong,
        radius_miles: parseFloat(filters.radius),
      });

      if (error) throw error;

      // 3. Apply manual filters to the results returned by the radius search
      const filteredResults = (data || []).filter((profile: any) => {
        // Don't show yourself
        if (profile.id === session.user.id) return false;

        // Parse arrays safely
        const profileAdventures = getArrayData(profile.adventure_type);
        const profileSkills = getArrayData(profile.skill_level);

        // Adventure Type Filter (Multiple Select)
        const matchesAdventure =
          filters.adventureType.length === 0 ||
          profileAdventures.some((a: string) =>
            filters.adventureType.includes(a),
          );

        // Skill Level Filter (Multiple Select)
        const matchesSkill =
          filters.skillLevel.length === 0 ||
          profileSkills.some((s: string) => filters.skillLevel.includes(s));

        // Gender Filter (Multiple Select - with case-insensitive check)
        const matchesGender =
          filters.gender.length === 0 ||
          (profile.gender &&
            filters.gender.some(
              (g: string) => g.toLowerCase() === profile.gender.toLowerCase(),
            ));

        // Age Filter
        const profileAge = profile.age || 0;
        const minAge = parseInt(filters.minAge) || 18;
        const maxAge = filters.maxAge ? parseInt(filters.maxAge) : 999;
        const matchesAge = profileAge >= minAge && profileAge <= maxAge;

        // State Filter (Multiple Select)
        const matchesState =
          filters.states.length === 0 ||
          (profile.state &&
            filters.states.some(
              (s: string) => s.toUpperCase() === profile.state.toUpperCase(),
            ));

        // City Filter (Text Match)
        const matchesCity =
          !filters.city ||
          (profile.city &&
            profile.city.toLowerCase().includes(filters.city.toLowerCase()));

        return (
          matchesAdventure &&
          matchesSkill &&
          matchesGender &&
          matchesAge &&
          matchesState &&
          matchesCity
        );
      });

      setProfiles(filteredResults);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
      // We do NOT close the filter here anymore because the
      // DashboardFilters component handles its own onClose via handleApplyFilters
    }
  }, [filters, getArrayData]);
  /* -------------------------------------------------------------------------- */
  /* SECTION 6: REAL-TIME SERVICES & AUTH                                       */
  /* -------------------------------------------------------------------------- */

  // 6.1 Initial fetch on filter change
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // 6.2 Handle Real-time Messages & Presence
  useEffect(() => {
    let isMounted = true;
    let channel: any;

    const syncUnreadCount = async (userId: string) => {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", userId)
        .eq("is_read", false);
      if (isMounted) setUnreadCount(count || 0);
    };

    async function initNotifications() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user || !isMounted) return;

      const userId = session.user.id;
      syncUnreadCount(userId);

      channel = supabase
        .channel(`notifs-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
            filter: `receiver_id=eq.${userId}`,
          },
          () => syncUnreadCount(userId),
        )
        .subscribe();
    }

    initNotifications();
    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleStartConversation = async (targetProfile: any) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !targetProfile) return;

      // 1. Sort IDs so P1 is always the smaller UUID
      // This matches your DB unique constraint (P1, P2)
      const [p1, p2] = [user.id, targetProfile.id].sort();

      // 2. Perform the Upsert using your specific column names
      const { data, error } = await supabase
        .from("conversations")
        .upsert(
          {
            participant_1: p1,
            participant_2: p2,
            last_message_time: new Date().toISOString(), // existing timestamp column
          },
          { onConflict: "participant_1, participant_2" },
        )
        .select("id")
        .single();

      if (error) {
        console.error(
          "Upsert Error Details:",
          error.message,
          error.details,
          error.hint,
        );
        return;
      }

      if (data?.id) {
        openFloatingChat(data.id);
      }
    } catch (err) {
      console.error("Critical Chat Error:", err);
    }
  };

  const [selectedInterestProfile, setSelectedInterestProfile] =
    useState<any>(null);

  /* -------------------------------------------------------------------------- */
  /* SECTION 7: RENDER                                                          */
  /* -------------------------------------------------------------------------- */
  return (
    <main
      className={`${styles.dashboardMain} min-h-screen flex flex-col ${isFilterOpen ? "hide-globals" : ""}`}
    >
      {/* 7.1 DYNAMIC GLOBAL STYLES (Filter State) */}
      {isFilterOpen && (
        <style jsx global>{`
          /* 1. Hiding the nav */
          nav,
          header.fixed,
          /* 2. Target the Chat Shell's exact wrapper */
          .fixed.bottom-8.right-8,
          /* 3. Target the Chat Window itself */
          .chat-container {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `}</style>
      )}

      {/* 7.2 MAIN CONTENT AREA */}
      <div className="flex-grow max-w-6xl mx-auto relative z-10 p-6 md:p-12 pt-48 md:pt-56 w-full">
        {/* 7.3 HEADER & TITLE */}
        <header className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-6">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="group p-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-xl shadow-black/20"
            >
              <ChevronLeft
                size={24}
                className="text-white group-hover:-translate-x-1 transition-transform"
              />
            </button>

            {/* WRAPPER FOR TEXT: This aligns the title and subtitle together */}
            <div className="flex flex-col justify-center">
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white drop-shadow-2xl leading-none">
                DASHBOARD
              </h1>

              <div className="flex items-center gap-2 px-1 mt-1">
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  Partner Discovery Hub
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 7.4 FILTER CONTROLS - Moved outside of conditional to ensure it never disappears */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-white mb-1">
              Adventurers Near You
            </h2>
            <p className="text-emerald-400/70 font-bold uppercase text-[13px]">
              Found {profiles.length} potential partners
            </p>
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="relative z-50 flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl"
          >
            <Settings size={16} strokeWidth={3} /> Refine Search
          </button>
        </div>

        {/* 7.5 PROFILES GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-s font-bold uppercase">
              Searching trails...
            </p>
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="group flex flex-col p-7 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-300 shadow-2xl h-full hover:border-emerald-500/60 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] hover:scale-[1.01] hover:bg-white/10"
              >
                {/* TOP SECTION: IDENTITY (REFINED FOR MOBILE MOCKUP) */}
                <div className="flex items-center md:items-start gap-5 md:gap-6 mb-6">
                  {/* Avatar & Online Status Stack */}
                  <div className="flex flex-col items-center gap-3 flex-shrink-0">
                    <div
                      className="relative w-24 h-24 md:w-20 md:h-20 flex items-center justify-center cursor-pointer group/avatar transition-transform hover:scale-105 active:scale-95"
                      onClick={() => router.push(`/profile/${profile.id}`)}
                    >
                      {/* THE GLOW RING: Using rounded-3xl for the 'soft square' mockup look on mobile */}
                      <div
                        className={`absolute inset-0 rounded-3xl md:rounded-full border-2 transition-all duration-700 z-10 pointer-events-none ${
                          onlineUsers.includes(profile.id)
                            ? "border-emerald-500 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.7)] opacity-100 scale-105"
                            : "border-emerald-500 opacity-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-100"
                        }`}
                      />

                      {profile.profile_pictures?.[0] ? (
                        <img
                          src={profile.profile_pictures[0]}
                          className="w-full h-full rounded-3xl md:rounded-full object-cover relative z-0"
                          alt=""
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-500/20 rounded-3xl md:rounded-full flex items-center justify-center text-3xl relative z-0">
                          🎒
                        </div>
                      )}
                    </div>

                    {/* ONLINE STATUS: Text-only with High-Definition Glow */}
                    <div className="w-24 md:w-20 h-7 flex items-center justify-center">
                      {onlineUsers.includes(profile.id) ? (
                        <div className="flex items-center gap-2 animate-pulse">
                          {/* Smaller dot to let the text lead */}
                          <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                          <span className="text-emerald-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]">
                            Online
                          </span>
                        </div>
                      ) : (
                        <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                          Offline
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Identity Text (Centered Alignment) */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 md:pt-1">
                    <p className="text-white font-black text-2xl md:text-xl leading-tight tracking-tight truncate">
                      {profile.first_name}, {profile.age}
                    </p>

                    {/* Gender Tag: Moved inside text flow for mobile mockup */}
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                      {profile.gender}
                    </p>

                    <p className="text-emerald-400 text-[11px] font-black uppercase tracking-[0.15em] truncate">
                      @{profile.username || "explorer"}
                    </p>

                    <p className="text-white/70 text-[11px] md:text-[11px] font-bold uppercase truncate mt-1">
                      {profile.city ? `${profile.city}, ` : ""}
                      {profile.state} {profile.zip_code || profile.zip || ""}
                    </p>

                    <p className="text-white/40 text-[11px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      {profile.dist_miles
                        ? `${Math.round(profile.dist_miles)} miles away`
                        : "Nearby"}
                    </p>
                  </div>
                </div>

                {/* MIDDLE SECTION: CONTENT WITH SUBTLE DIVIDERS */}
                <div className="flex flex-col flex-grow">
                  {/* Interests Section */}
                  <div className="py-5 border-t border-white/5 min-h-[85px]">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-3 px-1">
                      Adventure Interests
                    </p>
                    <div className="flex flex-wrap items-center gap-2 px-1">
                      {getArrayData(profile.adventure_type).length > 0 ? (
                        <>
                          {getArrayData(profile.adventure_type)
                            .slice(0, 3)
                            .map((a: string) => (
                              <span
                                key={a}
                                className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-lg uppercase tracking-wider"
                              >
                                {a}
                              </span>
                            ))}
                          {getArrayData(profile.adventure_type).length > 3 && (
                            <button
                              onClick={() =>
                                setSelectedInterestProfile(profile)
                              }
                              className="px-3 py-1 bg-white/5 border border-white/10 text-white/40 rounded-lg text-[10px] font-black hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
                            >
                              ...
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-white/20 text-[9px] uppercase italic">
                          No interests listed
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedInterestProfile && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                      <div className="bg-[#022c22] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in duration-200">
                        <button
                          onClick={() => setSelectedInterestProfile(null)}
                          className="absolute top-4 right-4 text-white/40 hover:text-white"
                        >
                          ✕
                        </button>
                        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
                          All Interests
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {getArrayData(
                            selectedInterestProfile.adventure_type,
                          ).map((a: string) => (
                            <span
                              key={a}
                              className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-black rounded-xl uppercase"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skill Levels Section */}
                  <div className="py-5 border-t border-white/5 min-h-[80px]">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-3 px-1">
                      Skill Levels
                    </p>
                    <div className="flex flex-wrap gap-2 px-1">
                      {getArrayData(profile.skill_level).length > 0 ? (
                        getArrayData(profile.skill_level)
                          .slice(0, 3)
                          .map((s: string) => (
                            <span
                              key={s}
                              className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/70 text-[9px] font-black rounded-lg uppercase tracking-wider"
                            >
                              {s}
                            </span>
                          ))
                      ) : (
                        <span className="text-white/20 text-[9px] uppercase italic">
                          Level not set
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* BOTTOM SECTION: ACTIONS */}
                <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  <button
                    onClick={() => handleStartConversation(profile)}
                    className="py-4 bg-emerald-500 text-[#022c22] rounded-2xl text-[11px] font-black uppercase hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Message
                  </button>
                  <Link href={`/profile/${profile.id}`} className="w-full">
                    <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[11px] font-black uppercase hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white/5 border border-white/5 rounded-3xl backdrop-blur-md">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">
              No Explorers Found
            </h3>
            <p className="text-white/40 text-xs font-bold uppercase mt-2 max-w-xs leading-relaxed px-4">
              Try expanding your radius or selecting fewer filters to find more
              partners.
            </p>
            <button
              onClick={() => {
                const defaultFilters = {
                  adventureType: [],
                  skillLevel: [],
                  city: "",
                  zipCode: "",
                  radius: "50",
                  gender: [],
                  minAge: "18",
                  maxAge: "",
                  states: [],
                  customCoords: null,
                };
                setFilters(defaultFilters);
                fetchProfiles();
              }}
              className="mt-6 px-6 py-2 border border-emerald-500 text-emerald-500 rounded-full text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-[#022c22] transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* 7.6 FILTER COMPONENT overlay */}
      <DashboardFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={fetchProfiles}
      />

      {/* 7.7 ATMOSPHERIC BACKGROUND LAYERS */}
      <div
        className={styles.landscapeOverlay}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&q=80')",
        }}
      />
      <div className={styles.gradientScrim} />

      {/* 7.8 SNOW ANIMATION LAYERS */}
      <div className={styles.snowContainer}>
        <div className={`${styles.snow} ${styles.snow1}`}></div>
        <div className={`${styles.snow} ${styles.snow2}`}></div>
        <div className={`${styles.snow} ${styles.snow3}`}></div>
      </div>
    </main>
  );
}
