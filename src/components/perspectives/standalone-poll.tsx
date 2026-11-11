import Link from "next/link";
import { DemoChoice } from "./demo-choice";
import { OperatorTournamentDemo } from "./operator-activities";
import { PERSPECTIVE_QUESTIONS } from "@/data/fixtures/shared-perspectives";

export function StandaloneDemoPoll() {
  return (
    <main id="main-content" className="perspectives perspectives--daughter">
      <div className="perspectives__inner perspectives__inner--article">
        <nav className="perspectives__breadcrumb" aria-label="위치">
          <Link href="/daughter">딸 홈</Link>
          <span aria-hidden="true">/</span>
          <Link href="/daughter/perspectives">서로의 시선</Link>
        </nav>
        <header className="perspectives__masthead perspectives__masthead--poll">
          <p className="perspectives__eyebrow">SIDE B / OPERATOR EDITION</p>
          <h1>이번 주 질문</h1>
          <p>운영자가 미리 작성한 고정 선택지 질문과 토너먼트 시연입니다.</p>
          <p className="perspectives__disclosure"><strong>시연 콘텐츠</strong> · 실제 투표가 아니며 응답·결과·집계를 저장하거나 제공하지 않습니다. 질문과 대진은 코드에 등록된 예시이며, 관리자 작성 화면은 없습니다.</p>
        </header>
        <DemoChoice question={PERSPECTIVE_QUESTIONS.daughter} />
        <OperatorTournamentDemo />
        <Link className="perspectives__action perspectives__return" href="/daughter">딸 홈으로 돌아가기 <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}
