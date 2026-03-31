'use client';

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & DEPENDENCIES                                          */
/* -------------------------------------------------------------------------- */

import { supabase } from '../supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import zipData from 'us-zips';
import { useState, useRef, useEffect, Suspense } from 'react';

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#022c22] flex items-center justify-center">
        <div className="animate-pulse text-emerald-400 font-black text-2xl tracking-tighter italic uppercase">
          Initializing Adventure...
        </div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}

export default function OnboardingPage() {
  /* -------------------------------------------------------------------------- */
  /* SECTION 2: STATE MANAGEMENT                                                */
  /* -------------------------------------------------------------------------- */
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams(); // <--- Add this

  const isEditMode = searchParams.get('mode') === 'edit';

  // Step 1: Profile Essentials
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('Female');
  const [skillLevels, setSkillLevels] = useState<string[]>([]);

  // Step 2 & 3: Adventure & Preferences
  const [adventures, setAdventures] = useState<string[]>([]);
  const [genderPrefs, setGenderPrefs] = useState<string[]>([]);
  const [mileRange, setMileRange] = useState(25);
  const [skillPref, setSkillPref] = useState<string[]>([]);

  // Step 4 & 5: Media & Socials
  const [photos, setPhotos] = useState<string[]>([]);
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Validation States
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [ageError, setAgeError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: CONSTANTS & HELPERS                                             */
  /* -------------------------------------------------------------------------- */
  const adventureOptions = ['Backpacking', 'Ice-Fishing', 'Bow-Hunting', 'Fishing', 'Boating', 'Hiking', 'Skiing', 'Rock-Climbing', 'Hang-Gliding', 'Kayaking', 'Camping', 'Mountain-Biking', 'Trail-Running', 'Snowmobiling', 'Wildlife-Photography'];

  const getArrayData = (data: any) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string' && data.startsWith('[')) {
      try { return JSON.parse(data); } catch (e) { return []; }
    }
    return [];
  };

  /* -------------------------------------------------------------------------- */
  /* SECTION 4: EFFECTS & DATA FETCHING                                         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function checkAuthAndLoad() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

      if (data && !error) {

      /* --- SURGICAL FIX: ALLOW EDIT MODE --- */
                    // Only redirect if they have a username AND they are NOT explicitly editing
                    if (data.username && !isEditMode) {
                      router.replace('/dashboard');
                      return;
                    }
            /* --- END FIX --- */
              setFirstName(data.first_name || '');
              setLastName(data.last_name || '');
              setUsername(data.username || '');
              setAge(data.age?.toString() || '');
              setZipCode(data.zip_code || '');
              setCity(data.city || '');
              setState(data.state || '');
              setBio(data.bio || '');
              if (data.username) setUsernameSuccess(true);

              // CLEANER: Ensures My Gender is always a single string, even if DB returns an array
              setGender(Array.isArray(data.gender) ? data.gender[0] : (data.gender || 'Female'));

              setSkillLevels(getArrayData(data.skill_level));
              setAdventures(getArrayData(data.adventure_type));
              setGenderPrefs(getArrayData(data.gender_preference));
              setMileRange(data.mile_range || 25);
              setSkillPref(getArrayData(data.skill_preference));
              setPhotos(getArrayData(data.profile_pictures));
              setInstagram(data.instagram || '');
              setTiktok(data.tiktok || '');
              setFacebook(data.facebook || '');
              setLinkedin(data.linkedin || '');
            }
      setLoading(false);
    }
    checkAuthAndLoad();
  }, [router]);

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
        } catch (error) { console.error("Location lookup failed", error); }
      };
      fetchLocation();
    }
  }, [zipCode]);

  /* -------------------------------------------------------------------------- */
  /* SECTION 5: HANDLERS & LOGIC                                                */
  /* -------------------------------------------------------------------------- */
  const checkUsername = async (val: string) => {
    if (!val) return;
    setCheckingUsername(true);
    setUsernameSuccess(false);
    await new Promise(r => setTimeout(r, 600));
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('profiles').select('username, id').eq('username', val).single();
    if (data && data.id !== user?.id) {
      setUsernameError('not available, choose another one');
    } else {
      setUsernameError('');
      setUsernameSuccess(true);
    }
    setCheckingUsername(false);
  };

  const validateAge = (val: string) => {
    const ageNum = parseInt(val);
    if (val && ageNum < 18) setAgeError('Must be 18+');
    else setAgeError('');
  };

  const toggleSelection = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) setList(list.filter((i) => i !== item));
    else setList([...list, item]);
  };

  const handleCancelTrigger = () => setShowCancelModal(true);

  const confirmCancelAction = async () => {
      if (isEditMode) {
        // If editing, just go back to the profile without logging out
        router.push('/profile');
      } else {
        // If new user, original "Bouncer" logic applies
        await supabase.auth.signOut();
        localStorage.clear();
        router.replace('/login');
      }
    };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) alert(uploadError.message);
      else {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
        setPhotos((prev) => [...prev, publicUrl]);
      }
    }
    setLoading(false);
  };

  const makePrimary = (index: number) => {
    const newPhotos = [...photos];
    const [selected] = newPhotos.splice(index, 1);
    newPhotos.unshift(selected);
    setPhotos(newPhotos);
  };

  const handleSaveProfile = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const coords = (zipData as any)[zipCode];
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
            adventure_type: adventures,
            bio,
            skill_level: skillLevels,
            skill_preference: skillPref,
            mile_range: mileRange,
            profile_pictures: photos,
            instagram,
            tiktok,
            facebook,
            linkedin,
            updated_at: new Date(),
          });

          if (error) {
            alert(error.message);
          } else {
            // --- ADD THIS LINE HERE ---
            sessionStorage.setItem('just_finished_onboarding', 'true');

            // Redirecting to the profile page
            router.push('/profile');
          }
        }
        setLoading(false);
      };
  const isStepValid = () => {
    switch (step) {
      case 1: return firstName && lastName && username && usernameSuccess && age && !ageError && zipCode.length === 5 && bio && skillLevels.length > 0;
      case 2: return adventures.length > 0;
      case 3: return genderPrefs.length > 0 && skillPref.length > 0;
      case 4: return photos.length >= 1;
      case 5: return true;
      default: return true;
    }
  };

  /* -------------------------------------------------------------------------- */
  /* SECTION 6: RENDER                                                          */
  /* -------------------------------------------------------------------------- */
  const progressWidth = `${(step / totalSteps) * 100}%`;

  if (loading && step === 1) return (
    <div className="min-h-screen bg-[#022c22] flex items-center justify-center">
      <div className="animate-pulse text-emerald-400 font-black text-2xl tracking-tighter italic">LOADING OUTTY...</div>
    </div>
  );

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-start bg-[#022c22] p-4 pt-32 md:pt-12 text-center overflow-x-hidden">

      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center">

            {/* Dynamic Title */}
            <h3 className="text-2xl font-black italic text-white tracking-tighter mb-4">
              {isEditMode ? 'DISCARD CHANGES?' : 'ABANDON ADVENTURE?'}
            </h3>

            {/* Dynamic Description */}
            <p className="text-white/60 text-sm mb-8 font-bold uppercase tracking-widest leading-relaxed">
              {isEditMode
                ? "Your recent edits won't be saved. Return to your profile?"
                : "To view profiles, you must complete your own first. Exiting will log you out."
              }
            </p>

            <div className="flex flex-col gap-3">
              {/* Dynamic Button Text */}
              <button
                onClick={confirmCancelAction}
                className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-400 transition-all"
              >
                {isEditMode ? 'Discard & Return' : 'Yes, Log Out'}
              </button>

              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full py-4 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
              >
                {isEditMode ? 'Back to Editing' : 'Keep Building'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-8 md:px-12 pointer-events-none">
        <div className="w-full flex justify-between items-center pointer-events-auto">
          <div className="text-3xl md:text-4xl font-black italic tracking-tighter text-white drop-shadow-lg">OUTTY</div>
          <button onClick={handleCancelTrigger} className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-500 hover:text-white transition-all">Cancel</button>
        </div>
      </div>

      <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80')" }}></div>

      <div className="z-10 w-full max-w-2xl p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500">
        <h1 className="text-4xl font-black italic tracking-tighter text-white">
          {isEditMode ? 'UPDATE YOUR PROFILE' : 'CREATE YOUR PROFILE'}
        </h1>
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: progressWidth }}></div>
        </div>

        {/* STEP 1: ABOUT YOU */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4 italic uppercase tracking-tighter">The Essentials</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name *" className="p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-emerald-500" onChange={(e) => setFirstName(e.target.value)} value={firstName}/>
              <input type="text" placeholder="Last Name *" className="p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-emerald-500" onChange={(e) => setLastName(e.target.value)} value={lastName}/>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['Male', 'Female', 'Other'].map((g) => (
                <button key={g} onClick={() => setGender(g)} className={`py-3 rounded-xl border text-sm font-bold transition-all ${gender === g ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>{g}</button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <input type="text" inputMode="numeric" placeholder="Age *" className={`p-4 rounded-xl bg-white/10 border ${ageError ? 'border-red-500' : 'border-white/20'} text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-emerald-500`} onChange={(e) => {setAge(e.target.value.replace(/\D/g, '')); setAgeError('');}} onBlur={(e) => validateAge(e.target.value)} value={age} />
                {ageError && <span className="text-red-500 text-[10px] font-bold uppercase">{ageError}</span>}
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <input type="text" placeholder="Username *" className={`p-4 rounded-xl bg-white/10 border ${usernameError ? 'border-red-500' : usernameSuccess ? 'border-emerald-500' : 'border-white/20'} text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-emerald-500`} onChange={(e) => {setUsername(e.target.value); setUsernameError(''); setUsernameSuccess(false);}} onBlur={(e) => checkUsername(e.target.value)} value={username} />
                {checkingUsername && <span className="text-emerald-400 text-[10px] font-bold animate-pulse uppercase">Verifying...</span>}
                {usernameError && <span className="text-red-500 text-[10px] font-bold uppercase">{usernameError}</span>}
                {usernameSuccess && <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Username Available</span>}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <input type="text" maxLength={5} placeholder="ZIP *" className="col-span-4 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-emerald-500" onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))} value={zipCode} />
              <input type="text" placeholder="City" disabled className="col-span-5 p-4 rounded-xl bg-black/20 border border-white/5 text-white/30 cursor-not-allowed" value={city} />
              <input type="text" placeholder="ST" disabled className="col-span-3 p-4 rounded-xl bg-black/20 border border-white/5 text-white/30 cursor-not-allowed text-center" value={state} />
            </div>

            <textarea placeholder="Adventure Bio - What drives you? (Required) *" className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px] resize-none" onChange={(e) => setBio(e.target.value)} value={bio}/>

            <div>
              <label className="text-white/40 text-[10px] font-bold uppercase mb-2 block tracking-widest italic">My Skill Levels *</label>
              <div className="grid grid-cols-4 gap-2">
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((s) => (
                  <button key={s} onClick={() => toggleSelection(skillLevels, setSkillLevels, s)} className={`py-2 rounded-xl border text-[10px] font-bold transition-all ${skillLevels.includes(s) ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ADVENTURES */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold text-white mb-6 uppercase italic tracking-tighter">Adventure Interests *</h2>
            <div className="flex flex-wrap justify-center gap-2 max-h-[350px] overflow-y-auto custom-scrollbar p-2">
              {adventureOptions.map((type) => (
                <button key={type} onClick={() => toggleSelection(adventures, setAdventures, type)} className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all ${adventures.includes(type) ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'}`}>{type}</button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: PREFERENCES */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left space-y-8">
            <h2 className="text-3xl font-bold text-white mb-2 text-center uppercase italic tracking-tighter">Matching Preferences *</h2>
            <div>
              <label className="text-white/60 text-xs font-bold uppercase block mb-3 italic">Partner Gender Preference *</label>
              <div className="grid grid-cols-3 gap-2">
                {['Female', 'Male', 'Other'].map((g) => (
                  <button key={g} onClick={() => toggleSelection(genderPrefs, setGenderPrefs, g)} className={`py-3 rounded-xl border text-xs font-bold transition-all ${genderPrefs.includes(g) ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white/60 text-xs font-bold uppercase italic">Search Distance *</label>
                <span className="text-emerald-400 font-bold">{mileRange} miles</span>
              </div>
              <input type="range" min="5" max="100" step="5" value={mileRange} onChange={(e) => setMileRange(parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
            <div>
              <label className="text-white/60 text-xs font-bold uppercase block mb-3 italic">Partner Skill Levels *</label>
              <div className="grid grid-cols-2 gap-2">
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((s) => (
                  <button key={s} onClick={() => toggleSelection(skillPref, setSkillPref, s)} className={`py-3 rounded-xl border text-xs font-bold transition-all ${skillPref.includes(s) ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PHOTOS */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter italic">Photos *</h2>
            <p className="text-white/40 text-[10px] font-black uppercase mb-8 tracking-widest">
              Tap a photo to set as primary • Drag to reorder
            </p>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || photos.length >= 6}
              className="w-full mb-10 py-5 bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 text-emerald-400 font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-emerald-500/20 hover:border-emerald-500/60 transition-all active:scale-[0.98]"
            >
              {loading ? 'Processing...' : `Upload Adventure Photos (${photos.length}/6)`}
            </button>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => makePrimary(idx)}
                  className={`relative group aspect-[4/5] rounded-[1.5rem] overflow-hidden border-2 cursor-pointer transition-all duration-500
                    ${idx === 0
                      ? 'border-emerald-500 ring-4 ring-emerald-500/20 z-10 scale-[1.02]'
                      : 'border-white/10 hover:border-white/40'}`}
                >
                  <img src={url} alt="Profile" className="w-full h-full object-cover" />

                  {/* Subtle Gradient Overlay for Icons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Primary Status Badge */}
                  {idx === 0 ? (
                    <div className="absolute top-3 left-3 bg-emerald-500 text-[#022c22] text-[9px] font-black px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      PRIMARY
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-4px] group-hover:translate-y-0">
                       <div className="bg-black/40 backdrop-blur-md text-white/70 text-[8px] font-black px-2 py-1 rounded-lg border border-white/10">
                        SET PRIMARY
                      </div>
                    </div>
                  )}

                  {/* Delete Button - Using your existing logic */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotos(photos.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-3 right-3 bg-black/40 backdrop-blur-md p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 text-white border border-white/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: SOCIALS */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6 text-center uppercase italic tracking-tighter">Social Links</h2>
            {['Instagram', 'TikTok', 'Facebook', 'LinkedIn'].map((label) => (
              <div key={label}>
                <label className="text-white/40 text-[10px] font-bold uppercase block mb-1 tracking-widest italic">{label} (Optional)</label>
                <input
                  type="text"
                  placeholder={`Your ${label} handle`}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  value={label === 'Instagram' ? instagram : label === 'TikTok' ? tiktok : label === 'Facebook' ? facebook : linkedin}
                  onChange={(e) => {
                    const v = e.target.value;
                    if(label === 'Instagram') setInstagram(v);
                    else if(label === 'TikTok') setTiktok(v);
                    else if(label === 'Facebook') setFacebook(v);
                    else setLinkedin(v);
                  }}
                />
              </div>
            ))}
          </div>
        )}

       {/* STEP 6: EXACT PREVIEW CARD LAYOUT */}
       {step === 6 && (
         <div className="animate-in fade-in zoom-in duration-500 text-left">
           <div className="bg-black/20 border border-white/10 rounded-[2rem] p-8 space-y-8 shadow-2xl overflow-y-auto max-h-[500px] custom-scrollbar">

             {/* Profile Header */}
             <div className="flex items-start gap-6 border-b border-white/5 pb-8">
               <div className="relative shrink-0">
                 <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-emerald-500 shadow-lg shadow-emerald-500/20">
                   {/* Displaying the user's selected primary photo (index 0) */}
                   <img src={photos[0] || ''} alt="Primary" className="w-full h-full object-cover" />
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-[#022c22] px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter">
                   {age || '??'} YR OLD
                 </div>
               </div>

               <div className="space-y-0.5">
                 <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none uppercase">
                   {firstName} {lastName}
                 </h3>
                 <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-2">
                     <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em]">
                       @{username} • {gender.toUpperCase()}
                     </span>

                   </div>
                   <span className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                     <span className="text-emerald-500 text-xs">📍</span> {city}, {state} {zipCode}
                   </span>


                  <span className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] animate-pulse drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]">
                    Online Now
                  </span>

                 </div>
               </div>
             </div>

             {/* Bio Section - Normalized to text-base */}
             <div className="space-y-2">
               <label className="text-emerald-400 text-[10px] font-black uppercase tracking-widest block">The Adventure Bio</label>
               <p className="text-white/90 text-base font-medium leading-relaxed tracking-tight">"{bio || "No bio added yet."}"</p>
             </div>

             {/* Interests Tags - Normalized font sizes */}
             <div className="space-y-3">
               <label className="text-emerald-400 text-[10px] font-black uppercase tracking-widest block">Adventure Interests</label>
               <div className="flex flex-wrap gap-2">
                 {adventures.map(adv => (
                   <span key={adv} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold rounded-full uppercase">
                     {adv}
                   </span>
                 ))}
               </div>
             </div>

             {/* Metrics Grid - Normalized to text-base for uniform readability */}
                          <div className="grid grid-cols-2 gap-y-8 gap-x-12 border-t border-white/5 pt-8">
                            <div className="space-y-1">
                              <label className="text-white/40 text-[10px] font-black uppercase tracking-widest block">My Skill Levels</label>
                              <p className="text-white text-base font-bold tracking-tight uppercase">
                                 {skillLevels.join(', ') || 'None'}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <label className="text-white/40 text-[10px] font-black uppercase tracking-widest block">Partner Gender</label>
                              <p className="text-white text-base font-bold tracking-tight uppercase">
                                 {genderPrefs.join(', ') || 'Any'}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <label className="text-white/40 text-[10px] font-black uppercase tracking-widest block">Search Range</label>
                              <p className="text-emerald-400 text-base font-bold tracking-tight uppercase">{mileRange} Miles</p>
                            </div>
                            <div className="space-y-1">
                              <label className="text-white/40 text-[10px] font-black uppercase tracking-widest block">Partner Skill Levels</label>
                              <p className="text-white text-base font-bold tracking-tight leading-none uppercase">
                                 {skillPref.join(', ') || 'Any'}
                              </p>
                            </div>
                          </div>

             {/* Socials Grid */}
             <div className="space-y-4 border-t border-white/5 pt-8 pb-4">
               <label className="text-white/40 text-[10px] font-black uppercase tracking-widest block">Connected Socials</label>
               <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                 {[
                   { label: 'Instagram', val: instagram },
                   { label: 'TikTok', val: tiktok },
                   { label: 'Facebook', val: facebook },
                   { label: 'LinkedIn', val: linkedin }
                 ].map(soc => (
                   <div key={soc.label}>
                     <p className="text-white/30 text-[9px] font-bold uppercase">{soc.label}</p>
                     <p className={`text-xs font-bold truncate ${soc.val ? 'text-white' : 'text-emerald-500'}`}>
                       {soc.val || 'Not added'}
                     </p>
                   </div>
                 ))}
               </div>
             </div>

           </div>
         </div>
       )}

        {/* NAVIGATION BUTTONS */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all italic"
            >
              Back
            </button>
          )}
          <button
            onClick={() => { if (step < totalSteps) setStep(step + 1); else handleSaveProfile(); }}
            disabled={loading || checkingUsername || !isStepValid()}
            className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-xl italic"
          >
            {loading ? (
              'Processing...'
            ) : step < totalSteps ? (
              'Continue'
            ) : isEditMode ? (
              'Update Profile'
            ) : (
              'Finalize Profile'
            )}
          </button>
        </div>
      </div>
    </main>
  );
}