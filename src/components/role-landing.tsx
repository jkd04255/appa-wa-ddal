"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  readLastSpace,
  saveLastSpace,
  type ExploreSpace,
} from "@/lib/role-preference";

const subscribeToBrowser = () => () => {};
const isBrowser = () => true;
const isServer = () => false;

const choices: ReadonlyArray<{
  space: ExploreSpace;
  eyebrow: string;
  title: string;
  description: string;
  number: string;
}> = [
  {
    space: "dad",
    eyebrow: "아빠의 공간",
    title: "아빠로 들어가기",
    description: "우리 딸의 세상이 궁금하다면",
    number: "01",
  },
  {
    space: "daughter",
    eyebrow: "딸의 공간",
    title: "딸로 들어가기",
    description: "내 취향과 이야기가 모이는 곳",
    number: "02",
  },
];

function ChoiceLinks() {
  return (
    <div className="role-choices" aria-label="둘러볼 공간 선택">
      {choices.map(({ space, eyebrow, title, description, number }) => (
        <a
          className={`role-card role-card--${space}`}
          href={`/${space}`}
          key={space}
          onClick={() => saveLastSpace(space)}
        >
          <span className="role-card__top">
            <span className="role-card__eyebrow">{eyebrow}</span>
            <span className="role-card__number" aria-hidden="true">{number}</span>
          </span>
          <span className="role-card__bottom">
            <span className="role-card__title">{title}</span>
            <span className="role-card__description">{description}</span>
          </span>
          <span className="role-card__arrow" aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

export function RoleLanding() {
  const router = useRouter();
  // Keep SSR and initial hydration deterministic; no localStorage access on the server.
  const browserReady = useSyncExternalStore(
    subscribeToBrowser,
    isBrowser,
    isServer,
  );
  const chooseExplicitly = browserReady &&
    new URLSearchParams(window.location.search).get("choose") === "1";
  const lastSpace = browserReady && !chooseExplicitly ? readLastSpace() : null;

  useEffect(() => {
    if (lastSpace) {
      router.replace(`/${lastSpace}`);
    }
  }, [lastSpace, router]);

  const showChoices = browserReady && !lastSpace;

  return (
    <main className="landing-page" id="main-content">
      <div className="landing-shell">
        <header className="landing-header">
          <span className="landing-brand">아빠와 딸</span>
          <span className="landing-index" aria-hidden="true">서로의 세상을 알아가는 공간</span>
        </header>

        {showChoices ? (
          <>
            <section className="landing-intro" aria-labelledby="landing-heading">
              <p className="landing-kicker">서로 다른 하루, 하나의 이야기</p>
              <h1 className="landing-heading" id="landing-heading">
                같은 집,<span>조금 다른 세상.</span>
              </h1>
              <p className="landing-subtitle">우리가 몰랐던 서로의 이야기.</p>
              <p className="landing-question">어떤 공간을 둘러보시겠어요?</p>
            </section>

            <ChoiceLinks />

            <p className="landing-disclosure">
              이 선택은 둘러볼 공간을 정하는 기능입니다.
              <span>실제 연령·가족관계나 게시 권한을 인증하지 않습니다.</span>
            </p>
          </>
        ) : (
          <p className="landing-loading" role="status" aria-live="polite">
            {browserReady ? "지난번 둘러본 공간으로 이동합니다." : "공간을 확인하고 있습니다."}
          </p>
        )}

        <noscript>
          <section className="landing-fallback" aria-label="공간 선택">
            <h1>같은 집, 조금 다른 세상.</h1>
            <p>우리가 몰랐던 서로의 이야기.</p>
            <p>어떤 공간을 둘러보시겠어요?</p>
            <p><a href="/dad">아빠로 들어가기</a></p>
            <p><a href="/daughter">딸로 들어가기</a></p>
            <p>공간 선택은 실제 연령·가족관계나 게시 권한 인증이 아닙니다.</p>
          </section>
        </noscript>

        <footer className="landing-footer">
          <span>APP A · WA · DDAL</span>
          <span>서로를 이해하는 또 하나의 방법</span>
        </footer>
      </div>
    </main>
  );
}
