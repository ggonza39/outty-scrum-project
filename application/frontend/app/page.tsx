'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MobilePage from '@/components/MobilePage';
import { supabase } from '@/lib/supabase';

export default function HomePage() {

  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteProfile = async () => {
    setDeleteError('');

    try {
      setIsDeleting(true);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session retrieval error:', sessionError);
        setDeleteError('Unable to verify your session. Please sign in again.');
        return;
      }

      const session = sessionData.session;

      if (!session) {
        setDeleteError('You must be signed in to delete your profile.');
        return;
      }

      const response = await fetch('/api/delete-profile', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Delete profile route error:', result);
        setDeleteError(result.error || 'Failed to delete profile.');
        return;
      }

      await supabase.auth.signOut({ scope: 'local' });
      router.push('/signin');
    } catch (error) {
      console.error('Unexpected delete profile error:', error);
      setDeleteError('An unexpected error occurred while deleting your profile.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MobilePage>
      <section className="hero">
        <h1>Meet new people without the messy prototype issues.</h1>
        <p>
          This version is responsive, scrollable, and interactive so you can demo it like a real mobile app.
        </p>
      </section>

      <main className="content">
        <section className="card">
          <h2 className="section-title">What changed</h2>
          <div className="chips">
            <span className="chip">Responsive layout</span>
            <span className="chip">Working navigation</span>
            <span className="chip">Scrollable pages</span>
            <span className="chip">Interactive inputs</span>
          </div>
        </section>

        <section className="card">
          <h2 className="section-title">Start here</h2>
          <p className="subtle">Use the buttons below to test the main flows.</p>
          <div className="row">
            <Link href="/signin" className="btn center">
              Sign in
            </Link>
            <Link href="/signup" className="btn-secondary center">
              Create account
            </Link>
          </div>
        </section>

        <section className="card">
          <h2 className="section-title">Quick demo flow</h2>
          <ol className="subtle" style={{ paddingLeft: 20, margin: 0 }}>
            <li>Open Sign up and enter profile details.</li>
            <li>Add photos and continue to matching.</li>
            <li>Like a profile and review matches.</li>
            <li>Send a test message in chat.</li>
          </ol>
        </section>
        
        {/* BEGIN TEMPORARY DELETE PROFILE SECTION */}
        <section className="card">
          <h2 className="section-title">Delete profile</h2>
          <p className="subtle">
            This temporary section allows you to remove your profile during backend testing.
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleDeleteProfile}
            disabled={isDeleting}
            style={{
              width: '100%',
              marginTop: 12,
              backgroundColor: '#f8d7da',
              color: '#842029',
              border: '1px solid #f1aeb5',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.7 : 1,
            }}
          >
            {isDeleting ? 'Deleting profile...' : 'Delete profile'}
          </button>

          {deleteError && (
            <p style={{ color: '#b00020', marginTop: 12 }}>{deleteError}</p>
          )}
        </section>
        {/* END TEMPORARY DELETE PROFILE SECTION */}

      </main>
    </MobilePage>
  );
}
