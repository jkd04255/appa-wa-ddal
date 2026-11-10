# 아빠와 딸

> **G1-01 최소 개발환경** — 아직 역할 선택 UI, 커뮤니티 기능 또는 실서비스 배포가 없습니다.

사춘기 딸과 가까워지고 싶은 아빠, 또래의 취향과 고민을 나누고 싶은 딸을 위한 두 공간형 플랫폼을 단계적으로 개발합니다. 최신 개발 기준은 [docs/DEVELOPMENT_PLAN.md](docs/DEVELOPMENT_PLAN.md)를 참고하세요.

## 환경

- Node.js 22.x (권장 LTS 계열; `package.json`의 Node 범위 준수)
- npm 10.x
- Next.js 16.4.6 / React 19.3.1 / TypeScript 5.9.3 / Tailwind CSS 4.3.5
- 정확히 고정된 직접 의존성 및 `package-lock.json` (npm lockfile v3)

## 로컬 설치·실행

```bash
npm ci
npm run dev
```

브라우저에서 `http://localhost:3000/`을 열면 개발 환경 준비 중 안내만 표시됩니다. 계정·로그인·댓글·투표·실제 데이터 저장은 없습니다.

## 검증 명령

```bash
npm run lint
npm run build
npm run typecheck
npm run test:smoke
```

`test:smoke`는 **빌드 이후** 실행하며, 일시적으로 `next start` 서버를 실행해 루트 HTTP 200, 한글 문서 속성, 임시 안내 문구, 역할 선택 UI의 부재를 점검합니다.

GitHub PR에서는 `.github/workflows/ci.yml`이 `npm ci`와 전체 검증을 수행합니다. 기존 문서 전용 G0 계획의 안전 제약은 계속 유지합니다.

## 프로젝트 진행 방식

- 하나의 G1 단계당 별도 브랜치 / PR / 테스트 / 계획서 갱신
- 실제 사용자 게시물·Auth·DB·DM·사진 업로드·공개 배포는 아직 금지
- **다음 단계 G1-02:** 첫 방문 역할 선택, 재방문 마지막 공간 복귀 및 명시적 공간 재선택 기능. 서버 권한/연령 인증과 무관하게 탐색 경험으로만 구현

[정보구조](docs/INFORMATION_ARCHITECTURE.md) · [디자인 시스템](docs/DESIGN_SYSTEM.md) · [와이어프레임](docs/WIREFRAMES.md) · [기술 계약](docs/TECHNICAL_ARCHITECTURE.md)
