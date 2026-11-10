import Link from "next/link";
import {
  DAD_BRIEFING,
  DAD_COMMUNITY_PREVIEW,
  DAD_CONVERSATION,
  DAD_PERSPECTIVE,
  DAD_TRENDS,
} from "@/data/fixtures/dad-home";
import type { DemoTrend } from "@/domain/demo-editorial";

function DemoStamp({ children = "시연 콘텐츠" }: { children?: string }) {
  return <span className="dad-home__demo">{children}</span>;
}

function EditorialArtwork({
  tone,
  hero = false,
}: {
  tone: DemoTrend["tone"];
  hero?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label="실제 사진이 아닌 가상 콘텐츠용 그래픽 자리"
      className={`dad-home__art dad-home__art--${tone}${hero ? " dad-home__art--hero" : ""}`}
    >
      <span aria-hidden="true" className="dad-home__art-grid" />
      <span aria-hidden="true" className="dad-home__art-orbit" />
      <span aria-hidden="true" className="dad-home__art-caption">
        STUDIO / SAMPLE
      </span>
    </div>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  href,
  cta,
}: {
  id: string;
  eyebrow: string;
  title: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="dad-home__section-header">
      <div>
        <p className="dad-home__eyebrow">{eyebrow}</p>
        <h2 className="dad-home__section-title" id={id}>{title}</h2>
      </div>
      {href && cta ? <Link className="dad-home__section-link" href={href}>{cta} <span aria-hidden="true">↗</span></Link> : null}
    </div>
  );
}

export function DadHome() {
  const [featured, ...secondary] = DAD_TRENDS;

  return (
    <main id="main-content" className="dad-home">
      <div className="dad-home__container">
        <div className="dad-home__intro">
          <p className="dad-home__eyebrow">APP A / CURATED EDITION</p>
          <h1>아빠의 공간</h1>
          <p>조금 낯선 이야기도, 가볍게 알아볼 수 있도록.</p>
        </div>

        <section className="dad-home__section dad-home__trends" aria-labelledby="dad-trends-heading">
          <SectionHeading id="dad-trends-heading" eyebrow="01 / DISCOVER" title="오늘의 딸 트렌드" />
          <div className="dad-home__hero">
            <EditorialArtwork tone={featured.tone} hero />
            <div className="dad-home__hero-copy">
              <div className="dad-home__meta"><DemoStamp /><span>{featured.categoryLabel}</span></div>
              <h3>{featured.title}</h3>
              <p>{featured.summary}</p>
              <Link href={`/dad/trends/${featured.slug}`} className="dad-home__hero-link">
                이야기 읽기 <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className="dad-home__subsection">
            <SectionHeading id="dad-more-trends" eyebrow="SHORT READS" title="함께 살펴볼 이야기" href="/dad/trends" cta="전체 보기" />
            <div className="dad-home__trend-list" aria-labelledby="dad-more-trends">
              {secondary.map((item) => (
                <article className="dad-home__trend-row" key={item.id}>
                  <EditorialArtwork tone={item.tone} />
                  <div className="dad-home__trend-copy">
                    <div className="dad-home__meta"><DemoStamp /><span>{item.categoryLabel}</span></div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <Link className="dad-home__story-link" href={`/dad/trends/${item.slug}`} aria-label={`${item.title} 상세 읽기`}>이야기 읽기 <span aria-hidden="true">↗</span></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dad-home__section" aria-labelledby="dad-briefing-heading">
          <SectionHeading id="dad-briefing-heading" eyebrow="02 / ONE MINUTE" title="아빠의 1분 브리핑" href="/dad/briefing" cta="브리핑 보기" />
          <div className="dad-home__brief">
            {DAD_BRIEFING.map((item, index) => (
              <article className="dad-home__brief-row" key={item.id}>
                <span className="dad-home__brief-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <DemoStamp />
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dad-home__section" aria-labelledby="dad-community-heading">
          <SectionHeading id="dad-community-heading" eyebrow="03 / COMMUNITY" title="아빠들의 이야기" href="/dad/community" cta="커뮤니티 보기" />
          <div className="dad-home__community">
            <div className="dad-home__community-copy">
              <p className="dad-home__community-lead">비슷한 고민을 나누는 자리</p>
              <p>아래 글은 화면 구성을 위한 가상 예시입니다.</p>
            </div>
            <ul className="dad-home__community-list">
              {DAD_COMMUNITY_PREVIEW.map((post) => (
                <li key={post.id}>
                  <span className="dad-home__community-category">{post.board}</span>
                  <span className="dad-home__community-title">{post.title}</span>
                  <DemoStamp>{post.demoNotice}</DemoStamp>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dad-home__section" aria-labelledby="dad-questions-heading">
          <SectionHeading id="dad-questions-heading" eyebrow="04 / CONVERSATION" title="궁금한 질문 · 대화 소재" />
          <div className="dad-home__prompts">
            {DAD_CONVERSATION.map((item) => (
              <article className="dad-home__prompt" key={item.kind}>
                <DemoStamp />
                <h3>{item.title}</h3>
                <p>{item.prompt}</p>
                <Link href={item.href}>이동하기 <span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
        </section>

        <section className="dad-home__section dad-home__last-section" aria-labelledby="dad-perspective-heading">
          <SectionHeading id="dad-perspective-heading" eyebrow="05 / PERSPECTIVES" title="서로의 시선" href="/dad/perspectives" cta="살펴보기" />
          <div className="dad-home__perspective">
            <DemoStamp />
            <h3>{DAD_PERSPECTIVE.title}</h3>
            <div className="dad-home__perspective-sides">
              <p><span>아빠의 관점</span>{DAD_PERSPECTIVE.dadSide}</p>
              <p><span>딸의 관점</span>{DAD_PERSPECTIVE.daughterSide}</p>
            </div>
          </div>
        </section>

        <p className="dad-home__fineprint">
          모든 카드·브리핑·게시글·관점은 디자인 검증용 합성 예시이며 실제 SNS 최신 동향, 게시글, 설문 결과가 아닙니다.
          트렌드 목록과 가상 상세는 읽을 수 있지만 실제 SNS 조사·실사용자 커뮤니티는 제공하지 않습니다.
        </p>
      </div>
    </main>
  );
}
