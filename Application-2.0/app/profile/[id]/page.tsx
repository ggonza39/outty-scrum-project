'use client';

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & CONFIGURATION                                         */
/* -------------------------------------------------------------------------- */
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import Link from 'next/link';
import { usePresence } from '@/context/PresenceContext';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import styles from '../Profile.module.css';

export default function PublicProfile() {
  /* -------------------------------------------------------------------------- */
  /* SECTION 2: STATE MANAGEMENT & ROUTING                                      */
  /* -------------------------------------------------------------------------- */
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { onlineUsers } = usePresence();
  const router = useRouter();

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: BACKEND LOGIC & UTILITIES (SUPABASE)                            */
  /* -------------------------------------------------------------------------- */
  const isOnline = id ? onlineUsers.includes(id as string) : false;

  // Helper to parse JSON arrays from database strings
  const getArrayData = (data: any) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string' && data.startsWith('[')) {
      try { return JSON.parse(data); } catch (e) { return []; }
    }
    return [];
  };

  const pictures = getArrayData(profile?.profile_pictures);


  // 1. Update the Handle Conversation logic
    const handleStartConversation = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !profile) return;

        // Ensure P1 is the smaller UUID for consistency
        const [p1, p2] = [user.id, profile.id].sort();

        const { data, error } = await supabase
          .from('conversations')
          .upsert(
            {
              participant_1: p1,
              participant_2: p2,
              last_message_time: new Date().toISOString()
            },
            { onConflict: 'participant_1, participant_2' }
          )
          .select('id')
          .single();

        if (error) {
          console.error("Error starting conversation:", error.message);
          return;
        }

        // Inside handleStartConversation in PublicProfile
        if (data?.id) {
          // Use 'conv' to match what MessagingContent is expecting
          router.push(`/messages?conv=${data.id}`);
        }
      } catch (err) {
        console.error("Critical Profile Chat Error:", err);
      }
    };
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ... inside the component ...
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    async function getPublicProfile() {
      if (!id) return;

      // Fetch target profile
      const { data: targetProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && targetProfile) {
        setProfile(targetProfile);

        // Fetch logged-in user's location to calculate distance
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: currentUser } = await supabase
            .from('profiles')
            .select('latitude, longitude')
            .eq('id', user.id)
            .single();

          if (currentUser?.latitude && targetProfile.latitude) {
            const dist = calculateDistance(
              currentUser.latitude,
              currentUser.longitude,
              targetProfile.latitude,
              targetProfile.longitude
            );
            setDistance(dist);
          }
        }
      }
      setLoading(false);
    }
    getPublicProfile();
  }, [id]);

  /* -------------------------------------------------------------------------- */
  /* SECTION 4: INTERFACE HANDLERS (GALLERY/UI)                                 */
  /* -------------------------------------------------------------------------- */
  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIndex((prev) => (prev !== null && prev < pictures.length - 1 ? prev + 1 : 0));
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : pictures.length - 1));
  };

  // Add this to handle the gender preference formatting safely
    const formattedGenderPreference = Array.isArray(profile?.gender_preference)
      ? profile.gender_preference.join(' | ')
      : typeof profile?.gender_preference === 'string'
        ? profile.gender_preference.replace(/[\[\]"]/g, '').split(',').map((s: string) => s.trim()).join(' | ')
        : 'Not Set';

  /* -------------------------------------------------------------------------- */
  /* SECTION 5: CONDITIONAL RENDERING (LOADING/ERROR)                           */
  /* -------------------------------------------------------------------------- */
  if (loading) return (
    <div className="min-h-screen bg-[#022c22] flex items-center justify-center">
      <div className="animate-pulse text-emerald-400 font-black tracking-tighter text-2xl uppercase">
        Tracking Explorer...
      </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-[#022c22] flex flex-col items-center justify-center text-white font-black">
      <p className="mb-4 tracking-tighter text-2xl uppercase">Explorer Lost</p>
      <Link
        href="/dashboard"
        className="text-emerald-400 border border-emerald-400/30 px-6 py-2 rounded-full text-xs uppercase hover:bg-emerald-500 hover:text-[#022c22] transition-all"
      >
        Back to Trails
      </Link>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* SECTION 6: MAIN FRONTEND UI (JSX)                                          */
  /* -------------------------------------------------------------------------- */
  return (
    <main className="relative min-h-full w-full flex flex-col items-center p-4 md:p-12 pb-24 overflow-x-hidden text-left">

      {/* 6.1 WEATHER BACKGROUND: CASTLE & ATMOSPHERE */}
      <div
        className="absolute inset-0 z-0 opacity-45 bg-cover bg-center fixed pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=2070&auto=format&fit=crop')",
          filter: 'brightness(1.1) contrast(1.2) saturate(0.9)'
        }}
      />

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-[#022c22]/5 to-[#022c22]/95 pointer-events-none fixed" />

      {/* 6.2 WEATHER BACKGROUND: SYNCHRONIZED LIGHTNING BOLTS & FLASHES */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-20">
        <div className={`${styles.skyFlash} ${styles.event1}`} />
        <div className={`${styles.skyFlash} ${styles.event2}`} />
        <div className={`${styles.skyFlash} ${styles.event3}`} />
        <div className={`${styles.skyFlash} ${styles.event4}`} />
      </div>

      <div className={styles.lightningContainer}>
        <div className={`${styles.bolt} ${styles.bolt1} ${styles.event1}`} />
        <div className={`${styles.bolt} ${styles.bolt2} ${styles.event2}`} />
        <div className={`${styles.bolt} ${styles.bolt3} ${styles.event3}`} />
        <div className={`${styles.bolt} ${styles.bolt4} ${styles.event4}`} />
      </div>

      {/* 6.3 MAIN CONTENT CONTAINER */}
      <div className="z-10 w-full max-w-3xl">

        {/* 6.3.1 HEADER & NAVIGATION */}
        <header className="flex items-center gap-6 md:gap-8 mt-16 md:mt-24 mb-10 md:mb-12">
          <button
            onClick={() => router.back()}
            className="group p-4 md:p-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-500 shadow-xl shadow-black/20"
          >
            <ChevronLeft size={28} className="text-white group-hover:-translate-x-1 transition-transform duration-300" />
          </button>

          <div>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-2xl">
              Explorer Profile
            </h1>
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 drop-shadow-sm">
              Viewing Discovery
            </p>
          </div>
        </header>

       {/* 6.3.2 MAIN PROFILE CARD */}
       <div className="p-8 md:p-12 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500">

         {/* IDENTITY SECTION */}
         <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
           {/* AVATAR SECTION */}
           <div className="relative w-32 h-32 flex items-center justify-center">
             {/* THE GLOW RING: Overlays the border. Pulses if online. */}
             <div className={`absolute inset-0 rounded-full border-4 transition-all duration-700 z-10 pointer-events-none ${
               isOnline
                 ? 'border-emerald-500 animate-pulse shadow-[0_0_25px_rgba(16,185,129,0.8)] opacity-100 scale-105'
                 : 'border-emerald-500/50 opacity-100 scale-100'
             }`} />

             {/* THE AVATAR IMAGE: Tucked behind the ring (z-0) */}
             {profile?.profile_pictures?.[0] ? (
               <img
                 src={profile.profile_pictures[0]}
                 alt="Profile"
                 className="w-full h-full rounded-full object-cover relative z-0"
               />
             ) : (
               <div className="w-full h-full bg-emerald-500/20 rounded-full flex items-center justify-center text-5xl relative z-0">
                 🎒
               </div>
             )}

             {/* Age Badge - Top Layer */}
             <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-[#022c22] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter z-20 shadow-lg">
               {profile?.age || '??'} YR OLD
             </div>
           </div>

           <div className="text-center md:text-left flex-1">
             {/* Line 0: Full Name */}
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-2">
               {profile?.first_name} {profile?.last_name}
             </h1>

             <div className="flex flex-col gap-1.5">
               {/* Line 1: Username & Gender */}
               <div className="flex items-center justify-center md:justify-start gap-3">
                 <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-sm">
                   @{profile?.username || 'explorer'} • {
                     typeof profile?.gender === 'string'
                       ? profile.gender.replace(/[\[\]"]/g, '').split(',').map((s: string) => s.trim()).join(' | ')
                       : 'NOT SET'
                   }
                 </p>
               </div>

               {/* Line 2: Location (City, State, Zip) */}
               {profile?.city && (
                 <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-1">
                   <span className="text-emerald-500 text-xs">📍</span>
                   {profile.city}, {profile.state} {profile.zip_code}
                 </div>
               )}

               {/* Line 3: Distance - REMOVED pl-5 to match Profile alignment */}
                       {distance !== null && (
                         <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center md:justify-start">
                           {distance < 1 ? 'Nearby' : `${Math.round(distance)} Miles Away`}
                         </div>
                       )}

                       {/* 🟢 ONLINE NOW: REMOVED pl-5 and added justify logic to match Profile alignment */}
                       {isOnline && (
                         <div className="flex items-center justify-center md:justify-start mt-1 animate-pulse">
                           <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                             Online Now
                           </span>
                         </div>
               )}
             </div>
           </div>
         </div>

                  {/* BIO & MATCHING PREFERENCES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <section>
                        <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-3">The Adventure Bio</h3>
                        <p className="text-white/80 text-lg leading-relaxed italic font-medium">
                          "{profile?.bio || "No bio added yet."}"
                        </p>
                      </section>

                      <section>
                        <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-3">Adventure Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {getArrayData(profile?.adventure_type).map((a: string) => (
                            <span key={a} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold rounded-full">
                              {a}
                            </span>
                          ))}
                        </div>
                      </section>

                      {/* SKILL LEVEL MOVED HERE FOR ALIGNMENT */}
                      <section>
                        <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-3">Skill Levels</h3>
                        <div className="flex flex-wrap gap-2">
                          {getArrayData(profile?.skill_level).map((s: string) => (
                            <span key={s} className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/70 text-[9px] font-black rounded-lg uppercase tracking-wider">
                                                        {s}
                                                      </span>
                          ))}
                        </div>
                      </section>
                    </div>

                    <div className="space-y-8 p-6 rounded-2xl bg-black/20 border border-white/5">
                      <section>
                        <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">Matching Preferences</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-white/60 text-xs uppercase font-bold text-[10px]">Home Base</span>
                            <span className="text-white font-black text-[11px] uppercase tracking-tighter">
                              {profile?.city ? `${profile.city}, ${profile.state}` : 'Not Set'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-white/60 text-xs uppercase font-bold text-[10px]">Search Range</span>
                            <span className="text-emerald-400 font-black">{profile?.mile_range || 25} MILES</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-white/60 text-xs uppercase font-bold text-[10px]">Partner Gender</span>
                            <span className="text-white font-bold text-[11px] uppercase tracking-wider">
                              {Array.isArray(profile?.gender_preference)
                                ? profile.gender_preference.join(' | ')
                                      : typeof profile?.gender_preference === 'string'
                                        ? profile.gender_preference.replace(/[\[\]"]/g, '').split(',').map((s: string) => s.trim()).join(' | ')
                                        : 'Not Set'}
                            </span>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">Connected Socials</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: 'Instagram', val: profile?.instagram },
                            { label: 'TikTok', val: profile?.tiktok },
                            { label: 'LinkedIn', val: profile?.linkedin },
                            { label: 'Facebook', val: profile?.facebook },
                          ].map((social) => (
                            <div key={social.label}>
                              <p className="text-white/30 text-[10px] font-bold uppercase">{social.label}</p>
                              <p className="text-white text-xs font-bold truncate">{social.val || '—'}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
          {/* GALLERY SECTION */}
          {pictures.length > 0 && (
            <section className="mt-12 pt-10 border-t border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-emerald-400 text-[12px] font-black uppercase tracking-widest">Adventure Gallery</h3>
                <span className="text-white/50 text-[12px] font-bold uppercase tracking-tighter">
                  {pictures.length} Photos Total
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {pictures.map((url: string, i: number) => (
                  <div
                    key={i}
                    onClick={() => setExpandedIndex(i)}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-black/20 cursor-zoom-in shadow-xl transition-all duration-500 hover:z-50 hover:scale-110 hover:shadow-emerald-500/20 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-[#022c22]/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img
                      src={url}
                      alt={`Adventure ${i}`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* INTERACTION SECTION */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleStartConversation}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-[#022c22] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              Message {profile?.first_name}
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------- */
      /* SECTION 7: SCREEN EXPANSION MODAL (OVERLAY)                                */
      /* -------------------------------------------------------------------------- */}
      {expandedIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-0 transition-all duration-700 animate-in fade-in"
          onClick={() => setExpandedIndex(null)}
        >
          <div className="absolute inset-0 bg-[#010c12]/98 backdrop-blur-[150px]" />
          <div className="relative z-[10005] w-full h-full max-w-[95vw] flex flex-col items-center justify-center p-2 md:p-6">
            <div className="relative flex-1 w-full flex items-center justify-center min-h-0 group/viewer">
              <button
                onClick={(e) => { e.stopPropagation(); showPrev(e); }}
                className="absolute left-4 md:left-6 z-[10020] pointer-events-auto w-14 h-14 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white/60 hover:bg-emerald-500 hover:text-black hover:border-emerald-400 transition-all active:scale-90 shadow-2xl backdrop-blur-xl opacity-100 md:opacity-0 md:group-hover/viewer:opacity-100"
              >
                <ChevronLeft size={28} />
              </button>

              <img
                key={expandedIndex}
                src={pictures[expandedIndex]}
                alt="Expanded adventure"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.95)] ring-1 ring-white/10 animate-in zoom-in-95 duration-500"
              />

              <button
                onClick={(e) => { e.stopPropagation(); showNext(e); }}
                className="absolute right-4 md:right-6 z-[10020] pointer-events-auto w-14 h-14 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white/60 hover:bg-emerald-500 hover:text-black hover:border-emerald-400 transition-all active:scale-90 shadow-2xl backdrop-blur-xl opacity-100 md:opacity-0 md:group-hover/viewer:opacity-100"
              >
                <ChevronLeft size={28} className="rotate-180" />
              </button>
            </div>

            <div
              className="mt-4 md:mt-6 flex items-center gap-6 bg-black/80 border border-white/10 px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-3xl shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-start">
                <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em] leading-none mb-1">
                  Media Viewer
                </p>
                <p className="text-white/40 font-bold text-[11px] uppercase tracking-tighter">
                  Viewing {expandedIndex + 1} of {pictures.length}
                </p>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <button
                onClick={() => setExpandedIndex(null)}
                className="group flex items-center gap-3 bg-emerald-500/10 hover:bg-emerald-500 px-6 py-2.5 rounded-xl border border-emerald-500/20 transition-all duration-300"
              >
                <span className="text-emerald-400 group-hover:text-black text-[11px] font-black uppercase tracking-widest">
                  Close View
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}