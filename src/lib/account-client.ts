import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
// Only modern public keys belong in this static client. Never accept a secret key.
export const accountConfigured = /^https:\/\/[^/]+\.supabase\.co$/.test(url) && key.startsWith("sb_publishable_");
export const googleConfigured = accountConfigured && process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
let client: SupabaseClient | null = null;

export function getAccountClient() {
  if (!accountConfigured) return null;
  client ??= createClient(url, key, {
    auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}

export function accountCallbackUrl() {
  return `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/account/`;
}
