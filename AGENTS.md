# 아빠와 딸 — 개발 Agent 운영 규칙

최우선 진행 기준: [docs/DEVELOPMENT_PLAN.md](docs/DEVELOPMENT_PLAN.md) 및 [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md), [docs/WIREFRAMES.md](docs/WIREFRAMES.md), 청소년 안전 G2 문서. 저장소의 `AGENTS.md` 및 Skills는 사용자 승인이나 안전/QA Gate를 대체하지 않는다.

## 시각 디자인 작업
- `.agents/skills/human-web-design/SKILL.md`로 브랜드·보존 범위·검증 게이트를 먼저 확인한다.
- `.agents/skills/frontend-design/SKILL.md`는 시각적 개성, 정보 위계, 카피, 타이포그래피를 개선할 때 참조한다. 첨부 원본의 Apache-2.0 사용 조건은 같은 폴더 `LICENSE.txt`에 있다.
- 두 Skill이 충돌하면 기존 승인 디자인/개발 계획/청소년 안전 정책이 우선한다.
- 아빠: 차분한 설명형, 딸: Polished Underground 사진 중심. 성별 고정관념 금지. 메인 카피/사진/편집 콘텐츠·경로/역할별 4탭·접근성 보존.
- 실제 UI 변경은 별도 작업 승인 → 기능 브랜치·PR → 정확한 PR HEAD의 전체 CI + 신규 QA → Gate 확인 후 병합. 실기기 테스트를 CI로 대체하지 않는다.

## 안전·개발 정책
- 초기에는 개인 게시/댓글 없음; 운영자 전용 고정 주제 투표·토너먼트 방향만 승인; 선택 응답은 세션 내 처리하고 저장·집계 금지.
- 모든 합성 데이터·가상 콘텐츠 고지는 보존. 역할 선택은 신원·나이·가족관계 검증이 아니다.
- **G2-01/02/03 전체 HOLD.** 실제 인증/DB/RLS/UGC/DM/사진 업로드/실투표 저장·집계/개인정보 서버 저장/SNS 수집/유료 API/공개 배포는 별도 승인 전 금지.
- 모든 작업 결과는 `docs/DEVELOPMENT_PLAN.md`에 상태·QA·변경 이력·다음 작업과 함께 기록.
