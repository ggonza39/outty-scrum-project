"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MobilePage from "@/components/MobilePage";
import MatchCard from "@/components/MatchCard";
import DiscoveryFilters from "@/components/discover/DiscoveryFilters";
import { explorerProfiles } from "@/lib/explorerProfiles";
import { useDiscoveryFilters } from "@/lib/useDiscoveryFilters";

type Person = {
  id: string;
  username: string;
  name: string;
  age: number;
  image: string;
  bio?: string;
  tags?: string[];
};

const initialPeople: Person[] = explorerProfiles.map((profile) => ({
  id: profile.id,
  username: profile.username,
  name: profile.name,
  age: profile.age,
  image: profile.image,
  bio: profile.bio,
  tags: profile.tags,
}));

function pluralize(count: number, singular: string, plural?: string) {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

export default function DiscoverPage() {
  const { filters } = useDiscoveryFilters();
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [showFilters, setShowFilters] = useState(false);

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const matchesAge =
        person.age >= filters.min_age && person.age <= filters.max_age;

      const matchesActivities =
        filters.activities.length === 0 ||
        filters.activities.some((activity) =>
          person.tags?.some(
            (tag) => tag.toLowerCase() === activity.toLowerCase()
          )
        );

      return matchesAge && matchesActivities;
    });
  }, [people, filters]);

  useEffect(() => {
    const searchObject = {
      min_age: filters.min_age,
      max_age: filters.max_age,
      gender: filters.gender,
      activities: filters.activities,
      skill_level: filters.skill_level,
      location: filters.location,
      distance: filters.distance,
    };

    console.log("Search Object:", searchObject);
  }, [filters]);

  const currentPerson = filteredPeople[0];

  const handleLike = (id: string) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));
  };

  const handlePass = (id: string) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));
  };

  const resultsHeader = useMemo(() => {
    const count = filteredPeople.length;
    const ageRangeText = `ages ${filters.min_age}-${filters.max_age}`;
    const genderText = filters.gender || "all genders";
    const distanceText = `within ${filters.distance} ${pluralize(
      filters.distance,
      "mile"
    )}`;
    const activityText =
      filters.activities.length > 0
        ? filters.activities.join(", ")
        : "adventurers";

    return `Showing ${count} ${pluralize(
      count,
      "match",
      "matches"
    )} for ${activityText}, ${ageRangeText}, ${genderText}, ${distanceText}.`;
  }, [filteredPeople.length, filters]);

  return (
    <MobilePage>
      <main className="content">
        <section className="card" style={{ padding: 12 }}>
          {/* Title */}
          <h2 className="section-title" style={{ marginBottom: 8 }}>
            Discover
          </h2>

          {/* FILTER BUTTON */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 8,
            }}
          >
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="pill"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 600,
              }}
            >
              ⚙️ Discovery Filtering
            </button>
          </div>

          {/* FILTER PANEL */}
          {showFilters && <DiscoveryFilters />}

          {/* RESULTS HEADER */}
          <p
            className="subtle"
            style={{
              marginBottom: 16,
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {resultsHeader}
          </p>

          {currentPerson ? (
            <div className="center" style={{ flexDirection: "column", gap: 16 }}>
              <MatchCard
                person={currentPerson}
                onLike={handleLike}
                onPass={handlePass}
              />

              <Link
                href={`/discover/${currentPerson.id}`}
                className="btn-secondary center"
                style={{ width: "100%", maxWidth: 320 }}
              >
                View Profile
              </Link>

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
                <h2 className="section-title">No matching results</h2>
                <p className="muted" style={{ color: "var(--muted)" }}>
                  Try adjusting your filters to broaden your search.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </MobilePage>
  );
}
