"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobilePage from "@/components/MobilePage";

type ExplorerProfile = {
  id: string;
  username: string;
  name: string;
  age: number;
  image: string;
  bio: string;
  tags: string[];
};

type Props = {
  profileId: string;
};

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let successful = false;

  try {
    successful = document.execCommand("copy");
  } catch {
    successful = false;
  }

  document.body.removeChild(textArea);
  return successful;
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  return fallbackCopyTextToClipboard(text);
}

export default function ExplorerProfileClient({ profileId }: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState<ExplorerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareMessage, setShareMessage] = useState("");
  const [shareType, setShareType] = useState<"success" | "error">("success");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/discover/${profileId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          setProfile(null);
          setIsLoading(false);
          return;
        }

        const data: ExplorerProfile = await response.json();
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [profileId]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/discover");
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      const copied = await copyToClipboard(url);

      if (!copied) {
        throw new Error("Copy failed");
      }

      setShareType("success");
      setShareMessage("Profile link copied.");
    } catch {
      setShareType("error");
      setShareMessage("Unable to copy profile link.");
    }

    setTimeout(() => {
      setShareMessage("");
    }, 2000);
  };

  if (isLoading) {
    return (
      <MobilePage>
        <main className="content">
          <section className="card" style={{ padding: 16 }}>
            <style>{`
              @keyframes shimmer {
                0% { background-position: -400px 0; }
                100% { background-position: 400px 0; }
              }
              .shimmer {
                background: linear-gradient(
                  90deg,
                  #f3f4f6 25%,
                  #e5e7eb 50%,
                  #f3f4f6 75%
                );
                background-size: 800px 100%;
                animation: shimmer 1.3s infinite linear;
              }
            `}</style>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                className="shimmer"
                style={{
                  width: 90,
                  height: 40,
                  borderRadius: 999,
                }}
              />
              <div
                className="shimmer"
                style={{
                  width: 140,
                  height: 40,
                  borderRadius: 999,
                }}
              />
            </div>

            <div className="center" style={{ flexDirection: "column", gap: 16 }}>
              <div
                className="shimmer"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                }}
              />

              <div style={{ width: "100%", maxWidth: 320 }}>
                <div
                  className="shimmer"
                  style={{
                    width: "65%",
                    height: 28,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                />

                <div
                  className="shimmer"
                  style={{
                    width: "35%",
                    height: 18,
                    borderRadius: 8,
                    marginBottom: 16,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 16,
                  }}
                >
                  <div
                    className="shimmer"
                    style={{
                      width: 80,
                      height: 32,
                      borderRadius: 999,
                    }}
                  />
                  <div
                    className="shimmer"
                    style={{
                      width: 90,
                      height: 32,
                      borderRadius: 999,
                    }}
                  />
                  <div
                    className="shimmer"
                    style={{
                      width: 75,
                      height: 32,
                      borderRadius: 999,
                    }}
                  />
                </div>

                <div
                  className="shimmer"
                  style={{
                    width: "100%",
                    height: 18,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                />
                <div
                  className="shimmer"
                  style={{
                    width: "88%",
                    height: 18,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                />
                <div
                  className="shimmer"
                  style={{
                    width: "78%",
                    height: 18,
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>
          </section>
        </main>
      </MobilePage>
    );
  }

  if (!profile) {
    return (
      <MobilePage>
        <main className="content">
          <section className="card center" style={{ minHeight: 220 }}>
            <div>
              <h2 className="section-title">Profile not found</h2>
              <p className="subtle">We could not find that explorer profile.</p>
              <button
                type="button"
                onClick={handleBack}
                className="btn"
                style={{ marginTop: 16 }}
              >
                Back to Discover
              </button>
            </div>
          </section>
        </main>
      </MobilePage>
    );
  }

  return (
    <MobilePage>
      <main className="content">
        <section className="card" style={{ padding: 16 }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="btn-secondary"
              aria-label="Share profile"
              title="Share profile"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span aria-hidden="true">🔗</span>
              <span>Share Profile</span>
            </button>
          </div>

          {shareMessage && (
            <div
              role="status"
              aria-live="polite"
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                borderRadius: 12,
                backgroundColor:
                  shareType === "success" ? "#dcfce7" : "#fee2e2",
                color: shareType === "success" ? "#166534" : "#991b1b",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              {shareMessage}
            </div>
          )}

          <div className="center" style={{ flexDirection: "column", gap: 16 }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textAlign: "center",
                    padding: "0 10px",
                  }}
                >
                  No Photo
                </span>
              )}
            </div>

            <div style={{ width: "100%", maxWidth: 320 }}>
              <h2 className="section-title" style={{ marginBottom: 8 }}>
                {profile.name}, {profile.age}
              </h2>

              <p className="subtle" style={{ marginBottom: 16 }}>
                @{profile.username}
              </p>

              <section style={{ marginBottom: 16 }}>
                <h3
                  className="section-title"
                  style={{ fontSize: "1.05rem", marginBottom: 8 }}
                >
                  Adventure Tags
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="pill selected"
                      style={{ cursor: "default" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3
                  className="section-title"
                  style={{ fontSize: "1.05rem", marginBottom: 8 }}
                >
                  Bio
                </h3>
                <p className="subtle">{profile.bio}</p>
              </section>
            </div>
          </div>
        </section>
      </main>
    </MobilePage>
  );
}
