"use client";

import ProfilePhotoUploader from "./ProfilePhotoUploader";
import { ProfileFormData } from "./ProfileSetupShell";

type Props = {
  formData: ProfileFormData;
  updateField: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => void;
};

export default function BasicInfoStep({ formData, updateField }: Props) {
  return (
    <div className="step-grid">
      <div className="full-width photo-section">
        <ProfilePhotoUploader
          mainPhoto={formData.mainPhoto}
          updateField={updateField}
        />
      </div>

      <label>
        Display Name
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => updateField("displayName", e.target.value)}
          placeholder="Enter your display name"
        />
      </label>

      <label>
        Age
        <input
          type="text"
          value={formData.age}
          onChange={(e) => updateField("age", e.target.value)}
          placeholder="Enter your age"
        />
      </label>

      <label>
        ZIP Code
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          value={formData.zipCode}
          onChange={(e) =>
            updateField("zipCode", e.target.value.replace(/\D/g, "").slice(0, 5))
          }
          placeholder="Enter your ZIP code"
        />
      </label>

      <div className="full-width">
        <label>Gender</label>

        <div className="pill-group">
          {["Female", "Male"].map((option) => (
            <button
              key={option}
              type="button"
              className={`pill ${formData.gender === option ? "selected" : ""}`}
              onClick={() => updateField("gender", option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <label className="full-width">
        Bio
        <textarea
          value={formData.bio}
          onChange={(e) => updateField("bio", e.target.value)}
          placeholder="Tell people a little about yourself and your adventure style"
          rows={5}
        />
      </label>
    </div>
  );
}
