'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import MobilePage from '@/components/MobilePage';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [age, setAge] = useState('28');
  const [location, setLocation] = useState('Madison, WI');
  const [bio, setBio] = useState('UX designer who loves coffee, road trips, and trying new brunch spots.');
  const [interests, setInterests] = useState('Design systems, live music, hiking');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push('/add-photos');
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

          <button type="submit" className="btn" style={{ width: '100%', marginTop: 18 }}>
            Save and add photos
          </button>
        </form>
      </main>
    </MobilePage>
  );
}
