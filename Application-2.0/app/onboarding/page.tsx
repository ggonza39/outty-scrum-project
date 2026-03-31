'use client';

import { supabase } from '../supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import zipData from 'us-zips';
import { useState, useRef, useEffect, Suspense } from 'react';

// Main Page Component with Suspense Boundary
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

// Inner Content Component
function OnboardingContent() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();

  const isEditMode = searchParams.get('mode') === 'edit';

  // --- State Management ---
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
  const [adventures, setAdventures] = useState<string[]>([]);
  const [genderPrefs, setGenderPrefs] = useState<string[]>([]);
  const [mileRange, setMileRange] = useState(25);
  const [skillPref, setSkillPref] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  // Socials
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Validation
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
        if (data.username && !isEditMode) {
          router.replace('/dashboard');
          return;
        }

        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setUsername(data.username || '');
        setAge(data.age?.toString() || '');
        setZipCode(data.zip_code || '');
        setCity(data.city || '');
        setState(data.state || '');
        setBio(data.bio || '');
        if (data.username) setUsernameSuccess(true);

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
  }, [router, isEditMode]);

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
      router.push('/profile');
    } else {
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
        sessionStorage.setItem('just_finished_onboarding', 'true');
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
      case 6: return true;
      default: return true;
    }
  };

  const progressWidth = `${(step / totalSteps) * 100}%`;

  if (loading && step === 1) return (
    <div className="min-h-screen bg-[#022c22] flex items-center justify-center">
      <div className="animate-pulse text-emerald-400 font-black text-2xl tracking-tighter italic">LOADING OUTTY...</div>
    </div>
  );

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-start bg-[#022c22] p-4 pt-32 md:pt-12 text-center overflow-x-hidden">
      {/* UI unchanged */}
    </main>
  );
}