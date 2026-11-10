# 아빠와 딸

> **G1-07: 아빠·딸의 역할별 합성 커뮤니티를 별개로 체험할 수 있습니다.** 실제 가입·게시·댓글·신고·DM/개인정보 저장은 여전히 제공하지 않습니다.

“같은 집, 조금 다른 세상.” / “우리가 몰랐던 서로의 이야기.”

아빠와 딸이 각자의 관심사 공간을 둘러볼 수 있도록 단계별로 구현하는 프로젝트입니다. [최신 개발 계획서](docs/DEVELOPMENT_PLAN.md)와 [정보구조](docs/INFORMATION_ARCHITECTURE.md), [디자인 시스템](docs/DESIGN_SYSTEM.md)을 개발 기준으로 사용합니다.

## 실행 환경

- Node.js 22.x, npm 10.x
- Next.js 16.4.6, React 19.3.1, TypeScript strict, Tailwind CSS 4.3.5
- 고정 의존성 + package-lock.json v3 (npm ci 권장)
- Playwright/axe 자동 브라우저 테스트 포함

### 로컬 실행

~~~bash
npm ci
npm run dev
~~~

브라우저에서 http://localhost:3000/ 으로 접속합니다. 아빠/딸 선택 후 각 역할의 홈으로 이동합니다. **아빠 홈만** 대표 트렌드 1개+보조 4개, 1분 브리핑, 샘플 커뮤니티, 질문/대화, 서로의 시선으로 구성된 합성 시안을 보여줍니다. 모든 항목에는 시연 표시가 있으며 실제 SNS 데이터·사용자 글이 아닙니다. 사진 대신 CSS 가상 표지 그래픽을 사용합니다. **딸 홈은 Polished Underground** 감성의 사진 중심 발견 매거진입니다. 사용권 확인 후 저장소에 자체 보관한 사진 4개, 대표 발견 1개·보조 3개, 관심사 칩, 합성 쇼핑 노트·샘플 커뮤니티·가상 질문·서로의 시선으로 구성했습니다. 브라우저가 사진을 외부 업체에 요청하지 않으며 [사진 사용권 기록](docs/G1_05_PHOTO_ASSETS.md)을 확인할 수 있습니다.

아빠 공간: 홈(`/dad`) · 트렌드(`/dad/trends`) · 커뮤니티(`/dad/community`) · 서로의 시선(`/dad/perspectives`). 브리핑(`/dad/briefing`), 질문(`/dad/questions`), 대화 소재(`/dad/talk`) 링크는 현재 **준비 중 화면**입니다. 트렌드 목록은 **정확히 5개 합성 예시**이며 `/dad/trends/[slug]` 상세를 읽을 수 있습니다. 다른 URL은 404입니다.

딸 공간: 홈(`/daughter`) · 발견(`/daughter/discover`) · 커뮤니티(`/daughter/community`) · 서로의 시선(`/daughter/perspectives`). 쇼핑(`/daughter/sales`)과 질문(`/daughter/polls`)은 **준비 중** 안내로 연결하며, 할인 상세는 여전히 404입니다. 발견 목록에는 합성 예시 4개가 있으며, `?category=beauty|food|culture` URL 필터를 지원합니다. 기존 발견 카드 4개의 `/daughter/discover/[slug]` 상세를 읽을 수 있습니다. 확인할 수 없는 카테고리는 안내 후 전체 예시를 표시합니다.

**커뮤니티 시연:** 아빠 `/dad/community`, 딸 `/daughter/community`에 각 3개의 합성 글을 제공합니다. 검색·주제 선택·정렬은 **브라우저 화면 안에서만** 작동하고 쿼리/쿠키/스토리지/서버에 저장하지 않습니다. 각 `/community/[id]`에서 가상 본문과 샘플 댓글을 읽을 수 있고, 다른 공간의 ID/없는 ID는 404입니다. `/community/new`는 게시판이 아니라 **메모리 전용 글쓰기 체험**으로, 내용을 화면 내 미리보기·지우기만 할 수 있으며 이탈·새로고침하면 모두 사라집니다. HTML 폼 제출·POST·fetch·DB 요청 기능을 구현하지 않았습니다. 회원 신원과 작성 권한이 확인된 상태가 아닙니다.

모바일에서는 하단 4탭, 768px 이상에서는 상단 4탭으로 전환하며 현재 페이지를 색상 및 `aria-current`로 표시합니다. **유효한 9개 합성 slug만 상세가 열리며**, 나머지 상세 주소는 404입니다. 각 상세에 배경·맥락·팁·부담 없는 대화 예시 및 '시연 콘텐츠 / 합성 시연 자료 · 외부 원문 없음 / 확인 날짜 해당 없음'을 표시합니다.

재방문 시 이전 선택값 dad/daughter가 있으면 마지막 공간으로 들어갑니다. **수동으로 다시 선택하려면 /?choose=1** 로 접속하거나 안내 화면에서 ‘공간 다시 선택하기’를 누르세요. 저장값은 단순 탐색 편의이며 실제 연령·가족관계·게시 권한을 인증하지 않습니다. 브라우저 저장소가 차단되면 탐색은 계속 가능하지만 마지막 공간을 기억하지 못합니다.

### 검증

~~~bash
npm run lint
npm run build
npm run typecheck
npm run test:smoke
npx playwright install chromium
npm run test:e2e
~~~

smoke와 e2e는 production build 후 실행합니다. CI에서 npm ci, lint, build, typecheck, HTTP smoke(9개 합성 상세·카테고리·404·사진 4개), Chromium 기존 **41개 + 신규 커뮤니티·보안 검사 14개 = 총 55개** Playwright 테스트와 axe 접근성 검사를 실행합니다. 자동 모바일 뷰포트(320/360/375/390/430px)는 실기기 Safari/Android 검증을 대체하지 않습니다.

결과 및 실패 수정 내역: [G1-02 QA](docs/G1_02_QA.md) · [G1-03 QA](docs/G1_03_QA.md) · [G1-04 QA](docs/G1_04_QA.md) · [G1-05 QA](docs/G1_05_QA.md) · [G1-06 QA](docs/G1_06_QA.md) · [G1-07 QA](docs/G1_07_QA.md) · [딸 홈 사진 출처](docs/G1_05_PHOTO_ASSETS.md).

## 단계별 개발·안전 제한

각 단계는 별도 브랜치/PR/CI/계획서 갱신으로 진행합니다. **로그인·Supabase DB/Auth·실사용자 게시글/댓글·DM·사진 업로드·쇼핑/유행 실시간 수집·유료 API·공개 배포를 하지 않았습니다.**

다음 단계는 **G1-08 서로의 시선·시연 설문 UI**입니다. 역할별 커뮤니티 원문·작성자 ID를 공용 공간으로 전달하지 않고, 별도의 합성·편집 관점과 가상 응답 UI만 개발합니다. 실계정·실저장·공개 커뮤니티 운영은 계속 금지합니다.
