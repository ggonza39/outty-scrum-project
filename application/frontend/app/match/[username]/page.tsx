"use client";

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

export default function ExplorerProfilePage() {
  const params = useParams();
  const router = useRouter();

  const username = String(params.username).toLowerCase();
  const person = people.find((item) => item.username === username);

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
          <button
            type="button"
            onClick={() => router.push("/match")}
            className="btn-secondary"
            style={{ marginBottom: 16 }}
          >
            Back
          </button>

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
                <h3 className="section-title" style={{ fontSize: "1.1rem", marginBottom: 8 }}>
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
