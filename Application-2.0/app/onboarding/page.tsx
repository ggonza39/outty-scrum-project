'use client';

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS                                                         */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';

// Reserved for: let zipData: any = null;

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

  // Reserved for: Step 2 States (Adventure/ZIP)
  // Reserved for: Step 3 States (Socials/Photos)

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

          // Reserved for: Fetching existing profile data to pre-fill form
        }
      } catch (err) {
        console.error("Auth check crashed:", err);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, [router]);

  /* -------------------------------------------------------------------------- */
  /* SECTION 4: ACTIONS & HANDLERS                                              */
  /* -------------------------------------------------------------------------- */

  // LOGOUT HANDLER
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // SAVE HANDLER (The core of the onboarding)
  const handleSaveProfile = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        // LOOKUP COORDINATES
        // We cast to 'any' to avoid strict TypeScript errors with the large zip library
        const coords = (zipData as any)[zipCode];

        const profileData = {
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          username: username,
          age: parseInt(age),
          bio: bio,
          zip_code: zipCode,
          city: city,
          state: state,
          // Ensure these are numbers or null so the DB doesn't reject them
          latitude: coords?.latitude || null,
          longitude: coords?.longitude || null,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').upsert(profileData);

        if (error) {
          console.error("Save Error:", error.message);
          alert(`Save failed: ${error.message}`);
        } else {
          alert("Basics Saved! Coordinates captured.");
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
  if (loading) {
    return (
      <div className="h-screen bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
        LOADING...
      </div>
    );
  }

 return (
     <main className="min-h-screen w-full bg-[#022c22] p-8 flex flex-col items-center">
       <div className="z-10 w-full max-w-2xl p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
         <h1 className="text-3xl font-black italic tracking-tighter text-white mb-8 text-center uppercase">
           The Essentials
         </h1>

         <div className="space-y-4">
           {/* Names */}
           <div className="grid grid-cols-2 gap-4">
             <input
               placeholder="First Name *"
               className="p-4 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-emerald-500"
               onChange={(e) => setFirstName(e.target.value)}
               value={firstName}
             />
             <input
               placeholder="Last Name *"
               className="p-4 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-emerald-500"
               onChange={(e) => setLastName(e.target.value)}
               value={lastName}
             />
           </div>

           {/* Username & Age */}
           <div className="grid grid-cols-3 gap-4">
             <input
               placeholder="Age *"
               className="p-4 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-emerald-500"
               onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))}
               value={age}
             />
             <input
               placeholder="Username *"
               className="col-span-2 p-4 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-emerald-500"
               onChange={(e) => setUsername(e.target.value)}
               value={username}
             />
           </div>

           {/* ZIP & Auto-City/State */}
           <div className="grid grid-cols-12 gap-4">
             <input
               maxLength={5}
               placeholder="ZIP *"
               className="col-span-4 p-4 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-emerald-500"
               onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
               value={zipCode}
             />
             <input placeholder="City" disabled className="col-span-5 p-4 rounded-xl bg-black/20 text-white/30 cursor-not-allowed" value={city} />
             <input placeholder="ST" disabled className="col-span-3 p-4 rounded-xl bg-black/20 text-white/30 cursor-not-allowed text-center" value={state} />
           </div>

           <textarea
             placeholder="Adventure Bio *"
             className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
             onChange={(e) => setBio(e.target.value)}
             value={bio}
           />

           <button
             onClick={handleSaveProfile} // <--- Change this
             disabled={loading || !usernameSuccess || !zipCode || city === ''}
             className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-xl italic disabled:opacity-20"
           >
             {loading ? 'Saving...' : 'Save & Continue'}
           </button>
         </div>
       </div>
     </main>
   );