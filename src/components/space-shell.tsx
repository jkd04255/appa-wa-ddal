import Link from "next/link";
import type { ReactNode } from "react";
import type { ExploreSpace } from "@/lib/role-preference";
import { SiteNavigation } from "@/components/site-navigation";

export function SpaceShell({
  space,
  children,
}: {
  space: ExploreSpace;
  children: ReactNode;
}) {
  const label = space === "dad" ? "아빠의 공간" : "딸의 공간";

  return (
    <div className={`app-shell app-shell--${space}`} data-current-space={space}>
      <a className="app-skip-link" href="#main-content">본문으로 바로가기</a>
      <header className="app-header">
        <div className="app-header__inner">
          <Link href={`/${space}`} className="app-header__brand" aria-label={`아빠와 딸 — ${label} 홈`}>
            아빠와 딸
          </Link>
          <SiteNavigation space={space} />
          <div className="app-header__actions">
            <span className="app-header__space">{label}</span>
            <Link className="app-header__switch" href="/?choose=1">
              공간 다시 선택하기
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
