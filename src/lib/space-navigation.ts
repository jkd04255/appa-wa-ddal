import type { ExploreSpace } from "@/lib/role-preference";

export type NavigationKey = "home" | "explore" | "community" | "perspectives" | "activity";

export type NavigationItem = Readonly<{
  key: NavigationKey;
  label: string;
  href: string;
}>;

export const NAV_ITEMS: Readonly<Record<ExploreSpace, readonly NavigationItem[]>> = {
  dad: [
    { key: "home", label: "홈", href: "/dad" },
    { key: "explore", label: "트렌드", href: "/dad/trends" },
    { key: "community", label: "커뮤니티", href: "/dad/community" },
    { key: "perspectives", label: "서로의 시선", href: "/dad/perspectives" },
  ],
  daughter: [
    { key: "home", label: "홈", href: "/daughter" },
    { key: "explore", label: "발견", href: "/daughter/discover" },
    { key: "community", label: "커뮤니티", href: "/daughter/community" },
    { key: "activity", label: "밸런스", href: "/daughter/polls" },
  ],
};

export function activeNavigationKey(
  space: ExploreSpace,
  pathname: string,
): NavigationKey {
  const prefix = `/${space}`;
  if (pathname === prefix || pathname === `${prefix}/`) return "home";

  const rest = pathname.startsWith(`${prefix}/`)
    ? pathname.slice(prefix.length + 1).split("/")[0]
    : "";

  if (space === "dad" && rest === "trends") return "explore";
  if (space === "daughter" && (rest === "discover" || rest === "sales")) return "explore";
  if (rest === "community") return "community";
  if (space === "daughter" && rest === "polls") return "activity";
  if (space === "dad" && rest === "perspectives") return "perspectives";
  // Later home-associated supporting routes (e.g. briefing/questions/polls).
  return "home";
}

