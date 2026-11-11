import Link from "next/link";
import type { PerspectiveSpace, SharedPerspective } from "@/domain/perspective-editorial";

export function PerspectiveDetail({ space, item }: { space: PerspectiveSpace; item: SharedPerspective }) {
  return (
    <main id="main-content" className={`perspectives perspectives--${space}`}>
      <div className="perspectives__inner perspectives__inner--article">
        <nav aria-label="위치" className="perspectives__breadcrumb">
          <Link href={`/${space}`}>{space === "dad" ? "아빠" : "딸"} 홈</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/${space}/perspectives`}>서로의 시선</Link>
        </nav>
        <article className="perspectives__article">
          <header className="perspectives__article-header">
            <p className="perspectives__eyebrow">EDITED / FICTIONAL PERSPECTIVE</p>
            <span className="perspectives__stamp">{item.notice}</span>
            <h1>{item.title}</h1>
            <p>{item.summary}</p>
          </header>
          <div className="perspectives__sides perspectives__sides--article">
            <section aria-labelledby="dad-side-heading">
              <span className="perspectives__eyebrow">01 / SIDE A</span>
              <h2 id="dad-side-heading">가상의 아빠 관점</h2>
              <p>{item.dadView}</p>
            </section>
            <section aria-labelledby="daughter-side-heading">
              <span className="perspectives__eyebrow">02 / SIDE B</span>
              <h2 id="daughter-side-heading">가상의 딸 관점</h2>
              <p>{item.daughterView}</p>
            </section>
          </div>
          <section className="perspectives__context" aria-labelledby="editorial-context-heading">
            <h2 id="editorial-context-heading">이 글을 읽는 방법</h2>
            <p>{item.editorialContext}</p>
          </section>
          <section className="perspectives__prompt" aria-labelledby="dialogue-prompt-heading">
            <h2 id="dialogue-prompt-heading">대화의 실마리</h2>
            <p>{item.gentleQuestion}</p>
          </section>
          <aside aria-label="자료 출처 및 보호 안내" className="perspectives__source">
            <h2>자료 상태·출처</h2>
            <p>시연 콘텐츠 · 원문 없음 · 확인일 해당 없음. 실제 설문·익명 게시글·작성자·인용·공개 동의가 있는 실제 기고에서 파생된 글이 아닙니다.</p>
            <p>어떤 개인이나 가족, 연령 집단의 공통된 의견을 대표하지 않습니다.</p>
          </aside>
        </article>
        <Link className="perspectives__action perspectives__return" href={`/${space}/perspectives`}>
          서로의 시선 목록으로 돌아가기 <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}
