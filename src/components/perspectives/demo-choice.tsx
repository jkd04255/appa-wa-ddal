"use client";

import { useId, useState } from "react";
import type { DemoQuestion, DemoChoiceState } from "@/domain/perspective-editorial";

/**
 * A deliberately non-submitting choice illustration.
 * No form, action, storage, cookie, fetch, counter, results, analytics or API.
 */
export function DemoChoice({ question }: { question: DemoQuestion }) {
  const groupId = useId();
  const [choice, setChoice] = useState<DemoChoiceState>(null);
  return (
    <section className="perspectives__choice" aria-labelledby={groupId}>
      <div className="perspectives__choice-heading">
        <p className="perspectives__eyebrow">INTERACTIVE / FICTIONAL</p>
        <h2 id={groupId}>가상 질문 체험</h2>
        <span className="perspectives__stamp">{question.notice}</span>
      </div>
      <p className="perspectives__choice-question">{question.question}</p>
      <fieldset className="perspectives__choices">
        <legend>보기 하나를 선택하여 화면에서만 미리 볼 수 있습니다</legend>
        {question.options.map((option, index) => (
          <label key={option} className={`perspectives__choice-option${choice === option ? " perspectives__choice-option--selected" : ""}`}>
            <input type="radio" name={groupId} checked={choice === option}
              onChange={() => setChoice(option)} value={option} />
            <span aria-hidden="true" className="perspectives__choice-index">{String(index + 1).padStart(2, "0")}</span>
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      {choice ? (
        <div className="perspectives__choice-preview" role="status" aria-live="polite">
          <p>선택 미리보기: <strong>{choice}</strong></p>
          <p>이것은 투표 결과가 아닙니다. 응답을 제출하거나 저장하지 않았습니다.</p>
          <button type="button" onClick={() => setChoice(null)}>선택 지우기</button>
        </div>
      ) : (
        <p className="perspectives__choice-footnote">선택은 이 화면에서만 표시되며 실제 투표·응답 수집·집계가 이루어지지 않습니다.</p>
      )}
    </section>
  );
}
