# G0-04 기술 아키텍처 · 라우팅 및 컴포넌트 계약 v1.0

> 상태: 설계 문서 승인 후보. 실제 코드 구현/빌드·배포 미실시  
> 기준 문서: [개발 계획서](./DEVELOPMENT_PLAN.md), [G0-02 IA](./INFORMATION_ARCHITECTURE.md), [디자인 시스템](./DESIGN_SYSTEM.md), [모바일 와이어프레임](./WIREFRAMES.md)  
> 보조 문서: [TypeScript/합성 데이터 계약](./DATA_CONTRACTS.md), [보안·검증 기준](./SECURITY_TEST_PLAN.md)  
> 작성: 2026-11-10 (KST)

## 1. 시스템 경계와 의사결정

제품 기본 기술 후보: Next.js App Router, React, TypeScript strict, Tailwind CSS. **의존성의 구체 버전은 G1-01에서 실제 lockfile과 CI 검증 후 고정**하며 지금 저장소에 package.json 등 구현 파일을 만들지 않는다.

| 결정 | 채택 | 근거 / 구현 시 확인 |
| --- | --- | --- |
| ADR-04-01 | App Router 파일 라우팅과 루트/역할별 중첩 layout | IA의 아빠/딸 URL 유지. 상단·하단 navigation의 중복 제거 |
| ADR-04-02 | 기본 Server Component, 최소 Client island | 콘텐츠 HTML 우선/초기 JS 최소화. 필터·공간 선택·데모 입력만 클라이언트 |
| ADR-04-03 | Phase 1 읽기 전용 TS 합성 fixture | 개인 데이터/실계정 저장 없이 UI 검증 |
| ADR-04-04 | 최초 / 랜딩, 재방문 마지막 선택 공간, 수동 랜딩 복귀 | 제품 v2.0 요구. 익명 탐색 상태 ≠ 계정/역할 인증 |
| ADR-04-05 | URL로 ‘아빠/딸’을 탐색할 수 있지만 쓰기 권한은 0 | Phase 1은 기능 데모만. G2 별도 서버 검증 없이는 실제 역할 전용 쓰기 불가 |
| ADR-04-06 | 공용 콘텐츠/사연 원문을 한 저장소로 합치지 않음 | 원문 역추적/재식별을 설계 단계부터 방지 |
| ADR-04-07 | 단계별 구현·검증 PR, 기본 브랜치 직접 변경 금지 | 기능과 QA 회귀 범위 최소화 |

**초기 공개 배포 금지:** G0-04에서는 UI 코드, Supabase Auth/DB/RLS, API, server actions, 실사용자 게시글/투표 저장, 로그인, 유료 API, 개인정보 수집, 서비스 배포 모두 보류.

## 2. 라우트와 레이아웃

### 2.1 제안 파일 구조 (미생성)

~~~text
src/
  app/
    layout.tsx                      # 글로벌 html/body·기본 metadata
    not-found.tsx                   # 공통 404
    (public)/
      page.tsx                      # / 선택 랜딩
      about/page.tsx                # /about
      help/safety/page.tsx          # /help/safety
    dad/
      layout.tsx                    # 아빠 theme/header/nav
      page.tsx                      # /dad
      trends/page.tsx               # /dad/trends
      trends/[slug]/page.tsx        # /dad/trends/:slug
      briefing/page.tsx             # /dad/briefing
      community/page.tsx            # /dad/community
      community/new/page.tsx        # /dad/community/new, Phase 1 데모
      community/[id]/page.tsx       # /dad/community/:id, 합성 fixture
      questions/page.tsx            # /dad/questions
      talk/page.tsx                 # /dad/talk
      perspectives/page.tsx         # /dad/perspectives
      perspectives/[slug]/page.tsx  # /dad/perspectives/:slug
    daughter/
      layout.tsx
      page.tsx                      # /daughter
      discover/page.tsx
      discover/[slug]/page.tsx
      sales/[slug]/page.tsx
      community/page.tsx
      community/new/page.tsx
      community/[id]/page.tsx
      polls/page.tsx
      father-notes/page.tsx
      perspectives/page.tsx
      perspectives/[slug]/page.tsx
  components/
    shell/                          # Header, BottomNav, SpaceMenu
    editorial/                      # EditorialHero, StoryCard, SourceMeta
    community/                      # DemoPostList, DemoComposer, DemoLabel
    perspectives/                   # PerspectiveCard, ApprovedSummary
    ui/                             # Button/Link, StatusLabel, EmptyState
  features/
    navigation/                     # Route-to-tab mapping / role preference
    content/                        # view-model selectors, validity rules
    demo/                           # ephemeral demo interaction helpers
  data/fixtures/                    # synthetic, readonly typed fixtures
  domain/                           # discriminated unions, branded IDs
  lib/                              # date/validation/format helpers (pure)
  styles/                           # CSS/Tailwind design token mapping
