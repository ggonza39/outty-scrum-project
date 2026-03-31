'use client'

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & DEPENDENCIES                                          */
/* -------------------------------------------------------------------------- */
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/app/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ConditionalFooter() {
  /* -------------------------------------------------------------------------- */
  /* SECTION 2: STATE & HOOKS (BACKEND LOGIC)                                   */
  /* -------------------------------------------------------------------------- */
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Route Logic
  const isHomePage = pathname === '/';
  // Settings usually has a short content height, so we want the footer
  // to feel like part of the "tent" scene.
  const isSettingsPage = pathname === '/settings';
  const isOnboardingPage = pathname === '/onboarding';

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: LIFECYCLE EFFECTS (AUTH LISTENER)                               */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* SECTION 4: RENDER LOGIC (FRONTEND)                                         */
  /* -------------------------------------------------------------------------- */

  // 4.1: HOME PAGE VERSION (Floating Text Section)
  if (isHomePage) {
    return (
      <div className="fixed bottom-10 left-0 right-0 z-[100] text-center pointer-events-none">
        <p className="text-white/60 font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] drop-shadow-lg">
          Est. 2026 • Built for the Wild
        </p>
      </div>
    );
  }

  // 4.2: INTERNAL PAGE VERSION (Glassy Footer Section)
  return (
    <footer className={`relative z-50 w-full border-t border-white/10 py-10 md:py-12 transition-all duration-500
          ${isOnboardingPage ? 'bg-transparent border-transparent' : 'bg-black/20 backdrop-blur-md'}
          ${isSettingsPage ? 'mt-0' : 'mt-auto'}`}>

          {!isOnboardingPage && (
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          )}

      <div className="text-center group cursor-default w-full px-4">
        {/* flex-col for mobile stacking, md:flex-row for desktop single-line */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0">

          {/* BRAND INFO SECTION */}
          <p className="flex items-center justify-center whitespace-nowrap text-white/50 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.7em] transition-all duration-500 group-hover:text-white">
            <span>Est. 2026</span>
            <span className="text-emerald-500/40 mx-3 transition-colors group-hover:text-emerald-400">•</span>
            <span>Built for the Wild</span>
          </p>

          {/* DESKTOP SEPARATOR: Only shows when on desktop to separate "Wild" from "About" */}
          <span className="hidden md:inline text-emerald-500/40 mx-3 transition-colors group-hover:text-emerald-400">•</span>

          {/* DESKTOP SEPARATOR & ABOUT LINK: Only rendered if NOT on onboarding */}
                    {!isOnboardingPage && (
                      <>
                        <span className="hidden md:inline text-emerald-500/40 mx-3 transition-colors group-hover:text-emerald-400">
                          •
                        </span>

                        <div
                          onClick={() => router.push('/about')}
                          className="cursor-pointer flex items-center gap-2 text-white/50 hover:text-emerald-400 transition-colors duration-300 mt-1 md:mt-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                          </svg>
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.7em] transition-all duration-500 group-hover:tracking-[0.5em] md:group-hover:tracking-[0.8em]">
                            About
                          </span>
                        </div>
                      </>
                    )}

        </div>
      </div>
    </footer>
  );
}