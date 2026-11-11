"use client";

import { useId, useState } from "react";
import { OPERATOR_POLL, OPERATOR_TOURNAMENT } from "@/data/fixtures/operator-activities";

export function OperatorActivities() {
  const pollId = useId();
  const [pollChoice, setPollChoice] = useState<string | null>(null);
  const [tournamentPicks, setTournamentPicks] = useState<string[]>([]);
  const entries = OPERATOR_TOURNAMENT.entries;
  const currentRound = tournamentPicks.length;

  const match = currentRound === 0
    ? entries.slice(0, 2)
    : currentRound === 1
      ? entries.slice(2, 4)
      : currentRound === 2
        ? [tournamentPicks[0], tournamentPicks[1]]
        : [];
  const roundLabel = currentRound < 2
    ? `준결승 ${currentRound + 1}`
    : "결승";

  function chooseTournamentEntry(entry: string) {
    setTournamentPicks((current) => [...current, entry]);
  }

  return (
    <div className="operator-activities">
      <section className="operator-activity" aria-labelledby={`${pollId}-title`}>
        <div className="operator-activity__heading">
          <p className="perspectives__eyebrow">OPERATOR EDITION / FIXED CHOICES</p>
          <h2 id={`${pollId}-title`}>이번 주 질문</h2>
          <p>{OPERATOR_POLL.question}</p>
          <span className="perspectives__stamp">운영자 작성 시연 · 고정 선택지</span>
        </div>
        <fieldset className="operator-activity__options">
          <legend>선택하면 이 화면에서만 미리 표시됩니다</legend>
          {OPERATOR_POLL.options.map((option, index) => (
            <label
              key={option}
              className={`perspectives__choice-option${pollChoice === option ? " perspectives__choice-option--selected" : ""}`}
            >
              <input
                type="radio"
                name={pollId}
                value={option}
                checked={pollChoice === option}
                onChange={() => setPollChoice(option)}
              />
              <span className="perspectives__choice-index">{String(index + 1).padStart(2, "0")}</span>
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
        {pollChoice ? (
          <div className="operator-activity__notice" role="status" aria-live="polite">
            <p>선택 미리보기: <strong>{pollChoice}</strong></p>
            <p>투표를 제출하지 않았으며 응답과 결과는 저장·집계되지 않습니다.</p>
            <button type="button" onClick={() => setPollChoice(null)}>선택 지우기</button>
          </div>
        ) : (
          <p className="operator-activity__footnote">응답 수나 순위는 표시하지 않습니다. 새로고침하면 선택이 사라집니다.</p>
        )}
      </section>

      <section className="operator-activity" aria-labelledby={`${pollId}-tournament`}>
        <div className="operator-activity__heading">
          <p className="perspectives__eyebrow">A SMALL BRACKET / SESSION ONLY</p>
          <h2 id={`${pollId}-tournament`}>{OPERATOR_TOURNAMENT.title}</h2>
          <p>운영자가 정한 네 가지 보기로 나만의 우승 항목을 골라봅니다.</p>
          <span className="perspectives__stamp">운영자 작성 시연 · 결과 비저장</span>
        </div>

        {match.length > 0 ? (
          <div className="operator-activity__match" aria-live="polite">
            <p className="operator-activity__round">{roundLabel} · {currentRound + 1}/3</p>
            <h3>어느 쪽을 고르시겠어요?</h3>
            <div className="operator-activity__match-options">
              {match.map((entry) => (
                <button key={entry} type="button" onClick={() => chooseTournamentEntry(entry)}>
                  {entry}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="operator-activity__notice" role="status" aria-live="polite">
            <p>나의 우승 선택: <strong>{tournamentPicks[2]}</strong></p>
            <p>이 선택은 개인 미리보기이며 전체 결과나 순위가 아닙니다.</p>
            <button type="button" onClick={() => setTournamentPicks([])}>처음부터 다시 고르기</button>
          </div>
        )}

        <ol className="operator-activity__progress" aria-label="나의 토너먼트 선택">
          {["준결승 1", "준결승 2", "결승"].map((label, index) => (
            <li key={label} aria-current={currentRound === index && currentRound < 3 ? "step" : undefined}>
              <span>{label}</span>
              <strong>{tournamentPicks[index] ?? "아직 선택 전"}</strong>
            </li>
          ))}
        </ol>
        <p className="operator-activity__footnote">각 단계의 선택은 이 화면에만 남고 저장·집계되지 않습니다. 새로고침하면 초기화됩니다.</p>
      </section>
    </div>
  );
}
