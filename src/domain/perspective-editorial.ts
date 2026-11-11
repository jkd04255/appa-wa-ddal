/**
 * G1-08 cross-space public editorial contract.
 * Completely fabricated copy; NEVER derived from community posts, replies or users.
 * Deliberately no author, originalPostId, originalQuote, groupCount, sampleSize,
 * respondent, account, sourceReference, demographic, pollVote or timestamps.
 */
export type PerspectiveSpace = "dad" | "daughter";
export type SharedPerspective = Readonly<{
  kind: "synthetic-perspective";
  id: `editorial-${string}`;
  slug: string;
  title: string;
  theme: string;
  summary: string;
  dadView: string;
  daughterView: string;
  editorialContext: string;
  gentleQuestion: string;
  notice: "시연 콘텐츠 · 양쪽 모두 합성된 편집 관점입니다";
}>;

export type DemoQuestion = Readonly<{
  kind: "demo-question";
  id: `question-${string}`;
  question: string;
  options: readonly [string, string, string];
  notice: "가상 질문 · 실제 투표 및 통계가 아닙니다";
}>;

/** Only a view model; user choice never leaves React component memory. */
export type DemoChoiceState = string | null;
