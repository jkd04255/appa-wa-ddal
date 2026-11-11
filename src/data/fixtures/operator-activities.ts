/**
 * Hand-authored, fixed-choice demo content representing the operator-curated
 * publication workflow. This is static source data, not an in-app CMS.
 */
export const OPERATOR_TOURNAMENT = {
  kind: "operator-tournament",
  id: "operator-tournament-day-off",
  title: "쉬는 날의 작은 취향 토너먼트",
  entries: [
    "집에서 영화 보기",
    "친구와 카페 가기",
    "산책하며 음악 듣기",
    "좋아하는 음식 먹기",
  ],
  interaction: "session-only",
  persistResponses: false,
  aggregateResponses: false,
} as const;
