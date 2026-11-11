/**
 * Hand-authored, fixed-choice demo content representing the operator-curated
 * publication workflow. This is static source data, not an in-app CMS.
 */
export const OPERATOR_POLL = {
  kind: "operator-poll",
  id: "operator-poll-weekend-topic",
  question: "주말에 가볍게 즐기고 싶은 이야기는 무엇인가요?",
  options: ["음악과 플레이리스트", "간식과 디저트", "산책과 나들이"],
  interaction: "session-only",
  persistResponses: false,
  aggregateResponses: false,
} as const;

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
