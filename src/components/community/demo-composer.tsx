"use client";

import Link from "next/link";
import { useState } from "react";
import type { CommunitySpace } from "@/domain/community-demo";

/**
 * No form, action, fetch, effect, localStorage, cookie or server mutation.
 * Buttons are type="button". User input lives only inside this page's React memory.
 */
export function DemoComposer({ space }: { space: CommunitySpace }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState<{ title: string; body: string } | null>(null);
  const canPreview = title.trim().length > 0 && body.trim().length > 0;

  return (
    <main id="main-content" className={`community-demo community-demo--${space}`}>
      <div className="community-demo__inner community-demo__inner--reading">
        <nav className="community-demo__breadcrumb" aria-label="위치">
          <Link href={`/${space}/community`}>샘플 커뮤니티</Link><span aria-hidden="true">/</span>
          <span>글쓰기 체험</span>
        </nav>
        <header className="community-demo__masthead community-demo__masthead--composer">
          <p className="community-demo__index">{space === "dad" ? "SIDE A" : "SIDE B"} / PRIVATE DRAFT</p>
          <h1>글쓰기 체험</h1>
          <p>입력한 내용을 이 화면에서만 미리 볼 수 있습니다.</p>
          <p className="community-demo__notice" role="note">
            <strong>실제 게시하거나 저장하지 않습니다.</strong>
            이름·연락처·학교·위치·민감한 개인 사연은 입력하지 마세요.
            작성 내용은 서버, DB, 분석 도구, 브라우저 저장소로 전송되지 않으며
            화면을 나가거나 새로고침하면 사라집니다. 역할 선택은 본인 인증이 아닙니다.
          </p>
        </header>
        <section className="community-demo__draft" aria-labelledby="draft-fields-heading">
          <h2 id="draft-fields-heading">나만의 샘플 문장</h2>
          <label className="community-demo__field community-demo__field--wide">
            <span>제목 (최대 80자)</span>
            <input type="text" name="demo-title" autoComplete="off" maxLength={80}
              value={title} onChange={(e) => { setTitle(e.target.value); setPreview(null); }}
              placeholder="가상의 취향 이야기를 입력해보세요"/>
          </label>
          <label className="community-demo__field community-demo__field--wide">
            <span>내용 (최대 500자)</span>
            <textarea name="demo-body" autoComplete="off" maxLength={500} rows={6}
              value={body} onChange={(e) => { setBody(e.target.value); setPreview(null); }}
              placeholder="실제 개인정보나 민감한 사연 없이 UI만 체험해보세요"/>
          </label>
          <div className="community-demo__draft-actions">
            <button type="button" className="community-demo__preview-button" disabled={!canPreview}
              onClick={() => setPreview({ title: title.trim(), body: body.trim() })}>
              화면에서만 미리보기
            </button>
            <button type="button" className="community-demo__clear-button"
              onClick={() => { setTitle(""); setBody(""); setPreview(null); }}>
              전체 지우기
            </button>
          </div>
          {preview ? (
            <div className="community-demo__draft-preview" aria-live="polite">
              <p className="community-demo__index">LOCAL / NOT PUBLISHED</p>
              <span className="community-demo__stamp">미리보기 전용 · 게시·저장되지 않았습니다</span>
              <h3>{preview.title}</h3>
              <p>{preview.body}</p>
            </div>
          ) : (
            <p className="community-demo__footnote">미리보기 버튼은 내용 확인용이며 실제 글쓰기를 완료하지 않습니다.</p>
          )}
        </section>
        <Link className="community-demo__return" href={`/${space}/community`}>체험 종료하고 돌아가기 <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}
