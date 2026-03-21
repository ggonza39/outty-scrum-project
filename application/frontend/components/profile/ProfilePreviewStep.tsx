"use client";

import { ProfileFormData } from "./ProfileSetupShell";

type Props = {
  formData: ProfileFormData;
};

export default function ProfilePreviewStep({ formData }: Props) {
  return (
    <div className="preview-card">
      {formData.mainPhoto ? (
        <img
          className="preview-hero-image"
          src={formData.mainPhoto}
          alt="Profile preview"
        />
      ) : (
        <div className="preview-hero-placeholder">
          No profile photo added yet
        </div>
      )}

      <h2>
        {formData.displayName || "Your Name"}
        {formData.age ? `, ${formData.age}` : ""}
      </h2>

      <p>{formData.zipCode ? `ZIP Code: ${formData.zipCode}` : "Your ZIP code"}</p>

      <section>
        <h3>About</h3>
        <p>{formData.bio || "Your bio will appear here."}</p>
      </section>

      <section>
        <h3>Adventure Interests</h3>
        <p>
          {formData.interests.length
            ? formData.interests.join(", ")
            : "No interests selected yet."}
        </p>
      </section>

      <section>
        <h3>Preferences</h3>
        <p>
          <strong>Looking For:</strong>{" "}
          {formData.partnerPreference || "Not selected"}
        </p>
        <p>
          <strong>Skill Level:</strong> {formData.skillLevel || "Not selected"}
        </p>
        <p>
          <strong>Distance:</strong> {formData.distance} miles from ZIP code
        </p>
      </section>

      <section>
        <h3>Socials</h3>
        <p>{formData.instagram || "Instagram not added"}</p>
        <p>{formData.tiktok || "TikTok not added"}</p>
        <p>{formData.facebook || "Facebook not added"}</p>
        <p>{formData.linkedin || "LinkedIn not added"}</p>
      </section>
    </div>
  );
}
