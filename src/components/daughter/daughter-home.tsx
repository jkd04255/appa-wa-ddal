import Link from "next/link";
import type { ReactNode } from "react";
import {
  DAUGHTER_COMMUNITY,
  DAUGHTER_DISCOVERY,
  DAUGHTER_FEATURE,
  DAUGHTER_POLL,
  DAUGHTER_SHOPPING,
} from "@/data/fixtures/daughter-home";
import type { DaughterDiscovery } from "@/domain/daughter-editorial";

const TOPIC_GROUPS = [
  {
    label: "덕질 · 미디어",
    topics: [
      ["아이돌", "culture"], ["팬덤", "culture"], ["쇼츠", "culture"], ["밈", "culture"],
      ["게임", "culture"], ["웹툰", "culture"], ["애니", "culture"], ["음악", "culture"],
      ["플레이리스트", "culture"], ["OTT · 드라마", "culture"],
    ],
  },
  {
    label: "뷰티 · 스타일",
    topics: [
      ["메이크업", "beauty"], ["스킨케어", "beauty"], ["패션", "culture"], ["빈티지", "culture"],
    ],
  },
  {
    label: "먹거리 · 일상",
    topics: [
      ["간식", "food"], ["디저트", "food"], ["카페", "food"], ["학교 · 친구", "culture"],
      ["사진 · 셀카", "culture"], ["반려동물", "culture"],
    ],
  },
] as const;

const TOPIC_COUNT = TOPIC_GROUPS.reduce((count, group) => count + group.topics.length, 0);

type FeedSection = {
  id: string;
  kicker: string;
  title: string;
  href: string;
  items: readonly DaughterDiscovery[];
};

const FEED_SECTIONS: readonly FeedSection[] = [
  {
    id: "fandom",
    kicker: "팬덤 · 미디어",
    title: "같은 취향인데, 왜 댓글은 갈렸을까",
    href: "/daughter/discover?category=culture",
    items: [DAUGHTER_FEATURE, DAUGHTER_DISCOVERY[2], DAUGHTER_DISCOVERY[3]],
  },
  {
    id: "school",
    kicker: "친구 · 학교",
    title: "단톡방 한 줄에 분위기가 바뀐 순간",
    category: "culture",
    items: [DAUGHTER_DISCOVERY[4], DAUGHTER_DISCOVERY[5]],
  },
  {
    id: "taste",
    kicker: "뷰티 · 먹거리",
    title: "사진으로 본 기대와 실제의 온도차",
    href: "/daughter/discover",
    items: [DAUGHTER_DISCOVERY[0], DAUGHTER_DISCOVERY[1]],
  },
];

function DemoLabel({ children = "시연 콘텐츠" }: { children?: ReactNode }) {
  return <span className="daughter-home__demo">{children}</span>;
}

