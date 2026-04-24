"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobilePage from "@/components/MobilePage";
import { getConversationIdForProfile } from "@/lib/mockMessages";

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

export default function ExplorerProfileClient({ profileId }: Props) {
  const router = useRouter();

  // Holds the selected explorer profile returned from the API route.
  const [profile, setProfile] = useState<ExplorerProfile | null>(null);

  // Loading state for profile fetch.
  const [isLoading, setIsLoading] = useState(true);

  // Fallback state if the image cannot be displayed.
  const [imageError, setImageError] = useState(false);

  /**
   * Load the explorer profile by route ID.
   *
   * Gibson test:
   * - open a valid discover profile
   * - confirm the correct person loads
   * - open an invalid profile route
   * - confirm "Profile not found" displays
   */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/discover/${profileId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          setProfile(null);
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

  /**
   * Returns the user back to the discover page.
   */
  const handleBack = () => {
    router.push("/discover");
  };

  /**
   * Shared conversation route helper.
   *
   * IMPORTANT:
   * This keeps the profile page aligned with:
   * - app/message/page.tsx
   * - app/message/[conversationId]/page.tsx
   * - lib/mockMessages.ts
   *
   * Gibson test:
   * - Maya profile should route to /message/conv-1
   * - Jordan profile should route to /message/conv-2
   * - Avery profile should route to /message/conv-3
   */
  const conversationId = profile
    ? getConversationIdForProfile(profile.id)
    : "";

  if (isLoading) {
    return (
      <MobilePage>
        <main className="content">
          <section className="card" style={{ padding: 16 }}>
            <p style={{ margin: 0 }}>Loading profile...</p>
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
              <button
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
        <section
          className="card"
          style={{
            padding: 0,
            overflow: "hidden",
          }}
        >
          {/* Back button */}
          <div style={{ padding: "12px 14px 0" }}>
            <button
              onClick={handleBack}
              style={{
                border: "none",
                background: "transparent",
                color: "#8a8a8a",
                fontSize: "0.85rem",
                cursor: "pointer",
                padding: 0,
              }}
            >
              &lt; Back to discovery
            </button>
          </div>

          {/* Large explorer image */}
          <div
            style={{
              width: "100%",
              height: 360,
              backgroundColor: "#e5e7eb",
              overflow: "hidden",
            }}
          >
            {profile.image && !imageError ? (
              <img
                src={profile.image}
                alt={profile.name}
                onError={() => setImageError(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                className="center"
                style={{
                  height: "100%",
                  fontWeight: 600,
                  color: "#6b7280",
                }}
              >
                No Photo
              </div>
            )}
          </div>

          {/* Send Message button */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "16px 0",
            }}
          >
            <Link
              href={`/message/${conversationId}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "2px solid #9b4f3a",
                borderRadius: 999,
                padding: "10px 18px",
                background: "#fff",
                color: "#8b4633",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Send Message ✉
            </Link>
          </div>

          {/* Explorer profile details */}
          <div style={{ padding: "0 16px 18px" }}>
            <h2 className="section-title">
              {profile.name}, {profile.age}
            </h2>

            {/* Bio section */}
            <section style={{ marginBottom: 16 }}>
              <h3 className="section-title">Bio</h3>
              <p className="subtle">{profile.bio}</p>
            </section>

            {/* Skill level placeholder for UI completeness */}
            <section style={{ marginBottom: 16 }}>
              <h3 className="section-title">Skill Level</h3>
              <span className="pill selected">Intermediate</span>
            </section>

            {/* Adventure tags */}
            <section>
              <h3 className="section-title">Adventure Activities</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile.tags.map((tag) => (
                  <span key={tag} className="pill selected">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </MobilePage>
  );
}
