"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { accountCallbackUrl, accountConfigured, getAccountClient, googleConfigured } from "@/lib/account-client";
import { useAccount } from "./account-provider";

type Mode = "login" | "signup" | "reset";

export function AccountPanel() {
  const { user, loading, recovery } = useAccount();
  const [mode, setMode] = useState<Mode>("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [recovered, setRecovered] = useState(false);
  const callbackFailed = useSyncExternalStore(
    () => () => {},
    () => { const params = new URLSearchParams(window.location.search); return params.has("error") || params.has("error_description"); },
    () => false,
  );
  const changingPassword = recovery && !recovered;

  function changeMode(next: Mode) { setMode(next); setError(""); setMessage(""); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getAccountClient();
    if (!client || busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if ((mode === "signup" || changingPassword) && password !== data.get("confirmPassword")) {
      setError("두 비밀번호가 일치하지 않습니다."); return;
    }
    setBusy(true); setError(""); setMessage("");
    try {
      if (changingPassword) {
        const result = await client.auth.updateUser({ password });
        if (result.error) throw result.error;
        setRecovered(true); setMessage("비밀번호를 변경했습니다.");
      } else if (mode === "signup") {
        const result = await client.auth.signUp({ email, password, options: { emailRedirectTo: accountCallbackUrl() } });
        if (result.error) throw result.error;
        setMessage("가입 가능한 이메일이면 확인 메일을 보냈습니다. 메일의 링크를 연 뒤 로그인해 주세요.");
      } else if (mode === "reset") {
        const result = await client.auth.resetPasswordForEmail(email, { redirectTo: accountCallbackUrl() });
        if (result.error) throw result.error;
        setMessage("등록된 이메일이면 비밀번호 재설정 링크를 보냈습니다.");
      } else {
        const result = await client.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        setMessage("로그인했습니다. 홈에서 원하는 의견에 투표해 주세요.");
      }
      form.reset();
    } catch {
      setError(mode === "login" && !changingPassword
        ? "로그인하지 못했습니다. 이메일·비밀번호와 이메일 인증 여부를 확인해 주세요."
        : "요청을 완료하지 못했습니다. 연결 상태를 확인하고 잠시 후 다시 시도해 주세요.");
    } finally { setBusy(false); }
  }

  async function google() {
    const client = getAccountClient();
    if (!client || !googleConfigured || busy) return;
    setBusy(true); setError("");
    try {
      const { error } = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: accountCallbackUrl() } });
      if (error) throw error;
    } catch { setError("Google 로그인에 연결하지 못했습니다. 다시 시도해 주세요."); }
    finally { setBusy(false); }
  }

  async function logout() {
    setBusy(true); setError("");
    try {
      const result = await getAccountClient()?.auth.signOut({ scope: "local" });
      if (result?.error) throw result.error;
      setMessage("로그아웃했습니다.");
    } catch { setError("로그아웃을 완료하지 못했습니다. 다시 시도해 주세요."); }
    finally { setBusy(false); }
  }

  return (
    <main id="main-content" className="account-page">
      <Link className="account-back" href="/daughter">← 딸 홈으로</Link>
      <div className="account-card">
        <div className="account-mark" aria-hidden="true"><span>나</span><span>의</span><span>선택</span></div>
        <h1>{user && !changingPassword ? "내 계정" : changingPassword ? "새 비밀번호" : "내 쪽에 한 표"}</h1>
        <p className="account-intro">구경은 자유롭게, 투표는 로그인하고.</p>
        {!accountConfigured && <p className="account-notice" role="status">회원 서비스 연결 준비 중입니다. 지금은 계정이 생성되거나 입력한 정보가 전송되지 않습니다.</p>}
        {(error || callbackFailed) && <p className="account-error" role="alert">{error || "로그인 연결을 완료하지 못했습니다. 다시 시도해 주세요."}</p>}
        {message && <p className="account-notice" role="status">{message}</p>}
        {loading ? <p role="status">로그인 상태 확인 중…</p> : user && !changingPassword ? (
          <div className="account-signed-in">
            <p>로그인한 계정: <strong>{user.email ?? "Google 계정"}</strong></p>
            <Link className="account-primary" href="/daughter/#balance-game">밸런스 게임으로 돌아가기</Link>
            <button className="account-secondary" onClick={logout} disabled={busy}>로그아웃</button>
          </div>
        ) : (
          <>
            {!changingPassword && <div className="account-modes" aria-label="회원 메뉴">
              <button aria-pressed={mode === "login"} onClick={() => changeMode("login")}>로그인</button>
              <button aria-pressed={mode === "signup"} onClick={() => changeMode("signup")}>회원가입</button>
            </div>}
            <form onSubmit={submit} key={`${mode}-${changingPassword}`}>
              <fieldset disabled={!accountConfigured || busy}>
                <legend className="sr-only">{changingPassword ? "비밀번호 변경" : mode === "signup" ? "회원가입 정보" : mode === "reset" ? "비밀번호 찾기" : "로그인 정보"}</legend>
                {!changingPassword && <label>이메일<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>}
                {(mode !== "reset" || changingPassword) && <label>비밀번호<input name="password" type="password" autoComplete={mode === "signup" || changingPassword ? "new-password" : "current-password"} minLength={mode === "signup" || changingPassword ? 12 : 1} maxLength={128} required /></label>}
                {(mode === "signup" || changingPassword) && <><p className="account-hint">12자 이상으로 입력해 주세요.</p><label>비밀번호 확인<input name="confirmPassword" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label></>}
                {mode === "signup" && !changingPassword && <label className="account-consent"><input name="consent" type="checkbox" required /><span>계정 생성과 투표 참여를 위해 이메일과 계정별 투표 기록을 사용하는 것에 동의합니다.</span></label>}
                <button className="account-primary" type="submit">{busy ? "처리 중…" : changingPassword ? "비밀번호 변경" : mode === "signup" ? "이메일로 회원가입" : mode === "reset" ? "재설정 메일 받기" : "로그인"}</button>
              </fieldset>
            </form>
            {!changingPassword && <>
              <button className="account-secondary" onClick={google} disabled={!googleConfigured || busy}><span className="google-mark" aria-hidden="true">G</span> Google로 계속하기{!googleConfigured && <small>연결 준비 중</small>}</button>
              <button className="account-reset" onClick={() => changeMode(mode === "reset" ? "login" : "reset")}>{mode === "reset" ? "로그인으로 돌아가기" : "비밀번호를 잊으셨나요?"}</button>
            </>}
          </>
        )}
      </div>
    </main>
  );
}
