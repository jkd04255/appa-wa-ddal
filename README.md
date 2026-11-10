# 아빠와 딸

> **G1-03: 역할별 공통 헤더·4탭 내비게이션 구현.** 실제 트렌드·발견·커뮤니티 콘텐츠는 아직 제공하지 않습니다.

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

브라우저에서 http://localhost:3000/ 으로 접속합니다. 처음에는 아빠/딸 선택 카드를 보여주고, 선택 후 각 역할의 홈으로 이동합니다. 역할별 메인 및 6개 탭 경로는 **현재 이동 확인용 ‘준비 중’ 화면**입니다.

아빠 공간: 홈(`/dad`) · 트렌드(`/dad/trends`) · 커뮤니티(`/dad/community`) · 서로의 시선(`/dad/perspectives`).

딸 공간: 홈(`/daughter`) · 발견(`/daughter/discover`) · 커뮤니티(`/daughter/community`) · 서로의 시선(`/daughter/perspectives`).

모바일에서는 하단 4탭, 768px 이상에서는 상단 4탭으로 전환하며 현재 페이지를 색상 및 `aria-current`로 표시합니다. 상세 콘텐츠 URL은 아직 준비되지 않아 404입니다.

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

smoke와 e2e는 production build 후 실행합니다. CI에서 npm ci, lint, build, typecheck, 기본 HTTP smoke, Chromium **16개** Playwright 테스트 및 axe 접근성 검사를 실행합니다. 자동 모바일 뷰포트(320/360/375/390/430px)는 실기기 Safari/Android 검증을 대체하지 않습니다.

결과 및 실패 수정 내역: [G1-02 QA](docs/G1_02_QA.md) · [G1-03 QA](docs/G1_03_QA.md).

## 단계별 개발·안전 제한

각 단계는 별도 브랜치/PR/CI/계획서 갱신으로 진행합니다. **로그인·Supabase DB/Auth·실사용자 게시글/댓글·DM·사진 업로드·쇼핑/유행 실시간 수집·유료 API·공개 배포를 하지 않았습니다.**

다음 작업은 **G1-04 아빠 홈 합성 콘텐츠**입니다. 이후 G1-05에서 딸 홈을 별도 브랜치로 개발합니다.
