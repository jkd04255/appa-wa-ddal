# G1-16 회원·밸런스 구현과 연결 상태

## 제공한 범위

친구·학교 아래에 코럴/하늘색 비율 막대, 두 선택의 아이콘·비율, 회원가입/로그인 진입을 추가했다. 팬덤 대표 카드에는 기존 권리 확인 사진을 사용했다. 로그인 없이 결과를 볼 수 있지만 쓰기는 검증된 회원만 가능하다. 관심사 탐색용 역할 선택은 계정·가족관계 인증이 아니다.

`/account/`는 이메일 가입·확인 메일 안내·로그인·로그아웃·비밀번호 찾기/변경·Google PKCE 연동을 구현한다. 회원 기능에 공개키가 없으면 개인정보 입력/전송을 차단한다. 실패는 일반 오류로 표시하며 원격 에러/토큰을 화면에 출력하지 않는다. 이메일·비밀번호를 자체 DB나 로그에 저장하지 않는다. 공급자 표준 세션은 SDK가 관리한다.

## 실제 연결 상태와 남은 이메일 설정

새 Supabase 연결 `Jo`의 `jkd04255's Org`에 월 견적 $0으로 서울 리전 `appa-wa-ddal` 프로젝트를 만들었다. ref: `cjtfkjuiqveosakaccdh`, 상태 ACTIVE_HEALTHY. 계정·투표 마이그레이션을 적용했으며 보안·상태 advisor 점검에서 경고가 없다. 테이블은 빈 상태에서 시작하고 여행 질문은 총 0표다. 62:38은 사이트 UI에서 명시한 예시이며 실제 인기·집계가 아니다. 진행 중 투표는 누적 참여수 내림차순으로 표시하도록 구현했다. 실시간/최근 24시간 순위는 구현하지 않았다.

## Pages 연결 확인

2026-11-14 커밋 `be27336`을 포함한 GitHub Actions Push #297의 전체 검증과 Pages 배포, PR #41 CI #298이 성공했다. 공개 딸 홈에는 DB와 일치하는 `0표 / 0% / 0%`가 표시되고, 로그인·가입 화면에서 이메일 로그인을 제공한다. DB에서 `balance_poll_results`를 직접 조회해 질문과 좌·우·총계가 모두 0임을 확인했다. 기존 62:38 예시가 실제 수치로 노출되지 않는다.

공개 홈 하단의 안내 문구가 모든 투표 데이터가 미연결인 것처럼 잘못 안내하던 부분을 정정했다. 저장되지 않는 합성 커뮤니티·질문 콘텐츠와, 로그인 회원 투표를 저장하는 밸런스 게임을 문구에서 구분한다.

Supabase Auth URL Configuration에 Site URL `https://jkd04255.github.io/appa-wa-ddal/`을 제안했으나 저장되지 않았다. 대신 정확한 콜백 `https://jkd04255.github.io/appa-wa-ddal/account/`가 허용 redirect 목록에 저장되어 있다. 클라이언트 가입·재설정은 이 exact URL을 지정한다.

GitHub Pages 빌드에는 프로젝트 URL과 **publishable key만** 주입한다. 이 키는 정적 브라우저 클라이언트용 공개 키다. secret/service-role key는 사용하지 않는다. Google provider는 비활성이다.

호스팅 Supabase 기본 SMTP는 프로젝트 팀 주소만 대상으로 하며 일반 이용자 이메일로 가입 확인/비밀번호 재설정 메일을 보낼 수 없다. 대외 가입을 열려면 프로젝트에 사용자 소유의 검증된 발신 도메인 및 SMTP 제공자를 설정해야 한다. Google OAuth는 별도의 Google Cloud OAuth client와 Supabase provider 설정이 필요하다. 이 둘은 아직 미연결이다. 일반 이용자용 처리방침·연령/운영 정책도 실제 가입 공개 전에 확정해야 한다.

## 서버 구조와 보안

