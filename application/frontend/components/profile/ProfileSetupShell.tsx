"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BasicInfoStep from "./BasicInfoStep";
import AdventureInterestsStep from "./AdventureInterestsStep";
import PreferencesStep from "./PreferencesStep";
import PhotosStep from "./PhotosStep";
import SocialsStep from "./SocialsStep";
import ProfilePreviewStep from "./ProfilePreviewStep";
import BottomNav from "@/components/BottomNav";

/**
 * MATCHING + PROFILE DATA NOTES FOR BACKEND
 *
 * Frontend collects these fields for matching:
 * - zipCode
 * - distance
 * - interests
 * - partnerPreference
 * - skillLevel
 *
 * Intended backend behavior:
 * 1. Convert zipCode -> latitude/longitude
 * 2. Store coordinates with user profile
 * 3. Use distance as the user's search radius in miles
 * 4. Filter potential matches by:
 *    - distance from ZIP-based coordinates
 *    - shared adventure interests
 *    - compatible skill level
 *    - partner preference
 *
 * Suggested future API endpoints:
 * - POST /api/profile
 * - GET /api/profile/:id
 * - PUT /api/profile/:id
 * - DELETE /api/profile/:id
 * - GET /api/matches
 * - POST /api/swipes
 * - GET /api/messages/:matchId
 */

export type ProfileFormData = {
  displayName: string;
  age: string;
  zipCode: string;
  bio: string;
  interests: string[];
  partnerPreference: string;
  skillLevel: string;
  distance: number;
  photos: string[];
  instagram: string;
  tiktok: string;
  facebook: string;
  linkedin: string;
};

const steps = [
  "About You",
  "Adventure Interests",
  "Preferences",
  "Photos",
  "Socials",
  "Preview",
];

const stepDescriptions = [
  "Share a few basics so people know who you are.",
  "Select the kinds of adventures you enjoy.",
  "Tell us what kind of adventure partner you’re looking for.",
  "Add photos that represent you.",
  "Optionally link your social profiles.",
  "Review your profile before continuing.",
];

const defaultData: ProfileFormData = {
  displayName: "",
  age: "",
  zipCode: "",
  bio: "",
  interests: [],
  partnerPreference: "",
  skillLevel: "",
  distance: 25,
  photos: [],
  instagram: "",
  tiktok: "",
  facebook: "",
  linkedin: "",
};

export default function ProfileSetupShell() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<ProfileFormData>(defaultData);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const back = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const skip = () => {
    if (step === 3 || step === 4) {
      next();
    }
  };

  const saveProfile = () => {
    setIsSaving(true);

    /**
     * Backend note:
     * This is currently frontend-only behavior.
     * Replace localStorage with an API call such as:
     * POST /api/profile or PUT /api/profile/:id
     */
    localStorage.setItem("outty-profile", JSON.stringify(formData));

    /**
     * Backend note:
     * After successful persistence, route user to the matching area.
     * Current frontend route assumption: /match
     */
    router.push("/match");
  };

  const progress = ((step + 1) / steps.length) * 100;

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
        return <PhotosStep formData={formData} updateField={updateField} />;
      case 4:
        return <SocialsStep formData={formData} updateField={updateField} />;
      case 5:
        return <ProfilePreviewStep formData={formData} />;
      default:
        return null;
    }
  };

  const isPreviewStep = step === steps.length - 1;

  return (
    <div className="profile-setup-shell">
      <section className="profile-setup-top">
        <div className="profile-setup-top__inner" />
      </section>

      <section className="profile-setup-content">
        <div className="profile-setup-card">
          <div className="progress-header">
            <p className="step-count">
              Step {step + 1} of {steps.length}
            </p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <h2 className="step-title">{steps[step]}</h2>
            <p className="step-description">{stepDescriptions[step]}</p>
          </div>

          <div className="profile-step-content">{renderStep()}</div>

          <div className="profile-step-actions">
            <div className="profile-step-actions__left">
              {step > 0 && (
                <button className="secondary-btn" onClick={back} type="button">
                  Back
                </button>
              )}
            </div>

            <div className="profile-step-actions__right">
              {!isPreviewStep && (step === 3 || step === 4) && (
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
                  {isSaving ? "Saving..." : "Save Profile"}
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
