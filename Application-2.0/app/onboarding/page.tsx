'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
        } else {
          // Check if they already have a profile
          const { data } = await supabase.from('profiles').select('first_name').eq('id', user.id).single();
          if (data?.first_name) setFirstName(data.first_name);
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, [router]);

  const handleSimpleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('profiles').upsert({
      id: user?.id,
      first_name: firstName,
      updated_at: new Date().toISOString(),
    });

    if (error) alert(`Error: ${error.message}`);
    else alert("Saved successfully!");
  };

  if (loading) return <div className="h-screen bg-[#00df9a] flex items-center justify-center text-white">LOADING...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Step 1: The Basics</h1>
      <input
        className="border p-2 m-2"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
      />
      <button onClick={handleSimpleSave} className="bg-black text-white p-2 rounded">Save & Test Connection</button>
    </div>
  );
}