import Link from "next/link";
import { DAD_TRENDS } from "@/data/fixtures/dad-home";
import { sourceDisplay } from "@/domain/editorial-detail";
import "../../editorial.css";

export default function DadTrendsPage() {
  return (
    <main id="main-content" className="editorial-page editorial-page--dad">
      <div className="editorial-page__inner">
        <header className="editorial-page__masthead">
          <p className="editorial-page__index">A / CURATED STORIES</p>
          <h1>딸의 취향을 이해하는 작은 이야기</h1>
          <p>정답을 알아내기보다 서로 다른 취향을 살펴보는 가상의 읽을거리입니다.</p>
          <p className="editorial-page__disclaimer">아래 5개 콘텐츠는 모두 <strong>시연 콘텐츠</strong>이며 실제 SNS 유행·설문·취재 결과가 아닙니다.</p>
        </header>
        <section aria-label="트렌드 읽을거리" className="editorial-page__list">
          {DAD_TRENDS.map((item, index) => {
            const status = sourceDisplay(item.status);
            return (
              <article className="editorial-page__tile" key={item.id}>
                <div className={`editorial-page__graphic editorial-page__graphic--${item.tone}`}
                  role="img" aria-label="실제 콘텐츠 사진이 아닌 합성 그래픽">
                  <span aria-hidden="true">STUDIO / DEMO</span>
                </div>
                <div className="editorial-page__tile-copy">
                  <p className="editorial-page__eyebrow">{String(index + 1).padStart(2, "0")} / {item.categoryLabel}</p>
                  <span className="editorial-page__stamp">{status.label}</span>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                  <Link href={`/dad/trends/${item.slug}`} className="editorial-page__action">
                    이야기 읽기 <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
        <p className="editorial-page__smallprint">외부 출처·확인일이 없는 합성 편집글입니다. 실제 유행 정보로 인용하지 마세요.</p>
        <Link className="editorial-page__return" href="/dad">아빠 홈으로 돌아가기 <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}
