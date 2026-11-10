export type DemoCategory = "food" | "music" | "video" | "hobby" | "fashion";
export type DemoArtworkTone = "slate" | "sand" | "moss" | "plum" | "mist";

export type DemoStatus = Readonly<{
  kind: "demo";
  demoNotice: "시연 콘텐츠";
}>;

export type DemoTrend = Readonly<{
  kind: "trend";
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: DemoCategory;
  categoryLabel: string;
  audience: "dad";
  status: DemoStatus;
  tone: DemoArtworkTone;
}>;

export type DemoBrief = Readonly<{
  id: string;
  title: string;
  summary: string;
  status: DemoStatus;
}>;

export type DemoCommunityPreview = Readonly<{
  kind: "demo-community-post";
  id: string;
  space: "dad";
  board: string;
  title: string;
  demoNotice: "샘플 게시글 · 실제 저장되지 않습니다";
}>;

export type DemoConversationCard = Readonly<{
  kind: "question" | "talk";
  title: string;
  prompt: string;
  href: "/dad/questions" | "/dad/talk";
  status: DemoStatus;
}>;

export type DemoPerspectiveTeaser = Readonly<{
  kind: "editorial-perspective";
  id: string;
  title: string;
  dadSide: string;
  daughterSide: string;
  publication: DemoStatus;
  // No raw post ID, author, source quote, user account or poll response.
}>;
