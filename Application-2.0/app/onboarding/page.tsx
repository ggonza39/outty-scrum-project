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
  const totalSteps = 3; // 1: Essentials, 2: Adventures, 3: Photos/Socials

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

  // --- STEP 2: ADVENTURE SELECTION ---
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

  const isStep1Valid =
    firstName.length > 0 &&
    lastName.length > 0 &&
    usernameSuccess &&
    zipCode.length === 5 &&
    city.length > 0 &&
    bio.length > 0;

  // --- STEP 3: FINAL TOUCHES ---
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');

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

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('profiles')
        .select('username, id')
        .eq('username', val)
        .maybeSingle();

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

  const handlePhotoUpload = async () => {
    if (!profilePhoto) return;

    setUploadingPhoto(true);
    try {
      const fileExt = profilePhoto.name.split('.').pop();
      const fileName = `${username}_${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, profilePhoto);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('profiles').update({ photo_url: urlData.publicUrl }).eq('id', user?.id);

      alert('Profile photo uploaded!');
    } catch (err) {
      console.error(err);
      alert('Photo upload failed');
    } finally {
      setUploadingPhoto(false);
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
        adventures: selectedAdventures,
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null,
        instagram: instagram || null,
        twitter: twitter || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(profileData);

      if (error) {
        alert(`Save failed: ${error.message}`);
      } else {
        alert("Profile Completed!");
        router.push('/dashboard'); // Redirect after onboarding
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

        {/* PROGRESS INDICATOR */}
        <div className={styles.progressBarContainer}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`${styles.progressSegment} ${s <= step ? styles.progressSegmentActive : ''}`}
            />
          ))}
        </div>

        {/* STEP 1: THE ESSENTIALS */}
        {step === 1 && (
          <>
            <h1 className={styles.title}>The Essentials</h1>
            <p className="text-emerald-500/60 text-[10px] font-bold text-center uppercase tracking-[0.2em] mb-8">
              Logged in as: {userEmail}
            </p>

            <div className="space-y-4">
              <div className={`grid grid-cols-2 gap-4 ${styles.grid2}`}>
                <input placeholder="First Name *" className={styles.inputBase} onChange={e => setFirstName(e.target.value)} value={firstName} />
                <input placeholder="Last Name *" className={styles.inputBase} onChange={e => setLastName(e.target.value)} value={lastName} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <input placeholder="Age *" className={styles.inputBase} onChange={e => setAge(e.target.value.replace(/\D/g, ''))} value={age} />
                <div className="col-span-2 relative">
                  <input
                    placeholder="Username *"
                    className={`${styles.inputBase} ${usernameError ? 'border-red-500' : usernameSuccess ? 'border-emerald-500' : ''}`}
                    onChange={e => { setUsername(e.target.value); setUsernameSuccess(false); }}
                    onBlur={e => checkUsername(e.target.value)}
                    value={username}
                  />
                  {checkingUsername && (
                    <span className="absolute right-4 top-5 text-[10px] text-emerald-400 font-bold animate-pulse">
                      VERIFYING...
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <input maxLength={5} placeholder="ZIP *" className={`${styles.inputBase} col-span-4`} onChange={e => setZipCode(e.target.value.replace(/\D/g, ''))} value={zipCode} />
                <input placeholder="City" disabled className={`${styles.inputBase} ${styles.inputDisabled} col-span-5`} value={city} />
                <input placeholder="ST" disabled className={`${styles.inputBase} ${styles.inputDisabled} col-span-3 text-center`} value={state} />
              </div>

              <textarea placeholder="Adventure Bio *" className={`${styles.inputBase} min-h-[100px]`} onChange={e => setBio(e.target.value)} value={bio} />

              <button type="button" onClick={() => setStep(2)} disabled={loading || !isStep1Valid} className={styles.submitButton}>
                {loading ? 'Processing...' : 'Continue to Adventures'}
              </button>
            </div>
          </>
        )}

        {/* STEP 2: ADVENTURES */}
        {step === 2 && (
          <>
            <h1 className={styles.title}>Your Adventures</h1>
            <p className="text-emerald-500/60 text-[10px] font-bold text-center uppercase tracking-[0.2em] mb-8">
              Select at least 3 things you love
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {adventureOptions.map((adv) => {
                const isSelected = selectedAdventures.includes(adv);
                return (
                  <button key={adv} onClick={() => toggleAdventure(adv)}
                    className={`p-4 rounded-xl border font-bold transition-all text-sm ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                    {adv}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 w-full">
              <button onClick={() => setStep(1)} className={`${styles.submitButton} !bg-white/5 !mt-0 border border-white/10`}>Back</button>
              <button onClick={() => setStep(3)} disabled={selectedAdventures.length < 3} className={`${styles.submitButton} !mt-0`}>Next</button>
            </div>
          </>
        )}

        {/* STEP 3: FINAL TOUCHES */}
        {step === 3 && (
          <>
            <h1 className={styles.title}>Final Touch</h1>
            <div className="space-y-4 w-full max-w-md">

              <label className="block text-white font-bold mb-2">Profile Photo</label>
              <input type="file" accept="image/*" onChange={e => setProfilePhoto(e.target.files?.[0] ?? null)} className={styles.inputBase} />
              <button onClick={handlePhotoUpload} disabled={!profilePhoto || uploadingPhoto} className={styles.submitButton}>
                {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
              </button>

              <label className="block text-white font-bold mt-6 mb-2">Social Links (Optional)</label>
              <input placeholder="Instagram" className={styles.inputBase} value={instagram} onChange={e => setInstagram(e.target.value)} />
              <input placeholder="Twitter" className={styles.inputBase} value={twitter} onChange={e => setTwitter(e.target.value)} />

              <div className="flex gap-4 w-full mt-6">
                <button onClick={() => setStep(2)} className={`${styles.submitButton} !bg-white/10 !mt-0`}>Back</button>
                <button onClick={handleSaveProfile} className={`${styles.submitButton} !mt-0`}>Complete Onboarding</button>
              </div>

            </div>
          </>
        )}

      </div>
    </main>
  );
}