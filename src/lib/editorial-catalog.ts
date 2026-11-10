import { DAD_TRENDS } from "@/data/fixtures/dad-home";
import { DAUGHTER_FEATURE, DAUGHTER_DISCOVERY } from "@/data/fixtures/daughter-home";
import { DAD_DETAIL, DAUGHTER_DETAIL } from "@/data/fixtures/editorial-detail";

export const DAUGHTER_ITEMS = [DAUGHTER_FEATURE, ...DAUGHTER_DISCOVERY] as const;
export type DadItem = (typeof DAD_TRENDS)[number];
export type DaughterItem = (typeof DAUGHTER_ITEMS)[number];
export type DaughterCategory = DaughterItem["category"];

/** Slugs are compared against an explicit allowlist, never interpolated into files or queries. */
export function findDadTrend(slug: string) {
  const item = DAD_TRENDS.find((entry) => entry.slug === slug);
  if (!item) return null;
  return { item, detail: DAD_DETAIL[item.slug] };
}

export function findDaughterDiscovery(slug: string) {
  const item = DAUGHTER_ITEMS.find((entry) => entry.slug === slug);
  if (!item) return null;
  return { item, detail: DAUGHTER_DETAIL[item.slug] };
}

export function getDaughterCategory(value: string | string[] | undefined): DaughterCategory | null {
  if (value === "beauty" || value === "food" || value === "culture") return value;
  return null;
}

export function listDaughterDiscovery(category?: DaughterCategory | null) {
  return category ? DAUGHTER_ITEMS.filter((item) => item.category === category) : DAUGHTER_ITEMS;
}
