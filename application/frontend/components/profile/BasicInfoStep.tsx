"use client";

import { ChangeEvent } from "react";
import { ProfileFormData } from "./ProfileSetupShell";

type Props = {
  formData: ProfileFormData;
  updateField: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => void;
};

export default function BasicInfoStep({ formData, updateField }: Props) {
  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    updateField("mainPhoto", previewUrl as ProfileFormData["mainPhoto"]);
  }

  return (
    <div className="step-grid">
      <div className="full-width photo-section">
        <span className="field-label">Profile Photo</span>

        <div className="avatar-upload">
          <div className="avatar-circle">
            {formData.mainPhoto ? (
              <img src={formData.mainPhoto} alt="Profile preview" />
            ) : (
              <div className="avatar-placeholder">
                <div className="avatar-head" />
                <div className="avatar-body" />
              </div>
            )}
          </div>

          <label htmlFor="main-profile-photo" className="avatar-plus">
            +
          </label>

          <input
            id="main-profile-photo"
            className="hidden-input"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>
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

      <label>
        Gender
        <input
          type="text"
          value={formData.gender}
          onChange={(e) => updateField("gender", e.target.value)}
          placeholder="Enter your gender"
        />
      </label>

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
