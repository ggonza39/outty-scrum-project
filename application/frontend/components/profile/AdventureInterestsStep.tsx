"use client";

import { ProfileFormData } from "./ProfileSetupShell";

type Props = {
  formData: ProfileFormData;
  updateField: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => void;
};

const options = [
"Backpacking",
"Ice-Fishing", 
"Bow-Hunting", 
"Fishing", 
"Boating",
"Hiking",
"Skiing",
"Rock-Climbing", 
"Hang-Gliding",
"Kayaking", 
"Camping", 
"Mountain-Biking",
"Trail-Running", 
"Snowmobiling", 
"Wildlife-Photography",
];

export default function AdventureInterestsStep({
  formData,
  updateField,
}: Props) {
  const toggleInterest = (interest: string) => {
    const updated = formData.interests.includes(interest)
      ? formData.interests.filter((item) => item !== interest)
      : [...formData.interests, interest];

    updateField("interests", updated);
  };

  return (
    <div>
      {/* 
        Backend note:
        interests should be stored as structured tags or a normalized relation table.
        These should be used in the matching engine for shared-interest scoring.
      */}
      <div className="pill-group">
        {options.map((interest) => (
          <button
            key={interest}
            type="button"
            className={`pill ${
              formData.interests.includes(interest) ? "selected" : ""
            }`}
            onClick={() => toggleInterest(interest)}
          >
            {interest}
          </button>
        ))}
      </div>
    </div>
  );
}
