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
  max_age: 65,
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

export function useDiscoveryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<DiscoveryFilters>(() => {
    return {
      min_age: parseNumber(searchParams.get("min_age"), DEFAULT_FILTERS.min_age),
      max_age: parseNumber(searchParams.get("max_age"), DEFAULT_FILTERS.max_age),
      gender: searchParams.get("gender") || DEFAULT_FILTERS.gender,
      activities: parseList(searchParams.get("activities")),
      skill_level: parseList(searchParams.get("skill_level")),
      location: searchParams.get("location") || DEFAULT_FILTERS.location,
      distance: parseNumber(searchParams.get("distance"), DEFAULT_FILTERS.distance),
    };
  }, [searchParams]);

  const setFilters = (nextFilters: Partial<DiscoveryFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    const merged: DiscoveryFilters = {
      ...filters,
      ...nextFilters,
    };

    if (merged.min_age === DEFAULT_FILTERS.min_age) {
      params.delete("min_age");
    } else {
      params.set("min_age", String(merged.min_age));
    }

    if (merged.max_age === DEFAULT_FILTERS.max_age) {
      params.delete("max_age");
    } else {
      params.set("max_age", String(merged.max_age));
    }

    if (!merged.gender) {
      params.delete("gender");
    } else {
      params.set("gender", merged.gender);
    }

    if (merged.activities.length === 0) {
      params.delete("activities");
    } else {
      params.set("activities", merged.activities.join(","));
    }

    if (merged.skill_level.length === 0) {
      params.delete("skill_level");
    } else {
      params.set("skill_level", merged.skill_level.join(","));
    }

    if (!merged.location) {
      params.delete("location");
    } else {
      params.set("location", merged.location);
    }

    if (merged.distance === DEFAULT_FILTERS.distance) {
      params.delete("distance");
    } else {
      params.set("distance", String(merged.distance));
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
