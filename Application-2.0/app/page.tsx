'use client'

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & DEPENDENCIES                                          */
/* -------------------------------------------------------------------------- */
import { useEffect, useState, Suspense } from 'react';
import { supabase } from './supabaseClient';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './Home.module.css';

/* -------------------------------------------------------------------------- */
/* SECTION 2: SUB-COMPONENTS (Frontend UI)                                    */
/* 2.1 LogoutToast: Logic and UI for post-logout system feedback              */
/* -------------------------------------------------------------------------- */
function LogoutToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (searchParams.get('logout') === 'success') {
      setIsVisible(true);
      const exitTimer = setTimeout(() => setIsExiting(true), 3000);
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
        router.replace('/');
      }, 4000);
      return () => { clearTimeout(exitTimer); clearTimeout(removeTimer); };
    }
  }, [searchParams, router]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ease-in-out
        ${isExiting ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0 animate-in fade-in slide-in-from-top-4'}`}>
      <div className="bg-[#064e3b]/90 backdrop-blur-2xl border border-emerald-500/30 px-6 py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_15px_rgba(16,185,129,0.2)] flex items-center gap-3">
        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#022c22" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <p className="text-emerald-50 font-black uppercase tracking-[0.2em] text-[10px]">
          Adventure Paused • <span className="text-emerald-400">Logged Out</span>
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION 3: MAIN PAGE COMPONENT (HomePage)                                  */
/* -------------------------------------------------------------------------- */
export default function HomePage() {

  /* --- 3.1 STATE & BACKEND LOGIC (Backend Connection) --- */
  /* Handles real-time Supabase auth verification and loading states        */
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    checkUser();
  }, []);

  /* --- 3.2 PAGE RENDER (Frontend UI) --- */
  return (
    <main className={styles.mainContainer}>

      {/* 3.2.1 SYSTEM OVERLAYS (Conditional UI) */}
      <Suspense fallback={null}>
        <LogoutToast />
      </Suspense>

      {/* 3.2.2 ENVIRONMENT LAYER (Visuals) */}
      <div className={styles.heroBackground}></div>

      {/* 3.2.3 HERO CONTENT CONTAINER */}
      <div className="z-10 text-center px-4 max-w-4xl">

        {/* Branding Slot: Main Logo Text */}
        <h1 className={styles.heroTitle}>OUTTY</h1>

        {/* Text Field Section: Primary Marketing Copy */}
        <p className="text-xl md:text-2xl text-emerald-100 font-light mb-12 tracking-wide max-w-2xl mx-auto">
          Adventure is better with a partner. <br />
          <span className="font-semibold text-emerald-400 italic drop-shadow-md">
            Find your match, find your trail.
          </span>
        </p>

        {/* 3.2.4 ACTION SLOT CONTAINER (Navigation & Buttons) */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">

          {/* Primary Button Section: Auth-Driven (Login/Dashboard) */}
          <div className="w-full md:w-auto flex justify-center">
            {!loading ? (
              <Link
                href={user ? "/dashboard" : "/login"}
                className={`${styles.primaryBtn} w-60 text-center block`}
              >
                {user ? "My Dashboard" : "Start Exploring"}
              </Link>
            ) : (
              /* Button Section: Loading State Indicator */
              <div className={`${styles.loadingBtn} w-60 text-center flex justify-center items-center gap-2`}>
                <div className="w-3 h-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                Checking Protocol...
              </div>
            )}
          </div>

          {/* Secondary Button Section: Information (About Page) */}
          <div className="w-full md:w-auto flex justify-center">
            <Link
              href="/about"
              className={`${styles.secondaryBtn} w-60 text-center block`}
            >
              How it Works
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}