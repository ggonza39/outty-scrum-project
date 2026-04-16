"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type DiscoveryFilters = {
  min_age: number;
  max_age: number;
  gender: string;
  activities: string[];
  skill_level: string[];
  location: string;
  distance: number;
};

const DEFAULT_FILTERS: DiscoveryFilters = {
  min_age: 18,
  max_age: 150,
  gender: "",
  activities: [],
  skill_level: [],
  location: "",
  distance: 25,
};

function parseNumber(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseList(value: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useDiscoveryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<DiscoveryFilters>(() => {
    const minAge = clamp(
      parseNumber(searchParams.get("min_age"), DEFAULT_FILTERS.min_age),
      18,
      150
    );

    const maxAge = clamp(
      parseNumber(searchParams.get("max_age"), DEFAULT_FILTERS.max_age),
      18,
      150
    );

    const distance = clamp(
      parseNumber(searchParams.get("distance"), DEFAULT_FILTERS.distance),
      0,
      500
    );

    return {
      min_age: Math.min(minAge, maxAge),
      max_age: Math.max(minAge, maxAge),
      gender: searchParams.get("gender") || DEFAULT_FILTERS.gender,
      activities: parseList(searchParams.get("activities")),
      skill_level: parseList(searchParams.get("skill_level")),
      location: searchParams.get("location") || DEFAULT_FILTERS.location,
      distance,
    };
  }, [searchParams]);

  const setFilters = (nextFilters: Partial<DiscoveryFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    const merged: DiscoveryFilters = {
      ...filters,
      ...nextFilters,
    };

    const normalized: DiscoveryFilters = {
      ...merged,
      min_age: clamp(merged.min_age, 18, 150),
      max_age: clamp(merged.max_age, 18, 150),
      distance: clamp(merged.distance, 0, 500),
    };

    if (normalized.min_age === DEFAULT_FILTERS.min_age) {
      params.delete("min_age");
    } else {
      params.set("min_age", String(normalized.min_age));
    }

    if (normalized.max_age === DEFAULT_FILTERS.max_age) {
      params.delete("max_age");
    } else {
      params.set("max_age", String(normalized.max_age));
    }

    if (!normalized.gender) {
      params.delete("gender");
    } else {
      params.set("gender", normalized.gender);
    }

    if (normalized.activities.length === 0) {
      params.delete("activities");
    } else {
      params.set("activities", normalized.activities.join(","));
    }

    if (normalized.skill_level.length === 0) {
      params.delete("skill_level");
    } else {
      params.set("skill_level", normalized.skill_level.join(","));
    }

    if (!normalized.location) {
      params.delete("location");
    } else {
      params.set("location", normalized.location);
    }

    if (normalized.distance === DEFAULT_FILTERS.distance) {
      params.delete("distance");
    } else {
      params.set("distance", String(normalized.distance));
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    router.replace(pathname);
  };

  return {
    filters,
    setFilters,
    resetFilters,
  };
}
