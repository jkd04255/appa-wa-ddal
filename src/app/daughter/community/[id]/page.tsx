import { notFound } from "next/navigation";
import { CommunityDetail } from "@/components/community/community-detail";
import { DAUGHTER_COMMUNITY_POSTS } from "@/data/fixtures/community-daughter";
import { findCommunityPost } from "@/lib/community-catalog";
import "../../../community-demo.css";

export function generateStaticParams() {
  return DAUGHTER_COMMUNITY_POSTS.map(({ id }) => ({ id }));
}

export default async function DaughterCommunityPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = findCommunityPost("daughter", id);
  if (!post) notFound();
  return <CommunityDetail post={post} />;
}
