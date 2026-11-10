import Link from "next/link";

export default function DaughterPlaceholder() {
  return (
    <main className="space-placeholder space-placeholder--daughter">
      <div className="space-placeholder__inner">
        <p className="space-placeholder__brand">아빠와 딸 / 딸의 공간</p>
        <p className="space-placeholder__index">02 / DAUGHTER</p>
        <h1>딸의 공간</h1>
        <p>취향과 새로운 발견을 위한 콘텐츠는 다음 단계에서 채워집니다.</p>
        <span className="space-placeholder__notice">현재는 화면 이동 확인용 안내입니다.</span>
        <Link href="/?choose=1">공간 다시 선택하기 <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}
