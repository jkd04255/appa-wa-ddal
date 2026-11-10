import Link from "next/link";

export default function DadPlaceholder() {
  return (
    <main className="space-placeholder space-placeholder--dad">
      <div className="space-placeholder__inner">
        <p className="space-placeholder__brand">아빠와 딸 / 아빠의 공간</p>
        <p className="space-placeholder__index">01 / DAD</p>
        <h1>아빠의 공간</h1>
        <p>딸의 관심사를 이해하는 이야기는 다음 단계에서 채워집니다.</p>
        <span className="space-placeholder__notice">현재는 화면 이동 확인용 안내입니다.</span>
        <Link href="/?choose=1">공간 다시 선택하기 <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}