tests/                               # eventual unit/route/component/e2e
docs/                                # actual G0 documents, tracked today
~~~

위 목록은 **향후 제안 구조이지 실제 파일 현황이 아님**. (public)은 URL에 나타나지 않는 route group이며 route group 내 중복 / 경로 생성 금지. /dad 및 /daughter 중첩 layout은 같은 root layout을 공유하고 경로별 자체 헤더·하단 탭을 제공한다.

### 2.2 라우트별 소유·탭 매핑

| URL 패턴 | 담당 영역 | 활성 부모 탭 | 게이트 |
| --- | --- | --- | --- |
| / | 공통 역할 선택 | 없음 | G1-02 |
| /about, /help/safety | 공통 정보·안전 | 없음 | 후속 G1 |
| /dad | 아빠 홈 | 홈 | G1-04 |
| /dad/trends, /dad/trends/[slug] | 트렌드 | 트렌드 | G1-06 |
| /dad/briefing, /dad/questions, /dad/talk | 아빠 홈 보조 콘텐츠 | 홈 | G1-06 이후 |
| /dad/community, /dad/community/new, /dad/community/[id] | 아빠 샘플 커뮤니티 | 커뮤니티 | G1-07 |
| /dad/perspectives, /dad/perspectives/[slug] | 공통 편집 콘텐츠의 아빠 뷰 | 서로의 시선 | G1-08 |
| /daughter | 딸 홈 | 홈 | G1-05 |
| /daughter/discover, /daughter/discover/[slug], /daughter/sales/[slug] | 발견/쇼핑 | 발견 | G1-06 |
| /daughter/community, /daughter/community/new, /daughter/community/[id] | 딸 샘플 커뮤니티 | 커뮤니티 | G1-07 |
| /daughter/polls, /daughter/father-notes | 시연 투표/편집 콘텐츠 | 홈 또는 연결 페이지 | G1-08 |
| /daughter/perspectives, /daughter/perspectives/[slug] | 공통 편집 콘텐츠의 딸 뷰 | 서로의 시선 | G1-08 |

하단 탭은 **각 역할에서 정확히 4개**. 상세/보조 페이지는 부모 탭의 active state를 사용하고 뒤로 가기와 해당 목록 복귀 링크를 제공한다. 서버 페이지의 동적 params는 **선택된 Next.js 버전에 맞는 타입**으로 읽고, 최신 App Router 문서 예시에서는 비동기 params를 await한다. 정적 경로 /community/new가 동적 [id]와 충돌하지 않도록 직접 테스트한다. 미구현 경로는 임의의 더미 ‘성공 페이지’ 대신 명확한 준비 중 화면 또는 404로 처리한다.

### 2.3 처음 방문/재방문/공간 선택 계약

