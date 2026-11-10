# 아빠와 딸

> **G1-02: 모바일 역할 선택 랜딩·재방문 UX 구현.** 역할별 실제 홈 콘텐츠와 커뮤니티는 아직 개발하지 않았습니다.

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

브라우저에서 http://localhost:3000/ 으로 접속합니다. 첫 방문에는 두 개의 역할 선택 카드가 표시됩니다. 아빠/딸 카드 선택 시 각각 /dad, /daughter의 **이동 확인용 안내 화면**으로 이동합니다. 실제 콘텐츠 홈 화면이 아닙니다.

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

smoke와 e2e는 production build 후 실행합니다. CI에서 npm ci, lint, build, typecheck, 기본 HTTP smoke, Chromium 8개 Playwright 테스트 및 axe 접근성 검사를 실행합니다. 자동 모바일 뷰포트(320/360/375/390/430px)는 실기기 Safari/Android 검증을 대체하지 않습니다.

결과 및 실패 수정 내역: [G1-02 QA 기록](docs/G1_02_QA.md).

## 단계별 개발·안전 제한

각 단계는 별도 브랜치/PR/CI/계획서 갱신으로 진행합니다. **로그인·Supabase DB/Auth·실사용자 게시글/댓글·DM·사진 업로드·쇼핑/유행 실시간 수집·유료 API·공개 배포를 하지 않았습니다.**

다음 작업은 **G1-03 공용 내비게이션(아빠·딸 각각 4탭)**입니다. 이후 G1-04/05에서 각 홈의 콘텐츠를 한 단계씩 구현합니다.
