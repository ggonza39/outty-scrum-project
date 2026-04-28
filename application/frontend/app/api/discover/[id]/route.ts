import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getExplorerProfileById } from "@/lib/explorerProfiles";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, age, bio, interests, gender, skill_level")
    .eq("id", id)
    .maybeSingle();

  if (profileError) {
    console.error("Discover profile fetch error:", profileError);
  }

  if (profile) {
    const { data: photos } = await supabase
      .from("photos")
      .select("public_url, is_primary")
      .eq("profile_id", profile.id)
      .order("is_primary", { ascending: false });

    const displayName = profile.display_name || "Explorer";

    return NextResponse.json({
      id: profile.id,
      username: profile.id,
      name: displayName,
      age: profile.age ?? 18,
      image: photos?.[0]?.public_url || "",
      bio: profile.bio || "No bio added yet.",
      tags: profile.interests ?? [],
      gender: profile.gender || "",
      skill_level: profile.skill_level || "",
      location: "",
    });
  }

  const mockProfile = getExplorerProfileById(id);

  if (!mockProfile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(mockProfile);
}
