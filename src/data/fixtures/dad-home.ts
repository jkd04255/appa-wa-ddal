import type {
  DemoBrief,
  DemoCommunityPreview,
  DemoConversationCard,
  DemoPerspectiveTeaser,
  DemoTrend,
} from "@/domain/demo-editorial";

const sample = { kind: "demo", demoNotice: "시연 콘텐츠" } as const;

export const DAD_TRENDS = [
  {
    kind: "trend", id: "dad-demo-01", slug: "example-favorite-word",
    title: "‘최애’라는 말에 담긴 취향",
    summary: "좋아하는 대상을 이야기하는 작은 표현부터 살펴보는 가상의 주제입니다.",
    category: "hobby", categoryLabel: "취향", audience: "dad",
    status: sample, tone: "slate",
  },
  {
    kind: "trend", id: "dad-demo-02", slug: "example-short-video",
    title: "짧은 영상 속 웃음 코드",
    summary: "웃음 포인트가 서로 다를 수도 있다는 이야기",
    category: "video", categoryLabel: "영상", audience: "dad",
    status: sample, tone: "mist",
  },
  {
    kind: "trend", id: "dad-demo-03", slug: "example-playlist",
    title: "플레이리스트를 고르는 기준",
    summary: "음악 취향을 나누는 여러 방식",
    category: "music", categoryLabel: "음악", audience: "dad",
    status: sample, tone: "plum",
  },
  {
    kind: "trend", id: "dad-demo-04", slug: "example-snack",
    title: "친구와 나누는 간식 이야기",
    summary: "먹거리에서 시작하는 부담 없는 대화",
    category: "food", categoryLabel: "먹거리", audience: "dad",
    status: sample, tone: "sand",
  },
  {
    kind: "trend", id: "dad-demo-05", slug: "example-personal-style",
    title: "작은 물건에 담긴 자기표현",
    summary: "소품과 꾸미기를 취향으로 바라보기",
    category: "fashion", categoryLabel: "스타일", audience: "dad",
    status: sample, tone: "moss",
  },
] as const satisfies readonly DemoTrend[];

export const DAD_BRIEFING = [
  { id: "brief-demo-01", title: "취향은 서로 달라도 괜찮습니다", summary: "좋아하는 이유를 먼저 궁금해하는 태도", status: sample },
  { id: "brief-demo-02", title: "모르는 단어는 가볍게 물어보기", summary: "정답보다 맥락을 듣는 짧은 질문", status: sample },
  { id: "brief-demo-03", title: "대화를 마칠 때도 여유 있게", summary: "반응을 기다리는 것 역시 대화의 일부", status: sample },
] as const satisfies readonly DemoBrief[];

export const DAD_COMMUNITY_PREVIEW = [
  {
    kind: "demo-community-post", id: "dad-post-demo-01", space: "dad",
    board: "함께 고민", title: "관심사를 자연스럽게 물어보려면?",
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
  {
    kind: "demo-community-post", id: "dad-post-demo-02", space: "dad",
    board: "일상", title: "주말에 함께 할 일을 고른다면?",
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
] as const satisfies readonly DemoCommunityPreview[];

export const DAD_CONVERSATION = [
  { kind: "question", title: "아빠들이 궁금한 질문", prompt: "좋아하는 걸 물을 때 무엇부터 시작할까요?", href: "/dad/questions", status: sample },
  { kind: "talk", title: "이번 주 대화 소재", prompt: "서로 다른 음악 취향에 대해 이야기해보기", href: "/dad/talk", status: sample },
] as const satisfies readonly DemoConversationCard[];

export const DAD_PERSPECTIVE = {
  kind: "editorial-perspective", id: "perspective-demo-01",
  title: "서로 편안한 대화의 거리",
  dadSide: "한 번쯤 먼저 이야기하고 싶을 때",
  daughterSide: "혼자 생각할 시간도 필요할 때",
  publication: sample,
} as const satisfies DemoPerspectiveTeaser;
