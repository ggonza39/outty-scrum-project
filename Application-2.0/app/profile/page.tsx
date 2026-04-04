'use client';

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & DEPENDENCIES                                          */
/* -------------------------------------------------------------------------- */
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Link from 'next/link';
import { usePresence } from '@/context/PresenceContext';
import { ChevronLeft } from 'lucide-react';
import styles from './Profile.module.css';
import { useRouter } from 'next/navigation';

export default function MyProfile() {
  /* -------------------------------------------------------------------------- */
  /* SECTION 2: STATE & LOGIC                                                   */
  /* -------------------------------------------------------------------------- */
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const router = useRouter(); // Add this line right here

  const handleSmartBack = () => {
    const justFinished = sessionStorage.getItem('just_finished_onboarding');

    if (justFinished === 'true') {
      sessionStorage.removeItem('just_finished_onboarding');
      router.push('/dashboard');
    } else {
      // Standard logic if they didn't JUST finish onboarding
      if (window.history.length <= 1) {
        router.push('/dashboard');
      } else {
        router.back();
      }
    }
  };

  const { onlineUsers } = usePresence();
  const isOnline = profile?.id ? onlineUsers.includes(profile.id) : false;

  const getArrayData = (data: any) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string' && data.startsWith('[')) {
      try { return JSON.parse(data); } catch (e) { return []; }
    }
    return [];
  };

  const pictures = getArrayData(profile?.profile_pictures);

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIndex((prev) => (prev !== null && prev < pictures.length - 1 ? prev + 1 : 0));
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : pictures.length - 1));
  };

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#022c22] flex items-center justify-center">
      <div className="animate-pulse text-emerald-400 font-black tracking-tighter text-2xl uppercase">LOADING OUTTY...</div>
    </div>
  );

// Add this logic here to keep the JSX clean
const formattedGender = typeof profile?.gender === 'string'
    ? profile.gender.replace(/[\[\]"]/g, '').split(',').map((s: string) => s.trim()).join(' | ')
    : Array.isArray(profile?.gender)
      ? profile.gender.join(' | ')
      : 'NOT SET';


  return (
    <>
      <main className={styles.mainWrapper}>
        {/* ------------------------------------------------------------------ */}
        {/* SECTION 3: HIGH-VISIBILITY BACKGROUND                              */}
        {/* ------------------------------------------------------------------ */}
        <div className={styles.baseLayer} />
        <div className={styles.oceanBg} />
        <div className={styles.sunRay} />
        <div className={styles.glassTint} />

        <div className="z-10 w-full max-w-3xl">
          {/* ---------------------------------------------------------------- */}
          {/* SECTION 4: HEADER & NAVIGATION                                   */}
          {/* ---------------------------------------------------------------- */}
          <header className="flex items-center gap-6 md:gap-8 mb-10 md:mb-12">
            <button
              onClick={handleSmartBack}
              className="group p-4 md:p-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-500 shadow-xl shadow-black/20"
            >
              <ChevronLeft size={28} className="text-white group-hover:-translate-x-1 transition-transform duration-300" />
            </button>

            <div>
              <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-2xl">
                My Profile
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] drop-shadow-sm">
                  Public Identity
                </p>

              </div>
            </div>
          </header>

          {/* ---------------------------------------------------------------- */}
          {/* SECTION 5: PROFILE CONTENT CARD                                  */}
          {/* ---------------------------------------------------------------- */}
          <div className="p-8 md:p-12 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500">

           {/* 5.1 Profile Header Info */}
           <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
             {/* AVATAR SECTION */}
             <div className="relative w-32 h-32 flex items-center justify-center">
               {/* THE GLOW RING: Overlays the border. Only pulses if online. */}
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

               {/* Age Badge - Stays on top of everything */}
               <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-[#022c22] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter z-20 shadow-lg">
                 {profile?.age || '??'} YR OLD
               </div>
             </div>

             {/* IDENTITY TEXT SECTION */}
             <div className="text-center md:text-left flex-1">
               <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-2">
                 {profile?.first_name} {profile?.last_name}
               </h1>

               <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-sm">
                 @{profile?.username || 'explorer'} • {formattedGender}
               </p>

                 {/* Location Row */}
                 {profile?.city && (
                   <span className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 justify-center md:justify-start">
                     <span className="text-emerald-500 text-xs">📍</span> {profile.city}, {profile.state} {profile.zip_code}
                   </span>
                 )}

                 {/* 🟢 ONLINE STATUS: Aligned under location, strictly glowing text */}
                 {isOnline && (
                   <div className="flex items-center gap-1.5 justify-center md:justify-start mt-1 animate-pulse">

                     <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                       Online Now
                     </span>
                   </div>
                 )}
               </div>
             </div>

            {/* 5.2 Bio & Matching Details */}
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
                      <span className="text-white font-bold text-[11px] uppercase">
                        {Array.isArray(profile?.gender_preference)
                            ? profile.gender_preference.join(' | ') // Adds the pipe with spaces
                            : typeof profile?.gender_preference === 'string'
                              ? profile.gender_preference.replace(/[\[\]"]/g, '').split(',').join(' | ') // Handles string-based lists too
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

            {/* 5.3 Photo Gallery Section */}
            {pictures.length > 0 && (
              <section className="mt-12 pt-10 border-t border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-emerald-400 text-[12px] font-black uppercase tracking-widest">Adventure Gallery</h3>
                  <span className="text-white/50 text-[12px] font-bold uppercase tracking-tighter">{pictures.length} Photos Total</span>
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
                        alt={`Adventure photo ${i + 1}`}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-110"
                      />
                      {i === 0 && (
                        <div className="absolute top-3 left-3 z-20 bg-emerald-500 text-[#022c22] px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-md">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

           <div className="mt-12 flex justify-center">
             {/* Add ?mode=edit to the URL */}
             <Link
               href="/onboarding?mode=edit"
               className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#022c22] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
             >
               Update Profile
             </Link>
           </div>
          </div>
        </div>
      </main>

      {/* -------------------------------------------------------------------- */}
      {/* SECTION 6: SCREEN EXPANSION MODAL                                    */}
      {/* -------------------------------------------------------------------- */}
      {expandedIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-0 transition-all duration-700 animate-in fade-in"
          onClick={() => setExpandedIndex(null)}
        >
          <div className="absolute inset-0 bg-[#010c12]/98 backdrop-blur-[150px]" />

          <div className="relative z-[10005] w-full h-full max-w-[95vw] flex flex-col items-center justify-center p-2 md:p-6">

            {/* Nav Group */}
            <div className="relative flex-1 w-full flex items-center justify-center min-h-0 group/viewer">
              <button
                onClick={(e) => { e.stopPropagation(); showPrev(e); }}
                className="absolute left-4 md:left-6 z-[10020] pointer-events-auto w-14 h-14 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white/60 hover:bg-emerald-500 hover:text-black hover:border-emerald-400 transition-all active:scale-90 shadow-2xl backdrop-blur-xl opacity-100 md:opacity-0 md:group-hover/viewer:opacity-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            {/* Bottom Hub */}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 group-hover:text-black group-hover:rotate-90 transition-transform duration-300"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}