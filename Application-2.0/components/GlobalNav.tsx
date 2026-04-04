'use client'

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & DEPENDENCIES                                          */
/* -------------------------------------------------------------------------- */
import { useEffect, useState } from 'react';
import { supabase } from '@/app/supabaseClient';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Home, MessagesSquare, User, Settings, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';


export default function GlobalNav() {
  /* -------------------------------------------------------------------------- */
  /* SECTION 2: STATE & HOOKS                                                   */
  /* -------------------------------------------------------------------------- */
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toast States
  const [showToast, setShowToast] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Route Flags
  const isHomePage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isOnboardingPage = pathname === '/onboarding';
  const isAboutPage = pathname === '/about';

  const [authLoading, setAuthLoading] = useState(true); // Start as true

  const [displayFarewellName, setDisplayFarewellName] = useState('Explorer');


  // Add these temporarily to your GlobalNav
  useEffect(() => {
    console.count("RENDER: GlobalNav");
  });

  useEffect(() => {
    console.log("TRIGGER: Auth Listener fired", user?.email);
  }, [user]);

  useEffect(() => {
    console.log("TRIGGER: Toast Logic fired", searchParams.get('logout'));
  }, [searchParams]);

/* SECTION 2: Add an authLoading state */
  /* -------------------------------------------------------------------------- */
  /* SECTION 3: LIFECYCLE EFFECTS (LRS & AUTH)                                  */
  /* -------------------------------------------------------------------------- */

 // 3.1a: SURGICAL WATCHER (Animation & History Scrub)
   useEffect(() => {
     const params = new URLSearchParams(window.location.search);

     if (params.get('logout') === 'success') {
       // 1. Trigger the Visuals with a tiny delay to ensure the fade-in animates
       const animationTimer = setTimeout(() => {
         setShowToast(true);
         setIsExiting(false);
       }, 75);

       // 2. THE FIX: Clear the URL effectively
       router.replace(pathname, { scroll: false });

       // 3. EXTRA SAFETY: Browser History Scrub
       window.history.replaceState({}, '', pathname);

       return () => clearTimeout(animationTimer);
     }
   }, [pathname, router]);
  // 3.1b: LIFECYCLE (Handles the exit countdown)
  // This ONLY runs when showToast becomes true.
  // It doesn't care about the URL anymore.
  useEffect(() => {
    if (showToast) {
      const exitTimer = setTimeout(() => setIsExiting(true), 3000);
      const removeTimer = setTimeout(() => {
        setShowToast(false);
        setIsExiting(false);
      }, 4000);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [showToast]);

  // 3.2 HISTORY & CACHE GUARD
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);


   /* -------------------------------------------------------------------------- */
     /* SECTION 3: LIFECYCLE EFFECTS (LRS & AUTH)                                  */
     /* -------------------------------------------------------------------------- */


     // 3.2 AUTH & BOUNCER (Stable Guard)
     useEffect(() => {
       let mounted = true;

       const initAuth = async () => {
         const { data: { session } } = await supabase.auth.getSession();
         if (!mounted) return;

         setUser(session?.user ?? null);
         setAuthLoading(false); // Auth check confirmed

         const isPublicPage = isHomePage || isLoginPage || isOnboardingPage || isAboutPage;

         // Only show modal if no session, not a public page, and NOT currently logging out
         if (!session && !isPublicPage && !isLoggingOut) {
           setShowSessionModal(true);
         }
       };

       initAuth();

       const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
         if (mounted) {
           setUser(session?.user ?? null);
           setAuthLoading(false);

           if (event === 'SIGNED_OUT') {
             setUnreadCount(0);
             const isPublicPage = isHomePage || isLoginPage || isOnboardingPage || isAboutPage;
             // SURGICAL FIX: Only show modal if the user ISN'T currently in the middle of a logout redirect
               if (!isPublicPage && !isLoggingOut) {
                 setShowSessionModal(true);
               }
           }
         }
       });

       return () => {
         mounted = false;
         subscription.unsubscribe();
       };
     }, [pathname, isHomePage, isLoginPage, isOnboardingPage, isAboutPage, isLoggingOut]);
  // 3.6 REAL-TIME UNREAD MESSAGES
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    const fetchUnreads = async () => {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      if (!error) setUnreadCount(count || 0);
    };
    fetchUnreads();
    const channel = supabase
      .channel(`global-nav-unreads-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, () => fetchUnreads())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  /* -------------------------------------------------------------------------- */
  /* SECTION 4: EVENT HANDLERS                                                  */
  /* -------------------------------------------------------------------------- */
  const shouldHideGlobalNav = isLoginPage || isOnboardingPage;

  const handleLogout = async () => {
    // 1. CAPTURE & FREEZE the name in state immediately



    setIsLoggingOut(true);

    try {
      if (user) {
        await supabase
          .from('profiles')
          .update({ is_online: false, last_seen: new Date().toISOString() })
          .eq('id', user.id);
      }

      const channels = supabase.getChannels();
      channels.forEach(ch => supabase.removeChannel(ch));

      // 2. This clears the 'user' object, but 'displayFarewellName' stays safe in state
      await supabase.auth.signOut();

      window.localStorage.clear();
      window.sessionStorage.clear();

      // 3. THE ONLY REDIRECT (Waiting 4 seconds)
      setTimeout(() => {
        window.location.href = '/login?logout=success';
      }, 2500);

      // REMOVED: The duplicate window.location.href that was here
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  /* -------------------------------------------------------------------------- */
  /* SECTION 5: RENDER LOGIC                                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      `}</style>

      {isLoggingOut ? (
              /* --- CINEMATIC EXIT VIEW (The "Bye" Page) --- */
              <main className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#022c22] overflow-hidden">
                <div
                  className="absolute inset-0 z-0 opacity-30 bg-cover bg-center transition-transform duration-[6000ms] ease-out animate-in fade-in"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80')",
                    transform: 'scale(1.1)'
                  }}
                />

                <div key="exit-greeting" className="z-20 text-center px-6 animate-in fade-in zoom-in duration-1000">
                  <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-4 drop-shadow-2xl">
                    Bye for now !
                  </h1>
                  <p className="text-emerald-400 text-xs md:text-sm font-black uppercase tracking-[0.6em] animate-pulse drop-shadow-sm">
                    Pausing your adventure...
                  </p>
                </div>
              </main>
            ) : (
      <>
      {/* 5.1 SESSION EXPIRED MODAL */}
      {!authLoading && showSessionModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" /> {/* Darkened for focus */}
          <div className="relative w-full max-w-sm bg-[#1a1a1a]/90 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center overflow-hidden animate-in fade-in zoom-in duration-500">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 blur-[80px]" />
            <h2 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tighter">
              Adventure Timed Out
            </h2>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed mb-8">
              Your session has expired. <br />
              <span className="text-red-500/80">Please re-authenticate to continue.</span>
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.replace('/login')}
                className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
              >
                Return to Portal
              </button>
            </div>
          </div>
        </div>
      )}

    {/* 5.2 LOGOUT SUCCESS TOAST */}
        {showToast && (
          <div className={`fixed z-[100] transition-all duration-[4500ms] ease-in-out left-1/2 -translate-x-1/2 top-28 md:top-10 ${isExiting ? 'opacity-0 blur-2xl scale-90 pointer-events-none' : 'opacity-100 blur-0 scale-100 animate-in fade-in zoom-in'}`}>
            <div className="bg-[#064e3b]/95 backdrop-blur-3xl border border-emerald-500/30 px-5 py-3 rounded-2xl flex items-center gap-3 text-emerald-50 font-black uppercase tracking-[0.2em] text-[9px] shadow-[0_0_40px_rgba(0,0,0,0.7)] whitespace-nowrap">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
               Adventure Paused • <span className="text-emerald-400">Logged Out</span>
            </div>
          </div>
        )}

      {/* 5.3 HALF-SCREEN MOBILE MENU (Refined Stickiness) */}
      {user && isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
            {/* Darkened Backdrop for remaining screen */}
            <div className="absolute inset-0 bg-black/20" onClick={toggleMobileMenu} />

            <div className="absolute right-0 top-0 bottom-0 w-[65%] flex flex-col bg-[#022c22]/40 backdrop-blur-[45px] border-l border-white/10 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
                {/* Sticky Close Button (Isolated from Navigation height) */}
                <div className="sticky top-0 right-0 p-8 flex justify-end z-10">
                    <button
                        onClick={toggleMobileMenu}
                        className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-90 transition-all duration-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Items (Scrolls beneath the button) */}
                <nav className="flex-1 px-6 pb-24 flex flex-col items-center gap-10">
                    {[
                    { href: '/', label: 'Home', icon: Home },
                    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { href: '/messages', label: 'Messages', icon: MessagesSquare, count: unreadCount },
                    { href: '/profile', label: 'My Profile', icon: User },
                    { href: '/settings', label: 'Settings', icon: Settings },
                    ].map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex flex-col items-center gap-2 text-white/70 hover:text-emerald-400 transition-all duration-300"
                    >
                        <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300">
                        <item.icon size={26} />
                        {item.count !== undefined && item.count > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#022c22] font-black shadow-lg">
                            {item.count}
                            </span>
                        )}
                        </div>
                        <span className="font-black uppercase tracking-[0.4em] text-[9px] italic">{item.label}</span>
                    </Link>
                    ))}

                    <button
                    onClick={handleLogout}
                    className="group flex flex-col items-center gap-2 text-white/40 hover:text-red-500 transition-all duration-300 mt-4"
                    >
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:bg-red-500/10 group-hover:border-red-500/50 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300">
                        <LogOut size={26} />
                    </div>
                    <span className="font-black uppercase tracking-[0.4em] text-[9px] italic">Logout</span>
                    </button>
                </nav>
            </div>
        </div>
      )}

      {/* 5.4 GLOBAL HEADER & NAVIGATION */}
      {!showSessionModal && (
       <header className="fixed top-0 left-0 right-0 z-50 px-6 py-8 md:px-12 pointer-events-none">
          <div className="w-full flex justify-between items-center pointer-events-auto">

            <Link
              href="/"
              className={`text-3xl md:text-4xl font-black italic tracking-tighter text-white hover:text-emerald-400 transition-all duration-500 drop-shadow-lg ${
                isHomePage ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
              }`}
            >
              OUTTY
            </Link>

            {/* DESKTOP NAV BAR */}
            {user && !shouldHideGlobalNav && (
              <nav className="hidden md:flex items-center gap-10 bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full shadow-2xl">
                <Link href="/" className="text-white/70 hover:text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 transition-all">
                  <Home size={14} /> Home
                </Link>
                <Link href="/dashboard" className="text-white/70 hover:text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 transition-all">
                   <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link href="/messages" className="relative text-white/70 hover:text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 transition-all">
                  <MessagesSquare size={14} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-3 -right-4 bg-red-600 text-white text-[9px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-[#022c22] px-1">
                      {unreadCount}
                    </span>
                  )}
                  Messages
                </Link>
                <Link href="/profile" className="text-white/70 hover:text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 transition-all">
                  <User size={14} /> My Profile
                </Link>
                <Link href="/settings" className="group text-white/70 hover:text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 transition-all">
                  <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" />
                  Settings
                </Link>

                {isLoggingOut ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                    <span>Logging Out...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white/40 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                )}
              </nav>
            )}

            {/* MOBILE HAMBURGER BUTTON */}
            {user && !shouldHideGlobalNav && (
              <button
                onClick={toggleMobileMenu}
                className="md:hidden w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:text-emerald-400 hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] shadow-lg active:scale-90 transition-all duration-300"
              >
                <Menu size={20} />
              </button>
            )}
          </div>
        </header>
        )}
       </>
      )}
    </>
  );
}