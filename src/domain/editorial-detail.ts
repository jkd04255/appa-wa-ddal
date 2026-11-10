/** G1-06: no verified source records are provided; every published item remains demo. */
export type DemoDetailCopy = Readonly<{
  kind: "demo";
  sourceNotice: "합성 시연 자료 · 외부 원문 없음";
  background: string;
  context: string;
  tip: string;
  conversation: string;
}>;

export const DEMO_SOURCE_NOTICE = "합성 시연 자료 · 외부 원문 없음" as const;

/** Unsourced information never becomes "verified" by omission or age. */
export type SourceDisplay =
  | Readonly<{ kind: "demo"; label: "시연 콘텐츠"; detail: typeof DEMO_SOURCE_NOTICE }>
  | Readonly<{ kind: "unverified"; label: "정보 확인 필요"; detail: "공식 출처·검증일 확인 전 공개 정보 아님" }>;

export function sourceDisplay(status: { readonly kind: string }): SourceDisplay {
  if (status.kind === "demo") {
    return { kind: "demo", label: "시연 콘텐츠", detail: DEMO_SOURCE_NOTICE };
  }
  // "verified"/"expired" are not accepted from a loose record without source approval,
  // date checks and a separate reviewed content pipeline.
  return { kind: "unverified", label: "정보 확인 필요", detail: "공식 출처·검증일 확인 전 공개 정보 아님" };
}
