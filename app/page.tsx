import type { Metadata } from "next";
import LandingPage from "./LandingPage";
import "./landing.css";

export const metadata: Metadata = {
  title: "마켓런 | 지역을 걷고, 이야기를 발견하다",
  description: "지역의 역사·시장·사람을 모바일 미션으로 연결하는 마켓런. 지자체·전통시장·문화재단을 위한 지역 맞춤형 체험 프로그램을 제안합니다.",
  alternates: { canonical: "https://market-run.co.kr/" },
  openGraph: {
    title: "마켓런 | 지역을 걷고, 이야기를 발견하다",
    description: "지역의 역사·시장·사람을 하나의 모바일 미션 여정으로 만듭니다.",
    url: "https://market-run.co.kr/",
    type: "website",
    images: [{
      url: "https://market-run.co.kr/images/golden-share-preview-20260913.png",
      width: 1200,
      height: 630,
      alt: "마켓런 보령편 황금 패랭이를 찾아라",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "마켓런 | 지역을 걷고, 이야기를 발견하다",
    description: "지역의 역사·시장·사람을 하나의 모바일 미션 여정으로 만듭니다.",
    images: ["https://market-run.co.kr/images/golden-share-preview-20260913.png"],
  },
};

export default function Home() {
  return <LandingPage />;
}
