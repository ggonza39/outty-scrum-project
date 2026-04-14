"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
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

type StatusType = "success" | "error" | "info";

export const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return "Only .jpg, .png, and .webp files are allowed.";
    }

    if (file.size > MAX_FILE_SIZE) {
        return "File too large. Maximum size is 5MB.";
    }

    return null;
};

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
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<StatusType>("info");
  const [previewFailed, setPreviewFailed] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const objectUrlRef = useRef<string | null>(null);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
    };
  }, []);

  const showStatus = (message: string, type: StatusType) => {
    setStatusMessage(message);
    setStatusType(type);

    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
    }

    statusTimerRef.current = setTimeout(() => {
      setStatusMessage("");
    }, 2500);
  };

  //const validateFile = (file: File) => {
  //  if (!ALLOWED_TYPES.includes(file.type)) {
  //    return "Only .jpg, .png, and .webp files are allowed.";
  //  }

  //  if (file.size > MAX_FILE_SIZE) {
  //    return "File too large. Maximum size is 5MB.";
  //  }

  //  return null;
  //};

  const clearPreviewObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");
    setPreviewFailed(false);

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

      const { error: storageError } = await supabase.storage
        .from("profile-galleries")
        .upload(filePath, file, {
          upsert: false,
        });

      if (storageError) throw storageError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-galleries").getPublicUrl(filePath);

      if (publicUrl) {
        updateField("mainPhoto", publicUrl as ProfileFormData["mainPhoto"]);
        setGalleryImages((prev) => [publicUrl, ...prev]);
      }

      clearPreviewObjectUrl();
      setSelectedFile(null);
      setUploadSuccess("Photo uploaded successfully.");
      setLastFailedFile(null);
      showStatus("Photo uploaded successfully.", "success");
    } catch (error) {
      console.error("Photo upload failed:", error);
      setUploadError("Upload failed. Please try again.");
      setLastFailedFile(file);
      setPreviewFailed(true);
      showStatus("Upload failed. Please try again.", "error");
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
      setPreviewFailed(false);
      clearPreviewObjectUrl();
      updateField("mainPhoto", null);
      showStatus(validationError, "error");
      return;
    }

    clearPreviewObjectUrl();

    const localPreviewUrl = URL.createObjectURL(file);
    objectUrlRef.current = localPreviewUrl;

    setSelectedFile(file);
    setLastFailedFile(null);
    setPreviewFailed(false);
    setUploadError("");
    setUploadSuccess("");

    updateField("mainPhoto", localPreviewUrl as ProfileFormData["mainPhoto"]);
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
    setPreviewFailed(false);
    clearPreviewObjectUrl();
    updateField("mainPhoto", null);
  };

  const previewContainerStyle =
    previewMode === "square"
      ? {
          width: 180,
          height: 180,
          borderRadius: 24,
          overflow: "hidden" as const,
          background: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative" as const,
        }
      : {
          position: "relative" as const,
        };

  return (
    <div>
      <span className="field-label">Profile Photo</span>

      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            marginTop: 12,
            marginBottom: 12,
            padding: "10px 14px",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: "0.95rem",
            backgroundColor:
              statusType === "success"
                ? "#dcfce7"
                : statusType === "error"
                ? "#fee2e2"
                : "#e0f2fe",
            color:
              statusType === "success"
                ? "#166534"
                : statusType === "error"
                ? "#991b1b"
                : "#075985",
          }}
        >
          {statusMessage}
        </div>
      )}

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
          style={previewContainerStyle}
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

          {previewFailed && !isUploading && mainPhoto && (
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: "#b00020",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.95rem",
              }}
              title="Upload failed"
              aria-label="Upload failed"
            >
              !
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

      {galleryImages.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <p
            style={{
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Uploaded Photos
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            {galleryImages.map((imageUrl) => (
              <div
                key={imageUrl}
                style={{
                  aspectRatio: "1 / 1",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#f3f4f6",
                }}
              >
                <img
                  src={imageUrl}
                  alt="Uploaded gallery preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
