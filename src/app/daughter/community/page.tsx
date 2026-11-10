import { CommunityIndex } from "@/components/community/community-index";
import { DAUGHTER_COMMUNITY_BOARDS, DAUGHTER_COMMUNITY_POSTS } from "@/data/fixtures/community-daughter";
import "../../community-demo.css";

export default function DaughterCommunityPage() {
  return <CommunityIndex space="daughter" posts={DAUGHTER_COMMUNITY_POSTS} boards={DAUGHTER_COMMUNITY_BOARDS} />;
}
