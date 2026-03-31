'use client';

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS                                                         */
/* -------------------------------------------------------------------------- */
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';
import zipData from 'us-zips';
import styles from './onboarding.module.css';

export default function OnboardingPage() {
  /* -------------------------------------------------------------------------- */
  /* SECTION 2: STATE MANAGEMENT                                                */
  /* -------------------------------------------------------------------------- */
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- NAVIGATION STATE ---
  const [step, setStep] = useState(1);
  const totalSteps = 6;

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

  // Validation States
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // --- STEP 2: ADVENTURES ---
  const [selectedAdventures, setSelectedAdventures] = useState<string[]>([]);
  const adventureOptions = ['Backpacking', 'Hiking', 'Camping', 'Kayaking', 'Rock Climbing', 'Mountain Biking', 'Skiing', 'Fishing', 'Photography', 'Road Trips', 'Stargazing'];

  // --- STEP 3: MATCHING PREFS ---
  const [genderPrefs, setGenderPrefs] = useState<string[]>([]);
  const [mileRange, setMileRange] = useState(25);
  const [skillPref, setSkillPref] = useState<string[]>([]);

  // --- STEP 4 & 5: MEDIA & SOCIALS ---
  const [photos, setPhotos] = useState<string[]>([]);
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: LOGIC HELPERS                                                   */
  /* -------------------------------------------------------------------------- */
  const toggleSelection = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) setList(list.filter((i) => i !== item));
    else setList([...list, item]);
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return firstName && lastName && usernameSuccess && age && zipCode.length === 5 && bio && skillLevels.length > 0;
      case 2: return selectedAdventures.length >= 1;
      case 3: return genderPrefs.length > 0 && skillPref.length > 0;
      case 4: return photos.length >= 1;
      default: return true;
    }
  };

  /* -------------------------------------------------------------------------- */
  /* SECTION 4: EFFECTS & HANDLERS                                              */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      else {
        setUserEmail(user.email ?? "User");
        setLoading(false);
      }
    }
    checkUser();
  }, [router]);

  useEffect(() => {
    if (zipCode.length === 5) {
      const coords = (zipData as any)[zipCode];
      if (coords) {
        fetch(`https://api.zippopotam.us/us/${zipCode}`)
          .then(res => res.json())
          .then(data => {
            setCity(data.places[0]['place name']);
            setState(data.places[0]['state abbreviation']);
          });
      }
    }
  }, [zipCode]);

  const checkUsername = async (val: string) => {
    if (!val) return;
    setCheckingUsername(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('profiles').select('username, id').eq('username', val).maybeSingle();
    if (!data || data.id === user?.id) {
      setUsernameSuccess(true);
      setUsernameError('');
    } else {
      setUsernameSuccess(false);
      setUsernameError('Taken');
    }
    setCheckingUsername(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const fileName = `${user.id}/${Math.random()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('avatars').upload(fileName, file);
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
        setPhotos(prev => [...prev, publicUrl]);
      }
    }
    setLoading(false);
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
        bio,
        zip_code: zipCode,
        city,
        state,
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null,
        gender,
        gender_preference: genderPrefs,
        adventure_type: selectedAdventures,
        skill_level: skillLevels,
        skill_preference: skillPref,
        mile_range: mileRange,
        profile_pictures: photos,
        instagram, tiktok, facebook, linkedin,
        updated_at: new Date()
      });
      if (!error) router.push('/dashboard');
      else alert(error.message);
    }
    setLoading(false);
  };

  /* -------------------------------------------------------------------------- */
  /* SECTION 5: RENDER                                                          */
  /* -------------------------------------------------------------------------- */
  const progressWidth = `${(step / totalSteps) * 100}%`;

  if (loading && step === 1) return <div className={styles.loadingScreen}>SYNCING OUTTY...</div>;

  return (
    <main className={styles.mainContainer}>
      <div className={styles.glassCard}>

        {/* PROGRESS BAR */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: progressWidth }}></div>
        </div>

        {/* STEP 1: THE ESSENTIALS */}
        {step === 1 && (
          <div className="space-y-4 text-left">
            <h1 className={styles.title}>The Essentials</h1>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="First Name *" className={styles.inputBase} onChange={(e) => setFirstName(e.target.value)} value={firstName} />
              <input placeholder="Last Name *" className={styles.inputBase} onChange={(e) => setLastName(e.target.value)} value={lastName} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['Male', 'Female', 'Other'].map((g) => (
                <button key={g} onClick={() => setGender(g)} className={`py-3 rounded-xl border text-sm font-bold transition-all ${gender === g ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>{g}</button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <input placeholder="Age *" className={styles.inputBase} onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))} value={age} />
              <div className="col-span-2 relative">
                <input placeholder="Username *" className={styles.inputBase} onChange={(e) => { setUsername(e.target.value); setUsernameSuccess(false); }} onBlur={(e) => checkUsername(e.target.value)} value={username} />
                {checkingUsername && <span className="absolute right-4 top-4 text-[10px] text-emerald-400 animate-pulse">VERIFYING...</span>}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <input placeholder="ZIP *" maxLength={5} className="col-span-4 p-4 rounded-xl bg-white/10 border border-white/20 text-white" onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))} value={zipCode} />
              <input placeholder="City" disabled className="col-span-5 p-4 rounded-xl bg-black/20 text-white/30" value={city} />
              <input placeholder="ST" disabled className="col-span-3 p-4 rounded-xl bg-black/20 text-white/30 text-center" value={state} />
            </div>

            <textarea placeholder="Adventure Bio *" className={`${styles.inputBase} min-h-[100px]`} onChange={(e) => setBio(e.target.value)} value={bio} />

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">My Skill Level *</label>
              <div className="grid grid-cols-4 gap-2">
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((s) => (
                  <button key={s} onClick={() => toggleSelection(skillLevels, setSkillLevels, s)} className={`py-2 rounded-xl border text-[10px] font-bold ${skillLevels.includes(s) ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ADVENTURES */}
        {step === 2 && (
          <div className="text-center">
            <h1 className={styles.title}>Your Adventures</h1>
            <div className="flex flex-wrap justify-center gap-2 max-h-[300px] overflow-y-auto p-2">
              {adventureOptions.map((type) => (
                <button key={type} onClick={() => toggleSelection(selectedAdventures, setSelectedAdventures, type)} className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all ${selectedAdventures.includes(type) ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>{type}</button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: PREFERENCES */}
        {step === 3 && (
          <div className="space-y-8 text-left">
            <h1 className={styles.title}>Matching Prefs</h1>
            <div>
              <label className="text-white/60 text-xs font-bold uppercase block mb-3">Partner Gender *</label>
              <div className="grid grid-cols-3 gap-2">
                {['Female', 'Male', 'Other'].map((g) => (
                  <button key={g} onClick={() => toggleSelection(genderPrefs, setGenderPrefs, g)} className={`py-3 rounded-xl border text-xs font-bold transition-all ${genderPrefs.includes(g) ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white/60 text-xs font-bold uppercase">Search Range</label>
                <span className="text-emerald-400 font-bold">{mileRange} miles</span>
              </div>
              <input type="range" min="5" max="100" step="5" value={mileRange} onChange={(e) => setMileRange(parseInt(e.target.value))} className="w-full accent-emerald-500" />
            </div>
            <div>
              <label className="text-white/60 text-xs font-bold uppercase block mb-3">Partner Skill Levels *</label>
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
          <div className="text-center">
            <h1 className={styles.title}>Photos</h1>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full mb-6 py-5 bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 text-emerald-400 font-black rounded-2xl">
              Upload Photos ({photos.length}/6)
            </button>
            <div className="grid grid-cols-3 gap-4">
              {photos.map((url, idx) => (
                <div key={idx} className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10">
                  <img src={url} className="w-full h-full object-cover" />
                  <button onClick={() => setPhotos(photos.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/40 p-1 rounded-lg text-white">X</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: SOCIALS */}
        {step === 5 && (
          <div className="space-y-4 text-left">
            <h1 className={styles.title}>Social Links</h1>
            {['Instagram', 'TikTok', 'Facebook', 'LinkedIn'].map((label) => (
              <div key={label}>
                <label className="text-white/40 text-[10px] font-bold uppercase block mb-1">{label}</label>
                <input type="text" placeholder={`@handle`} className={styles.inputBase} onChange={(e) => {
                  if(label === 'Instagram') setInstagram(e.target.value);
                  else if(label === 'TikTok') setTiktok(e.target.value);
                  else if(label === 'Facebook') setFacebook(e.target.value);
                  else setLinkedin(e.target.value);
                }} />
              </div>
            ))}
          </div>
        )}

        {/* STEP 6: PREVIEW & FINALIZE */}
        {step === 6 && (
          <div className="text-center space-y-8">
            <h1 className={styles.title}>Ready to Go?</h1>
            <div className="bg-black/20 p-6 rounded-2xl border border-white/10 text-left">
              <p className="text-emerald-400 font-bold uppercase text-xs">Profile Preview</p>
              <h2 className="text-2xl font-black text-white">{firstName} {lastName}</h2>
              <p className="text-white/60 italic">"{bio}"</p>
            </div>
            <p className="text-white/40 text-sm italic">Review your details and finalize your adventure profile.</p>
          </div>
        )}

        {/* NAVIGATION */}
        <div className="flex gap-4 mt-10">
          {step > 1 && <button onClick={() => setStep(step - 1)} className="flex-1 py-4 bg-white/5 text-white font-black uppercase rounded-xl border border-white/10">Back</button>}
          <button
            onClick={() => { if (step < totalSteps) setStep(step + 1); else handleSaveProfile(); }}
            disabled={!isStepValid()}
            className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 text-white font-black uppercase rounded-xl transition-all"
          >
            {step < totalSteps ? 'Continue' : 'Finalize Profile'}
          </button>
        </div>

      </div>
    </main>
  );
}