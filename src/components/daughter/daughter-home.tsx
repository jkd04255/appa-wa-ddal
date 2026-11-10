import Image from "next/image";
import Link from "next/link";
import {
  DAUGHTER_COMMUNITY,
  DAUGHTER_DISCOVERY,
  DAUGHTER_FEATURE,
  DAUGHTER_PERSPECTIVE,
  DAUGHTER_POLL,
  DAUGHTER_SHOPPING,
} from "@/data/fixtures/daughter-home";
import type { DaughterDiscovery } from "@/domain/daughter-editorial";

function DemoLabel({ children = "시연 콘텐츠" }: { children?: string }) {
  return <span className="daughter-home__demo">{children}</span>;
}

function EditorialPhoto({
  src,
  alt,
  priority = false,
  sizes,
}: {
  src: DaughterDiscovery["cover"];
  alt: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <div className="daughter-home__photo">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="daughter-home__photo-image"
      />
    </div>
  );
}

function SectionHeading({
  number,
  title,
  id,
  aside,
  href,
}: {
  number: string;
  title: string;
  id: string;
  aside?: string;
  href?: string;
}) {
  return (
    <div className="daughter-home__section-head">
      <div>
        <p className="daughter-home__index">{number}</p>
        <h2 id={id}>{title}</h2>
      </div>
      {aside && href ? (
        <Link className="daughter-home__text-link" href={href}>
          {aside}<span aria-hidden="true">↗</span>
        </Link>
      ) : null}
    </div>
  );
}

const FILTERS = [
  { label: "뷰티", slug: "beauty" },
  { label: "먹거리", slug: "food" },
  { label: "문화", slug: "culture" },
  { label: "전체 보기", slug: "all" },
] as const;