function SectionHeading({
  title,
  id,
  href,
  aside,
}: {
  title: string;
  id: string;
  href: string;
  aside: string;
}) {
  return (
    <div className="daughter-home__section-head">
      <h2 id={id}>{title}</h2>
      <Link className="daughter-home__text-link" href={href}>
        {aside}<span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}

function StoryCard({ item, index }: { item: DaughterDiscovery; index: number }) {
  return (
    <article className={"daughter-home__story-card daughter-home__story-card--tone-" + (index % 3 + 1)}>
      <Link className="daughter-home__story-link" href={"/daughter/discover/" + item.slug}>
        <div className="daughter-home__story-meta">
          <span>{item.categoryLabel}</span>
          <DemoLabel>가상 이슈</DemoLabel>
        </div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <span className="daughter-home__read-link">내용 보기 <span aria-hidden="true">↗</span></span>
      </Link>
    </article>
  );
}

export function DaughterHome() {
  return (
    <main id="main-content" className="daughter-home">
      <div className="daughter-home__container">
        <header className="daughter-home__masthead">
          <p className="daughter-home__index">가상 편집 피드 · 실제 이슈 아님</p>
          <div className="daughter-home__masthead-row">
            <h1>관심사</h1>
            <span className="daughter-home__issue">가상 헤드라인 {DAUGHTER_DISCOVERY.length + 1}</span>
          </div>
        </header>

        <details className="daughter-home__topic-menu">
          <summary>
            <span>주제 둘러보기</span>
            <span className="daughter-home__topic-count">{TOPIC_COUNT}</span>
            <span className="daughter-home__topic-icon" aria-hidden="true">+</span>
          </summary>
          <nav className="daughter-home__topic-content" aria-label="관심 주제">
            {TOPIC_GROUPS.map((group) => (
              <div className="daughter-home__topic-group" key={group.label}>
                <h2>{group.label}</h2>
                <div className="daughter-home__topic-links">
                  {group.topics.map(([label, category]) => (
                    <Link key={label} href={"/daughter/discover?category=" + category}>{label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </details>

        <div className="daughter-home__feed">
          {FEED_SECTIONS.map((section, sectionIndex) => (
            <section
              className={"daughter-home__feed-section daughter-home__feed-section--" + section.id}
              aria-labelledby={"daughter-section-" + section.id}
              key={section.id}
            >
              <div className="daughter-home__section-kicker">
                <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
                <span>{section.kicker}</span>
              </div>
              <SectionHeading
                id={"daughter-section-" + section.id}
                title={section.title}
                href={section.href}
                aside="관련 글"
              />
              <div className="daughter-home__story-grid">
                {section.items.map((item, index) => <StoryCard key={item.id} item={item} index={index} />)}
              </div>
            </section>
          ))}
        </div>

        <section className="daughter-home__extra-section" aria-labelledby="daughter-shopping-heading">
          <div className="daughter-home__section-kicker">
            <span>04</span><span>장바구니 · 소비</span>
          </div>
          <SectionHeading id="daughter-shopping-heading" title="담기 직전, 한 번 더 보게 되는 것" href="/daughter/sales" aside="쇼핑 글" />
          <div className="daughter-home__shopping-list">
            {DAUGHTER_SHOPPING.map((item, index) => (
              <article className="daughter-home__shopping-item" key={item.id}>
                <span className="daughter-home__shopping-index" aria-hidden="true">0{index + 1}</span>
                <div>
                  <DemoLabel>가상 장바구니</DemoLabel>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>
              </article>
            ))}
            <p className="daughter-home__fine-print">실제 가격·할인·구매 링크는 제공하지 않습니다.</p>
          </div>
        </section>

        <div className="daughter-home__bottom-grid">
          <section className="daughter-home__extra-section daughter-home__community-section" aria-labelledby="daughter-community-heading">
            <div className="daughter-home__section-kicker">
              <span>05</span><span>커뮤니티 미리보기</span>
            </div>
            <SectionHeading id="daughter-community-heading" title="이 말, 나만 걸렸어?" href="/daughter/community" aside="샘플 글" />
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

          <section className="daughter-home__extra-section daughter-home__poll-section" aria-labelledby="daughter-poll-heading">
            <div className="daughter-home__section-kicker">
              <span>06</span><span>댓글 갈리는 질문</span>
            </div>
            <SectionHeading id="daughter-poll-heading" title="너라면 먼저 뭐라고 할래?" href="/daughter/polls" aside="질문·토너먼트 보기" />
            <div className="daughter-home__poll-panel">
              <DemoLabel>가상 질문 · 결과 저장 안 됨</DemoLabel>
              <h3>{DAUGHTER_POLL.question}</h3>
              <div className="daughter-home__poll-options" aria-label="가상 선택지 · 선택 기능 없음">
                {DAUGHTER_POLL.options.map((option) => <span key={option}>{option}</span>)}
              </div>
            </div>
          </section>
        </div>

        <p className="daughter-home__footnotes">
          모든 제목·본문·게시글·질문은 실제 인물, 사건, 유행, 할인, 사용자 반응과 무관한 합성 시연 콘텐츠입니다.
          이용자 게시·댓글·투표 저장·결과 집계 기능은 연결되어 있지 않습니다.
        </p>
      </div>
    </main>
  );
}
