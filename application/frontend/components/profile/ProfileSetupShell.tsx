"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BasicInfoStep from "./BasicInfoStep";
import AdventureInterestsStep from "./AdventureInterestsStep";
import PreferencesStep from "./PreferencesStep";
import SocialsStep from "./SocialsStep";
import ProfilePreviewStep from "./ProfilePreviewStep";
import BottomNav from "@/components/BottomNav";

export type ProfileFormData = {
  mainPhoto: string | null;
  displayName: string;
  age: string;
  zipCode: string;
  bio: string;
  interests: string[];
  partnerPreference: string;
  skillLevel: string;
  distance: number;
  instagram: string;
  tiktok: string;
  facebook: string;
  linkedin: string;
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
  interests: [],
  partnerPreference: "",
  skillLevel: "",
  distance: 25,
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
    next();
  };

  const saveProfile = () => {
    setIsSaving(true);
    localStorage.setItem("outty-profile", JSON.stringify(formData));
    router.push("/match");
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
        return <ProfilePreviewStep formData={formData} />;
      default:
        return null;
    }
  };

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
