"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CommunityDemoProps, CommunityDemoPost } from "@/domain/community-demo";

export function CommunityIndex({ space, posts, boards }: CommunityDemoProps) {
  const [query, setQuery] = useState("");
  const [board, setBoard] = useState("all");
  const [order, setOrder] = useState("sample");
  const isDad = space === "dad";
  const pageTitle = isDad ? "아빠들의 이야기" : "취향의 뒷면";
  const searched = query.trim().toLocaleLowerCase("ko-KR");
  const visible = useMemo(() => {
    const selected = posts.filter((post: CommunityDemoPost) =>
      (board === "all" || board === post.board)
      && (!searched || [post.title, post.excerpt, post.body].some((value) =>
        value.toLocaleLowerCase("ko-KR").includes(searched)
      ))
    );
    return selected.sort((a, b) => order === "title"
      ? a.title.localeCompare(b.title, "ko-KR")
      : b.sampleOrder - a.sampleOrder
    );
  }, [posts, board, searched, order]);

  return (
    <main id="main-content" className={`community-demo community-demo--${space}`}>
      <div className="community-demo__inner">
        <header className="community-demo__masthead">
          <p className="community-demo__index">{isDad ? "SIDE A / SMALL TALKS" : "SIDE B / AFTER HOURS"}</p>
          <div className="community-demo__topline">
            <h1>{pageTitle}</h1>
            <Link className="community-demo__primary-link" href={`/${space}/community/new`}>
              글쓰기 체험 <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <p>{isDad
            ? "각자의 속도로 대화를 시작하는 가상의 이야기들."
            : "겉은 조용한 취향 노트, 안에는 조금 더 솔직한 작은 이야기."}</p>
          <p className="community-demo__notice">
            <strong>시연 콘텐츠 · 샘플 커뮤니티입니다.</strong> 실제 작성자·회원·댓글이 없으며, 게시글과 댓글은 모두 합성 예시입니다.
            이 공간 선택은 신원·연령·작성 권한을 인증하지 않습니다.
          </p>
        </header>

        <section className="community-demo__browse" aria-labelledby="community-browse-heading">
          <h2 id="community-browse-heading">이야기 찾아보기</h2>
          <div className="community-demo__filters">
            <label className="community-demo__field">
              <span>샘플 글 검색</span>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="제목이나 주제 검색" autoComplete="off" maxLength={80}/>
            </label>
            <label className="community-demo__field">
              <span>주제 선택</span>
              <select value={board} onChange={(e) => setBoard(e.target.value)}>
                <option value="all">전체 주제</option>
                {boards.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <label className="community-demo__field">
              <span>정렬</span>
              <select value={order} onChange={(e) => setOrder(e.target.value)}>
                <option value="sample">시연 순서</option>
                <option value="title">제목 가나다순</option>
              </select>
            </label>
          </div>
          <p className="community-demo__count" role="status" aria-live="polite">
            검색 결과: 샘플 게시글 {visible.length}개
          </p>
          {visible.length ? (
            <div className="community-demo__list">
              {visible.map((post: CommunityDemoPost, i: number) => (
                <article className="community-demo__post" key={post.id}>
                  <span className="community-demo__ordinal" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <div className="community-demo__post-body">
                    <div className="community-demo__meta">
                      <span className="community-demo__board">{post.board}</span>
                      <span className="community-demo__stamp">{post.demoNotice}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <Link className="community-demo__post-link" href={`/${space}/community/${post.id}`}>
                      샘플 글 읽기 <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="community-demo__empty">
              <p>일치하는 샘플 글이 없습니다.</p>
              <button type="button" onClick={() => { setQuery(""); setBoard("all"); setOrder("sample"); }}>
                검색 초기화
              </button>
            </div>
          )}
        </section>
        <p className="community-demo__footnote">검색·주제·정렬은 이 화면의 합성 데이터에만 적용됩니다. 입력값을 서버나 브라우저 저장소에 보내지 않습니다.</p>
      </div>
    </main>
  );
}
