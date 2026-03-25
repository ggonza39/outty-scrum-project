"use client";

import { useState } from "react";
import { ProfileFormData } from "./ProfileSetupShell";

type Props = {
  formData: ProfileFormData;
  onDeleteProfile: () => void;
};

export default function ProfilePreviewStep({
  formData,
  onDeleteProfile,
}: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
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

        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            border: "1px solid #c62828",
            backgroundColor: "#fff5f5",
            color: "#c62828",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Delete Profile
        </button>
      </div>

      {showDeleteConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "360px",
              backgroundColor: "#fff",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "12px" }}>
              Delete profile?
            </h3>

            <p style={{ marginBottom: "20px", color: "#555" }}>
              Are you sure you want to delete your profile? This action cannot be undone.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDeleteProfile();
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#c62828",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
