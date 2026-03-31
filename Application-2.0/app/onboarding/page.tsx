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

  // Step 1 States (The Basics)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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

      // Payload Construction
      const profileData = {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
        // Reserved for: Latitude, Longitude, Adventures, etc.
      };

      const { error } = await supabase.from('profiles').upsert(profileData);

      if (error) {
        console.error("Save Error:", error.message);
        alert(`Save failed: ${error.message}`);
      } else {
        alert("Success! Profile updated.");
        // router.push('/dashboard');
      }
    } catch (err) {
      console.error("Handler error:", err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-10">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Setup Profile</h1>

        {/* STEP 1: BASICS */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Logged in as: {userEmail}</p>

          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              className="w-full border p-2 rounded mt-1"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              className="w-full border p-2 rounded mt-1"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full bg-[#00df9a] text-black font-bold py-3 rounded-lg hover:bg-[#00c88a] transition"
          >
            Save Profile
          </button>
        </div>

        {/* UTILITY BUTTONS */}
        <div className="mt-8 border-t pt-4">
          <button
            onClick={handleSignOut}
            className="w-full text-red-500 text-sm hover:underline"
          >
            Not you? Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}