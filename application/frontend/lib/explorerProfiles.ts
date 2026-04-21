/**
 * Shared mock explorer profile data used across the frontend.
 *
 * WHY THIS FILE MATTERS:
 * - Discover page uses it for cards/results
 * - Profile page uses it for explorer details
 * - Messaging flow will use profile IDs to create stable mock conversation routes
 *
 * IMPORTANT:
 * - Every profile ID must stay unique
 * - Every username should also stay unique to avoid confusing routes and UI labels
 */

export type ExplorerProfile = {
  id: string;
  username: string;
  name: string;
  age: number;
  image: string;
  bio: string;
  tags: string[];
  gender: string;
  skill_level: string;
  location: string;
};

export const explorerProfiles: ExplorerProfile[] = [
  {
    id: "1",
    username: "maya",
    name: "Maya",
    age: 28,
    image: "/maya.jpg",
    bio: "Loves hiking, sunrise trails, and good coffee after a long adventure.",
    tags: ["Hiking", "Kayaking"],
    gender: "Female",
    skill_level: "Intermediate",
    location: "Denver, CO",
  },
  {
    id: "2",
    username: "jordan",
    name: "Jordan",
    age: 31,
    image: "/jordan.jpg",
    bio: "Designer, traveler, and dog person who loves exploring new cities.",
    tags: ["Camping", "Hiking"],
    gender: "Male",
    skill_level: "Beginner",
    location: "Austin, TX",
  },
  {
    id: "3",
    username: "avery",
    name: "Avery",
    age: 26,
    image: "/avery.jpg",
    bio: "Into fitness, books, and weekend brunch. Always up for an active day.",
    tags: ["Biking", "Surfing"],
    gender: "Female",
    skill_level: "Advanced",
    location: "Miami, FL",
  },
  {
    id: "4",
    username: "taylor",
    name: "Taylor",
    age: 30,
    image: "/taylor.jpg",
    bio: "Adventure seeker who enjoys skiing and backpacking trips.",
    tags: ["Skiing", "Backpacking"],
    gender: "Male",
    skill_level: "Advanced",
    location: "Denver, CO",
  },
  {
    id: "5",
    username: "taylor66",
    name: "Taylor",
    age: 66,
    image: "/taylor.jpg",
    bio: "Adventure seeker who enjoys skiing and backpacking trips.",
    tags: ["Skiing", "Backpacking"],
    gender: "Male",
    skill_level: "Advanced",
    location: "Denver, CO",
  },
];

/**
 * Returns one explorer profile by ID.
 *
 * TEST:
 * - Pass a valid ID like "1" and confirm Maya is returned
 * - Pass an invalid ID and confirm null is returned
 */
export function getExplorerProfileById(id: string) {
  return explorerProfiles.find((profile) => profile.id === id) || null;
}
