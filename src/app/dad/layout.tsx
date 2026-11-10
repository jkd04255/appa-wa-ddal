import type { ReactNode } from "react";
import { SpaceShell } from "@/components/space-shell";

export default function DadLayout({ children }: { children: ReactNode }) {
  return <SpaceShell space="dad">{children}</SpaceShell>;
}