- 처음 / 방문: 선택된 공간 정보가 없으면 랜딩을 표시한다.
- 저장 가능한 값: 단 한 개의 탐색 취향 키 awdd.lastSpace.v1, 열거값 dad | daughter. 성별·나이·가족관계·신원·작성 자격이 아님.
- G1-02 구현 후보는 **브라우저 localStorage** 기반으로 한다. 네트워크 전송/서버 쿠키/분석 수집은 도입하지 않는다. 브라우저 저장 금지·오류·손상 값이면 첫 방문처럼 랜딩으로 복귀한다.
- / 재방문: 저장된 유효한 마지막 공간이 있으면 해당 홈으로 클라이언트 탐색한다. 로그인이나 사용자 세션은 필요 없다.
- **명시적 공간 선택**: 헤더의 공간 선택 → /?choose=1. 이 모드에서는 마지막 값이 있어도 반드시 두 선택 카드를 보여준다. 선택 시 취향만 갱신하고 해당 홈으로 이동한다.
- 직접 /dad, /daughter, 유효한 상세 URL로 진입할 수 있어야 한다. 저장값과 URL이 다르더라도 **URL로 접근 가능한 Phase 1 공개 합성 콘텐츠만** 표시한다. 데이터 권한 검증으로 취급하지 않는다.
- SSR/하이드레이션 중 콘텐츠 점멸을 줄이는 게이트 UI를 설계한다. 첫 방문/no-JS 환경에서 링크가 동작해야 하고, 재방문 시에도 짧은 전환 동안 포커스와 읽기 순서를 보장할 것. 구체 구현/검증은 G1-02에서 한다.
- 개인정보로 해석될 수 있는 사용자 입력의 저장을 허용하지 않는다. 글쓰기 시연 값은 React 메모리 상태만, 새로고침·역할 전환 시 폐기.
- 저장된 역할 변경이 실제 인증·게시판 권한을 바꾸거나 두 게시판 원문을 공개하는 효과가 없어야 한다.

### 2.4 미구현/오류/메타데이터

- 직접 입력한 미지 slug/id → notFound, fallback으로 다른 카드나 임의 실제 유사 사례를 표시하지 않는다.
- 페이지별 semantic h1 1개, title/description 차별화, role theme에 맞는 텍스트를 제공.
- 미만료/검증됨/만료/검증 불가/시연 등 데이터 상태별 label을 두고 상태를 추정하지 않는다.
- 빈 피드/이미지 실패/브라우저 저장 불가/JS 비활성에 대한 읽기 가능한 fallback.
- 실사용자 글쓰기·신고 화면은 G2 안전 운영 준비 전 **시연 UI의 외관**만 만들 수 있으며 실제 처리 성공을 표시하지 않는다.

## 3. Server/Client 경계와 책임

| 층 | 기본 실행 위치 | 책임 | 금지 |
| --- | --- | --- | --- |
| app/**/page 및 layout | Server Component 기본 | 콘텐츠 렌더, 메타데이터, 라우트 분기, 404 | 인증/DB가 구현된 것처럼 주장 |
| components/editorial | Server 우선 | 구조·시맨틱·사진 자리/합법 이미지 | 시연 데이터를 실최신으로 표시 |
| navigation/role-choice | 작은 Client island | 선택 이벤트, localStorage 읽기/쓰기, 재방문 탐색 | 작성 권한 검사, 인증 |
| CategoryChips/검색/정렬 | 작은 Client island (필요 시) | 미리 제공된 합성 목록 필터 | 서버 API/분석 전송 |
| DemoComposer / DemoPoll | Client (G1-07/08) | 메모리 상태만, 시연 표시 | localStorage·DB·업로드·전송 |
| domain/lib, fixture selectors | 순수 TypeScript | 타입·상태 판별·불변 fixture 조회 | 사용자 정보 수집 |

Client island가 import하는 모듈에는 비밀키/서비스 역할/개인 데이터가 없어야 한다. 마케팅·광고 추적 스크립트는 G1 범위 밖. DOM 직접 조작보다 React 상태와 기본 semantic control 사용.

## 4. 공통 컴포넌트 책임

- SiteHeader: 브랜드, ‘아빠의 공간/딸의 공간’, 공간 선택/안전 안내. 로그인 프로필 표시 금지.
- RoleChoiceCard: 두 동일 중요도 링크, 설명, 포커스. 마지막 공간 선택을 비인증 선호로 보관.
- SpaceLayout: theme data attribute + Header + BottomNavigation + main landmark. dad/daughter 컴포넌트 분리 가능.
- BottomNavigation: URL 기반 탭 활성화 (아빠: 홈/트렌드/커뮤니티/서로의 시선; 딸: 홈/발견/커뮤니티/서로의 시선), aria-current, 하단 safe area.
- EditorialHero/StoryCard: 사진 아래 텍스트와 CTA 1개, 상태 라벨. 서버 기본.
- DemoLabel/SourceMeta/SaleCard: 시연·검증·만료 메타 필수; 가짜 수치 표시 금지.
- CommunityPreview/DemoComposer: 현재 공간의 **합성 fixture만** 노출. 향후 실제 권한 로직과 분리.
- PerspectiveCard: 같은 perspective ID를 양 공간의 *서로 다른 프레젠테이션*에서 읽되 원본 게시글 링크를 생성하지 않음.
- EmptyState: ‘데이터 없음’, ‘구현 전’, ‘미검증’, ‘만료’ 구분. 에러·로딩은 명시.

