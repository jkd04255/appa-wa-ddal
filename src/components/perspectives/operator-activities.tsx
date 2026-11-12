"use client";

import { useId, useState } from "react";
import { OPERATOR_TOURNAMENT } from "@/data/fixtures/operator-activities";

export function OperatorTournamentDemo() {
  const headingId = useId();
  const [picks, setPicks] = useState<string[]>([]);
  const entries = OPERATOR_TOURNAMENT.entries;
  const round = picks.length;
  const match = round === 0
    ? entries.slice(0, 2)
    : round === 1
      ? entries.slice(2, 4)
      : round === 2
        ? [picks[0], picks[1]]
        : [];

  return (
    <section className="operator-activity" aria-labelledby={headingId}>
      <div className="operator-activity__heading">
        <p className="perspectives__eyebrow">네 가지 취향, 나만의 선택</p>
        <h2 id={headingId}>{OPERATOR_TOURNAMENT.title}</h2>
        <p>운영자가 정한 네 가지 보기로 나만의 우승 항목을 골라봅니다.</p>
        <span className="perspectives__stamp">운영자 작성 시연 · 결과 비저장</span>
      </div>

      {match.length > 0 ? (
        <div className="operator-activity__match" aria-live="polite">
          <p className="operator-activity__round">
            {round < 2 ? `준결승 ${round + 1}` : "결승"} · {round + 1}/3
          </p>
          <h3>어느 쪽을 고르시겠어요?</h3>
          <div className="operator-activity__match-options">
            {match.map((entry) => (
              <button key={entry} type="button" onClick={() => setPicks((current) => [...current, entry])}>
                {entry}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="operator-activity__notice" role="status" aria-live="polite">
          <p>나의 우승 선택: <strong>{picks[2]}</strong></p>
          <p>이 선택은 개인 미리보기이며 전체 결과나 순위가 아닙니다.</p>
          <button type="button" onClick={() => setPicks([])}>처음부터 다시 고르기</button>
        </div>
      )}

      <ol className="operator-activity__progress" aria-label="나의 토너먼트 선택">
        {["준결승 1", "준결승 2", "결승"].map((label, index) => (
          <li key={label} aria-current={round === index && round < 3 ? "step" : undefined}>
            <span>{label}</span>
            <strong>{picks[index] ?? "아직 선택 전"}</strong>
          </li>
        ))}
      </ol>
      <p className="operator-activity__footnote">
        각 단계의 선택은 이 화면에만 남고 저장·집계되지 않습니다. 새로고침하면 초기화됩니다.
      </p>
    </section>
  );
}

