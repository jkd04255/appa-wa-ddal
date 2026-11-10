# G0-04 TypeScript 데이터 모델 및 합성 데이터 계약 v1.0

> 현재 문서는 설계 예시이며 실제 타입 코드, DB, API, fixture 파일은 **생성하지 않았다**.  
> 선행 문서: [기술 아키텍처](./TECHNICAL_ARCHITECTURE.md), [정보구조](./INFORMATION_ARCHITECTURE.md), [디자인 시스템](./DESIGN_SYSTEM.md)  
> 2026-11-10 KST / G0-04 문서 단계

## 1. 안전한 데이터 경계

- Phase 1은 합성 데이터만 로컬 읽기 전용으로 사용한다. 실사용자 게시글·댓글·설문 결과·개인정보를 파일이나 서버/브라우저 장기 저장소에 기록하지 않는다.
- 공개 편집 콘텐츠, 커뮤니티 샘플, 서로의 시선 편집본은 서로 다른 타입/폴더/렌더링 뷰 모델로 구분한다.
- 아빠/딸은 콘텐츠 탐색 공간이지 검증된 사용자 권한이 아니다.
- 모든 합성 카드에는 가상 데이터임을 알리는 명시적 문구가 필요하다.
- 실제 매출/쇼핑 정보, SNS 유행, 투표 결과를 출처 검증 없이 현재 사실로 표시하지 않는다.

## 2. 제안 TypeScript 모델 (비실행 문서 예시)

~~~typescript
type Space = "dad" | "daughter";
type Audience = Space | "both";
type ISODate = string; // YYYY-MM-DD: runtime parsing/validation required
type ContentId = string;
type Slug = string;

type Category =
  | "meme" | "idol" | "food" | "fashion" | "beauty"
  | "school" | "shopping" | "video" | "hobby" | "family";

type DemoStatus = {
  kind: "demo";
  demoNotice: "시연 콘텐츠";
};
type VerifiedStatus = {
  kind: "verified";
  reviewStatus: "approved";
  sourceUrl: string; // HTTPS only; runtime URL validation required
  verifiedAt: ISODate;
  publishedAt?: ISODate;
};
type ExpiredStatus = {
  kind: "expired";
  label: "종료된 행사";
  sourceUrl: string;
  expiresAt: ISODate;
  verifiedAt: ISODate;
};
type UnknownStatus = {
  kind: "unverified";
  label: "정보 확인 필요";
};
type ContentStatus =
  | DemoStatus | VerifiedStatus | ExpiredStatus | UnknownStatus;

type EditorialItem = Readonly<{
  kind: "trend" | "briefing" | "discovery";
  id: ContentId;
  slug: Slug;
  title: string;
  summary: string;
  category: Category;
  audience: Audience;
  coverAssetId?: string;
  status: ContentStatus;
  whyItMatters?: string;
  conversationHint?: string;
}>;

type SaleItem = Readonly<{
  kind: "sale";
  id: ContentId;
  slug: Slug;
  title: string;
  summary: string;
  audience: "daughter";
  status: ContentStatus;
  startsAt?: ISODate;
  expiresAt?: ISODate;
  conditions?: string;
  offerSummary?: string;
}>;

type DemoCommunityComment = Readonly<{
  id: ContentId;
  postId: ContentId;
  text: string;
  demoNotice: "샘플 댓글";
}>;

type DemoCommunityPost = Readonly<{
  kind: "demo-community-post";
  id: ContentId;
  space: Space;
  board: string;
  title: string;
  excerpt: string;
  demoNotice: "샘플 게시글 · 실제 저장되지 않습니다";
  comments: readonly DemoCommunityComment[];
}>;

type DemoPoll = Readonly<{
  kind: "demo-poll";
  id: ContentId;
  question: string;
  options: readonly string[];
  demoNotice: "실제 투표 결과가 아닙니다";
  // Phase 1: real vote counts and percentages unavailable
}>;

type ApprovedPerspective = Readonly<{
  kind: "editorial-perspective";
  id: ContentId;
  slug: Slug;
  title: string;
  dadSide: readonly string[];
  daughterSide: readonly string[];
  disclosure: string;
  // no original post ID, username, contact details or source URL
}>;
~~~

**중요:** TS 타입은 런타임 외부 입력을 자동으로 검증하지 않는다. 실제 구현 시 분기·날짜·URL·허용된 필드에 대한 검증 함수를 따로 작성한다. 버전 및 타입 컴파일 통과 여부는 G1-01 이후 확인.

## 3. 콘텐츠 상태 판정표

| 상태 | 화면 레이블 | 허용 행동 | 금지 |
| --- | --- | --- | --- |
| demo | 시연 콘텐츠 | 안전한 샘플 화면 탐색 | 진짜 인기·응답 수·실시간 쇼핑 정보인 듯 표기 |
| verified | 출처 + 최종 확인일 | 사용자가 최신성/기간 확인 | 확인 날짜가 과거인 이벤트를 자동으로 진행 중이라고 주장 |
| expired | 종료된 행사 + 종료일 | 과거 사례로 읽기 | 현재 할인 표시 |
| unverified | 정보 확인 필요 | 공개 보류 또는 정보 부족 안내 | 임의 출처·만료일·혜택 생성 |
| 잘못된 slug | 404 | 목록 복귀 | 다른 글 자동 대체 |

