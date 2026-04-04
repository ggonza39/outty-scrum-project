"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BasicInfoStep from "./BasicInfoStep";
import AdventureInterestsStep from "./AdventureInterestsStep";
import PreferencesStep from "./PreferencesStep";
import SocialsStep from "./SocialsStep";
import ProfilePreviewStep from "./ProfilePreviewStep";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

export type ProfileFormData = {
  mainPhoto: string | null;
  displayName: string;
  age: string;
  zipCode: string;
  bio: string;
  gender: string;
  interests: string[];
  partnerPreference: string;
  skillLevel: string;
  distance: number;
  instagram: string;
  tiktok: string;
  facebook: string;
  linkedin: string;
};

type ProfileSetupShellProps = {
  isEditMode?: boolean;
  onCancelEdit?: () => void;
  onSaveComplete?: () => void;
};

const steps = [
  "About You",
  "Adventure Interests",
  "Preferences",
  "Socials",
  "Preview",
];

const stepDescriptions = [
  "Share a few basics so people know who you are.",
  "Select the kinds of adventures you enjoy.",
  "Tell us what kind of adventure partner you’re looking for.",
  "Optionally link your social profiles.",
  "Review your profile before continuing.",
];

const defaultData: ProfileFormData = {
  mainPhoto: null,
  displayName: "",
  age: "",
  zipCode: "",
  bio: "",
  gender: "",
  interests: [],
  partnerPreference: "",
  skillLevel: "",
  distance: 25,
  instagram: "",
  tiktok: "",
  facebook: "",
  linkedin: "",
};

export function validateBasicInfo(data: ProfileFormData): string | null {
  if (!data.displayName || data.displayName.trim().length < 1 || data.displayName.trim().length > 17) {
    return "Please enter a name between 1 and 17 letters";
  }

  if (!data.age || !data.age.trim()) {
    return "Please enter an age.";
  }

  const ageNumber = Number(data.age);

  if (!Number.isInteger(ageNumber) || ageNumber < 18 || ageNumber > 150) {
    return "Please enter an age between 18 and 150, to the nearest year.";
  }

  if (!/^\d{5}$/.test(data.zipCode)) {
    return "Please enter a valid ZIP code.";
  }

  if (!data.gender || !data.gender.trim()) {
    return "Please select a gender.";
  }

  return null;
}

export function validateInterests(data: ProfileFormData): string | null {
  if (!data.interests || data.interests.length === 0) {
    return "Please select at least one interest.";
  }

  return null;
}

export function validatePreferences(data: ProfileFormData): string | null {
  if (!data.partnerPreference) {
    return "Please select a partner preference.";
  }

  if (!data.skillLevel) {
    return "Please select a skill level.";
  }

  return null;
}

export default function ProfileSetupShell({
  isEditMode = false,
  onCancelEdit,
  onSaveComplete,
}: ProfileSetupShellProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<ProfileFormData>(defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          setIsLoadingProfile(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          setIsLoadingProfile(false);
          return;
        }

        if (data) {
          setFormData({
            mainPhoto: null,
            displayName: data.display_name || "",
            age: data.age ? String(data.age) : "",
            zipCode: data.zip_code || "",
            bio: data.bio || "",
            gender: data.gender || "",
            interests: data.interests || [],
            partnerPreference: data.partner_preference || "",
            skillLevel: data.skill_level || "",
            distance: data.distance || 25,
            instagram: data.instagram || "",
            tiktok: data.tiktok || "",
            facebook: data.facebook || "",
            linkedin: data.linkedin || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const updateField = <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    if (step === 0) {
      const error = validateBasicInfo(formData);

      if (error) {
        setErrorMessage(error);
        return;
      }
    }

    if (step === 1) {
      const error = validateInterests(formData);

      if (error) {
        setErrorMessage(error);
        return;
      }
    }

    if (step === 2) {
      const error = validatePreferences(formData);

      if (error) {
        setErrorMessage(error);
        return;
      }
    }

    setErrorMessage("");
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const back = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const skip = () => {
    next();
  };

  const saveProfile = async () => {
    setIsSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("No authenticated user found.");

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: formData.displayName || null,
        age: formData.age ? Number(formData.age) : null,
        zip_code: formData.zipCode || null,
        bio: formData.bio || null,
        gender: formData.gender || null,
        interests: formData.interests,
        partner_preference: formData.partnerPreference || null,
        skill_level: formData.skillLevel || null,
        distance: formData.distance ?? null,
        instagram: formData.instagram || null,
        tiktok: formData.tiktok || null,
        facebook: formData.facebook || null,
        linkedin: formData.linkedin || null,
      });

      if (profileError) throw profileError;

      alert("Profile saved successfully.");

      if (isEditMode && onSaveComplete) {
        onSaveComplete();
        return;
      }

      router.push("/discover");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("There was a problem saving your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProfile = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("No authenticated user found.");

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (error) throw error;

      const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });

      if (signOutError) throw signOutError;

      setFormData(defaultData);
      setStep(0);
      alert("Your profile has been deleted.");
      router.replace("/signin");
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("There was a problem deleting your profile.");
    }
  };

  const progress = ((step + 1) / steps.length) * 100;
  const isPreviewStep = step === steps.length - 1;

  const renderStep = () => {
    switch (step) {
      case 0:
        return <BasicInfoStep formData={formData} updateField={updateField} />;
      case 1:
        return (
          <AdventureInterestsStep
            formData={formData}
            updateField={updateField}
          />
        );
      case 2:
        return <PreferencesStep formData={formData} updateField={updateField} />;
      case 3:
        return <SocialsStep formData={formData} updateField={updateField} />;
      case 4:
        return (
          <ProfilePreviewStep
            formData={formData}
            onDeleteProfile={deleteProfile}
          />
        );
      default:
        return null;
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="profile-setup-shell">
        <section className="profile-setup-content">
          <div className="profile-setup-card">
            <p>Loading profile...</p>
          </div>
        </section>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="profile-setup-shell">
      <section className="profile-setup-top">
        <div className="profile-setup-top__inner" />
      </section>

      <section className="profile-setup-content">
        <div className="profile-setup-card">
          <div className="progress-header">
            {!isEditMode && (
              <>
                <p className="step-count">
                  Step {step + 1} of {steps.length}
                </p>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            )}

            <h2 className="step-title">
              {isEditMode ? "Edit Profile" : steps[step]}
            </h2>

            <p className="step-description">
              {isEditMode
                ? "Update your profile information."
                : stepDescriptions[step]}
            </p>
          </div>

          <div className="profile-step-content">{renderStep()}</div>

          {errorMessage && (
            <p style={{ color: "#b00020", marginTop: 10 }}>{errorMessage}</p>
          )}

          <div className="profile-step-actions">
            <div className="profile-step-actions__left">
              {isEditMode && step === 0 && onCancelEdit && (
                <button className="secondary-btn" onClick={onCancelEdit} type="button">
                  Cancel
                </button>
              )}

              {step > 0 && (
                <button className="secondary-btn" onClick={back} type="button">
                  Back
                </button>
              )}
            </div>

            <div className="profile-step-actions__right">
              {step === 3 && (
                <button className="ghost-btn" onClick={skip} type="button">
                  Skip
                </button>
              )}

              {!isPreviewStep && (
                <button className="primary-btn" onClick={next} type="button">
                  Continue
                </button>
              )}

              {isPreviewStep && (
                <button
                  className="primary-btn"
                  onClick={saveProfile}
                  type="button"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : isEditMode ? "Save Changes" : "Save Profile"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
