import Link from "next/link";
import type { ExploreSpace } from "@/lib/role-preference";

export function SectionPlaceholder({
  space,
  title,
}: {
  space: ExploreSpace;
  title: string;
}) {
  const spaceName = space === "dad" ? "아빠의 공간" : "딸의 공간";

  return (
    <main id="main-content" className="space-placeholder">
      <div className="space-placeholder__inner">
        <p className="space-placeholder__index">{spaceName} / 메뉴 이동 확인</p>
        <h1>{title}</h1>
        <p>이 페이지의 콘텐츠는 아직 준비 중입니다.</p>
        <span className="space-placeholder__notice">
          현재는 내비게이션·직접 URL 이동을 검증하기 위한 안내 화면입니다.
        </span>
        <Link href={`/${space}`} className="space-placeholder__home-link">
          홈으로 돌아가기 <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}
