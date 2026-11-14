import type { DemoStatus } from "@/domain/demo-editorial";

export type DaughterCategory = "beauty" | "food" | "culture";
export type DaughterDiscovery = Readonly<{
  kind: "discovery";
  audience: "daughter";
  id: string;
  slug: string;
  category: DaughterCategory;
  categoryLabel: string;
  title: string;
  summary: string;
  cover: `/editorial/${string}.jpg`;
  coverAlt: string;
  status: DemoStatus;
}>;
export type DaughterShopping = Readonly<{
  kind: "sale";
  id: string;
  title: string;
  summary: string;
  status: DemoStatus;
  // No price, discount rate, event start/end, or false verified source.
}>;
export type DaughterCommunity = Readonly<{
  kind: "demo-community-post";
  id: string;
  space: "daughter";
  board: string;
  title: string;
  demoNotice: "샘플 게시글 · 실제 저장되지 않습니다";
}>;
export type DaughterPoll = Readonly<{
  kind: "demo-poll";
  id: string;
  question: string;
  options: readonly string[];
  demoNotice: "실제 투표 결과가 아닙니다";
}>;

