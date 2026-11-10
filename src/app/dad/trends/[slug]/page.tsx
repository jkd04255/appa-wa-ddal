import Link from "next/link";
import { notFound } from "next/navigation";
import { DAD_TRENDS } from "@/data/fixtures/dad-home";
import { findDadTrend } from "@/lib/editorial-catalog";
import { sourceDisplay } from "@/domain/editorial-detail";
import "../../../editorial.css";

export function generateStaticParams() {
  return DAD_TRENDS.map(({ slug }) => ({ slug }));
}

export default async function DadTrendDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = findDadTrend(slug);
  if (!record) notFound();
  const { item, detail } = record;
  const status = sourceDisplay(item.status);

  return (
    <main id="main-content" className="editorial-page editorial-page--dad">
      <div className="editorial-page__inner editorial-page__inner--article">
        <nav className="editorial-page__breadcrumbs" aria-label="위치">
          <Link href="/dad">아빠 홈</Link><span aria-hidden="true">/</span>
          <Link href="/dad/trends">트렌드</Link>
        </nav>
        <article className="editorial-page__article">
          <header className="editorial-page__article-head">
            <p className="editorial-page__index">A / {item.categoryLabel}</p>
            <span className="editorial-page__stamp">{status.label}</span>
            <h1>{item.title}</h1>
            <p>{item.summary}</p>
          </header>
          <div className={`editorial-page__article-art editorial-page__graphic--${item.tone}`}
            role="img" aria-label="이 글과 관련된 실제 사진이 아닌 합성 배경 그래픽">
            <span aria-hidden="true">EDITORIAL / SAMPLE</span>
          </div>
          <div className="editorial-page__article-body">
            <section aria-labelledby="dad-detail-background">
              <h2 id="dad-detail-background">이야기의 배경</h2>
              <p>{detail.background}</p>
            </section>
            <section aria-labelledby="dad-detail-context">
              <h2 id="dad-detail-context">이해할 점</h2>
              <p>{detail.context}</p>
            </section>
            <section aria-labelledby="dad-detail-tip">
              <h2 id="dad-detail-tip">알아두면 좋은 점</h2>
              <p>{detail.tip}</p>
            </section>
            <section className="editorial-page__conversation" aria-labelledby="dad-detail-question">
              <h2 id="dad-detail-question">부담 없는 대화 예시</h2>
              <p>{detail.conversation}</p>
            </section>
            <aside className="editorial-page__source" aria-label="자료 상태와 출처">
              <h2>자료 상태</h2>
              <p><strong>{status.label}</strong> · {status.detail}</p>
              <p>출처·확인 날짜: 해당 없음(가상 예시). 실제 최신 유행이나 검증된 취재 자료가 아닙니다.</p>
            </aside>
          </div>
        </article>
        <Link className="editorial-page__return" href="/dad/trends">트렌드 목록으로 돌아가기 <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}
