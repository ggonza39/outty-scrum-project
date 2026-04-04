import { NextResponse } from "next/server";
import { getExplorerProfileById } from "@/lib/explorerProfiles";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const profile = getExplorerProfileById(id);

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}
