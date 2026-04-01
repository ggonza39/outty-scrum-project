'use client';

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & DEPENDENCIES                                          */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Login.module.css';

export default function LoginPage() {
  /* -------------------------------------------------------------------------- */
  /* SECTION 2: STATE & LOGIC                                                   */
  /* -------------------------------------------------------------------------- */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams(); // Make sure this is imported from 'next/navigation'


  // Effect to clear success message after 5 seconds and prompt login
  useEffect(() => {
    if (message && !isError && message.includes('Success')) {
      const timer = setTimeout(() => {
        setMessage('Ready to go? Please Sign In with your new credentials.');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, isError]);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pass)) return "Add at least one uppercase letter.";
    if (!/[0-9]/.test(pass)) return "Add at least one number.";
    if (!/[!@#$%^&*]/.test(pass)) return "Add one special character (!@#$%^&*).";
    return null;
  };

  const handleSignUp = async () => {
    setMessage('');
    setIsError(false);

    if (!email || !password) {
      setMessage("Please fill in both email and password.");
      setIsError(true);
      return;
    }

    const validationError = validatePassword(password);
    if (validationError) {
      setMessage(validationError);
      setIsError(true);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
      }
    });

    if (error) {
      setMessage(error.message);
      setIsError(true);
    } else if (data?.user?.identities?.length === 0) {
      setMessage("This email is already linked to an account. Try signing in!");
      setIsError(true);
    } else {
      // SUCCESS: Clear fields for security and show message
      setMessage('Success! Please check your email for the link.');
      setIsError(false);
      setEmail('');
      setPassword('');
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setMessage('');
    setIsError(false);

    if (!email || !password) {
      setMessage("Enter your email and password to sign in.");
      setIsError(true);
      return;
    }

    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      setMessage(authError.message);
      setIsError(true);
      setLoading(false);
      return;
    }

    if (authData?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .single();

      if (profile) router.push('/dashboard');
      else router.push('/onboarding');
    }
    setLoading(false);
  };

  return (
    /* Added pt-24 (96px) to push the container below the navigation bar */
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#022c22] pt-24 pb-12">
      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3: BACKGROUND ASSETS                                       */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80')" }}
      ></div>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 4: LOGIN CONTAINER                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className={`${styles.glassCard} z-10 w-full max-w-md p-10 mx-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500`}>
        <h2 className={`${styles.glassTitle} text-4xl font-black text-white mb-2 text-center tracking-tighter uppercase italic`}>Join the Adventure</h2>
        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] text-center mb-8">Outty Identity Portal</p>

        <div className="space-y-5 text-left">
          {/* Email Field */}
          <div>
            <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative mt-1">
              <span className="absolute left-4 top-4.5 opacity-40 text-sm">✉️</span>
              <input
                type="email"
                placeholder="explorer@outty.com"
                value={email}
                className={`${styles.inputField} w-full p-4 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Password</label>
            <div className="relative mt-1">
              <span className="absolute left-4 top-4.5 opacity-40 text-sm">🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                className="w-full p-4 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SECTION 5: FEEDBACK MESSAGES                                       */}
        {/* ------------------------------------------------------------------ */}
        {message && (
          <div className={`mt-6 p-4 rounded-xl border animate-in fade-in zoom-in duration-500 ${
            isError ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
          }`}>
            <p className="text-center text-[11px] font-black uppercase tracking-tight">{message}</p>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* SECTION 6: ACTION BUTTONS                                          */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`${styles.primaryBtn} w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:opacity-50 text-[#022c22] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95`}>

            {loading ? 'Verifying...' : 'Sign In'}
          </button>

          <div className="flex items-center my-2 text-white/10">
            <div className="flex-grow h-px bg-white/10"></div>
            <span className="px-4 text-[9px] font-black uppercase tracking-[0.5em]">or</span>
            <div className="flex-grow h-px bg-white/10"></div>
          </div>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className={`${styles.secondaryBtn} w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all active:scale-95`}>
            Create New Account
          </button>
        </div>
      </div>
    </main>
  );
}