import type {
  DaughterCommunity,
  DaughterDiscovery,
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
  categoryLabel: "음악",
  title: "인디 음악 플레이리스트",
  summary: "차트·인기 순위가 아닌 시연용 음악 콘텐츠입니다.",
  cover: "/editorial/headphones-magazine.jpg",
  coverAlt: "음악 잡지 위에 놓인 헤드폰을 촬영한 분위기 사진",
  status: demo,
} as const satisfies DaughterDiscovery;

export const DAUGHTER_DISCOVERY = [
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-01",
    slug: "sample-beauty-notes", category: "beauty", categoryLabel: "뷰티",
    title: "메이크업 색상 조합 기록",
    summary: "상품 추천이나 성분 검증이 아닌 가상 편집 예시입니다.",
    cover: "/editorial/beauty-stilllife.jpg",
    coverAlt: "립스틱과 과일을 배치한 뷰티 정물 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-02",
    slug: "sample-cafe-dessert", category: "food", categoryLabel: "먹거리",
    title: "카페 디저트 사진",
    summary: "실제 매장 정보나 후기가 아닌 시연 콘텐츠입니다.",
    cover: "/editorial/cafe-dessert.jpg",
    coverAlt: "카페 테이블 위의 커피와 디저트를 촬영한 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-03",
    slug: "sample-late-night-vinyl", category: "culture", categoryLabel: "문화 · 음악",
    title: "바이닐 음악 편집글",
    summary: "실제 아티스트나 음원 순위가 아닌 가상 콘텐츠입니다.",
    cover: "/editorial/vinyl-night.jpg",
    coverAlt: "어두운 조명 아래 턴테이블과 레코드를 촬영한 사진",
    status: demo,
  },
] as const satisfies readonly DaughterDiscovery[];

export const DAUGHTER_SHOPPING = [
  {
    kind: "sale", id: "daughter-shop-demo-01",
    title: "상품 정보 확인",
    summary: "제품 설명을 비교하는 가상 화면 예시입니다.",
    status: demo,
  },
  {
    kind: "sale", id: "daughter-shop-demo-02",
    title: "할인 정보 확인",
    summary: "실시간 행사 정보가 아닌 시연용 텍스트입니다.",
    status: demo,
  },
] as const satisfies readonly DaughterShopping[];

export const DAUGHTER_COMMUNITY = [
  {
    kind: "demo-community-post", id: "daughter-post-demo-01", space: "daughter",
    board: "음악", title: "최근 저장한 플레이리스트",
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
  {
    kind: "demo-community-post", id: "daughter-post-demo-02", space: "daughter",
    board: "일상", title: "주말 할 일 목록",
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
] as const satisfies readonly DaughterCommunity[];

export const DAUGHTER_POLL = {
  kind: "demo-poll", id: "daughter-poll-demo-01",
  question: "주말에 할 콘텐츠를 고른다면?",
  options: ["음악 듣기", "카페 가기", "사진 찍기"],
  demoNotice: "실제 투표 결과가 아닙니다",
} as const satisfies DaughterPoll;

