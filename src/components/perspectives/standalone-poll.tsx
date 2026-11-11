import Link from "next/link";
import { DemoChoice } from "./demo-choice";
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
          <p className="perspectives__eyebrow">SIDE B / IMAGINARY QUESTION</p>
          <h1>이번 주 질문</h1>
          <p>작은 취향을 고르는 경험만 시험하는 가상 화면입니다.</p>
          <p className="perspectives__disclosure"><strong>시연 콘텐츠</strong> · 실제 투표가 아니며 응답·결과·집계를 저장하거나 제공하지 않습니다.</p>
        </header>
        <DemoChoice question={PERSPECTIVE_QUESTIONS.daughter}/>
        <Link className="perspectives__action perspectives__return" href="/daughter">딸 홈으로 돌아가기 <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}
