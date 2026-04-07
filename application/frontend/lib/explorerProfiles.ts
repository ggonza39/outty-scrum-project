export type ExplorerProfile = {
  id: string;
  username: string;
  name: string;
  age: number;
  image: string;
  bio: string;
  tags: string[];
};

export const explorerProfiles: ExplorerProfile[] = [
  {
    id: "1",
    username: "maya",
    name: "Maya",
    age: 28,
    image: "/maya.jpg",
    bio: "Loves hiking, sunrise trails, and good coffee after a long adventure.",
    tags: ["Hiking", "Coffee", "Nature"],
  },
  {
    id: "2",
    username: "jordan",
    name: "Jordan",
    age: 31,
    image: "/jordan.jpg",
    bio: "Designer, traveler, and dog person who loves exploring new cities and scenic spots.",
    tags: ["Travel", "Design", "Dogs"],
  },
  {
    id: "3",
    username: "avery",
    name: "Avery",
    age: 26,
    image: "/avery.jpg",
    bio: "Into fitness, books, and weekend brunch. Always up for an active day outdoors.",
    tags: ["Fitness", "Books", "Brunch"],
  },
];

export function getExplorerProfileById(id: string) {
  return explorerProfiles.find((profile) => profile.id === id) || null;
}
