"use client";

import Link from "next/link";
import { useState } from "react";
import MobilePage from "@/components/MobilePage";
import MatchCard from "@/components/MatchCard";

type Person = {
  id: string;
  username: string;
  name: string;
  age: number;
  image: string;
  bio?: string;
};

const initialPeople: Person[] = [
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

export default function MatchPage() {
  const [people, setPeople] = useState<Person[]>(initialPeople);

  const currentPerson = people[0];

  const handleLike = (id: string) => {
    console.log("LIKED:", id);
    setPeople((prev) => prev.filter((person) => person.id !== id));
  };

  const handlePass = (id: string) => {
    console.log("PASSED:", id);
    setPeople((prev) => prev.filter((person) => person.id !== id));
  };

  return (
    <MobilePage>
      <main className="content">
        <section className="card" style={{ padding: 12 }}>
          <h2 className="section-title" style={{ marginBottom: 12 }}>
            Discover
          </h2>

          {currentPerson ? (
            <div className="center" style={{ flexDirection: "column", gap: 16 }}>
              <MatchCard
                person={currentPerson}
                onLike={handleLike}
                onPass={handlePass}
              />

              <Link
                href={`/match/${currentPerson.username}`}
                className="btn-secondary center"
                style={{ width: "100%", maxWidth: 320 }}
              >
                View Profile
              </Link>

              {/* Clickable buttons for testing and desktop demo */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  width: "100%",
                  maxWidth: 320,
                }}
              >
                <button
                  type="button"
                  onClick={() => handlePass(currentPerson.id)}
                  style={{
                    flex: 1,
                    border: "none",
                    borderRadius: 999,
                    padding: "14px 16px",
                    fontSize: "1rem",
                    fontWeight: 800,
                    background: "#fee2e2",
                    color: "#b91c1c",
                    cursor: "pointer",
                  }}
                >
                  Pass
                </button>

                <button
                  type="button"
                  onClick={() => handleLike(currentPerson.id)}
                  style={{
                    flex: 1,
                    border: "none",
                    borderRadius: 999,
                    padding: "14px 16px",
                    fontSize: "1rem",
                    fontWeight: 800,
                    background: "#dcfce7",
                    color: "#15803d",
                    cursor: "pointer",
                  }}
                >
                  Like
                </button>
              </div>
            </div>
          ) : (
            <div className="card center" style={{ minHeight: 220 }}>
              <div>
                <h2 className="section-title">No more matches</h2>
                <p className="muted" style={{ color: "var(--muted)" }}>
                  You have gone through everyone for now.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </MobilePage>
  );
}
