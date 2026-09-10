import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "마켓런-보령편 | 왕을 구한 보부상",
  description: "QR을 따라 보령 전통시장을 누비며 쌍목화솜을 완성하는 30분 모바일 미션투어",
  openGraph: {
    title: "마켓런-보령편 | 왕을 구한 보부상",
    description: "30분 보령 전통시장 미션투어",
    images: [{ url: "https://market-run-boryeong.beecorium.chatgpt.site/og.png", width: 1730, height: 909, alt: "마켓런-보령편 왕을 구한 보부상" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "마켓런-보령편 | 왕을 구한 보부상",
    description: "30분 보령 전통시장 미션투어",
    images: ["https://market-run-boryeong.beecorium.chatgpt.site/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
