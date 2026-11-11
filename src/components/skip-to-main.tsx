"use client";

/**
 * G1-09 keyboard accessibility fix:
 * Hash navigation can scroll without transferring DOM focus to a non-tabbable
 * <main>. Shift keyboard focus to the existing main landmark on activation.
 * Keep the native #main-content anchor as a no-JS scroll fallback.
 */
export function SkipToMain() {
  return (
    <a
      className="app-skip-link"
      href="#main-content"
      onClick={() => {
        const main = document.getElementById("main-content");
        if (!main) return;
        // -1 allows programmatic focus but never adds a normal Tab stop.
        main.tabIndex = -1;
        main.focus({ preventScroll: true });
      }}
    >
      본문으로 바로가기
    </a>
  );
}
