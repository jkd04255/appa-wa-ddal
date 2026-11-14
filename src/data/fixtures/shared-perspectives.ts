import type { SharedPerspective, DemoQuestion } from "@/domain/perspective-editorial";

/**
 * These are hand-written fictional editorial pairs.
 * Import NO dad/daughter community fixtures or authors into this file.
 * The same IDs and copy are shown in both spaces by design.
 */
export const SHARED_PERSPECTIVES = [
  {
    kind: "synthetic-perspective",
    id: "editorial-calm-distance",
    slug: "a-comfortable-distance",
    title: "서로 편안한 대화의 거리",
    theme: "대화의 리듬",
    summary: "말을 시작하려는 마음과 혼자 생각할 시간이 함께 존재할 수 있을까요?",
    dadView: "가상의 아빠 입장에서는 짧은 질문 하나로 관심을 표현하고 싶을 수도 있습니다.",
    daughterView: "가상의 딸 입장에서는 좋아하는 것을 혼자 정리한 후 이야기하고 싶을 수도 있습니다.",
    editorialContext: "어느 쪽이 옳다는 뜻이 아닙니다. 실제 가족의 경험을 수집하거나 재현한 것이 아니라 서로의 속도를 존중하는 상황을 상상한 글입니다.",
    gentleQuestion: "지금은 이야기하고 싶은지, 잠깐 쉬고 싶은지 서로 물어볼까요?",
    notice: "시연 콘텐츠 · 양쪽 모두 합성된 편집 관점입니다",
  },
  {
    kind: "synthetic-perspective",
    id: "editorial-talk-tempo",
    slug: "the-pace-of-a-conversation",
    title: "서로에게 필요한 대화의 속도",
    theme: "일상의 속도",
    summary: "가까이 있고 싶은 마음도, 각자의 시간이 필요한 마음도 있을 수 있습니다.",
    dadView: "한쪽에서는 하루를 묻고 싶어 대화를 기다리는 가상 장면을 떠올립니다.",
    daughterView: "다른 쪽에서는 하루가 길었기에 잠시 조용히 머물고 싶은 가상 장면을 떠올립니다.",
    editorialContext: "이는 통계나 설문 결과가 아닙니다. 모든 아빠나 딸이 같은 감정을 느낀다고 일반화하지 않으며, 두 인물을 가정한 편집 예시입니다.",
    gentleQuestion: "오늘의 대화는 짧게 할까요, 조금 길게 나눌까요?",
    notice: "시연 콘텐츠 · 양쪽 모두 합성된 편집 관점입니다",
  },
  {
    kind: "synthetic-perspective",
    id: "editorial-taste-bridge",
    slug: "different-tastes-together",
    title: "다른 취향을 나누는 방식",
    theme: "취향의 교집합",
    summary: "서로 좋아하는 것이 달라도 새로운 이야기의 시작점은 만들 수 있습니다.",
    dadView: "가상 시나리오에서는 상대의 음악을 한 곡 추천받으며 이유를 물어볼 수 있습니다.",
    daughterView: "가상 시나리오에서는 취향을 평가받지 않고 가볍게 소개하고 싶을 수 있습니다.",
    editorialContext: "실제 게시글이나 익명 댓글을 편집해 가져온 내용이 아닙니다. 정해진 세대·성별 특성 대신 서로 다른 취향을 존중하는 가능성을 묘사합니다.",
    gentleQuestion: "서로의 목록에서 궁금한 것 한 가지만 골라볼까요?",
    notice: "시연 콘텐츠 · 양쪽 모두 합성된 편집 관점입니다",
  },
] as const satisfies readonly SharedPerspective[];

export const PERSPECTIVE_QUESTIONS = {
  dad: {
    kind: "demo-question",
    id: "question-dad-conversation",
    question: "가상의 대화 상황이라면 어떤 시작이 편할까요?",
    options: ["짧게 안부 묻기", "함께할 일 제안하기", "조용히 기다리기"],
    notice: "가상 질문 · 실제 투표 및 통계가 아닙니다",
  },
  daughter: {
    kind: "demo-question",
    id: "question-daughter-weekend-content",
    question: "주말에 할 콘텐츠를 고른다면?",
    options: ["음악 듣기", "카페 가기", "사진 찍기"],
    notice: "가상 질문 · 실제 투표 및 통계가 아닙니다",
  },
} as const satisfies Record<"dad" | "daughter", DemoQuestion>;

export function findSharedPerspective(slug: string) {
  return SHARED_PERSPECTIVES.find((item) => item.slug === slug) ?? null;
}

