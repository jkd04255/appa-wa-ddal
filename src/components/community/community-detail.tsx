import Link from "next/link";
import type { CommunityDemoPost } from "@/domain/community-demo";

export function CommunityDetail({ post }: { post: CommunityDemoPost }) {
  const spaceLabel = post.space === "dad" ? "아빠" : "딸";
  return (
    <main id="main-content" className={`community-demo community-demo--${post.space}`}>
      <div className="community-demo__inner community-demo__inner--reading">
        <nav className="community-demo__breadcrumb" aria-label="위치">
          <Link href={`/${post.space}`}>{spaceLabel} 홈</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/${post.space}/community`}>커뮤니티</Link>
        </nav>
        <article className="community-demo__article">
          <header className="community-demo__article-header">
            <p className="community-demo__index">{post.space === "dad" ? "SIDE A / SAMPLE NOTE" : "SIDE B / SAMPLE NOTE"}</p>
            <span className="community-demo__board">{post.board}</span>
            <h1>{post.title}</h1>
            <p className="community-demo__subtle">{post.excerpt}</p>
            <p className="community-demo__notice"><strong>{post.demoNotice}</strong> · 가상 작성글이며 실제 사용자 사연이 아닙니다.</p>
          </header>
          <div className="community-demo__article-body">
            <p>{post.body}</p>
          </div>
        </article>
        <section className="community-demo__comments" aria-labelledby="demo-comments-heading">
          <div className="community-demo__section-title">
            <h2 id="demo-comments-heading">샘플 댓글</h2>
            <span className="community-demo__subtle">실제 대화가 아닙니다</span>
          </div>
          <ul>
            {post.comments.map((comment) => (
              <li key={comment.id}>
                <span className="community-demo__stamp">{comment.demoNotice}</span>
                <p>{comment.body}</p>
              </li>
            ))}
          </ul>
          <p className="community-demo__footnote">댓글 작성·답글·신고 전송 기능은 연결되지 않았습니다. 실제 커뮤니티가 아닙니다.</p>
        </section>
        <Link className="community-demo__return" href={`/${post.space}/community`}>
          샘플 목록으로 돌아가기 <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}
