import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { publicAsset } from "@/lib/public-asset";
import {
  DAUGHTER_COMMUNITY,
  DAUGHTER_DISCOVERY,
  DAUGHTER_FEATURE,
  DAUGHTER_POLL,
  DAUGHTER_SHOPPING,
} from "@/data/fixtures/daughter-home";
import type { DaughterDiscovery } from "@/domain/daughter-editorial";

const INTEREST_TOPICS = [
  ["아이돌", "culture"], ["팬덤", "culture"], ["쇼츠", "culture"], ["밈", "culture"],
  ["게임", "culture"], ["웹툰", "culture"], ["애니", "culture"], ["음악", "culture"],
  ["플레이리스트", "culture"], ["메이크업", "beauty"], ["스킨케어", "beauty"],
  ["패션", "culture"], ["빈티지", "culture"], ["간식", "food"], ["디저트", "food"],
  ["카페", "food"], ["학교·친구", "culture"], ["사진·셀카", "culture"],
  ["OTT·드라마", "culture"], ["반려동물", "culture"],
] as const;

function DemoLabel({ children = "시연 콘텐츠" }: { children?: ReactNode }) {
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
        src={publicAsset(src)}
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
  title,
  id,
  aside,
  href,
}: {
  title: string;
  id: string;
  aside?: string;
  href?: string;
}) {
  return (
    <div className="daughter-home__section-head">
      <div>
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

export function DaughterHome() {
  return (
    <main id="main-content" className="daughter-home">
      <div className="daughter-home__container">
        <div className="daughter-home__masthead">
          <p className="daughter-home__index">시연 콘텐츠</p>
          <div className="daughter-home__masthead-row">
            <h1>관심사</h1>
            <span className="daughter-home__issue">{INTEREST_TOPICS.length}개 주제</span>
          </div>
        </div>

        <section className="daughter-home__topic-board" aria-labelledby="daughter-topic-heading">
          <h2 id="daughter-topic-heading">관심 주제</h2>
          <nav aria-label="관심 주제">
            {INTEREST_TOPICS.map(([label, category]) => (
              <Link key={label} href={`/daughter/discover?category=${category}`}>
                {label}
              </Link>
            ))}
          </nav>
        </section>

        <section className="daughter-home__section daughter-home__feature" aria-labelledby="daughter-feature-heading">
          <SectionHeading id="daughter-feature-heading" title="추천 글" />
          <div className="daughter-home__feature-grid">
            <div className="daughter-home__feature-photo">
              <EditorialPhoto
                src={DAUGHTER_FEATURE.cover}
                alt={DAUGHTER_FEATURE.coverAlt}
                sizes="(min-width: 900px) 480px, (min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
            <div className="daughter-home__feature-copy">
              <div className="daughter-home__meta">
                <DemoLabel />
                <span>{DAUGHTER_FEATURE.categoryLabel}</span>
              </div>
              <h3>{DAUGHTER_FEATURE.title}</h3>
              <p className="daughter-home__summary">{DAUGHTER_FEATURE.summary}</p>
              <Link href={`/daughter/discover/${DAUGHTER_FEATURE.slug}`} className="daughter-home__arrow-link"
                aria-label={`${DAUGHTER_FEATURE.title} · 이야기 읽기`}>
                이야기 읽기 <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="daughter-home__section" aria-labelledby="daughter-discovery-heading">
          <SectionHeading
            id="daughter-discovery-heading"
            title="관심사별 글"
            href="/daughter/discover"
            aside="전체 글 보기"
          />
          <div className="daughter-home__discovery-grid">
            {DAUGHTER_DISCOVERY.map((item) => (
              <article className="daughter-home__discovery-card" key={item.id}>
                <div className="daughter-home__discovery-media">
                  <EditorialPhoto
                    src={item.cover}
                    alt={item.coverAlt}
                    sizes="(min-width: 960px) 350px, (min-width: 600px) 46vw, 100vw"
                  />
                </div>
                <div className="daughter-home__meta">
                  <DemoLabel />
                  <span>{item.categoryLabel}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <Link href={`/daughter/discover/${item.slug}`} className="daughter-home__card-link"
                  aria-label={`${item.title} · 이야기 읽기`}>
                  이야기 읽기 <span aria-hidden="true">↗</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="daughter-home__section daughter-home__shopping" aria-labelledby="daughter-shopping-heading">
          <SectionHeading
            id="daughter-shopping-heading" title="쇼핑 정보"
            aside="쇼핑 정보 보기" href="/daughter/sales"
          />
          <div className="daughter-home__shopping-panel">
            <div className="daughter-home__shopping-intro">
              <span className="daughter-home__off-record">광고가 아닌 시연 콘텐츠</span>
              <p>예시 상품</p>
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
          <SectionHeading id="daughter-community-heading"
            title="커뮤니티 글" href="/daughter/community" aside="커뮤니티 보기" />
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
          <SectionHeading id="daughter-poll-heading"
            title="이번 주 질문" href="/daughter/polls" aside="질문·토너먼트 보기" />
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

        <p className="daughter-home__footnotes">
          모든 이야기·쇼핑 노트·커뮤니티·투표는 시연용 합성 데이터입니다. 실제 인기·할인·응답 결과나 사용자 게시물이 아닙니다.
          사진은 주제의 분위기를 표현하기 위한 이미지이며 실제 콘텐츠의 출처를 뜻하지 않습니다.
          사진 출처와 사용권은 개발 문서에서 확인할 수 있습니다. 이야기 상세는 가상 편집글입니다. 개인 작성은 제공하지 않으며, 질문·토너먼트 선택은 화면에서만 체험할 수 있습니다.
        </p>
      </div>
    </main>
  );
}

