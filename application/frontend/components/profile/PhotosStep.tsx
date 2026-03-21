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

export default function PhotosStep({ formData, updateField }: Props) {
  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    updateField("photos", [...formData.photos, ...imageUrls]);
  };

  const removePhoto = (index: number) => {
    const updated = formData.photos.filter((_, i) => i !== index);
    updateField("photos", updated);
  };

  return (
    <div>
      {/* 
        Backend note:
        Frontend currently uses local preview URLs only.
        Real implementation should upload files to storage and persist returned image URLs.
      */}
      <label className="upload-box">
        <span>Choose Photos</span>
        <input type="file" accept="image/*" multiple onChange={handleFiles} />
      </label>

      <div className="photo-grid">
        {formData.photos.map((photo, index) => (
          <div className="photo-card" key={`${photo}-${index}`}>
            <img src={photo} alt={`Profile upload ${index + 1}`} />
            <button
              type="button"
              className="remove-photo-btn"
              onClick={() => removePhoto(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
