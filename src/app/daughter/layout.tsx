import type { ReactNode } from "react";
import { SpaceShell } from "@/components/space-shell";

export default function DaughterLayout({ children }: { children: ReactNode }) {
  return <SpaceShell space="daughter">{children}</SpaceShell>;
}
