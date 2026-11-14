"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { accountConfigured, getAccountClient } from "@/lib/account-client";
import { EXAMPLE_POLL, pollPercent, type BalancePoll, type VoteSide } from "@/lib/balance-poll";
import { useAccount } from "@/components/account/account-provider";

export function BalanceGame() {
  const { user, loading } = useAccount();
  const [poll, setPoll] = useState<BalancePoll | null>(accountConfigured ? null : EXAMPLE_POLL);
  const [choice, setChoice] = useState<VoteSide | null>(null);
  const [pendingChoice, setPendingChoice] = useState<VoteSide | null>(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(!accountConfigured);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  const example = !accountConfigured;

  useEffect(() => {
    const client = getAccountClient();
    if (!client) return;
    let active = true;
    async function load() {
      setReady(false); setError(""); setChoice(null);
      try {
        const result = await client!.from("balance_poll_results").select("id,question,left_label,right_label,left_votes,right_votes,total_votes").order("total_votes", { ascending: false }).order("id").limit(1).maybeSingle();
        if (result.error) throw result.error;
        if (!active) return;
        setPoll(result.data as BalancePoll | null);
        if (result.data && user) {
          const mine = await client!.from("balance_votes").select("side").eq("poll_id", result.data.id).eq("user_id", user.id).maybeSingle();
          if (mine.error) throw mine.error;
          if (active) setChoice(mine.data?.side ?? null);
        }
        if (active) setReady(true);
      } catch { if (active) { setError("투표 현황을 불러오지 못했습니다."); setReady(false); } }
    }
    void load();
    return () => { active = false; };
  }, [user, revision]);

  async function vote(side: VoteSide) {
    const client = getAccountClient();
    if (!user) { setPendingChoice(side); return; }
    if (!client || !poll || !ready || busy || choice) return;
    setBusy(true); setError(""); setNotice("");
    try {
      // No user-writable counts or rewards; the server owns the unique vote and aggregate.
      const result = await client.from("balance_votes").insert({ poll_id: poll.id, user_id: user.id, side });
      if (result.error) {
        if (result.error.code === "23505") { setNotice("이미 참여한 투표입니다."); setRevision(r => r + 1); return; }
        throw result.error;
      }
      setChoice(side); setNotice("내 한 표를 반영했습니다.");
      setRevision(r => r + 1);
    } catch { setError("투표하지 못했습니다. 로그인 상태와 투표 마감 여부를 확인해 주세요."); }
    finally { setBusy(false); }
  }

  const percent = pollPercent(poll?.left_votes ?? 0, poll?.right_votes ?? 0);
  return (
    <section id="balance-game" className="balance-game" aria-labelledby="balance-title">
      <header className="balance-game__header"><span className="balance-game__badge">밸런스 게임</span><span>{example ? "예시 결과 · 실제 투표 아님" : "진행 중 · 참여순"}</span></header>
      <h2 id="balance-title">지금, 어느 쪽?</h2>
      {poll ? <>
        <p className="balance-game__question">{poll.question}</p>
        <div className="balance-game__duel">
          <button type="button" className="balance-game__option balance-game__option--left" aria-pressed={choice === "left"} disabled={busy || loading || !!choice || !ready} onClick={() => vote("left")}>
            <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="13" y="12" width="38" height="43" rx="5"/><path d="M23 8v10m18-10v10M13 25h38m-29 9 4 4 8-9m-12 16h17"/></svg>
            <span>{poll.left_label}</span><strong>{percent.left}<small>%</small></strong>
          </button>
          <span className="balance-game__vs" aria-hidden="true">VS</span>
          <button type="button" className="balance-game__option balance-game__option--right" aria-pressed={choice === "right"} disabled={busy || loading || !!choice || !ready} onClick={() => vote("right")}>
            <svg viewBox="0 0 64 64" aria-hidden="true"><path d="m7 28 49-17-17 47-8-22zM31 36l25-25M8 44l8-2M17 54l5-6"/></svg>
            <span>{poll.right_label}</span><strong>{percent.right}<small>%</small></strong>
          </button>
        </div>
        <div className={`balance-game__bar${poll.total_votes === 0 ? " balance-game__bar--empty" : ""}`} role="img" aria-label={`${example ? "예시: " : ""}${poll.left_label} ${percent.left}%, ${poll.right_label} ${percent.right}%`}>
          <span className="balance-game__bar-left" style={{ width: `${percent.width}%` }} /><span className="balance-game__bar-right" style={{ width: `${100 - percent.width}%` }} />
        </div>
        <div className="balance-game__footer">
          <span>{example ? "비율 미리보기" : poll.total_votes === 0 ? "아직 0표 · 첫 선택을 남겨 주세요" : `${poll.total_votes.toLocaleString("ko-KR")}표 참여`}</span>
          {user ? <span>{choice ? "투표 완료 ✓" : "한 계정, 한 표"}</span> : <Link href="/account">로그인하고 투표</Link>}
        </div>
        {pendingChoice && !user && <p className="balance-game__notice" role="status">{pendingChoice === "left" ? poll.left_label : poll.right_label}에 투표하려면 <Link href="/account">로그인 또는 회원가입</Link>이 필요합니다.</p>}
      </> : <p className="balance-game__notice">{ready ? "첫 밸런스 게임을 준비 중입니다." : "투표 현황을 불러오는 중…"}</p>}
      {error && <div className="balance-game__notice" role="alert">{error} <button type="button" onClick={() => setRevision(r => r + 1)}>다시 불러오기</button></div>}
      {notice && <p className="balance-game__notice" role="status">{notice}</p>}
    </section>
  );
}
