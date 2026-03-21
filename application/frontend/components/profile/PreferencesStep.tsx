"use client";

import { ProfileFormData } from "./ProfileSetupShell";

type Props = {
  formData: ProfileFormData;
  updateField: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => void;
};

const partnerOptions = ["Male", "Female", "No Preference"];
const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function PreferencesStep({ formData, updateField }: Props) {
  return (
    <div className="step-grid">
      <div className="full-width">
        <label>Looking for an adventure partner that is</label>

        {/* 
          Backend note:
          partnerPreference should be used as a filter in candidate generation.
          This may later map to gender identity / preference fields in a fuller data model.
        */}
        <div className="pill-group">
          {partnerOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`pill ${
                formData.partnerPreference === option ? "selected" : ""
              }`}
              onClick={() => updateField("partnerPreference", option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <label className="full-width">
        Distance from your ZIP code ({formData.distance} miles)

        {/* 
          Backend note:
          distance is the user's maximum search radius in miles.
          Matching engine should only return candidates within this radius
          based on ZIP-derived coordinates.
        */}
        <input
          type="range"
          min={5}
          max={200}
          step={5}
          value={formData.distance}
          onChange={(e) => updateField("distance", Number(e.target.value))}
        />
      </label>

      <div className="full-width">
        <label>Skill level</label>

        {/* 
          Backend note:
          skillLevel should be used for compatibility scoring or filtering.
          Example:
          - exact match
          - +/- 1 level
          - weighted relevance
        */}
        <div className="pill-group">
          {skillLevels.map((level) => (
            <button
              key={level}
              type="button"
              className={`pill ${
                formData.skillLevel === level ? "selected" : ""
              }`}
              onClick={() => updateField("skillLevel", level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
