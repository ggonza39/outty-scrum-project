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
  max_age: 150, // FIXED
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

    setTimeout(() => setIsResetPressed(false), 120);
  };

  const applyFilters = () => {
    setIsApplyPressed(true);
    setFilters({ ...localFilters });

    setTimeout(() => {
      setIsApplyPressed(false);
      onApplyComplete?.();
    }, 120);
  };

  // UPDATED math for 150
  const minPercent = useMemo(
    () => ((localFilters.min_age - 18) / (150 - 18)) * 100,
    [localFilters.min_age]
  );

  const maxPercent = useMemo(
    () => ((localFilters.max_age - 18) / (150 - 18)) * 100,
    [localFilters.max_age]
  );

  // FIXED (allow equal)
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

  // SINGLE BAR styling
  const sliderStyles = `
    .age-slider {
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
    }

    .age-slider::-webkit-slider-runnable-track {
      background: transparent;
    }

    .age-slider::-moz-range-track {
      background: transparent;
    }

    .age-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 22px;
      height: 22px;
      border-radius: 999px;
      background: white;
      border: 4px solid #f5b22d;
      cursor: pointer;
      margin-top: -9px;
      position: relative;
      z-index: 10;
    }

    .age-slider::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: 999px;
      background: white;
      border: 4px solid #f5b22d;
      cursor: pointer;
    }
  `;

  return (
    <>
      <style>{sliderStyles}</style>

      <section className="card" style={{ padding: 18, borderRadius: 28 }}>
        <div style={{ width: 52, height: 4, background: "#d4d4d4", margin: "0 auto 14px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 className="section-title">Advanced Discovery Filter</h2>

          <button
            className="pill"
            onClick={handleReset}
            style={{
              transform: isResetPressed ? "scale(0.97)" : "scale(1)",
              opacity: isResetPressed ? 0.8 : 1,
            }}
          >
            Reset
          </button>
        </div>

        {/* LOCATION */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontWeight: 700 }}>Location</p>

          <LocationAutoSuggest
            value={localFilters.location}
            onChange={(value) =>
              setLocalFilters((prev) => ({ ...prev, location: value }))
            }
          />
        </div>

        {/* AGE */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontWeight: 700 }}>Age / Gender</p>

          <div style={{ position: "relative", paddingTop: 30 }}>
            {/* VALUE BUBBLES */}
            <div
              style={{
                position: "absolute",
                left: `calc(${minPercent}% - 18px)`,
                top: 0,
                background: "#eee",
                padding: "4px 8px",
                borderRadius: 10,
              }}
            >
              {localFilters.min_age}
            </div>

            <div
              style={{
                position: "absolute",
                left: `calc(${maxPercent}% - 18px)`,
                top: 0,
                background: "#eee",
                padding: "4px 8px",
                borderRadius: 10,
              }}
            >
              {localFilters.max_age}
            </div>

            {/* TRACK */}
            <div style={{ position: "relative", height: 30 }}>
              <div
                style={{
                  position: "absolute",
                  top: 13,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: "#ddd",
                  borderRadius: 999,
                }}
              />

              {/* SELECTED RANGE */}
              <div
                style={{
                  position: "absolute",
                  top: 13,
                  left: `${minPercent}%`,
                  width: `${maxPercent - minPercent}%`,
                  height: 4,
                  background: "#f5b22d",
                  borderRadius: 999,
                }}
              />

              {/* MIN */}
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
                  zIndex: 5,
                }}
              />

              {/* MAX */}
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
                  zIndex: 4,
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>18</span>
              <span>150</span>
            </div>
          </div>
        </div>

        {/* APPLY */}
        <button
          className="primary-btn"
          onClick={applyFilters}
          style={{
            width: "100%",
            transform: isApplyPressed ? "scale(0.98)" : "scale(1)",
          }}
        >
          Apply Filters
        </button>
      </section>
    </>
  );
}
