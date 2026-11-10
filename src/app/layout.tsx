import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "아빠와 딸 | 준비 중",
  description: "같은 집, 조금 다른 세상. 웹 서비스 개발 환경 준비 중입니다.",
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
