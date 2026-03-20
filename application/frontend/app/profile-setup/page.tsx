'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import MobilePage from '@/components/MobilePage';
import { supabase } from '../../lib/supabase';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [age, setAge] = useState('28');
  const [location, setLocation] = useState('Madison, WI');
  const [bio, setBio] = useState('UX designer who loves coffee, road trips, and trying new brunch spots.');
  const [interests, setInterests] = useState('Design systems, live music, hiking');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace('/signin');
      }
    };

    checkSession();
  }, [router]);

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setErrorMessage('');

  try {
    setIsSubmitting(true);

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session retrieval error:', sessionError);
      setErrorMessage('Unable to verify your session. Please sign in again.');
      return;
    }

    const user = sessionData.session?.user;

    if (!user) {
      setErrorMessage('You must be signed in to save your profile.');
      router.replace('/signinTEMP');
      return;
    }

    const parsedAge = age.trim() ? Number(age) : null;

    if (parsedAge !== null && Number.isNaN(parsedAge)) {
      setErrorMessage('Please enter a valid age.');
      return;
    }

    const interestsArray = interests
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        age: parsedAge,
        location: location.trim(),
        bio: bio.trim(),
        interests: interestsArray,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      setErrorMessage(updateError.message || 'Failed to save profile.');
      return;
    }

    router.push('/add-photos');
  } catch (error) {
    console.error('Unexpected profile submission error:', error);
    setErrorMessage('An unexpected error occurred while saving your profile.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <MobilePage>
      <section className="hero">
        <h1>Build your profile</h1>
        <p>Add enough detail so the app feels real during your demo.</p>
      </section>

      <main className="content">
        <form className="card" onSubmit={handleSubmit}>
          <div className="row">
            <div className="field">
              <label className="label" htmlFor="age">Age</label>
              <input id="age" className="input" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="location">Location</label>
              <input id="location" className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label className="label" htmlFor="bio">Bio</label>
            <textarea id="bio" className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label className="label" htmlFor="interests">Interests</label>
            <input id="interests" className="input" value={interests} onChange={(e) => setInterests(e.target.value)} />
          </div>

          {errorMessage && (
            <p style={{ color: '#b00020', marginTop: 14 }}>{errorMessage}</p>
          )}

          <button
            type="submit"
            className="btn"
            style={{
              width: '100%',
              marginTop: 18,
              backgroundColor: isSubmitting ? '#9e9e9e' : '',
              color: isSubmitting ? '#f5f5f5' : '',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving profile...' : 'Save and add photos'}
          </button>

        </form>
      </main>
    </MobilePage>
  );
}
