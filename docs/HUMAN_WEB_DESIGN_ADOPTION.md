# 아빠와 딸 — Human Web Design + Frontend Design 도입 기록

> 2026-11-11 · 문서/Skill 전용 제안 · 정확한 기준 main: `426409297c2fa5cc8aaa6ee9925034a345f9fe26`

## 추가한 Skills

1. `.agents/skills/human-web-design/SKILL.md`: 기존 3개 프로젝트에서 쓰는 Human Web Design 지침의 아빠와 딸 맞춤형 버전. 브랜드·승인된 G0/G1 디자인·청소년 안전·Gate/QA 우선.
2. `.agents/skills/frontend-design/SKILL.md`: 사용자가 제공한 `SKILL.md`를 프로젝트에 추가. https://github.com/anthropics/skills/tree/main/skills/frontend-design 와 동일 본문(끝 줄바꿈만 다름). 원본 Apache-2.0 라이선스는 동봉된 `LICENSE.txt` 참조.
3. `AGENTS.md`: 두 Skill이 정책보다 우선하지 않게 연결하는 실행 안내.
4. 본 기록과 최신 `DEVELOPMENT_PLAN.md` 이력 갱신.

## 디자인 방향 (실제 화면 수정 없음)
- 공통 역할 선택 랜딩은 **“같은 집, 조금 다른 세상.” / “우리가 몰랐던 서로의 이야기.”** 고정. 역할 선택은 인증이 아닌 탐색.
- 아빠 공간은 차분한 설명형 매거진, 정보 이해와 대화 소재 중심. 딸 공간은 승인된 **Polished Underground** 사진 중심 매거진과 취향 발견을 우선.
- 불필요한 균일 카드/미사여구/장식 번호·라벨·CTA를 검토하되 디자인 시스템의 색상, 글자 위계, 실제 사진 4장과 사용권, 모바일 내비게이션·접근성은 유지한다.
- 청소년 안전/시연 표시와 합성 편집 관점의 데이터 경계는 디자인의 일부이며 제거 대상이 아니다.

## 승인/보안/테스트 Gate
- 초기 개인 게시·댓글 금지; 운영자가 사전에 작성하는 고정 선택지 투표·토너먼트만 제품 방향 승인. 이용자 선택은 비저장·비집계.
- **G2-01·02·03 전체 HOLD**, Auth/DB/RLS/실계정·게시·DM/실투표 수집/개인정보 저장·SNS 크롤링/유료 API/공개 배포 미승인.
- 실제 UI 변경 때만 디자인 승인 → 최소 기능 브랜치 → `npm ci`/lint/build/typecheck/smoke/Playwright Chromium+axe 전체 및 신규 QA → 정확한 최신 PR SHA 검증 → 병합 승인 검토.
- 이번 PR은 디자인 지침/문서만 추가했으며 HTML/CSS/JS/테스트·워크플로/배포 설정 미변경. PR 이벤트로 CI가 동작할 수 있으나 실행 결과 확인 전에는 PASS라고 하지 않는다.
- 실제 iPhone Safari/Android 및 VoiceOver/TalkBack·수동 육안 디자인 QA는 **미실시** 상태 유지.

## 후속 사용 예
> "Human Web Design + Frontend Design을 참고해 아빠와 딸의 역할 선택/아빠 홈/딸 홈에서 AI 템플릿 같은 패턴 하나를 찾아 근거와 시안을 제시하되, 현재 G0/G1 승인 UI와 안전 정책을 보존하고 구현 전 디자인 승인을 받으세요."

## 다음 작업
실제 스크린샷/렌더링을 바탕으로 두 공간에서 가장 영향이 큰 작은 시각 개선 1건을 선정하고, 신규 G1 범위 내 디자인 승인 이후 별도 PR로 구현한다. 실기기 검증, G2 안전 검토, 공개 배포는 별도 과제이다.
