import type { Metadata } from "next";
import ExplorerProfileClient from "@/components/discover/ExplorerProfileClient";
import { getExplorerProfileById } from "@/lib/explorerProfiles";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = getExplorerProfileById(id);

  if (!profile) {
    return {
      title: "Explorer Profile Not Found | Outty",
      description: "The requested explorer profile could not be found.",
    };
  }

  return {
    title: `${profile.name} | Outty`,
    description: profile.bio,
    openGraph: {
      title: `${profile.name} | Outty`,
      description: profile.bio,
      images: [profile.image],
    },
  };
}

export default async function ExplorerProfilePage({ params }: Props) {
  const { id } = await params;

  return <ExplorerProfileClient profileId={id} />;
}