- `balance_polls`: 운영자 작성 질문과 두 의견, 공개/개시/마감.
- `balance_votes`: Auth UUID + poll ID 복합 PK, left/right, 서버 시각. 본인 SELECT와 제한된 INSERT만 허용한다.
- `balance_poll_totals`: 비식별 집계. 이용자 직접 수정 권한 없음.
- `balance_poll_results`: security_invoker 뷰. 공개·진행 중 질문과 집계만 제공한다.
- private 트리거는 검증된 이메일/비익명 회원 여부, UID 일치, 투표 공개·마감을 확인한다. 직접 RPC 실행 권한이 없다.
- AFTER INSERT 집계로 중복 키/ON CONFLICT DO NOTHING이 숫자를 늘리지 않는다. 동일 트랜잭션에서 행 잠금/원자적 증분을 사용한다.
- Auth 삭제의 CASCADE가 투표·집계를 함께 정리한다. 사용자 직접 투표 수정·삭제는 제공하지 않는다.
- 프런트에는 publishable 키만 허용한다. service role/secret key는 넣지 않는다.
- 로컬 Postgres 엔진(PGlite)의 RLS/권한/트리거 검증 23건. 호스팅 환경의 RLS/advisors 검증은 미실시이다.

## 전용 서버가 준비되면

1. 전용 프로젝트에서 `supabase/migrations/20261113151710_account_balance_vote.sql` 적용. 일반 계정/anon 역할로 부정 테스트 재검증 및 Supabase security advisors 확인.
2. Auth 이메일 확인 필수, 익명 로그인 끄기, 비밀번호 최소 12자, 운영 이메일 전달 설정과 리다이렉트 허용 목록을 구성한다. GitHub Pages callback은 `https://jkd04255.github.io/appa-wa-ddal/account/`이며 광범위 와일드카드는 사용하지 않는다.
3. Google OAuth client를 생성/연결하려면 소유자의 Google Cloud 설정이 필요하다. client secret은 공급자 설정에만 보관한다. 앱 프런트에 넣지 않는다. 실제 Google callback 검증 후 `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true`를 사용한다.
4. 실제 가입 공개 전 운영 주체·연령 적격/미성년 정책·처리방침·탈퇴/삭제 접수·연락 수단을 확정한다. 현재 폼의 짧은 동의 문구는 완성된 개인정보 처리방침의 대체물이 아니다. 자동 검증으로 법률·운영 검증 완료를 주장하지 않는다.
5. Pages workflow는 전용 프로젝트 URL과 공개 publishable key를 사용해 빌드한다. 배포 산출물에는 브라우저 공개 키가 포함된다.
6. 소유자가 관리하는 테스트 계정으로 메일 확인·로그인·재설정·로그아웃·중복 투표·다른 계정 격리·모바일 리다이렉트를 실검증한다.

## 검증 범위

- 기존 일반/정적 77개 시나리오에 반응형 막대·게스트 유도·미설정 폼/axe 5개 추가.
- 별도 테스트 빌드에서만 가짜 Supabase 호스트와 키를 주입한다. 모든 호출은 Playwright route로 가로채며 실계정/메일/Google로 전송하지 않는다. 가입 확인, 로그인/오류, 로그아웃, 재설정, 중복 투표, 0표, PKCE 전달, 콜백 오류를 검사한다.
- fixture 테스트 후 실제 프로젝트 키를 사용하는 Pages 빌드를 생성해 테스트 키나 가짜 계정 상태를 배포하지 않는다.
- 공개 화면 점검에서 발견한 대표 사진의 basePath 누락을 수정했다. 브라우저에서 이미지 디코딩을 확인하고, Pages 빌드의 이미지 경로 접두사와 실제 파일 존재를 배포 전에 검사한다.
- 일반 회원 가입은 Supabase 기본 SMTP 제한 때문에 외부 수신자를 대상으로 동작하지 않는다. Google 로그인 버튼도 비활성 상태다. 호스팅 실제 사용자·메일·Google 실검증은 미실시다.
- iPhone Safari/Android·VoiceOver/TalkBack 실기기 QA와 실제 공급자 종단간 QA는 미실시다.

## 이후 방·재화 확장

안정적인 Auth UUID를 향후 방 소유자/활동 원장과 연결한다. 추후 활동 보상은 서버에서 이벤트 ID를 고유키로 저장해 중복 지급을 막고, 클라이언트가 잔액을 직접 올릴 수 없게 한다. 출석·글쓰기·가구·재화 테이블이나 보상 약속은 이번에 만들지 않았다.
