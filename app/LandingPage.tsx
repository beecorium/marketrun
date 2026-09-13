"use client";

import { FormEvent } from "react";
import { ArrowRight, Building2, Check, Compass, MapPin, QrCode, Smartphone, Sparkles, Store, Users } from "lucide-react";

const partnerTypes = [
  { icon: Building2, title: "지자체·공공기관", text: "원도심 활성화, 야간관광, 생활인구 확대 사업" },
  { icon: Store, title: "전통시장·상인회", text: "시장 체류 확대, 점포 연계 행사, 방문객 참여 프로그램" },
  { icon: Sparkles, title: "문화재단·축제", text: "지역문화 자원을 활용한 상설·기간형 체험 콘텐츠" },
  { icon: Compass, title: "관광·교육기관", text: "가족, 청소년, 단체 방문객을 위한 탐방형 프로그램" },
];
const process = ["도입 상담", "현장 조사", "콘텐츠 설계", "제작·테스트", "현장 운영"];
const processText = ["목적·대상·일정·예산 확인", "지역 자원과 실제 동선 분석", "서사·미션·보상 구조 기획", "모바일 웹과 현장물 제작", "사전 점검·운영·결과 정리"];

export default function Home() {
  const sendInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`[마켓런 도입 문의] ${form.get("organization")}`);
    const body = encodeURIComponent([
      `기관·단체명: ${form.get("organization")}`,
      `담당자명: ${form.get("name")}`,
      `이메일: ${form.get("email")}`,
      `연락처: ${form.get("phone")}`,
      `기관 유형: ${form.get("type")}`,
      `희망 운영 시기: ${form.get("date")}`,
      "", "문의 내용", String(form.get("message") ?? ""),
    ].join("\n"));
    window.location.href = `mailto:SUN@JLPARTNER.CO.KR?subject=${subject}&body=${body}`;
  };

  return <main className="landing">
    <header className="landing-nav">
      <a className="landing-brand" href="#top" aria-label="마켓런 홈"><span>MARKET</span><b>RUN</b><small>지역을 달리는 이야기</small></a>
      <nav aria-label="주요 메뉴"><a href="#about">마켓런 소개</a><a href="#case">보령편 사례</a><a href="#process">도입 절차</a><a className="landing-nav-cta" href="#contact">운영 문의</a></nav>
    </header>

    <section className="landing-hero" id="top">
      <div className="landing-hero-bg" />
      <div className="landing-wrap landing-hero-copy">
        <p className="landing-kicker">LOCAL STORY MISSION PLATFORM</p>
        <h1>시장을 걷고,<br/><span>지역을 기억하다.</span></h1>
        <p className="landing-lead">마켓런은 지역의 역사·시장·사람을 하나의 이야기로 엮어 방문객이 직접 걷고 발견하는 모바일 미션 프로그램입니다.</p>
        <div className="landing-actions"><a className="landing-button" href="#contact">우리 지역 마켓런 문의하기 <ArrowRight size={19}/></a><a className="landing-button ghost" href="#case">보령편 사례 보기</a></div>
        <div className="landing-tags"><span>앱 설치 없음</span><span>QR 현장 참여</span><span>지역 맞춤 설계</span></div>
      </div>
    </section>

    <section className="landing-section" id="about"><div className="landing-wrap">
      <div className="landing-heading"><p>WHY MARKET RUN</p><h2>스쳐 가는 방문을<br/>이야기가 남는 체험으로.</h2><span>지역을 설명하는 대신, 참가자가 스스로 찾아내게 합니다. 시장의 골목과 상점, 역사 자원이 미션의 무대가 됩니다.</span></div>
      <div className="landing-feature-grid">
        <article><MapPin/><b>장소 기반 스토리</b><p>지역만의 인물·역사·특산물로 고유한 서사를 만듭니다.</p></article>
        <article><Smartphone/><b>가벼운 모바일 참여</b><p>별도 앱 없이 QR 접속만으로 미션을 순서대로 진행합니다.</p></article>
        <article><Users/><b>현장 체류와 연결</b><p>골목을 걷고 상점을 만나며 지역 안에서 자연스럽게 머뭅니다.</p></article>
        <article><QrCode/><b>운영 가능한 시스템</b><p>정답·설문·혜택을 관리하고 현장 상황에 맞게 조정합니다.</p></article>
      </div>
    </div></section>

    <section className="landing-case" id="case"><div className="landing-wrap landing-case-grid">
      <div><p className="landing-kicker gold">CASE 01 · BORYEONG</p><h2>황금 패랭이를 찾아라</h2><p>망루에서 반사 글자를 찾고, 한내시장에서 보령 3미를 해독한 뒤, 포목거리의 황금빛 단서를 따라 보부상을 깨우는 모바일 미션투어입니다.</p><div className="landing-stats"><div><b>30분</b><span>권장 참여 시간</span></div><div><b>4개</b><span>핵심 탐색 거점</span></div><div><b>3개</b><span>수집형 이야기 징표</span></div></div><a className="landing-text-link" href="/golden">보령편 미션 페이지 보기 <ArrowRight size={17}/></a></div>
      <figure><img src="/images/golden-main-banner.png" alt="보령 꿀잼야행 황금 패랭이를 찾아라"/></figure>
    </div></section>

    <section className="landing-section white"><div className="landing-wrap">
      <div className="landing-heading"><p>HOW IT WORKS</p><h2>한 지역의 자원이<br/>하나의 여정이 됩니다.</h2></div>
      <div className="landing-how">
        <article><span>01</span><img src="/images/mission-point-1.webp" alt="지역 서사를 활용한 보부상 미션"/><h3>지역 서사 발굴</h3><p>인물·역사·설화에서 참여자가 따라갈 이야기의 이유를 찾습니다.</p></article>
        <article><span>02</span><img src="/images/mission-point-3.webp" alt="전통시장 상인과 연결되는 현장 미션"/><h3>현장 탐색 설계</h3><p>시장, 골목, 상점과 조형물을 실제 동선 위의 단서로 연결합니다.</p></article>
        <article><span>03</span><img src="/images/golden-paeraengi-camellia.png" alt="미션 완주 보상 황금 패랭이"/><h3>모바일 완주 경험</h3><p>QR, 순차 잠금, 정답 판정, 보상과 설문까지 하나의 흐름으로 운영합니다.</p></article>
      </div>
    </div></section>

    <section className="landing-section dark"><div className="landing-wrap">
      <div className="landing-heading"><p>FOR PARTNERS</p><h2>이런 기관과 함께합니다.</h2></div>
      <div className="landing-partners">{partnerTypes.map(({icon:Icon,title,text})=><article key={title}><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div>
    </div></section>

    <section className="landing-section" id="process"><div className="landing-wrap">
      <div className="landing-heading"><p>LAUNCH PROCESS</p><h2>지역을 읽는 것부터<br/>운영까지 함께합니다.</h2></div>
      <ol className="landing-process">{process.map((item,index)=><li key={item}><span>{String(index+1).padStart(2,"0")}</span><b>{item}</b><p>{processText[index]}</p></li>)}</ol>
      <div className="landing-provide">
        <div><Check/><span><b>지역 맞춤 콘텐츠</b>콘셉트·서사·미션·힌트·완료 메시지</span></div><div><Check/><span><b>모바일 미션 시스템</b>QR·순차 진행·정답·보상·설문 연계</span></div><div><Check/><span><b>현장 제작물 디자인</b>접수처·배너·단서판·안내물</span></div><div><Check/><span><b>운영 패키지</b>관리자 설정·매뉴얼·테스트·결과 정리</span></div>
      </div>
    </div></section>

    <section className="landing-contact" id="contact"><div className="landing-wrap landing-contact-grid">
      <div><p className="landing-kicker gold">PROJECT INQUIRY</p><h2>다음 마켓런의<br/>무대는 어디인가요?</h2><p>지역과 행사의 기본 정보를 보내주시면 현장 특성에 맞는 운영 방향과 준비 범위를 안내해 드립니다.</p><a href="mailto:SUN@JLPARTNER.CO.KR">SUN@JLPARTNER.CO.KR</a></div>
      <form onSubmit={sendInquiry}><h3>마켓런 도입 문의</h3><div className="landing-fields">
        <label>기관·단체명 *<input name="organization" required placeholder="예: ○○문화재단"/></label><label>담당자명 *<input name="name" required placeholder="성함을 입력해주세요"/></label><label>이메일 *<input name="email" type="email" required placeholder="name@organization.kr"/></label><label>연락처 *<input name="phone" required inputMode="tel" placeholder="010-0000-0000"/></label><label>기관 유형<select name="type"><option>지자체·공공기관</option><option>전통시장·상인회</option><option>문화재단·축제조직</option><option>관광·교육기관</option><option>기타</option></select></label><label>희망 운영 시기<input name="date" placeholder="예: 2027년 5월"/></label><label className="full">지역·행사 소개 및 문의 내용 *<textarea name="message" required placeholder="운영 지역, 행사 목적, 예상 참여 규모 등을 알려주세요."/></label>
      </div><label className="landing-consent"><input type="checkbox" required/><span>문의 응대를 위한 개인정보 수집·이용에 동의합니다. 입력 정보는 상담 목적으로만 사용합니다.</span></label><button className="landing-button" type="submit">이메일로 문의 보내기 <ArrowRight size={19}/></button></form>
    </div></section>

    <footer className="landing-footer"><div className="landing-wrap"><b>MARKET RUN</b><p>지역의 길 위에 이야기를 심습니다.</p><span>© 2026 JL PARTNER. All rights reserved.</span></div></footer>
  </main>;
}
