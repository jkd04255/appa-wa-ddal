export type ExploreSpace = "dad" | "daughter";

export const LAST_SPACE_KEY = "awdd.lastSpace.v1";

export function isExploreSpace(value: unknown): value is ExploreSpace {
  return value === "dad" || value === "daughter";
}

export function readLastSpace(): ExploreSpace | null {
  try {
    const value = window.localStorage.getItem(LAST_SPACE_KEY);
    return isExploreSpace(value) ? value : null;
  } catch {
    // Blocked storage must never block browsing or masquerade as authorization.
    return null;
  }
}

export function saveLastSpace(space: ExploreSpace): void {
  try {
    window.localStorage.setItem(LAST_SPACE_KEY, space);
  } catch {
    // The native link still navigates when storage is blocked.
  }
}
