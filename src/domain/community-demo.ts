/**
 * G1-07 demo-only community view models.
 * No real author identity, timestamps, engagement counts, or personal details.
 * A role choice/URL is NEVER authorization; there are no write endpoints.
 */
export type CommunitySpace = "dad" | "daughter";
export type DadBoard = "함께 고민" | "일상";
export type DaughterBoard = "취향 기록" | "일상";
export type DemoComment = Readonly<{
  kind: "demo-comment";
  id: string;
  body: string;
  demoNotice: "샘플 댓글 · 실제 작성된 의견이 아닙니다";
}>;

type BasePost<S extends CommunitySpace, B extends string> = Readonly<{
  kind: "demo-community-post";
  id: string;
  space: S;
  board: B;
  title: string;
  excerpt: string;
  body: string;
  sampleOrder: number;
  comments: readonly DemoComment[];
  demoNotice: "샘플 게시글 · 실제 저장되지 않습니다";
}>;

export type DadDemoPost = BasePost<"dad", DadBoard>;
export type DaughterDemoPost = BasePost<"daughter", DaughterBoard>;
export type CommunityDemoPost = DadDemoPost | DaughterDemoPost;

export type CommunityDemoProps =
  | Readonly<{ space: "dad"; posts: readonly DadDemoPost[]; boards: readonly DadBoard[] }>
  | Readonly<{ space: "daughter"; posts: readonly DaughterDemoPost[]; boards: readonly DaughterBoard[] }>;
