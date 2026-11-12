import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DAUGHTER_ITEMS, findDaughterDiscovery } from "@/lib/editorial-catalog";
import { sourceDisplay } from "@/domain/editorial-detail";
import "../../../editorial.css";

export function generateStaticParams() {
  return DAUGHTER_ITEMS.map(({ slug }) => ({ slug }));
}

export default async function DaughterDiscoveryDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = findDaughterDiscovery(slug);
  if (!record) notFound();
  const { item, detail } = record;
  const status = sourceDisplay(item.status);
  return (
    <main id="main-content" className="editorial-page editorial-page--daughter">
      <div className="editorial-page__inner editorial-page__inner--article">
        <nav className="editorial-page__breadcrumbs" aria-label="위치">
          <Link href="/daughter">딸 홈</Link><span aria-hidden="true">/</span>
          <Link href="/daughter/discover">발견</Link>
        </nav>
        <article className="editorial-page__article">
          <header className="editorial-page__article-head">
            <p className="editorial-page__index">{item.categoryLabel}</p>
            <span className="editorial-page__stamp">{status.label}</span>
            <h1>{item.title}</h1>
            <p>{item.summary}</p>
          </header>
          <figure className="editorial-page__article-photo">
            <div className="editorial-page__photo">
              <Image src={item.cover} alt={item.coverAlt} fill priority
                sizes="(min-width: 800px) 720px, 100vw" />
            </div>
            <figcaption>분위기를 표현한 예시 사진 · 실제 게시물·상품 이미지가 아닙니다.</figcaption>
          </figure>
          <div className="editorial-page__article-body">
            <section aria-labelledby="daughter-detail-background">
              <h2 id="daughter-detail-background">글 안내</h2>
              <p>{detail.background}</p>
            </section>
            <section aria-labelledby="daughter-detail-context">
              <h2 id="daughter-detail-context">자료 범위</h2>
              <p>{detail.context}</p>
            </section>
            <section aria-labelledby="daughter-detail-tip">
              <h2 id="daughter-detail-tip">관련 정보</h2>
              <p>{detail.tip}</p>
            </section>
            <section className="editorial-page__conversation" aria-labelledby="daughter-detail-prompt">
              <h2 id="daughter-detail-prompt">확인할 항목</h2>
              <p>{detail.conversation}</p>
            </section>
            <aside className="editorial-page__source" aria-label="자료 상태와 출처">
              <h2>자료 상태</h2>
              <p><strong>{status.label}</strong> · {status.detail}</p>
              <p>출처·확인 날짜: 해당 없음(가상 예시). 사진은 실제 콘텐츠의 출처가 아닙니다.</p>
            </aside>
          </div>
        </article>
        <Link className="editorial-page__return" href={`/daughter/discover?category=${item.category}`}>
          {item.categoryLabel} 목록으로 돌아가기 <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}

