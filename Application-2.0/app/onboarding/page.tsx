'use client';

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS                                                         */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';
import styles from './onboarding.module.css';

// Global variable for the large zip library
let zipData: any = null;

export default function OnboardingPage() {
  /* -------------------------------------------------------------------------- */
  /* SECTION 2: STATE MANAGEMENT                                                */
  /* -------------------------------------------------------------------------- */
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // --- STEP 1 STATES: THE BASICS ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [bio, setBio] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Validation States
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: AUTH & INITIALIZATION                                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.push('/login');
        } else {
          setUserEmail(user.email ?? "User");
        }
      } catch (err) {
        console.error("Auth check crashed:", err);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, [router]);

  // Load the ZIP library into memory once
  useEffect(() => {
    async function loadZipLibrary() {
      try {
        const module = await import('us-zips');
        zipData = module.default;
      } catch (e) {
        console.error('Zip data failed to load', e);
      }
    }
    loadZipLibrary();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* SECTION 4: ACTIONS & HANDLERS                                              */
  /* -------------------------------------------------------------------------- */

  const checkUsername = async (val: string) => {
    if (!val) return;
    setCheckingUsername(true);
    setUsernameError('');
    setUsernameSuccess(false);

    try {
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', val)
        .maybeSingle();

      if (data) {
        setUsernameError('Taken');
        setUsernameSuccess(false);
      } else {
        setUsernameError('');
        setUsernameSuccess(true);
      }
    } catch (err) {
      setUsernameSuccess(true);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const coords = zipData?.[zipCode];

      const profileData = {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        username: username,
        age: parseInt(age) || 0,
        bio: bio,
        zip_code: zipCode,
        city: city,
        state: state,
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(profileData);

      if (error) {
        alert(`Save failed: ${error.message}`);
      } else {
        alert("Basics Saved!");
      }
    } catch (err) {
      console.error("Handler error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (zipCode.length === 5) {
      const fetchLocation = async () => {
        try {
          const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
          if (response.ok) {
            const data = await response.json();
            setCity(data.places[0]['place name']);
            setState(data.places[0]['state abbreviation']);
          }
        } catch (error) {
          console.error("Location lookup failed", error);
        }
      };
      fetchLocation();
    }
  }, [zipCode]);

  /* -------------------------------------------------------------------------- */
  /* SECTION 5: RENDER LOGIC                                                    */
  /* -------------------------------------------------------------------------- */
  if (loading && !userEmail) {
    return (
      <div className="h-screen bg-[#022c22] flex items-center justify-center text-emerald-500 text-2xl font-black italic">
        SYNCING...
      </div>
    );
  }

  return (
      <main className={styles.mainContainer}>
        <div className={styles.glassCard}>
          <h1 className={styles.title}>The Essentials</h1>
          <p className="text-emerald-500/60 text-[10px] font-bold text-center uppercase tracking-[0.2em] mb-8">
            Logged in as: {userEmail}
          </p>

          <div className="space-y-4">
            {/* Names */}
            <div className={`grid grid-cols-2 gap-4 ${styles.grid2}`}>
              <input
                placeholder="First Name *"
                className={styles.inputBase}
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
              <input
                placeholder="Last Name *"
                className={styles.inputBase}
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>

            {/* Username & Age */}
            <div className="grid grid-cols-3 gap-4">
              <input
                placeholder="Age *"
                className={styles.inputBase}
                onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))}
                value={age}
              />
              <div className="col-span-2 relative">
                <input
                  placeholder="Username *"
                  className={`${styles.inputBase} ${
                    usernameError ? 'border-red-500' : usernameSuccess ? 'border-emerald-500' : ''
                  }`}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameSuccess(false);
                  }}
                  onBlur={(e) => checkUsername(e.target.value)}
                  value={username}
                />
                {checkingUsername && (
                  <span className="absolute right-4 top-5 text-[10px] text-emerald-400 font-bold animate-pulse">
                    VERIFYING...
                  </span>
                )}
              </div>
            </div>

            {/* ZIP & Auto-City/State */}
            <div className="grid grid-cols-12 gap-4">
              <input
                maxLength={5}
                placeholder="ZIP *"
                className={`${styles.inputBase} col-span-4`}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                value={zipCode}
              />
              <input
                placeholder="City"
                disabled
                className={`${styles.inputBase} ${styles.inputDisabled} col-span-5`}
                value={city}
              />
              <input
                placeholder="ST"
                disabled
                className={`${styles.inputBase} ${styles.inputDisabled} col-span-3 text-center`}
                value={state}
              />
            </div>

            <textarea
              placeholder="Adventure Bio *"
              className={`${styles.inputBase} min-h-[100px]`}
              onChange={(e) => setBio(e.target.value)}
              value={bio}
            />

            <button
              onClick={handleSaveProfile}
              disabled={loading || !usernameSuccess || !zipCode || !city}
              className={styles.submitButton}
            >
              {loading ? 'Processing...' : 'Save & Continue'}
            </button>
          </div>
        </div>
      </main>
    );
  }