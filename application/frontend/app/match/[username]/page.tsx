"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MobilePage from "@/components/MobilePage";

type Person = {
  id: string;
  username: string;
  name: string;
  age: number;
  image: string;
  bio?: string;
};

const people: Person[] = [
  {
    id: "1",
    username: "maya",
    name: "Maya",
    age: 28,
    image: "/images/maya.png",
    bio: "Loves hiking and coffee.",
  },
  {
    id: "2",
    username: "jordan",
    name: "Jordan",
    age: 31,
    image: "/images/jordan.jpg",
    bio: "Designer, traveler, and dog person.",
  },
  {
    id: "3",
    username: "avery",
    name: "Avery",
    age: 26,
    image: "/images/avery.jpg",
    bio: "Into fitness, books, and weekend brunch.",
  },
];

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
  } catch (error) {
    console.error("Fallback copy failed:", error);
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

export default function ExplorerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [person, setPerson] = useState<Person | null | undefined>(undefined);
  const [shareMessage, setShareMessage] = useState("");
  const [shareMessageType, setShareMessageType] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const username = String(params.username).toLowerCase();

    const timer = setTimeout(() => {
      const foundPerson = people.find((item) => item.username === username) || null;
      setPerson(foundPerson);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [params.username]);

  const handleShareProfile = async () => {
    const profileUrl = window.location.href;

    try {
      const copied = await copyToClipboard(profileUrl);

      if (!copied) {
        throw new Error("Copy failed");
      }

      setShareMessageType("success");
      setShareMessage("Profile link copied.");
    } catch (error) {
      console.error("Share profile error:", error);
      setShareMessageType("error");
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
          <section className="card" style={{ padding: 12 }}>
            <div
              style={{
                width: 100,
                height: 42,
                borderRadius: 999,
                backgroundColor: "#e5e7eb",
                marginBottom: 16,
              }}
            />

            <div
              style={{
                width: "100%",
                maxWidth: 320,
                height: 360,
                borderRadius: 24,
                backgroundColor: "#e5e7eb",
                margin: "0 auto 16px",
              }}
            />

            <div style={{ width: "100%", maxWidth: 320, margin: "0 auto" }}>
              <div
                style={{
                  width: "70%",
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: "#e5e7eb",
                  marginBottom: 12,
                }}
              />

              <div
                style={{
                  width: "35%",
                  height: 18,
                  borderRadius: 8,
                  backgroundColor: "#e5e7eb",
                  marginBottom: 20,
                }}
              />

              <div
                style={{
                  width: "100%",
                  height: 18,
                  borderRadius: 8,
                  backgroundColor: "#e5e7eb",
                  marginBottom: 10,
                }}
              />

              <div
                style={{
                  width: "85%",
                  height: 18,
                  borderRadius: 8,
                  backgroundColor: "#e5e7eb",
                  marginBottom: 10,
                }}
              />

              <div
                style={{
                  width: "90%",
                  height: 18,
                  borderRadius: 8,
                  backgroundColor: "#e5e7eb",
                }}
              />
            </div>
          </section>
        </main>
      </MobilePage>
    );
  }

  if (!person) {
    return (
      <MobilePage>
        <main className="content">
          <section className="card center" style={{ minHeight: 220 }}>
            <div>
              <h2 className="section-title">Profile not found</h2>
              <p className="subtle">We could not find that explorer profile.</p>
              <button
                type="button"
                onClick={() => router.push("/match")}
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
        <section className="card" style={{ padding: 12 }}>
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
              onClick={() => router.push("/match")}
              className="btn-secondary"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleShareProfile}
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
                  shareMessageType === "success" ? "#dcfce7" : "#fee2e2",
                color: shareMessageType === "success" ? "#166534" : "#991b1b",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              {shareMessage}
            </div>
          )}

          <div className="center" style={{ flexDirection: "column", gap: 16 }}>
            <img
              src={person.image}
              alt={person.name}
              style={{
                width: "100%",
                maxWidth: 320,
                borderRadius: 24,
                objectFit: "cover",
              }}
            />

            <div style={{ width: "100%", maxWidth: 320 }}>
              <h2 className="section-title" style={{ marginBottom: 8 }}>
                {person.name}, {person.age}
              </h2>
              <p className="subtle" style={{ marginBottom: 16 }}>
                @{person.username}
              </p>

              <section style={{ marginBottom: 16 }}>
                <h3
                  className="section-title"
                  style={{ fontSize: "1.1rem", marginBottom: 8 }}
                >
                  About
                </h3>
                <p className="subtle">{person.bio || "No bio available."}</p>
              </section>
            </div>
          </div>
        </section>
      </main>
    </MobilePage>
  );
}
