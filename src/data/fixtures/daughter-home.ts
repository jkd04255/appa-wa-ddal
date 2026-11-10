import type {
  DaughterCommunity,
  DaughterDiscovery,
  DaughterPerspective,
  DaughterPoll,
  DaughterShopping,
} from "@/domain/daughter-editorial";

const demo = { kind: "demo", demoNotice: "시연 콘텐츠" } as const;

export const DAUGHTER_FEATURE = {
  kind: "discovery",
  audience: "daughter",
  id: "daughter-feature-01",
  slug: "sample-offbeat-playlist",
  category: "culture",
  categoryLabel: "음악 · 취향",
  title: "남들이 잘 모르는 노래를 좋아하는 마음",
  summary: "작고 조용한 플레이리스트에서 시작하는 취향 이야기.",
  cover: "/editorial/headphones-magazine.jpg",
  coverAlt: "음악 잡지 위에 놓인 헤드폰을 촬영한 분위기 사진",
  status: demo,
} as const satisfies DaughterDiscovery;

export const DAUGHTER_DISCOVERY = [
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-01",
    slug: "sample-beauty-notes", category: "beauty", categoryLabel: "뷰티",
    title: "화장대 위, 취향을 기록하는 방법",
    summary: "새로운 제품보다 내게 맞는 감각을 발견하는 일.",
    cover: "/editorial/beauty-stilllife.jpg",
    coverAlt: "립스틱과 과일을 배치한 뷰티 정물 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-02",
    slug: "sample-cafe-dessert", category: "food", categoryLabel: "먹거리",
    title: "조용한 카페에서 고르는 한 접시",
    summary: "먹는 순간보다 그 공간의 분위기를 기억하기.",
    cover: "/editorial/cafe-dessert.jpg",
    coverAlt: "카페 테이블 위의 커피와 디저트를 촬영한 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-03",
    slug: "sample-late-night-vinyl", category: "culture", categoryLabel: "문화 · 음악",
    title: "조금 낯선 음악이 더 오래 남을 때",
    summary: "익숙한 취향 바깥에서 발견하는 새로운 소리.",
    cover: "/editorial/vinyl-night.jpg",
    coverAlt: "어두운 조명 아래 턴테이블과 레코드를 촬영한 사진",
    status: demo,
  },
] as const satisfies readonly DaughterDiscovery[];

export const DAUGHTER_SHOPPING = [
  {
    kind: "sale", id: "daughter-shop-demo-01",
    title: "장바구니보다 먼저 체크할 것",
    summary: "제품 설명과 성분을 읽는 가상의 쇼핑 노트.",
    status: demo,
  },
  {
    kind: "sale", id: "daughter-shop-demo-02",
    title: "세일 소식을 확인하는 기준",
    summary: "행사 기간과 조건이 확인되기 전에는 할인으로 표시하지 않아요.",
    status: demo,
  },
] as const satisfies readonly DaughterShopping[];

export const DAUGHTER_COMMUNITY = [
  {
    kind: "demo-community-post", id: "daughter-post-demo-01", space: "daughter",
    board: "취향 기록", title: "요즘 반복해서 듣고 싶은 노래는?",
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
  {
    kind: "demo-community-post", id: "daughter-post-demo-02", space: "daughter",
    board: "일상", title: "혼자 보내는 주말에 해보고 싶은 일",
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
] as const satisfies readonly DaughterCommunity[];

export const DAUGHTER_POLL = {
  kind: "demo-poll", id: "daughter-poll-demo-01",
  question: "오늘 기분을 표현한다면?",
  options: ["음악", "음식", "한 장의 사진"],
  demoNotice: "실제 투표 결과가 아닙니다",
} as const satisfies DaughterPoll;

export const DAUGHTER_PERSPECTIVE = {
  kind: "editorial-perspective", id: "daughter-perspective-demo-01",
  title: "서로에게 필요한 대화의 속도",
  dadSide: "더 이야기하고 싶은 마음",
  daughterSide: "스스로 정리할 시간이 필요한 마음",
  publication: demo,
} as const satisfies DaughterPerspective;
