"use client";

import LocationAutoSuggest from "@/components/discover/LocationAutoSuggest";
import { useEffect, useMemo, useState } from "react";
import { useDiscoveryFilters } from "@/lib/useDiscoveryFilters";

const ACTIVITY_OPTIONS = [
  "Hiking",
  "Rock Climbing",
  "Skiing",
  "Snowboarding",
  "Camping",
  "Kayaking",
  "Surfing",
  "Biking",
  "Backpacking",
];

const SKILL_OPTIONS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const GENDER_OPTIONS = ["Female", "Male", "No Preference"];

const DEFAULT_FILTERS = {
  min_age: 18,
  max_age: 150,
  gender: "",
  activities: [] as string[],
  skill_level: [] as string[],
  location: "",
  distance: 25,
};

type Props = {
  onApplyComplete?: () => void;
};

export default function DiscoveryFilters({ onApplyComplete }: Props) {
  const { filters, setFilters, resetFilters } = useDiscoveryFilters();
  const [localFilters, setLocalFilters] = useState(filters);
  const [isResetPressed, setIsResetPressed] = useState(false);
  const [isApplyPressed, setIsApplyPressed] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const toggleArrayValue = (key: "activities" | "skill_level", value: string) => {
    setLocalFilters((prev) => {
      const exists = prev[key].includes(value);

      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((item) => item !== value)
          : [...prev[key], value],
      };
    });
  };

  const handleReset = () => {
    setIsResetPressed(true);
    resetFilters();
    setLocalFilters({ ...DEFAULT_FILTERS });

    setTimeout(() => {
      setIsResetPressed(false);
    }, 120);
  };

  const applyFilters = () => {
    setIsApplyPressed(true);

    const searchObject = { ...localFilters };
    console.log("Search Object:", searchObject);
    setFilters(searchObject);

    setTimeout(() => {
      setIsApplyPressed(false);
      onApplyComplete?.();
    }, 120);
  };

  const minPercent = useMemo(
    () => ((localFilters.min_age - 18) / (150 - 18)) * 100,
    [localFilters.min_age]
  );

  const maxPercent = useMemo(
    () => ((localFilters.max_age - 18) / (150 - 18)) * 100,
    [localFilters.max_age]
  );

  const radiusPercent = useMemo(
    () => (localFilters.distance / 500) * 100,
    [localFilters.distance]
  );

  const handleMinAgeChange = (value: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      min_age: Math.min(value, prev.max_age),
    }));
  };

  const handleMaxAgeChange = (value: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      max_age: Math.max(value, prev.min_age),
    }));
  };

  const sliderStyles = `
    .radius-slider,
    .age-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      box-shadow: none;
      padding: 0;
      margin: 0;
    }

    .radius-slider::-webkit-slider-runnable-track,
    .age-slider::-webkit-slider-runnable-track {
      -webkit-appearance: none;
      appearance: none;
      height: 4px;
      background: transparent;
      border: none;
    }

    .radius-slider::-moz-range-track,
    .age-slider::-moz-range-track {
      height: 4px;
      background: transparent;
      border: none;
    }

    .radius-slider::-webkit-slider-thumb,
    .age-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 22px;
      border-radius: 999px;
      background: #ffffff;
      border: 4px solid #f5b22d;
      cursor: pointer;
      margin-top: -9px;
      box-shadow: none;
      position: relative;
      z-index: 10;
    }

    .radius-slider::-moz-range-thumb,
    .age-slider::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: 999px;
      background: #ffffff;
      border: 4px solid #f5b22d;
      cursor: pointer;
      box-shadow: none;
    }

    .age-slider {
      pointer-events: none;
    }

    .age-slider::-webkit-slider-thumb {
      pointer-events: auto;
    }

    .age-slider::-moz-range-thumb {
      pointer-events: auto;
    }
  `;

  const displayMaxAge = localFilters.max_age === 150 ? "65+" : localFilters.max_age;
  const maxAgeBottomLabel = "65+";
  const radiusDisplay = localFilters.distance === 500 ? "500+" : localFilters.distance;

  return (
    <>
      <style>{sliderStyles}</style>

      <section
        className="card"
        style={{
          padding: 18,
          marginBottom: 0,
          borderRadius: 28,
        }}
      >
        <div
          style={{
            width: 52,
            height: 4,
            borderRadius: 999,
            background: "#d4d4d4",
            margin: "0 auto 14px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <h2 className="section-title" style={{ margin: 0 }}>
            Advanced Discovery Filter
          </h2>

          <button
            type="button"
            className="pill"
            onClick={handleReset}
            style={{
              minWidth: 70,
              justifyContent: "center",
              transform: isResetPressed ? "scale(0.97)" : "scale(1)",
              opacity: isResetPressed ? 0.8 : 1,
              transition: "all 0.12s ease",
            }}
          >
            Reset
          </button>
        </div>

        {/* LOCATION */}
        <div style={{ marginBottom: 16 }}>
          <p
            style={{
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            Location
          </p>

          <LocationAutoSuggest
            value={localFilters.location}
            onChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                location: value,
              }))
            }
            onSelectLocation={(selected) => {
              setLocalFilters((prev) => ({
                ...prev,
                location: selected.label,
              }));

              console.log("Selected Location Mapping:", {
                location: selected.label,
                zip: selected.zip,
                lat: selected.lat,
                lng: selected.lng,
              });
            }}
          />
        </div>

        {/* RADIUS */}
        <div
          style={{
            paddingBottom: 16,
            marginBottom: 16,
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: "0.95rem", color: "#555" }}>Radius</span>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              {radiusDisplay} miles
            </span>
          </div>

          <div
            style={{
              position: "relative",
              height: 30,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 13,
                left: 0,
                right: 0,
                height: 4,
                borderRadius: 999,
                background: "#ddd",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 13,
                left: 0,
                width: `calc(${radiusPercent}% - ${radiusPercent === 0 ? 0 : 11}px)`,
                height: 4,
                borderRadius: 999,
                background: "#f5b22d",
              }}
            />

            <input
              type="range"
              min={0}
              max={500}
              value={localFilters.distance}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  distance: Number(e.target.value),
                }))
              }
              className="radius-slider"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                zIndex: 3,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.75rem",
              color: "#999",
              marginTop: 8,
            }}
          >
            <span>0</span>
            <span>500+</span>
          </div>
        </div>

        {/* AGE / GENDER */}
        <div
          style={{
            paddingBottom: 16,
            marginBottom: 16,
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <p
            style={{
              fontWeight: 700,
              margin: "0 0 10px",
            }}
          >
            Age / Gender
          </p>

          <div style={{ position: "relative", paddingTop: 26, paddingBottom: 12 }}>
            {localFilters.min_age !== 18 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: `calc(${minPercent}% - 18px)`,
                  background: "#efefef",
                  color: "#999",
                  borderRadius: 10,
                  minWidth: 36,
                  textAlign: "center",
                  padding: "4px 8px",
                  fontSize: "0.85rem",
                }}
              >
                {localFilters.min_age}
              </div>
            )}

            {localFilters.max_age !== 150 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: `calc(${maxPercent}% - 18px)`,
                  background: "#efefef",
                  color: "#999",
                  borderRadius: 10,
                  minWidth: 36,
                  textAlign: "center",
                  padding: "4px 8px",
                  fontSize: "0.85rem",
                }}
              >
                {localFilters.max_age >= 150 ? "65+" : localFilters.max_age}
              </div>
            )}

            <div
              style={{
                position: "relative",
                height: 30,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 13,
                  left: 0,
                  right: 0,
                  height: 4,
                  borderRadius: 999,
                  background: "#ddd",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: 13,
                  left: `calc(${minPercent}% + 11px)`,
                  width: `calc(${maxPercent - minPercent}% - 22px)`,
                  height: 4,
                  borderRadius: 999,
                  background: "#f5b22d",
                }}
              />

              <input
                type="range"
                min={18}
                max={150}
                value={localFilters.min_age}
                onChange={(e) => handleMinAgeChange(Number(e.target.value))}
                className="age-slider"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  zIndex:
                    localFilters.min_age === localFilters.max_age &&
                    localFilters.min_age === 18
                      ? 6
                      : 4,
                }}
              />
              
              <input
                type="range"
                min={18}
                max={150}
                value={localFilters.max_age}
                onChange={(e) => handleMaxAgeChange(Number(e.target.value))}
                className="age-slider"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  zIndex:
                    localFilters.min_age === localFilters.max_age &&
                    localFilters.max_age === 18
                      ? 5
                      : 6,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: "#999",
                marginTop: 8,
              }}
            >
              <span>18</span>
              <span>{maxAgeBottomLabel}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {GENDER_OPTIONS.map((option) => {
              const isSelected =
                option === "No Preference"
                  ? localFilters.gender === ""
                  : localFilters.gender === option;

              return (
                <button
                  key={option}
                  type="button"
                  className={`pill ${isSelected ? "selected" : ""}`}
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      gender: option === "No Preference" ? "" : option,
                    }))
                  }
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* SKILL LEVEL */}
        <div
          style={{
            paddingBottom: 16,
            marginBottom: 16,
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <p
            style={{
              fontWeight: 700,
              margin: "0 0 10px",
            }}
          >
            Skill Level
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SKILL_OPTIONS.map((skill) => (
              <button
                key={skill}
                type="button"
                className={`pill ${
                  localFilters.skill_level.includes(skill) ? "selected" : ""
                }`}
                onClick={() => toggleArrayValue("skill_level", skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVITIES */}
        <div style={{ marginBottom: 22 }}>
          <p
            style={{
              fontWeight: 700,
              margin: "0 0 10px",
            }}
          >
            Adventure Activities
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ACTIVITY_OPTIONS.map((activity) => (
              <button
                key={activity}
                type="button"
                className={`pill ${
                  localFilters.activities.includes(activity) ? "selected" : ""
                }`}
                onClick={() => toggleArrayValue("activities", activity)}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="primary-btn"
          style={{
            width: "100%",
            borderRadius: 999,
            padding: "16px 18px",
            fontWeight: 800,
            fontSize: "1rem",
            transform: isApplyPressed ? "scale(0.985)" : "scale(1)",
            opacity: isApplyPressed ? 0.9 : 1,
            transition: "all 0.12s ease",
          }}
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </section>
    </>
  );
}
