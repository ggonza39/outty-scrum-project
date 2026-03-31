'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          console.log("No user found, redirecting to login...");
          router.push('/login');
        } else {
          setUserEmail(user.email ?? "User");
          console.log("User authenticated:", user.id);
        }
      } catch (err) {
        console.error("Auth check crashed:", err);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="h-screen bg-blue-500 flex items-center justify-center text-white text-2xl">
        STRICT AUTH CHECK... (If stuck here, check Console)
      </div>
    );
  }

  return (
    <div className="p-20 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Connection Successful!</h1>
      <p className="text-xl mb-8">Logged in as: {userEmail}</p>
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white px-6 py-2 rounded-lg"
      >
        Sign Out
      </button>
    </div>
  );
}