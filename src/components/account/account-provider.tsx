"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { accountConfigured, getAccountClient } from "@/lib/account-client";

const AccountContext = createContext<{ user: User | null; loading: boolean; recovery: boolean }>({ user: null, loading: true, recovery: false });

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(accountConfigured);
  const [recovery, setRecovery] = useState(false);
  useEffect(() => {
    const client = getAccountClient();
    if (!client) return;
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      // This state only changes the UI. Database policies validate every vote.
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      if (event === "SIGNED_OUT") setRecovery(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  return <AccountContext.Provider value={{ user, loading, recovery }}>{children}</AccountContext.Provider>;
}

export function useAccount() { return useContext(AccountContext); }

export function AccountLink() {
  const { user } = useAccount();
  return <Link className="account-entry" href="/account">{user ? "내 계정" : "로그인 / 가입"}</Link>;
}