export function DaughterHome() {
  return (
    <main id="main-content" className="daughter-home">
      <div className="daughter-home__container">
        <div className="daughter-home__masthead">
          <p className="daughter-home__index">SIDE B / AN OPEN NOTEBOOK</p>
          <div className="daughter-home__masthead-row">
            <h1>딸의 공간<span aria-hidden="true">.</span></h1>
            <span className="daughter-home__issue" aria-hidden="true">ISSUE 001 / SAMPLE EDITION</span>
          </div>
          <p className="daughter-home__intro-copy">취향에 이름을 붙이지 않아도 괜찮은 곳.</p>
        </div>

        <section className="daughter-home__section daughter-home__feature" aria-labelledby="daughter-feature-heading">
          <SectionHeading id="daughter-feature-heading" number="01 / THE COVER" title="지금 눈여겨볼 이야기" />
          <div className="daughter-home__feature-grid">
            <div className="daughter-home__feature-photo">
              <EditorialPhoto
                src={DAUGHTER_FEATURE.cover}
                alt={DAUGHTER_FEATURE.coverAlt}
                sizes="(min-width: 900px) 480px, (min-width: 768px) 50vw, 100vw"
                priority
              />
              <span className="daughter-home__photo-number" aria-hidden="true">01 — SIDE B</span>
            </div>
            <div className="daughter-home__feature-copy">
              <div className="daughter-home__meta">
                <DemoLabel />
                <span>{DAUGHTER_FEATURE.categoryLabel}</span>
              </div>
              <p className="daughter-home__tiny-note">THE QUIET SIDE OF CULTURE</p>
              <h3>{DAUGHTER_FEATURE.title}</h3>
              <p className="daughter-home__summary">{DAUGHTER_FEATURE.summary}</p>
              <Link href="/daughter/discover" className="daughter-home__arrow-link">
                발견 메뉴에서 살펴보기 <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="daughter-home__section daughter-home__interests" aria-labelledby="daughter-interests-heading">
          <SectionHeading id="daughter-interests-heading" number="02 / YOUR FREQUENCY" title="관심 있는 이야기" />
          <nav aria-label="관심사 카테고리" className="daughter-home__filter-nav">
            {FILTERS.map((filter) => (
              <Link
                href={filter.slug === "all" ? "/daughter/discover" : `/daughter/discover?category=${filter.slug}`}
                key={filter.slug}
                className="daughter-home__filter"
              >
                {filter.label} <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
        </section>

        <section className="daughter-home__section" aria-labelledby="daughter-discovery-heading">
          <SectionHeading
            id="daughter-discovery-heading"
            number="03 / OFF THE RECORD"
            title="발견한 장면들"
            href="/daughter/discover"
            aside="더 발견하기"
          />
          <div className="daughter-home__discovery-grid">
            {DAUGHTER_DISCOVERY.map((item, i) => (
              <article className="daughter-home__discovery-card" key={item.id}>
                <div className="daughter-home__discovery-media">
                  <EditorialPhoto
                    src={item.cover}
                    alt={item.coverAlt}
                    sizes="(min-width: 960px) 350px, (min-width: 600px) 46vw, 100vw"
                  />
                  <span className="daughter-home__media-index" aria-hidden="true">0{i + 2}</span>
                </div>
                <div className="daughter-home__meta">
                  <DemoLabel />
                  <span>{item.categoryLabel}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <Link href="/daughter/discover" className="daughter-home__card-link">
                  발견 메뉴 보기 <span aria-hidden="true">↗</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="daughter-home__section daughter-home__shopping" aria-labelledby="daughter-shopping-heading">
          <SectionHeading
            id="daughter-shopping-heading" number="04 / LITTLE FINDS" title="쇼핑 노트"
            aside="쇼핑 정보 보기" href="/daughter/sales"
          />
          <div className="daughter-home__shopping-panel">
            <div className="daughter-home__shopping-intro">
              <span className="daughter-home__off-record">NOT AN AD / DEMO</span>
              <p>세일보다 먼저,<span>나에게 맞는 선택.</span></p>
              <span className="daughter-home__shopping-disclosure">실시간 할인·구매 안내가 아닙니다.</span>
            </div>
            <div className="daughter-home__shopping-items">
              {DAUGHTER_SHOPPING.map((item, i) => (
                <article key={item.id} className="daughter-home__shopping-item">
                  <span className="daughter-home__shopping-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <DemoLabel />
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="daughter-home__section" aria-labelledby="daughter-community-heading">
          <SectionHeading id="daughter-community-heading" number="05 / LOW-KEY CONVERSATIONS"
            title="친구들과 나누는 이야기" href="/daughter/community" aside="커뮤니티로 이동" />
          <ul className="daughter-home__community">
            {DAUGHTER_COMMUNITY.map((post) => (
              <li key={post.id}>
                <span className="daughter-home__community-board">{post.board}</span>
                <span className="daughter-home__community-title">{post.title}</span>
                <DemoLabel>{post.demoNotice}</DemoLabel>
              </li>
            ))}
          </ul>
        </section>

        <section className="daughter-home__section daughter-home__poll-section" aria-labelledby="daughter-poll-heading">
          <SectionHeading id="daughter-poll-heading" number="06 / QUESTION OF THE WEEK"
            title="이번 주 질문" href="/daughter/polls" aside="질문 살펴보기" />
          <div className="daughter-home__poll-panel">
            <div>
              <DemoLabel>시연 질문 · {DAUGHTER_POLL.demoNotice}</DemoLabel>
              <h3>{DAUGHTER_POLL.question}</h3>
            </div>
            <div className="daughter-home__poll-options" aria-label="가상 선택지 · 투표 기능 없음">
              {DAUGHTER_POLL.options.map((option) => <span key={option}>{option}</span>)}
            </div>
          </div>
        </section>

        <section className="daughter-home__section daughter-home__perspectives" aria-labelledby="daughter-perspective-heading">
          <div>
            <p className="daughter-home__index">07 / BETWEEN US</p>
            <h2 id="daughter-perspective-heading">서로의 시선</h2>
            <p>{DAUGHTER_PERSPECTIVE.title}</p>
            <DemoLabel />
          </div>
          <Link href="/daughter/perspectives" className="daughter-home__arrow-link">
            편집된 관점 보기 <span aria-hidden="true">↗</span>
          </Link>
        </section>

        <p className="daughter-home__footnotes">
          모든 이야기·쇼핑 노트·커뮤니티·투표는 시연용 합성 데이터입니다. 실제 인기·할인·응답 결과나 사용자 게시물이 아닙니다.
          사진은 주제의 분위기를 표현하기 위한 이미지이며 실제 콘텐츠의 출처를 뜻하지 않습니다.
          사진 출처와 사용권은 개발 문서에서 확인할 수 있습니다. 상세 콘텐츠와 작성·투표 기능은 아직 준비 중입니다.
        </p>
      </div>
    </main>
  );
}
