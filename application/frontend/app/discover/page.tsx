"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import MobilePage from "@/components/MobilePage";
import MatchCard from "@/components/MatchCard";
import DiscoveryFilters from "@/components/discover/DiscoveryFilters";
import { explorerProfiles } from "@/lib/explorerProfiles";
import { useDiscoveryFilters } from "@/lib/useDiscoveryFilters";
import { filterPeople, Person } from "@/lib/filterPeople";

const initialPeople: Person[] = explorerProfiles.map((profile) => ({
  id: profile.id,
  username: profile.username,
  name: profile.name,
  age: profile.age,
  image: profile.image,
  bio: profile.bio,
  tags: profile.tags,
  gender: profile.gender,
  skill_level: profile.skill_level,
  location: profile.location,
}));

const DEFAULT_FILTERS = {
  min_age: 18,
  max_age: 150,
  gender: "",
  activities: [] as string[],
  skill_level: [] as string[],
  location: "",
  distance: 25,
};

function pluralize(count: number, singular: string, plural?: string) {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiscoverPageContent />
    </Suspense>
  );
}

function DiscoverPageContent() {
  const { filters } = useDiscoveryFilters();
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadRealProfiles = async () => {
      try {
        const response = await fetch("/api/discover", {
          cache: "no-store",
        });
  
        if (!response.ok) {
          return;
        }
  
        const data = await response.json();
  
        if (Array.isArray(data.results) && data.results.length > 0) {
          setPeople(data.results);
        }
      } catch (error) {
        console.error("Failed to load real discover profiles:", error);
      }
    };
  
    loadRealProfiles();
  }, []);

  const filteredPeople = useMemo(() => {
    return filterPeople(people, filters);
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

  const hasAppliedFilters = useMemo(() => {
    return (
      filters.min_age !== DEFAULT_FILTERS.min_age ||
      filters.max_age !== DEFAULT_FILTERS.max_age ||
      filters.gender !== DEFAULT_FILTERS.gender ||
      filters.activities.length > 0 ||
      filters.skill_level.length > 0 ||
      filters.location !== DEFAULT_FILTERS.location ||
      filters.distance !== DEFAULT_FILTERS.distance
    );
  }, [filters]);

  const resultsHeader = useMemo(() => {
    const count = filteredPeople.length;

    if (!hasAppliedFilters) {
      return `Showing ${count} ${pluralize(count, "match", "matches")}.`;
    }

    const parts: string[] = [];

    if (filters.activities.length > 0) {
      parts.push(filters.activities.join(", "));
    }

    const maxAgeLabel = filters.max_age === 150 ? "65+" : String(filters.max_age);
    parts.push(`ages ${filters.min_age}-${maxAgeLabel}`);

    if (filters.gender) {
      parts.push(filters.gender);
    }

    const distanceLabel =
      filters.distance === 500
        ? "within 500+ miles"
        : `within ${filters.distance} ${pluralize(filters.distance, "mile")}`;

    parts.push(distanceLabel);

    if (filters.location) {
      parts.push(filters.location);
    }

    return `Showing ${count} ${pluralize(
      count,
      "match",
      "matches"
    )} for ${parts.join(", ")}.`;
  }, [filteredPeople.length, filters, hasAppliedFilters]);

  return (
    <MobilePage>
      <main className="content">
        <section
          className="card"
          style={{
            padding: 12,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
              gap: 12,
            }}
          >
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Discover
            </h2>

            <button
              type="button"
              onClick={() => setShowFilters(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                border: "none",
                borderRadius: 999,
                padding: "8px 14px",
                background: "#e8ece7",
                color: "#2d2d2d",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <span aria-hidden="true">⚙️</span>
              <span>Discovery Filtering</span>
            </button>
          </div>

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

      {showFilters && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.28)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={() => setShowFilters(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 430,
              maxHeight: "88vh",
              overflowY: "auto",
              padding: "0 10px 14px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <DiscoveryFilters onApplyComplete={() => setShowFilters(false)} />
          </div>
        </div>
      )}
    </MobilePage>
  );
}
