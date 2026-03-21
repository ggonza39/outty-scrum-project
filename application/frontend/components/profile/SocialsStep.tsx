"use client";

import { ProfileFormData } from "./ProfileSetupShell";

type Props = {
  formData: ProfileFormData;
  updateField: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => void;
};

export default function SocialsStep({ formData, updateField }: Props) {
  return (
    <div className="step-grid">
      {/* 
        Backend note:
        These are currently simple profile links / usernames.
        Future versions could support OAuth-based social account linking.
      */}
      <label>
        Instagram
        <input
          type="text"
          value={formData.instagram}
          onChange={(e) => updateField("instagram", e.target.value)}
          placeholder="@username or full URL"
        />
      </label>

      <label>
        TikTok
        <input
          type="text"
          value={formData.tiktok}
          onChange={(e) => updateField("tiktok", e.target.value)}
          placeholder="@username or full URL"
        />
      </label>

      <label>
        Facebook
        <input
          type="text"
          value={formData.facebook}
          onChange={(e) => updateField("facebook", e.target.value)}
          placeholder="Profile URL"
        />
      </label>

      <label>
        LinkedIn
        <input
          type="text"
          value={formData.linkedin}
          onChange={(e) => updateField("linkedin", e.target.value)}
          placeholder="Profile URL"
        />
      </label>
    </div>
  );
}
