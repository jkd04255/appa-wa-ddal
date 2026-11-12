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
  title: "최애 곡에 ‘별로’ 한마디 했더니… “팬 맞아?” 역공 시작",
  summary: "노래 한 곡이 별로라 했더니 팬 자격까지 따져 묻는 상황으로 번진 가상 편집글입니다.",
  cover: "/editorial/headphones-magazine.jpg",
  coverAlt: "음악 잡지 위에 놓인 헤드폰을 촬영한 분위기 사진",
  status: demo,
} as const satisfies DaughterDiscovery;

export const DAUGHTER_DISCOVERY = [
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-01",
    slug: "sample-beauty-notes", category: "beauty", categoryLabel: "뷰티",
    title: "필터에선 쿨핑크였는데… 내 입술에 바르자 형광? 후기 믿은 날의 반전",
    summary: "필터·조명·화면 밝기가 바꿔 놓은 색을 두고 후기가 다르다며 갈리는 가상 상황입니다.",
    cover: "/editorial/beauty-stilllife.jpg",
    coverAlt: "립스틱과 과일을 배치한 뷰티 정물 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-02",
    slug: "sample-cafe-dessert", category: "food", categoryLabel: "먹거리",
    title: "40분 줄 서서 샀는데 한 입 뒤 정적… 사진만 믿은 대가?",
    summary: "사진 속 비주얼과 실제 한 입의 반응이 엇갈리는 가상 리뷰입니다. 실제 매장 평가는 아닙니다.",
    cover: "/editorial/cafe-dessert.jpg",
    coverAlt: "카페 테이블 위의 커피와 디저트를 촬영한 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-03",
    slug: "sample-late-night-vinyl", category: "culture", categoryLabel: "팬덤",
    title: "최애 생일 광고에 돈 안 보탰다고 아웃? 팬덤 인증이 돼버린 응원",
    summary: "응원 방식과 지출을 팬 자격의 기준처럼 묻는 가상 팬덤 논쟁입니다.",
    cover: "/editorial/vinyl-night.jpg",
    coverAlt: "어두운 조명 아래 턴테이블과 레코드를 촬영한 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-04",
    slug: "sample-fan-rule", category: "culture", categoryLabel: "팬덤",
    title: "굿즈 못 샀다고 ‘팬 아님’… 지갑 사정까지 시험대 오른 팬심",
    summary: "굿즈를 살 여력이 팬 자격을 결정하는 듯한 가상 댓글 논쟁입니다.",
    cover: "/editorial/headphones-magazine.jpg",
    coverAlt: "헤드폰과 음악 잡지를 촬영한 분위기 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-05",
    slug: "sample-group-chat", category: "culture", categoryLabel: "친구 · 학교",
    title: "약속 사진은 다 올라왔는데 나만 몰랐다… ‘너한테 말한 줄’이 진짜 실수일까?",
    summary: "모두가 알던 약속에서 혼자만 빠진 듯한 순간을 가정한 가상 시나리오입니다.",
    cover: "/editorial/cafe-dessert.jpg",
    coverAlt: "테이블 위에 놓인 커피와 디저트를 촬영한 분위기 사진",
    status: demo,
  },
  {
    kind: "discovery", audience: "daughter", id: "daughter-discover-06",
    slug: "sample-joke-boundary", category: "culture", categoryLabel: "친구 · 학교",
    title: "싫다고 했는데 세 번 더… 아직도 ‘장난’이라고 넘겨야 하나?",
    summary: "그만해달라고 말한 뒤에도 반복된 농담을 둘러싼 가상 시나리오입니다.",
    cover: "/editorial/vinyl-night.jpg",
    coverAlt: "어두운 조명 아래 턴테이블과 레코드를 촬영한 사진",
    status: demo,
  },
] as const satisfies readonly DaughterDiscovery[];

export const DAUGHTER_SHOPPING = [
  {
    kind: "sale", id: "daughter-shop-demo-01",
    title: "‘오늘만’ 알림에 담았는데… 결제 직전 총액 보고 손이 멈췄다",
    summary: "실제 할인이나 판매처가 아닌, 급히 담은 뒤 예산을 다시 확인하는 가상 소비 상황입니다.",
    status: demo,
  },
  {
    kind: "sale", id: "daughter-shop-demo-02",
    title: "다들 샀다는데 나만 안 사면 뒤처져? 유행템 결제 직전의 불안",
    summary: "특정 상품 추천이 아닌, 또래 소비 압박과 내 예산 사이에서 고민하는 가상 장면입니다.",
    status: demo,
  },
] as const satisfies readonly DaughterShopping[];

export const DAUGHTER_COMMUNITY = [
  {
    kind: "demo-community-post", id: "daughter-post-demo-01", space: "daughter",
    board: "취향 기록", title: "“그 노래 별로” 한마디에 팬 자격까지 심사받았다",
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
  {
    kind: "demo-community-post", id: "daughter-post-demo-02", space: "daughter",
    board: "일상", title: "단체 사진엔 다 있는데 약속은 나만 몰랐다… ‘실수’라고?",
    demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  },
] as const satisfies readonly DaughterCommunity[];

export const DAUGHTER_POLL = {
  kind: "demo-poll", id: "daughter-poll-demo-01",
  question: "나만 빠진 약속 사진을 봤다면? “실수였어”로 끝낼까?",
  options: ["바로 이유를 묻는다", "사실부터 확인한다", "한 발 물러난다"],
  demoNotice: "실제 투표 결과가 아닙니다",
} as const satisfies DaughterPoll;
