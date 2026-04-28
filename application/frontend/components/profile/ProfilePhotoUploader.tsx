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

type GalleryImage = {
  id: number;
  public_url: string;
  storage_path: string;
  is_primary: boolean;
};

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
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  // Tracks the selected gallery photo for delete confirmation.
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);

  // Controls the delete confirmation modal.
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) return;

        // Include storage_path so deleted photos can also be removed from storage.
        const { data, error } = await supabase
          .from("photos")
          .select("id, public_url, storage_path, is_primary")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setGalleryImages(data ?? []);
      } catch (error) {
        console.error("Failed to load gallery images:", error);
      }
    };

    loadGalleryImages();
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

      if (!publicUrl) {
        throw new Error("Unable to generate public URL for uploaded photo.");
      }

      const { data: insertedPhoto, error: photoInsertError } = await supabase
        .from("photos")
        .insert({
          profile_id: user.id,
          storage_path: filePath,
          public_url: publicUrl,
          is_primary: false,
        })
        .select("id")
        .single();

      if (photoInsertError) {
        throw photoInsertError;
      }

      const { error: primaryPhotoError } = await supabase.rpc(
        "set_primary_photo",
        {
          target_photo_id: insertedPhoto.id,
          target_profile_id: user.id,
        }
      );

      if (primaryPhotoError) {
        throw primaryPhotoError;
      }

      updateField("mainPhoto", publicUrl as ProfileFormData["mainPhoto"]);

      setGalleryImages((prev) => [
        {
          id: insertedPhoto.id,
          public_url: publicUrl,
          storage_path: filePath,
          is_primary: true,
        },
        ...prev.map((image) => ({
          ...image,
          is_primary: false,
        })),
      ]);

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

  const handleDeletePhoto = async () => {
    if (selectedPhotoId === null) return;
  
    const photoToDelete = galleryImages.find(
      (image) => image.id === selectedPhotoId
    );
  
    if (!photoToDelete) return;
  
    try {
      setUploadError("");
      setUploadSuccess("");
  
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
  
      if (userError) throw userError;
  
      if (!user) {
        throw new Error("You must be signed in to delete a photo.");
      }
  
      // Delete the photo record from the photos table.
      const { error: deleteError } = await supabase
        .from("photos")
        .delete()
        .eq("id", selectedPhotoId)
        .eq("profile_id", user.id);
  
      if (deleteError) throw deleteError;
  
      // Try to remove the file from Supabase Storage.
      // If storage deletion fails, do not block the UI/database delete.
      if (photoToDelete.storage_path) {
        const { error: storageDeleteError } = await supabase.storage
          .from("profile-galleries")
          .remove([photoToDelete.storage_path]);
  
        if (storageDeleteError) {
          console.error("Storage delete failed:", storageDeleteError);
        }
      }
  
      setGalleryImages((prev) =>
        prev.filter((image) => image.id !== selectedPhotoId)
      );
  
      if (mainPhoto === photoToDelete.public_url) {
        updateField("mainPhoto", null);
      }
  
      setSelectedPhotoId(null);
      setShowDeleteConfirm(false);
      showStatus("Photo deleted successfully.", "success");
    } catch (error) {
      console.error("Failed to delete photo:", error);
      showStatus("Failed to delete photo. Please try again.", "error");
    }
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
            {galleryImages.map((image) => {
              const isSelected = mainPhoto === image.public_url;
              const isMarkedForDelete = selectedPhotoId === image.id;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={async () => {
                    try {
                      setSelectedPhotoId(image.id);
                      setUploadError("");
                      setUploadSuccess("");
                      setPreviewFailed(false);

                      const {
                        data: { user },
                        error: userError,
                      } = await supabase.auth.getUser();

                      if (userError) throw userError;

                      if (!user) {
                        throw new Error(
                          "You must be signed in to select a profile photo."
                        );
                      }

                      const { error: primaryPhotoError } = await supabase.rpc(
                        "set_primary_photo",
                        {
                          target_photo_id: image.id,
                          target_profile_id: user.id,
                        }
                      );

                      if (primaryPhotoError) {
                        throw primaryPhotoError;
                      }

                      updateField(
                        "mainPhoto",
                        image.public_url as ProfileFormData["mainPhoto"]
                      );

                      setGalleryImages((prev) =>
                        prev.map((galleryImage) => ({
                          ...galleryImage,
                          is_primary: galleryImage.id === image.id,
                        }))
                      );

                      showStatus("Profile photo selected.", "success");
                    } catch (error) {
                      console.error("Failed to select primary photo:", error);
                      setUploadError(
                        "Failed to update profile photo. Please try again."
                      );
                      showStatus(
                        "Failed to update profile photo. Please try again.",
                        "error"
                      );
                    }
                  }}
                  style={{
                    aspectRatio: "1 / 1",
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "#f3f4f6",
                    border: isMarkedForDelete
                      ? "3px solid #d90429"
                      : isSelected
                      ? "3px solid #f5b22d"
                      : "2px solid transparent",
                    padding: 0,
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <img
                    src={image.public_url}
                    alt="Uploaded gallery preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  {isMarkedForDelete && (
                    <span
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowDeleteConfirm(true);
                      }}
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "#d90429",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "1rem",
                      }}
                      title="Delete photo"
                      aria-label="Delete photo"
                    >
                      ×
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete photo"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 320,
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              textAlign: "center",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.18)",
            }}
          >
            <p style={{ fontWeight: 800, marginBottom: 8 }}>
              Delete this photo?
            </p>

            <p style={{ color: "#666", marginBottom: 18 }}>
              This will remove the photo from your gallery.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedPhotoId(null);
                }}
                style={{ flex: 1 }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeletePhoto}
                style={{
                  flex: 1,
                  border: "none",
                  borderRadius: 999,
                  padding: "12px 16px",
                  background: "#d90429",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
