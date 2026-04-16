import { DiscoveryFilters } from "@/lib/useDiscoveryFilters";

export type Person = {
    id: string;
    username: string;
    name: string;
    age: number;
    image: string;
    bio?: string;
    tags?: string[];
    gender: string;
    skill_level: string;
    location: string;
};

export function filterPeople(people: Person[], filters: DiscoveryFilters) {
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

        const matchesGender =
            !filters.gender || person.gender === filters.gender;

        const matchesSkill =
            filters.skill_level.length === 0 ||
            filters.skill_level.includes(person.skill_level);

        const matchesLocation =
            !filters.location || person.location === filters.location;

        return (
            matchesAge &&
            matchesActivities &&
            matchesGender &&
            matchesSkill &&
            matchesLocation
        );
    });
}