import Link from "next/link";
import { SHARED_PERSPECTIVES, PERSPECTIVE_QUESTIONS } from "@/data/fixtures/shared-perspectives";
import type { PerspectiveSpace } from "@/domain/perspective-editorial";
import { DemoChoice } from "./demo-choice";

export function PerspectiveIndex({ space }: { space: PerspectiveSpace }) {
  const isDad = space === "dad";
  return (
    <main id="main-content" className={`perspectives perspectives--${space}`}>
      <div className="perspectives__inner">
        <header className="perspectives__masthead">
          <p className="perspectives__eyebrow">{isDad ? "SIDE A / VIEWPOINTS" : "SIDE B / TWO SIDES"}</p>
          <h1>서로의 시선</h1>
          <p>{isDad
            ? "같은 순간을 바라보는 두 가지 가상의 마음을 차분히 읽어봅니다."
            : "정답 없는 두 가지 마음, 서로 다른 편집 노트."}</p>
          <p className="perspectives__disclosure"><strong>시연 콘텐츠</strong> · 모든 관점은 독립적으로 작성한 가상 편집글입니다. 실제 아빠·딸의 게시글, 인용, 설문 응답, 집계 자료가 아닙니다.</p>
        </header>
        <section className="perspectives__catalog" aria-labelledby="perspectives-list-heading">
          <div className="perspectives__section-title">
            <p className="perspectives__eyebrow">01 / THREE IMAGINARY PAIRS</p>
            <h2 id="perspectives-list-heading">두 가지 마음을 나란히</h2>
          </div>
          <div className="perspectives__cards">
            {SHARED_PERSPECTIVES.map((item, i) => (
              <article className="perspectives__card" key={item.id}>
                <div className="perspectives__card-no" aria-hidden="true">{String(i + 1).padStart(2,"0")}</div>
                <div className="perspectives__card-inner">
                  <p className="perspectives__eyebrow">{item.theme}</p>
                  <span className="perspectives__stamp">{item.notice}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div className="perspectives__sides perspectives__sides--preview">
                    <p><span>가상 아빠 관점</span>{item.dadView}</p>
                    <p><span>가상 딸 관점</span>{item.daughterView}</p>
                  </div>
                  <Link className="perspectives__action" href={`/${space}/perspectives/${item.slug}`}>
                    편집글 읽기 <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
        <DemoChoice question={PERSPECTIVE_QUESTIONS[space]} />
        <footer className="perspectives__footer">
          <p>서로의 시선은 실제 작성글을 두 공간 사이에 공유하는 기능이 아닙니다. 응답자 수, 세대별 비율 또는 사연 원문을 제공하지 않습니다.</p>
          {space === "daughter" ? <Link className="perspectives__action" href="/daughter/polls">가상 질문 별도 화면 보기 <span aria-hidden="true">↗</span></Link> : null}
          <Link className="perspectives__action" href={`/${space}`}>{isDad ? "아빠" : "딸"} 홈으로 돌아가기 <span aria-hidden="true">↗</span></Link>
        </footer>
      </div>
    </main>
  );
}
