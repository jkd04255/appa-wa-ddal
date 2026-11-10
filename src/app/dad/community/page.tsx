import { CommunityIndex } from "@/components/community/community-index";
import { DAD_COMMUNITY_BOARDS, DAD_COMMUNITY_POSTS } from "@/data/fixtures/community-dad";
import "../../community-demo.css";

export default function DadCommunityPage() {
  return <CommunityIndex space="dad" posts={DAD_COMMUNITY_POSTS} boards={DAD_COMMUNITY_BOARDS} />;
}
