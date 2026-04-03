'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MobilePage from '@/components/MobilePage';
import ProfilePreviewStep from '@/components/profile/ProfilePreviewStep';
import ProfileSetupShell, { ProfileFormData } from '@/components/profile/ProfileSetupShell';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileFormData | null>(null);

  const loadProfile = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.replace('/signin');
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !data) {
      setIsCheckingAuth(false);
      return;
    }

    setProfile({
      mainPhoto: null,
      displayName: data.display_name || '',
      age: data.age ? String(data.age) : '',
      zipCode: data.zip_code || '',
      bio: data.bio || '',
      gender: data.gender || '',
      interests: data.interests || [],
      partnerPreference: data.partner_preference || '',
      skillLevel: data.skill_level || '',
      distance: data.distance || 25,
      instagram: data.instagram || '',
      tiktok: data.tiktok || '',
      facebook: data.facebook || '',
      linkedin: data.linkedin || '',
    });

    setIsCheckingAuth(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (isCheckingAuth) {
    return (
      <MobilePage>
        <main style={{ padding: '24px' }}>
          <p>Loading...</p>
        </main>
      </MobilePage>
    );
  }

  if (!profile) {
    return (
      <MobilePage>
        <main style={{ padding: '24px' }}>
          <p>No profile found.</p>
        </main>
      </MobilePage>
    );
  }

  return (
    <MobilePage>
      <main style={{ padding: '24px' }}>
        {!isEditing && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <button
                type="button"
                className="primary-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>

            <ProfilePreviewStep
              formData={profile}
              onDeleteProfile={async () => {
                const {
                  data: { user },
                  error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                  router.replace('/signin');
                  return;
                }

                const { error } = await supabase
                  .from('profiles')
                  .delete()
                  .eq('id', user.id);

                if (error) {
                  alert('There was a problem deleting your profile.');
                  return;
                }

                await supabase.auth.signOut({ scope: 'local' });
                alert('Your profile has been deleted.');
                router.replace('/signin');
              }}
            />
          </>
        )}

        {isEditing && (
          <ProfileSetupShell
            isEditMode={true}
            onCancelEdit={() => setIsEditing(false)}
            onSaveComplete={async () => {
              await loadProfile();
              setIsEditing(false);
            }}
          />
        )}
      </main>
    </MobilePage>
  );
}
