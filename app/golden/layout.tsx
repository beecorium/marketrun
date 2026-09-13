import type { Metadata } from 'next';
const title = '황금 패랭이를 찾아라 | 보령 꿀잼야행';
const description = '밤길에 숨은 세 개의 징표를 찾아 황금 패랭이를 완성하는 보령 전통시장 모바일 미션';
const url = 'https://market-run-boryeong.jlpartner.workers.dev/golden';
const images = [{
  url: 'https://market-run-boryeong.jlpartner.workers.dev/images/golden-share-preview-20260913.png',
  width: 1200,
  height: 630,
  alt: '황금 패랭이를 찾아라 – 보령 꿀잼야행',
}];
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { type: 'website', title, description, url, images },
  twitter: { card: 'summary_large_image', title, description, images },
};
export default function Layout({children}:{children:React.ReactNode}) { return children; }