**행사 진행 중 표시 조건:** 관리자 검증/승인, 유효한 HTTPS 원본, 확인일, 행사 시작·종료 범위, 현재 시각 대비 기간 및 최신성 확인이 **모두** 필요하다. 현재를 기준으로 계산할 때는 한국 시간대 등 명시적 기준 시간대를 사용한다. 날짜 불명·일정 만료·검증 불가 시 안전하게 ‘확인 필요/종료’로 내린다.

## 4. 합성 fixture 예시 (Git에 생성하지 않음)

~~~typescript
const demoTrend: EditorialItem = {
  kind: "trend",
  id: "trend-demo-01",
  slug: "example-favorite-snack",
  title: "[가상 예시] 간식 취향 이야기",
  summary: "카드 길이와 상세 이동을 시험하는 가상 설명입니다.",
  category: "food",
  audience: "dad",
  status: { kind: "demo", demoNotice: "시연 콘텐츠" }
};

const demoPost: DemoCommunityPost = {
  kind: "demo-community-post",
  id: "dad-demo-01",
  space: "dad",
  board: "자유",
  title: "[샘플] 함께 고를 주말 취미",
  excerpt: "실제 가족 사례가 아닌 UI 시연용 문장입니다.",
  demoNotice: "샘플 게시글 · 실제 저장되지 않습니다",
  comments: []
};
~~~

합성 fixture에는 실명·이메일·전화번호·학교·구체 위치·건강 정보·민감한 개인 사연·미성년자 사진을 넣지 않는다. SNS 글이나 기사 원문을 복사하지 않는다.

## 5. 단계별 검증 규칙

| 모델 | 입력 유효성 | 허용된 공개 필드 | 금지 |
| --- | --- | --- | --- |
| EditorialItem | 유일 id·slug, title, audience, category, ContentStatus | 제목·요약·정상 출처/확인일 | 내부 운영자 식별·추정 수치 |
| SaleItem | 유효 행사 기간·상태·확인일·HTTPS URL | 실제 검증/만료 정보 또는 데모 표시 | 확인 전 ‘현재 세일 중’ |
| DemoCommunityPost | 현재 공간의 허용 board, 모든 샘플 표기 | 합성 제목·내용·합성 댓글 | 실제 연락처·작성자 계정·저장 |
| DemoPoll | 가상 질문과 옵션, 샘플 표시 | 구조 시연 | 가짜 응답 수·퍼센트 |
| ApprovedPerspective | 별도 편집/합성 메타, 승인된 요약 | 다양한 관점의 편집본 | 원문 ID/링크·정확 인용·소표본 노출 |

- 렌더링 전에 public view-model allowlist를 적용한다.
- 콘텐츠 메타의 URL은 HTTPS·올바른 호스트·출처 검증, 불필요한 개인정보 매개변수 제거 대상이다.
- 사용자 글쓰기 데모는 React 컴포넌트 메모리 안에만 유지하고 새로고침/전환에 폐기한다.
- 실운영 사용자 생성 콘텐츠의 저장·공개는 G2 보안 및 법률/운영 검토 전까지 허용하지 않는다.

## 6. Phase 1 데이터 흐름

~~~text
readonly typed fixture
    -> pure selectors / validation
    -> public editorial view-model
    -> Server Component (읽기 전용 카드·상세)
    -> 작은 Client island (필터·정렬·시연 글쓰기)
    -> React 메모리만, 요청/장기 저장 없음

G2 이전 금지:
실계정 -> 서버 권한 -> RLS -> 역할 커뮤니티
                 -> 동의·편집 승인 -> 비식별 집계만 교차 공개
~~~

‘서로의 시선’의 **같은 ID**는 양쪽의 **같은 승인된 편집 콘텐츠**를 뜻한다. 다른 공간의 실제 게시물 원문이나 위치를 공유한다는 뜻이 아니다.

## 7. G1 인수 조건과 남은 제약

- G1-01: 실제 TypeScript strict/ESLint/빌드 설치 후 타입 검증.
- G1-04~06: slug 누락·카테고리·공개 상태·데모 표시·검증일·만료일 분기 테스트.
- G1-07: 사용자 입력의 DB/API/analytics/localStorage 전송 0, 가상 글만.
- G1-08: 원문 글 ID, 이름·연락처, 응답 수치, 검색 가능 인용이 perspective view-model에 없는지 테스트.
- G2: 서버 권한 부정 테스트, RLS, 만 14세 미만 작성 제한 정책, 법적 동의·운영 준비를 통과한 **폐쇄형 시험** 검토.
- 본 문서의 예시는 **컴파일 미실시**. 실행 가능하다는 보장이 아니라 구현 계약의 출발점이다.
