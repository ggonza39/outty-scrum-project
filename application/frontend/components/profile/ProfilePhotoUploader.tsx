"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProfileFormData } from "@/components/profile/ProfileSetupShell";

type Props = {
  mainPhoto: string | null;
  updateField: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProfilePhotoUploader({
  mainPhoto,
  updateField,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState<"circle" | "square">("circle");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [lastFailedFile, setLastFailedFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    if (!previewUrl) return;

    updateField("mainPhoto", previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, updateField]);

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only .jpg, .png, and .webp files are allowed.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File too large. Maximum size is 5MB.";
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("You must be signed in to upload a photo.");

      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-galleries")
        .upload(filePath, file, {
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadSuccess("Photo uploaded successfully.");
      setLastFailedFile(null);
    } catch (error) {
      console.error("Photo upload failed:", error);
      setUploadError("Upload failed. Please try again.");
      setLastFailedFile(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);

    if (validationError) {
      setUploadError(validationError);
      setUploadSuccess("");
      setSelectedFile(null);
      updateField("mainPhoto", null);
      return;
    }

    setSelectedFile(file);
    setLastFailedFile(null);
    await uploadFile(file);
  };

  const handleRetry = async () => {
    if (!lastFailedFile) return;
    await uploadFile(lastFailedFile);
  };

  const handleChooseDifferentPhoto = () => {
    setSelectedFile(null);
    setUploadError("");
    setUploadSuccess("");
    setLastFailedFile(null);
    updateField("mainPhoto", null);
  };

  return (
    <div>
      <span className="field-label">Profile Photo</span>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginTop: 12,
          marginBottom: 16,
        }}
      >
        <button
          type="button"
          className={`pill ${previewMode === "circle" ? "selected" : ""}`}
          onClick={() => setPreviewMode("circle")}
        >
          Circular View
        </button>

        <button
          type="button"
          className={`pill ${previewMode === "square" ? "selected" : ""}`}
          onClick={() => setPreviewMode("square")}
        >
          Square View
        </button>
      </div>

      <div className="avatar-upload">
        <div
          className={previewMode === "circle" ? "avatar-circle" : ""}
          style={
            previewMode === "square"
              ? {
                  width: 180,
                  height: 180,
                  borderRadius: 24,
                  overflow: "hidden",
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }
              : { position: "relative" }
          }
        >
          {mainPhoto ? (
            <img
              src={mainPhoto}
              alt="Profile preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div className="avatar-placeholder">
              <div className="avatar-head" />
              <div className="avatar-body" />
            </div>
          )}

          {isUploading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                textAlign: "center",
                padding: 12,
              }}
            >
              Uploading...
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
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
        />
      </div>

      {uploadError && (
        <div style={{ marginTop: 12 }}>
          <p style={{ color: "#b00020", marginBottom: 8 }}>{uploadError}</p>

          {lastFailedFile && (
            <button
              type="button"
              className="secondary-btn"
              onClick={handleRetry}
            >
              Retry Upload
            </button>
          )}
        </div>
      )}

      {uploadSuccess && (
        <p style={{ color: "#166534", marginTop: 12 }}>{uploadSuccess}</p>
      )}

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          className="ghost-btn"
          onClick={handleChooseDifferentPhoto}
        >
          Choose Different Photo
        </button>
      </div>
    </div>
  );
}
