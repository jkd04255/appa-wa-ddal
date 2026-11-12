"use client";

import Image from "next/image";
import Link from "next/link";
import { getDaughterCategory, listDaughterDiscovery } from "@/lib/editorial-catalog";
import { sourceDisplay } from "@/domain/editorial-detail";

const categories = [
  { label: "전체", value: null },
  { label: "뷰티", value: "beauty" },
  { label: "먹거리", value: "food" },
  { label: "문화·음악", value: "culture" },
] as const;

export function DiscoveryContent({ query }: { query?: string | string[] }) {
  const category = getDaughterCategory(query);
  const invalidCategory = query !== undefined && query !== "" && category === null;
  const items = listDaughterDiscovery(category);
  return (
    <main id="main-content" className="editorial-page editorial-page--daughter">
      <div className="editorial-page__inner">
        <header className="editorial-page__masthead">
          <h1>발견</h1>
          <p className="editorial-page__disclaimer">모든 항목은 <strong>시연 콘텐츠</strong>이며 실제 유행·쇼핑 소식이 아닙니다.</p>
        </header>
        <nav className="editorial-page__categories" aria-label="발견 필터">
          {categories.map(({ label, value }) => {
            const active = value === category;
            const href = value ? `/daughter/discover?category=${value}` : "/daughter/discover";
            return (
              <Link key={label} href={href} aria-current={active ? "true" : undefined}
                className={`editorial-page__category${active ? " editorial-page__category--active" : ""}`}>
                {label}
              </Link>
            );
          })}
        </nav>
        {invalidCategory ? (
          <p role="status" className="editorial-page__filter-notice">
            확인할 수 없는 카테고리입니다. 전체 콘텐츠를 표시합니다.
          </p>
        ) : null}
        <section aria-label="발견 목록" className="editorial-page__list editorial-page__list--daughter">
          {items.map((item, index) => {
            const status = sourceDisplay(item.status);
            return (
              <article className="editorial-page__tile editorial-page__tile--daughter" key={item.id}>
                <div className="editorial-page__photo">
                  <Image src={item.cover} alt={item.coverAlt} fill
                    sizes="(min-width: 960px) 330px, (min-width: 640px) 46vw, 100vw"
                    priority={index === 0} />
                </div>
                <div className="editorial-page__tile-copy">
                  <p className="editorial-page__eyebrow">{item.categoryLabel}</p>
                  <span className="editorial-page__stamp">{status.label}</span>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                  <Link href={`/daughter/discover/${item.slug}`} className="editorial-page__action"
                    aria-label={`${item.title} · 이야기 읽기`}>
                    <span className="editorial-page__action-label">이야기 읽기</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
        <p className="editorial-page__smallprint">실제 사진은 분위기 표현용입니다. 원문·유행·할인 자료의 출처로 사용하지 않았습니다.</p>
        <Link className="editorial-page__return" href="/daughter">딸 홈으로 돌아가기 <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}

