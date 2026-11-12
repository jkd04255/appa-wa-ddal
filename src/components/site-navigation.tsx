"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NAV_ITEMS, activeNavigationKey, type NavigationKey } from "@/lib/space-navigation";
import type { ExploreSpace } from "@/lib/role-preference";

function TabIcon({ name }: { name: NavigationKey }) {
  const marks: Record<NavigationKey, ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
      </>
    ),
    explore: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2.6 5.1-4.4 1.9 2.6-5.1z" />
      </>
    ),
    community: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    perspectives: (
      <>
        <path d="M4 5h10a4 4 0 0 1 4 4v3" />
        <path d="m15 9 3 3 3-3" />
        <path d="M20 19H10a4 4 0 0 1-4-4v-3" />
        <path d="m9 15-3-3-3 3" />
      </>
    ),
    activity: (
      <>
        <path d="M7 4v16M17 4v16" />
        <path d="M3 8h8M13 16h8" />
        <circle cx="7" cy="8" r="2" fill="currentColor" />
        <circle cx="17" cy="16" r="2" fill="currentColor" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" focusable="false" className="app-nav__icon"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {marks[name]}
    </svg>
  );
}

export function SiteNavigation({ space }: { space: ExploreSpace }) {
  const pathname = usePathname();
  const active = activeNavigationKey(space, pathname);
  const label = space === "dad" ? "아빠의 공간 주요 메뉴" : "딸의 공간 주요 메뉴";
  const entries = NAV_ITEMS[space];

  return (
    <nav className="app-nav" aria-label={label} data-space={space}>
      <ul className="app-nav__list">
        {entries.map((item) => {
          const selected = active === item.key;
          return (
            <li className="app-nav__item" key={item.key}>
              <Link className={`app-nav__link${selected ? " app-nav__link--active" : ""}`}
                href={item.href} aria-current={selected ? "page" : undefined}>
                <TabIcon name={item.key} />
                <span className="app-nav__label">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