컴포넌트간 props는 콘텐츠의 public view-model만 전달한다. 내부 운영 메타·작성자 ID·원문 소스 위치·추론 가능한 작은 집계는 props에 포함하지 않는다.

## 5. 디자인·성능·품질 계약

- [G0-03 디자인 시스템](./DESIGN_SYSTEM.md)의 색·타이포·44px 내부 터치 기준·하단 안전 영역 규칙 보존.
- 320/360/375/390/430/768/1024px 폭 대응, 200% 텍스트 확대, 접근성 대비, 키보드 탭 순서, aria-current.
- 읽기 페이지에서 최소 JS, 자동재생·무거운 캐러셀 제거. 이미지 자산은 라이선스 검증 전 placeholder.
- 합성 fixture는 구체 날짜·실제 세일·응답을 주장하지 않는다. “시연 콘텐츠”가 텍스트로 읽히게 함.
- 테스트 조건 및 위협 모델은 [보안·테스트 계획](./SECURITY_TEST_PLAN.md) 참조.

## 6. 단계별 소유권 및 실행 제약

| 게이트 | 도입 가능 항목 | 실행/검증 조건 |
| --- | --- | --- |
| G1-01 | toolchain, app shell 최소 scaffold, static check | 설치·기본 라우트·lint/typecheck/build. UI 기능 코드 선작성 금지 |
| G1-02 | 랜딩+역할 선호 상태 | 첫 방문/재방문/choose=1/저장 차단/직접 URL 검사 |
| G1-03 | 공용 역할 navigation | 정확히 4탭/ARIA/뒤로/하단 safe area 검사 |
| G1-04 | 아빠 홈 합성 콘텐츠 | 트렌드 1+4·브리핑·카드 위계, 데모 라벨 |
| G1-05 | 딸 홈 합성 콘텐츠 | 사진 중심 발견/세일 데모 검증, 독립 가치 |
| G1-06 | 상세 페이지 | URL slug 유효성, 만료·출처·404 |
| G1-07 | 커뮤니티 시연 | 합성 글·댓글 UI, 네트워크 쓰기 0, 실제 사용자 데이터 장기 저장 0 |
| G1-08 | 서로의 시선/설문 시연 | 공용 편집 모델만, 소수 응답·원문/개인 링크 없음 |
| G1-09 | 종합 회귀 | 접근성·키보드·실기기·성능·시연/보안 체크 |

**어떤 G1 단계도 미성년자가 실제로 글을 저장하거나 타 역할의 비공개 원문에 접근하는 서비스가 아니다.** G2에서 정책/역할 검증/RLS/관리자 신고 체계가 준비되기 전 공개 커뮤니티 운영 금지.

## 7. 공식 참조 및 검증 상태

Next.js 공식 문서(2026-11 기준 확인):
- https://nextjs.org/docs/app/getting-started/layouts-and-pages
- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://nextjs.org/docs/app/getting-started/linking-and-navigating

도큐먼트 검증: 경로의 IA 대응, UI 상태/컴포넌트 책임·사용자 이동·무실데이터 원칙 점검. **실제 Next.js 프로젝트/라우트 빌드 실행은 G1-01 이전에 실시하지 않았다.**

## 8. 다음 게이트

G1-01: 새 브랜치에 최소 Next.js + TypeScript + Tailwind scaffold를 생성하고 설치/린트/타입/빌드/기본 라우트 검증 후 PR을 만든다. G1-01에 역할 선택 UI/커뮤니티 기능을 몰아서 작성하지 않는다.
