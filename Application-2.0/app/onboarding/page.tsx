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

  // --- NAVIGATION STATE ---
    const [step, setStep] = useState(1);
    const totalSteps = 6; // Matching the reference

    // --- STEP 1: THE BASICS ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Female');
    const [bio, setBio] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [skillLevels, setSkillLevels] = useState<string[]>([]);

    // --- STEP 2 & 3: ADVENTURES & PREFS ---
    const [selectedAdventures, setSelectedAdventures] = useState<string[]>([]);
    const [genderPrefs, setGenderPrefs] = useState<string[]>([]);
    const [mileRange, setMileRange] = useState(25);
    const [skillPref, setSkillPref] = useState<string[]>([]);

    // --- STEP 4 & 5: MEDIA & SOCIALS ---
    const [photos, setPhotos] = useState<string[]>([]);
    const [instagram, setInstagram] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [facebook, setFacebook] = useState('');
    const [linkedin, setLinkedin] = useState('');

    // Validation Checkers
    const isStep1Valid = firstName && lastName && usernameSuccess && age && zipCode.length === 5 && bio && skillLevels.length > 0;

  // Step 2: Adventure Selection
    const [selectedAdventures, setSelectedAdventures] = useState<string[]>([]);

    const adventureOptions = [
      'Hiking', 'Camping', 'Rock Climbing', 'Kayaking',
      'Mountain Biking', 'Surfing', 'Skiing', 'Road Trips',
      'Photography', 'Stargazing', 'Backpacking', 'Fishing'
    ];

    const toggleAdventure = (adv: string) => {
      setSelectedAdventures(prev =>
        prev.includes(adv) ? prev.filter(a => a !== adv) : [...prev, adv]
      );
    };

    // Add these simple checks to your existing state list
    const isStep1Valid =
      firstName.length > 0 &&
      lastName.length > 0 &&
      usernameSuccess &&
      zipCode.length === 5 &&
      city.length > 0 &&
      bio.length > 0;

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

  /* --- SECTION 4 UPDATES --- */
  const checkUsername = async (val: string) => {
    if (!val) return;
    setCheckingUsername(true);
    setUsernameError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('profiles')
        .select('username, id')
        .eq('username', val)
        .maybeSingle();

      // Success if NO ONE has the name, OR if the ID matches you
      if (!data || data.id === user?.id) {
        setUsernameSuccess(true);
        setUsernameError('');
      } else {
        setUsernameSuccess(false);
        setUsernameError('Taken');
      }
    } catch (err) {
      console.error(err);
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

        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          username,
          age: parseInt(age),
          zip_code: zipCode,
          city,
          state,
          latitude: coords?.latitude || null,
          longitude: coords?.longitude || null,
          gender,
          gender_preference: genderPrefs,
          adventure_type: selectedAdventures,
          bio,
          skill_level: skillLevels,
          skill_preference: skillPref,
          mile_range: mileRange,
          profile_pictures: photos,
          instagram,
          tiktok,
          facebook,
          linkedin,
          updated_at: new Date().toISOString(),
        });

        if (error) throw error;
        router.push('/profile');
      } catch (err: any) {
        alert(`Save failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const isStepValid = () => {
      switch (step) {
        case 1: return isStep1Valid;
        case 2: return selectedAdventures.length >= 3;
        case 3: return genderPrefs.length > 0 && skillPref.length > 0;
        case 4: return photos.length >= 1;
        default: return true;
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
          {/* PROGRESS INDICATOR */}
          <div className={styles.progressBarContainer}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`${styles.progressSegment} ${i + 1 <= step ? styles.progressSegmentActive : ''}`} />
            ))}
          </div>

          {/* STEP 1: ESSENTIALS */}
          {step === 1 && (
            <div className="space-y-4 text-left">
              <h1 className={styles.title}>The Essentials</h1>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="First Name *" className={styles.inputBase} onChange={(e) => setFirstName(e.target.value)} value={firstName} />
                <input placeholder="Last Name *" className={styles.inputBase} onChange={(e) => setLastName(e.target.value)} value={lastName} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Male', 'Female', 'Other'].map(g => (
                  <button key={g} onClick={() => setGender(g)} className={`py-3 rounded-xl border text-xs font-bold transition-all ${gender === g ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40 border-white/10'}`}>{g}</button>
                ))}
              </div>
              <div className="grid grid-cols-12 gap-4">
                <input maxLength={5} placeholder="ZIP *" className={`${styles.inputBase} col-span-4`} onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))} value={zipCode} />
                <input placeholder="City" disabled className={`${styles.inputBase} ${styles.inputDisabled} col-span-8`} value={city} />
              </div>
              <textarea placeholder="Adventure Bio *" className={`${styles.inputBase} min-h-[100px]`} onChange={(e) => setBio(e.target.value)} value={bio} />
              <div className="grid grid-cols-4 gap-2">
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(s => (
                  <button key={s} onClick={() => toggleSelection(skillLevels, setSkillLevels, s)} className={`py-2 rounded-xl border text-[10px] font-bold transition-all ${skillLevels.includes(s) ? 'bg-emerald-500 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: ADVENTURES (Already implemented in your code) */}
          {/* ... Include your existing Adventure mapping here ... */}

          {/* STEP 3: MATCHING PREFS */}
          {step === 3 && (
            <div className="space-y-6 text-left">
              <h1 className={styles.title}>Matching Preferences</h1>
              <div>
                <label className="text-white/40 text-[10px] font-black uppercase mb-2 block">Search Distance: {mileRange} miles</label>
                <input type="range" min="5" max="100" step="5" value={mileRange} onChange={(e) => setMileRange(parseInt(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(s => (
                  <button key={s} onClick={() => toggleSelection(skillPref, setSkillPref, s)} className={`py-3 rounded-xl border text-xs font-bold transition-all ${skillPref.includes(s) ? 'bg-emerald-500 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: PREVIEW (Final Step) */}
          {step === 6 && (
             <div className="text-left space-y-6">
               <h1 className={styles.title}>Review Profile</h1>
               <div className="bg-black/20 p-6 rounded-2xl border border-white/10">
                 <h3 className="text-xl font-black text-white italic">{firstName} {lastName}</h3>
                 <p className="text-emerald-400 font-bold text-xs uppercase">@{username} • {city}, {state}</p>
                 <p className="text-white/70 text-sm mt-4 italic">"{bio}"</p>
               </div>
             </div>
          )}

          {/* DYNAMIC NAVIGATION BUTTONS */}
          <div className="flex gap-4 w-full mt-8">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className={`${styles.submitButton} !bg-white/5 !mt-0`}>Back</button>
            )}
            <button
              onClick={() => { if (step < totalSteps) setStep(step + 1); else handleSaveProfile(); }}
              disabled={loading || !isStepValid()}
              className={`${styles.submitButton} !mt-0`}
            >
              {loading ? 'Processing...' : step < totalSteps ? 'Continue' : 'Finalize Profile'}
            </button>
          </div>
        </div>
      </main>
    );