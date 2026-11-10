import { DAD_COMMUNITY_POSTS } from "@/data/fixtures/community-dad";
import { DAUGHTER_COMMUNITY_POSTS } from "@/data/fixtures/community-daughter";
import type { CommunitySpace } from "@/domain/community-demo";

/** Exact allowlisted sample IDs only: no file queries, no external identifiers. */
export function findCommunityPost(space: CommunitySpace, id: string) {
  if (space === "dad") {
    const post = DAD_COMMUNITY_POSTS.find((item) => item.id === id);
    return post ?? null;
  }
  const post = DAUGHTER_COMMUNITY_POSTS.find((item) => item.id === id);
  return post ?? null;
}
