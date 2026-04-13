"use client";

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { CITY_SUGGESTIONS } from "@/lib/citySuggestions";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelectLocation?: (location: {
    label: string;
    zip: string;
    lat: number;
    lng: number;
  }) => void;
};

export default function LocationAutoSuggest({
  value,
  onChange,
  onSelectLocation,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showInvalidMessage, setShowInvalidMessage] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useMemo(() => {
    if (value.trim().length < 3) return [];

    const search = value.trim().toLowerCase();

    return CITY_SUGGESTIONS.filter((item) =>
      item.label.toLowerCase().includes(search)
    );
  }, [value]);

  useEffect(() => {
    setActiveIndex(-1);
    setShowInvalidMessage(false);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;

      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);

        if (value.trim().length >= 3 && value.trim() !== "") {
          const exactMatch = CITY_SUGGESTIONS.some(
            (item) => item.label.toLowerCase() === value.trim().toLowerCase()
          );

          setShowInvalidMessage(!exactMatch);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value]);

  const handleSelect = (suggestion: (typeof CITY_SUGGESTIONS)[number]) => {
    onChange(suggestion.label);
    onSelectLocation?.({
      label: suggestion.label,
      zip: suggestion.zip,
      lat: suggestion.lat,
      lng: suggestion.lng,
    });
    setIsOpen(false);
    setShowInvalidMessage(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex]);
        return;
      }

      const exactMatch = CITY_SUGGESTIONS.find(
        (item) => item.label.toLowerCase() === value.trim().toLowerCase()
      );

      if (exactMatch) {
        handleSelect(exactMatch);
      } else {
        setShowInvalidMessage(true);
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid #d4d4d4",
          borderRadius: 10,
          background: "#f5f5f5",
          padding: "10px 12px",
        }}
      >
        <span style={{ color: "#f5a623", fontSize: "0.95rem" }}>●</span>

        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(e.target.value.trim().length >= 3);
          }}
          onFocus={() => {
            if (value.trim().length >= 3) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter city"
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%",
            fontSize: "0.98rem",
          }}
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 12,
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
            zIndex: 20,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => handleSelect(suggestion)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                border: "none",
                background: activeIndex === index ? "#f5f5f5" : "#fff",
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      )}

      {value.trim().length >= 3 &&
        !isOpen &&
        showInvalidMessage &&
        !CITY_SUGGESTIONS.some(
          (item) => item.label.toLowerCase() === value.trim().toLowerCase()
        ) && (
          <p style={{ color: "#b00020", marginTop: 8, fontSize: "0.9rem" }}>
            Invalid location. Please choose a valid city/state.
          </p>
        )}
    </div>
  );
}
