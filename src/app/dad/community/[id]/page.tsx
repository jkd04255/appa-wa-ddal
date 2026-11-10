import { notFound } from "next/navigation";
import { CommunityDetail } from "@/components/community/community-detail";
import { DAD_COMMUNITY_POSTS } from "@/data/fixtures/community-dad";
import { findCommunityPost } from "@/lib/community-catalog";
import "../../../community-demo.css";

export function generateStaticParams() {
  return DAD_COMMUNITY_POSTS.map(({ id }) => ({ id }));
}

export default async function DadCommunityPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = findCommunityPost("dad", id);
  if (!post) notFound();
  return <CommunityDetail post={post} />;
}
