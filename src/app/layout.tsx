import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "아빠와 딸 | 같은 집, 조금 다른 세상.",
  description: "우리가 몰랐던 서로의 이야기. 아빠와 딸, 각자의 공간을 둘러보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
