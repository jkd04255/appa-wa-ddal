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
  categoryLabel: "팬덤 · 미디어",
  title: "최애가 추천한 곡인데… 댓글은 ‘취향 존중’과 ‘이건 별로’로 갈렸다",
  summary: "실제 아티스트나 팬덤 이야기가 아닌, 취향이 부딪히는 순간을 만든 가상 편집글입니다.",
  cover: "/editorial/headphones-magazine.jpg",
  coverAlt: "음악 잡지 위에 놓인 헤드폰을 촬영한 분위기 사진",
  status: demo,
} as const satisfies DaughterDiscovery;

export const DAUGHTER_DISCOVERY = [
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-01",
    slug: "sample-beauty-notes", category: "beauty", categoryLabel: "뷰티",
    title: "사진에선 로즈, 교실 조명 아래선 형광 핑크? 립 색이 뒤집히는 순간",
    summary: "조명·카메라·화면 밝기가 인상을 바꾸는 가상 비교글입니다.",
    cover: "/editorial/beauty-stilllife.jpg",
    coverAlt: "립스틱과 과일을 배치한 뷰티 정물 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-02",
    slug: "sample-cafe-dessert", category: "food", categoryLabel: "먹거리",
    title: "바이럴 사진은 완벽했는데 한 입 뒤 반응은 반전? 디저트 기대가 갈리는 순간",
    summary: "실제 매장 리뷰가 아닌 사진과 기대를 둘러싼 가상 편집글입니다.",
    cover: "/editorial/cafe-dessert.jpg",
    coverAlt: "카페 테이블 위의 커피와 디저트를 촬영한 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-03",
    slug: "sample-late-night-vinyl", category: "culture", categoryLabel: "팬덤",
    title: "최애가 같은데 ‘진짜 팬’ 기준은 왜 다를까? 굿즈 하나로 갈린 댓글",
    summary: "팬심을 소비와 연결하는 압박을 다룬 가상 사례입니다.",
    cover: "/editorial/vinyl-night.jpg",
    coverAlt: "어두운 조명 아래 턴테이블과 레코드를 촬영한 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-04",
    slug: "sample-fan-rule", category: "culture", categoryLabel: "팬덤",
    title: "굿즈 안 샀다고 팬 아니야? ‘진짜 팬’ 기준에 댓글이 갈린 이유",
    summary: "실제 팬덤의 반응이 아닌, 소비와 팬심의 경계를 묻는 가상 토론입니다.",
    cover: "/editorial/headphones-magazine.jpg",
    coverAlt: "헤드폰과 음악 잡지를 촬영한 분위기 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-05",
    slug: "sample-group-chat", category: "culture", categoryLabel: "친구 · 학교",
    title: "단톡방에 나만 빠진 약속… ‘실수’라는 말, 믿어도 될까?",
    summary: "누구의 실화도 아닌, 친구 사이의 오해를 가정한 짧은 시나리오입니다.",
    cover: "/editorial/cafe-dessert.jpg",
    coverAlt: "테이블 위에 놓인 커피와 디저트를 촬영한 분위기 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-06",
    slug: "sample-joke-boundary", category: "culture", categoryLabel: "친구 · 학교",
    title: "“장난인데 왜 그래?” 웃지 못한 사람은 예민한 걸까?",
    summary: "친구 사이 농담의 선을 두고 의견이 갈리는 가상 상황입니다.",
    cover: "/editorial/vinyl-night.jpg",
    coverAlt: "어두운 조명 아래 턴테이블과 레코드를 촬영한 사진",
    status: demo,
  },
] as const satisfies readonly DaughterDiscovery[];

export const DAUGHTER_SHOPPING = [
  {
    kind: "sale", id: "daughter-shop-demo-01",
    title: "세일이라 담았는데 총액에서 멈췄다 — 장바구니를 비운 마지막 숫자",
    summary: "실제 가격이나 할인율이 아닌, 결제 전에 예산을 확인하는 가상 상황입니다.",
    status: demo,
  },
  {
    kind: "sale", id: "daughter-shop-demo-02",
    title: "유행템 안 샀다고 놓친 걸까? 사고 싶은 마음과 필요 사이",
    summary: "특정 제품을 권하는 내용이 아닌 합성 소비 시나리오입니다.",
    status: demo,
  },
] as const satisfies readonly DaughterShopping[];

export const DAUGHTER_COMMUNITY = [
  {
    kind: "demo-community-post", id: "daughter-post-demo-01", space: "daughter",
    board: "팬덤", title: "친구가 내 최애를 싫어한대. 취향 차이로 끝내도 돼?",
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
  {
    kind: "demo-community-post", id: "daughter-post-demo-02", space: "daughter",
    board: "학교·친구", title: "나만 빠진 약속인 걸 뒤늦게 봤다. 바로 물어볼까?",
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
] as const satisfies readonly DaughterCommunity[];

export const DAUGHTER_POLL = {
  kind: "demo-poll", id: "daughter-poll-demo-01",
  question: "단톡방에서 나만 빠진 약속을 봤다면?",
  options: ["바로 물어본다", "하루 기다린다", "따로 약속을 잡는다"],
  demoNotice: "실제 투표 결과가 아닙니다",
} as const satisfies DaughterPoll;
