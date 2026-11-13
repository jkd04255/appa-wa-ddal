export type BalancePoll = { id: string; question: string; left_label: string; right_label: string; left_votes: number; right_votes: number; total_votes: number };
export type VoteSide = "left" | "right";
export const EXAMPLE_POLL: BalancePoll = {
  id: "travel-plan", question: "친구랑 여행 갈 때, 나는?", left_label: "분 단위 계획파", right_label: "일단 출발 즉흥파", left_votes: 62, right_votes: 38, total_votes: 100,
};
export function pollPercent(left: number, right: number) {
  const total = left + right;
  const leftPercent = total ? Math.round(left / total * 100) : 0;
  return { left: leftPercent, right: total ? 100 - leftPercent : 0, width: total ? leftPercent : 50 };
}
