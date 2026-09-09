"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Backpack, Check, Clock3, Fish, Gift, HeartPulse, LockKeyhole,
  Map, MapPin, Minus, Plus, QrCode, Store, Wheat,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogTitle,
} from "@/components/ui/dialog";

type Point = {
  id: number;
  place: string;
  kicker: string;
  title: string;
  story: string;
  instruction: string;
  hint?: string;
  accent: string;
  pale: string;
  seconds: number;
};

type Screen = "gate" | "locked" | "mission" | "reward";
type Benefit = { shop: string; benefit: string };
type PublicConfig = { surveyUrl: string; point3Answers: string[]; benefits: Benefit[] };

const defaultConfig: PublicConfig = {
  surveyUrl: "",
  point3Answers: ["보령공방"],
  benefits: [
    { shop: "수산·건어물 제휴점", benefit: "2만원 이상 구매 시 3,000원 할인" },
    { shop: "먹거리 제휴점", benefit: "1만원 이상 구매 시 1,000원 할인" },
    { shop: "로컬푸드·청과 제휴점", benefit: "구매금액 10% 할인" },
    { shop: "프리마켓 참여점포", benefit: "1만원 이상 구매 시 사은품 증정" },
  ],
};

const QR_TOKENS: Record<string, number> = {
  "br-baeksang-7f3a": 1,
  "br-cotton-91d4": 2,
  "br-market-c62e": 3,
  "br-goods-84ba": 4,
  "br-paeraengi-5d27": 5,
};

const points: Point[] = [
  {
    id: 1,
    place: "마실카페 앞 보부상 동상",
    kicker: "1851 원홍주 상무사의 밀지",
    title: "왕의 길을 열\n첫 봇짐을 꾸려라",
    story: "1851년, 보령과 충남 서부 장터를 잇던 원홍주 상무사에 비밀 밀지가 도착했습니다.\n신의를 생명처럼 여기던 보부상의 봇짐을 꾸려 왕의 길을 여세요.",
    instruction: "다음 물건 중 길 위에 꼭 필요한 봇짐 3가지를 골라 챙겨주세요.",
    hint: "힌트 : 리플렛의 설명을 참고하세요.",
    accent: "#a9432b",
    pale: "#f8e8d8",
    seconds: 180,
  },
  {
    id: 2,
    place: "보령중앙시장 메인 아케이드",
    kicker: "왕의 사건 ①",
    title: "화살에 맞아 쓰러진\n사람을 구하라!",
    story: "전장에서 적군의 독화살이 훗날 태조가 될 이성계 장군의 다리를 꿰뚫었습니다.\n피를 흘리며 쓰러진 장군의 상처를 백달원의 봇짐 속 목화솜으로 지혈하세요.",
    instruction: "둥근 목화솜을 세 번 터치해 다리 상처를 지혈하세요.",
    accent: "#b83b2d",
    pale: "#fae1d6",
    seconds: 150,
  },
  {
    id: 3,
    place: "한내시장 라디오방송국 광장",
    kicker: "장터의 비밀 소식통",
    title: "시장 상인과\n신의를 맺어라",
    story: "장터의 진짜 힘은 물건이 아니라 사람 사이의 신의입니다.\n숨어 있는 소식통을 찾아 인사를 건네고 상단의 비밀망을 깨우세요.",
    instruction: "보부상 표식이 있는 점포 한 곳을 방문하고 상호를 적어주세요.",
    accent: "#176a5b",
    pale: "#dff2e8",
    seconds: 180,
  },
  {
    id: 4,
    place: "한내시장 수산물 골목",
    kicker: "서해의 진상품",
    title: "왕실의 물목을\n확보하라",
    story: "서해의 귀한 물목이 뒤섞여 왕실 운송이 멈췄습니다.\n리플렛을 단서로 진상품 세 가지를 가려내고 보급로를 다시 여세요.",
    instruction: "다음 물건 중 왕실에 전달할 서해 물목 3가지를 골라주세요.",
    hint: "힌트 : 리플렛의 설명을 참고하세요.",
    accent: "#176084",
    pale: "#dceef2",
    seconds: 180,
  },
  {
    id: 5,
    place: "마실카페 앞 완주 부스",
    kicker: "왕의 사건 ②",
    title: "인조에게 구호 쌀을\n모두 전달하라!",
    story: "병자호란 피난길, 굶주림과 추위 속에 인조의 어가가 고립됐습니다.\n보부상들이 군량과 쌀을 전하자 인조는 그 공을 기려 두 번째 목화솜을 하사했습니다.",
    instruction: "쌀가마 5개를 하나씩 눌러 인조의 어가에 구호 물자를 모두 전달하세요.",
    accent: "#886122",
    pale: "#f4e9c9",
    seconds: 150,
  },
];

const pointIcons = [Backpack, HeartPulse, Store, Fish, Wheat];
const missionImageAlts = [
  "보령 장터에서 길 위의 필수 봇짐을 고르는 보부상",
  "목화솜으로 이성계 장군의 화살 상처를 지혈하는 보부상",
  "보령 장터 상인과 신의를 맺고 물목표를 주고받는 보부상",
  "서해 어물전에서 다섯 물목 가운데 진상품을 고르는 보부상",
  "인조에게 다섯 쌀가마를 전하고 목화솜을 하사받는 보부상",
];
const progressKey = "market-run-boryeong-progress-v3";
const correctBag = ["목화솜", "왕실 통행첩", "짚신"];
const correctGoods = ["굴", "간재미", "물메기"];
const mapPins = [
  { id: "1·5", label: "마실카페", left: 16, top: 43, points: [1, 5] },
  { id: "2", label: "중앙시장 아케이드", left: 24, top: 45, points: [2] },
  { id: "3", label: "라디오방송국 광장", left: 49, top: 72, points: [3] },
  { id: "4", label: "수산물 골목", left: 43, top: 79, points: [4] },
];

function readProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(progressKey) ?? "[]") as number[];
  } catch {
    return [];
  }
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("gate");
  const [pointId, setPointId] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [remaining, setRemaining] = useState(180);
  const [mapOpen, setMapOpen] = useState(false);
  const [mapFocus, setMapFocus] = useState<number | null>(null);
  const [mapRouteFrom, setMapRouteFrom] = useState<number | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [bag, setBag] = useState<string[]>([]);
  const [cottonCount, setCottonCount] = useState(0);
  const [shopName, setShopName] = useState("");
  const [goods, setGoods] = useState<string[]>([]);
  const [riceSacks, setRiceSacks] = useState<number[]>([]);
  const [config, setConfig] = useState<PublicConfig>(defaultConfig);

  useEffect(() => {
    let cancelled = false;
    window.queueMicrotask(() => {
      if (cancelled) return;
      const params = new URLSearchParams(window.location.search);
      const token = params.get("qr") ?? "";
      const resetRequested = params.get("reset") === "market-run-test";
      if (resetRequested) {
        window.localStorage.removeItem(progressKey);
        window.localStorage.removeItem("market-run-boryeong-progress-v2");
        for (let index = window.sessionStorage.length - 1; index >= 0; index -= 1) {
          const key = window.sessionStorage.key(index);
          if (key?.startsWith("market-run-start-")) window.sessionStorage.removeItem(key);
        }
        params.delete("reset");
        const query = params.toString();
        window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
      }
      const requested = QR_TOKENS[token];
      const saved = resetRequested ? [] : readProgress();
      setCompleted(saved);
      if (!requested) {
        setScreen("gate");
        return;
      }
      setPointId(requested);
      if (requested > 1 && !saved.includes(requested - 1)) {
        setScreen("locked");
        return;
      }
      setScreen("mission");
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/config", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("운영 설정을 불러오지 못했습니다.");
        return response.json() as Promise<PublicConfig>;
      })
      .then((data) => {
        if (!cancelled) setConfig(data);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  const point = points[pointId - 1];
  const Icon = pointIcons[pointId - 1];
  const cleared = completed.includes(pointId);

  useEffect(() => {
    if (screen !== "mission" || cleared) return;
    const timerKey = `market-run-v3-start-${pointId}`;
    const stored = Number(window.sessionStorage.getItem(timerKey));
    const startedAt = stored || Date.now();
    if (!stored) window.sessionStorage.setItem(timerKey, String(startedAt));
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(Math.max(0, point.seconds - elapsed));
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [screen, pointId, point.seconds, cleared]);

  const isReady = useMemo(() => {
    if (pointId === 1) return bag.length === 3 && correctBag.every((item) => bag.includes(item));
    if (pointId === 2) return cottonCount >= 3;
    if (pointId === 3) {
      const normalized = shopName.trim().toLocaleLowerCase().replace(/\s+/g, "");
      return Boolean(normalized && config.point3Answers.some((answer) => answer.trim().toLocaleLowerCase().replace(/\s+/g, "") === normalized));
    }
    if (pointId === 4) return goods.length === 3 && correctGoods.every((item) => goods.includes(item));
    return riceSacks.length === 5;
  }, [pointId, bag, cottonCount, shopName, goods, riceSacks, config.point3Answers]);

  const toggleLimited = (value: string, list: string[], setter: (next: string[]) => void) => {
    if (list.includes(value)) setter(list.filter((item) => item !== value));
    else if (list.length < 3) setter([...list, value]);
  };

  const completeMission = () => {
    if (!isReady || cleared) return;
    const next = Array.from(new Set([...completed, pointId])).sort();
    setCompleted(next);
    window.localStorage.setItem(progressKey, JSON.stringify(next));
  };

  const openMap = (focus: number | null, routeFrom: number | null = null) => {
    setMapFocus(focus);
    setMapRouteFrom(routeFrom);
    setMapZoom(focus ? 1.65 : 1);
    setMapOpen(true);
  };

  const timeText = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;

  if (screen === "gate" || screen === "locked") {
    return <main className="access-shell">
      <section className="access-card">
        <div className="access-icon">{screen === "gate" ? <QrCode size={42} /> : <LockKeyhole size={42} />}</div>
        <p className="access-edition">마켓런-보령편</p>
        <h1>{screen === "gate" ? "현장 QR을\n스캔해주세요" : `POINT ${pointId - 1}을\n먼저 완료해주세요`}</h1>
        <p>{screen === "gate" ? "각 장소에 설치된 QR을 스캔해야만 미션이 열립니다. 별도의 가입 절차는 없습니다." : "이전 미션에 CLEAR 도장이 찍힌 뒤, 현재 장소의 QR을 다시 스캔해주세요."}</p>
        <div className="access-rule"><span>1</span> 현장 QR 찾기 <i /> <span>2</span> 미션 수행 <i /> <span>3</span> CLEAR</div>
      </section>
      <SiteFooter />
    </main>;
  }

  if (screen === "reward") {
    return <main className="reward-shell">
      <Header onMap={() => openMap(null)} />
      <section className="reward-card">
        <div className="gift-icon"><Gift size={35} /></div>
        <p>마켓런 완주를 축하합니다!</p>
        <h1>만족도조사에 참여하고<br/><strong>온누리상품권 10,000원</strong> 받으세요!</h1>
        <button className="masil-map" onClick={() => openMap(5)}><MapPin size={22}/><span><small>선물 수령 장소</small><b>마실카페 앞 운영부스 위치 보기</b></span></button>
        {config.surveyUrl ? <a className="primary-action" href={config.surveyUrl} target="_blank" rel="noopener noreferrer">만족도조사 참여하기</a> : <button className="primary-action" disabled>만족도 조사 링크 준비 중</button>}
        <div className="benefit-list reward-benefits">
          <h2>상점별 할인·사은품</h2>
          {config.benefits.length > 0 ? config.benefits.map((item, index) => <article key={`${item.shop}-${index}`}><span>{item.shop}</span><b>{item.benefit}</b></article>) : <p className="benefit-empty">등록된 혜택이 없습니다.</p>}
        </div>
      </section>
      <MapDialog open={mapOpen} onOpenChange={setMapOpen} focus={mapFocus} routeFrom={mapRouteFrom} zoom={mapZoom} setZoom={setMapZoom} />
      <SiteFooter />
    </main>;
  }

  return <main className="mission-shell" style={{ "--accent": point.accent, "--pale": point.pale } as React.CSSProperties}>
    <div className="paper-grain" />
    <Header onMap={() => openMap(null)} />

    <nav className="point-rail" aria-label="미션 진행상황">
      {points.map((item) => {
        const isDone = completed.includes(item.id);
        return <button key={item.id} disabled className={`${item.id === pointId ? "active" : ""} ${isDone ? "done" : ""}`}>
          <span>POINT</span><b>{item.id}</b>{isDone && <i>CLEAR</i>}
        </button>;
      })}
    </nav>

    <section className={`mission-card ${cleared ? "is-cleared" : ""}`}>
      {cleared && <div className="clear-stamp">CLEAR</div>}
      <div className="location-label"><MapPin size={21}/><span>{point.place}</span></div>
      <div className="mission-heading"><div className="icon-seal"><Icon size={30} strokeWidth={1.8}/></div><div><p>{point.kicker}</p><h1>{point.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1></div></div>

      <img className="story-image" src={`/images/mission-point-${pointId}.webp`} alt={missionImageAlts[pointId - 1]} />
      <p className="story">{point.story.split("\n").map((line) => <span key={line}>{line}</span>)}</p>
      <div className={`countdown ${remaining <= 30 ? "urgent" : ""}`}><Clock3 size={23}/><span>남은 미션 시간</span><b>{cleared ? "CLEAR" : timeText}</b></div>

      <div className="action-panel">
        <p className="instruction">{point.instruction}</p>
        {point.hint && <p className="hint">{point.hint}</p>}

        {pointId === 1 && <ChoiceGrid items={["목화솜", "왕실 통행첩", "짚신", "비단 두루마리", "놋그릇"]} selected={bag} onToggle={(item) => toggleLimited(item, bag, setBag)} />}

        {pointId === 2 && <div className="tap-mission"><button className="cotton-button" onClick={() => setCottonCount(Math.min(3, cottonCount + 1))} disabled={cleared}><span>☁</span><b>{cottonCount >= 3 || cleared ? "지혈 완료!" : "목화솜 터치"}</b><small>{Math.min(cottonCount, 3)} / 3</small></button><div className="tap-dots">{[1,2,3].map((n) => <i className={cottonCount >= n || cleared ? "on" : ""} key={n}/>)}</div></div>}

        {pointId === 3 && <div className="shop-action"><div className="phrase"><small>상인에게 이렇게 말해보세요</small><b>“신의를 맺으러 왔습니다!”</b></div><label>방문한 상호명<input value={shopName} onChange={(e) => setShopName(e.target.value)} disabled={cleared} placeholder="상점명을 정확히 입력해주세요" />{shopName.trim() && !isReady && !cleared && <span className="shop-answer-error">등록된 상점명을 정확히 입력해주세요.</span>}</label></div>}

        {pointId === 4 && <><ChoiceGrid items={["굴", "간재미", "물메기", "도토리", "곶감"]} selected={goods} onToggle={(item) => toggleLimited(item, goods, setGoods)} />{cleared && <div className="kit-notice"><Check size={24}/><span><b>물목 선별 완료!</b>미션 CLEAR 화면을 <strong>00상점 주인</strong>에게 보여주고 물목 3종 KIT를 수령하세요.</span></div>}</>}

        {pointId === 5 && <div className="tap-mission"><div className="rice-sack-grid">{[1,2,3,4,5].map((sack) => { const delivered = riceSacks.includes(sack) || cleared; return <button key={sack} className={delivered ? "delivered" : ""} onClick={() => setRiceSacks((current) => current.includes(sack) ? current : [...current, sack])} disabled={delivered}><Wheat size={28}/><b>쌀가마 {sack}</b>{delivered ? <Check size={18}/> : <span>터치</span>}</button>; })}</div><p className="rice-progress"><b>{cleared ? 5 : riceSacks.length}</b> / 5 구호 물자 전달</p>{(riceSacks.length === 5 || cleared) && <div className="paeraengi-complete"><img src="/images/paeraengi-cotton.png" alt="양쪽에 목화솜이 달린 패랭이 모자"/><b>인조가 하사한 쌍목화솜 완성</b></div>}</div>}
      </div>
    </section>

    <p className="history-note">※ 보부상 전승과 역사 자료를 바탕으로 재구성한 체험 이야기입니다.</p>
    <SiteFooter />
    <div className="sticky-action">{pointId === 5 && cleared ? <button onClick={() => setScreen("reward")}>완주 인증하고 선물받기 <Gift size={21}/></button> : cleared ? <button onClick={() => openMap(pointId + 1, pointId)}>다음미션 QR 위치 지도보기 <MapPin size={21}/></button> : <button disabled={!isReady} onClick={completeMission}>{`POINT ${pointId} 미션 완료`}<Check size={21}/></button>}</div>
    <MapDialog open={mapOpen} onOpenChange={setMapOpen} focus={mapFocus} routeFrom={mapRouteFrom} zoom={mapZoom} setZoom={setMapZoom} />
  </main>;
}

function Header({ onMap }: { onMap: () => void }) {
  return <header className="topbar"><div className="topbar-row"><div className="brand-lockup"><img className="brand-logo" src="/images/market-run-logo.png" alt="마켓런 로고"/><div className="brand-title"><span>[보령편]</span><strong>왕을 구한 보부상</strong></div></div><button className="course-button" onClick={onMap}><Map size={18}/> 전체맵보기</button></div></header>;
}

function SiteFooter() {
  return <footer className="site-footer">
    <p>© 2026 <a href="http://www.jlpartner.co.kr" target="_blank" rel="noopener noreferrer">JL PARTNER</a>. All rights reserved.</p>
  </footer>;
}

function ChoiceGrid({ items, selected, onToggle }: { items: string[]; selected: string[]; onToggle: (item: string) => void }) {
  return <><div className="choice-status"><b>{selected.length}</b> / 3 선택</div><div className="choice-grid">{items.map((item) => <button key={item} className={selected.includes(item) ? "selected" : ""} onClick={() => onToggle(item)}>{selected.includes(item) && <Check size={17}/>}<span>{item}</span></button>)}</div></>;
}

function MapDialog({ open, onOpenChange, focus, routeFrom, zoom, setZoom }: { open: boolean; onOpenChange: (open: boolean) => void; focus: number | null; routeFrom: number | null; zoom: number; setZoom: (zoom: number) => void }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const startPin = routeFrom ? mapPins.find((item) => item.points.includes(routeFrom)) : null;
  const endPin = focus ? mapPins.find((item) => item.points.includes(focus)) : null;

  useEffect(() => {
    if (!open || !focus) return;
    const pin = mapPins.find((item) => item.points.includes(focus));
    const viewport = viewportRef.current;
    if (!pin || !viewport) return;
    const frame = window.requestAnimationFrame(() => {
      const canvas = viewport.firstElementChild as HTMLElement | null;
      if (!canvas) return;
      viewport.scrollTo({
        left: (canvas.scrollWidth * pin.left / 100) - (viewport.clientWidth / 2),
        top: (canvas.scrollHeight * pin.top / 100) - (viewport.clientHeight / 2),
        behavior: "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, focus, zoom]);

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="map-dialog"><DialogTitle>{routeFrom ? "다음 미션 QR 위치" : "마켓런 전체맵"}</DialogTitle><DialogDescription>{routeFrom && focus ? `POINT ${routeFrom}에서 POINT ${focus}까지의 이동 방향입니다. 목적지에서 다음 QR을 스캔하세요.` : focus ? `POINT ${focus} 위치를 표시했습니다. 손가락으로 지도를 움직이거나 확대해보세요.` : "다섯 미션의 위치를 한눈에 확인하세요."}</DialogDescription>{routeFrom && focus && <div className="route-banner"><span>현재 POINT {routeFrom}</span><b>→</b><strong>다음 QR POINT {focus}</strong></div>}<div className="map-toolbar"><span>보령중앙시장 · 한내시장</span><div><button onClick={() => setZoom(Math.max(1, zoom - .25))} aria-label="지도 축소"><Minus size={18}/></button><b>{Math.round(zoom * 100)}%</b><button onClick={() => setZoom(Math.min(2.5, zoom + .25))} aria-label="지도 확대"><Plus size={18}/></button></div></div><div ref={viewportRef} className="map-viewport"><div className="map-canvas" style={{ width: `${zoom * 100}%` }}><img src="/images/market-run-map.png" alt="보령중앙시장과 한내시장 전체 지도"/>{startPin && endPin && <svg className="map-route-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="route-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" /></marker></defs><line x1={startPin.left} y1={startPin.top} x2={endPin.left} y2={endPin.top} markerEnd="url(#route-arrow)" /></svg>}{mapPins.map((pin) => <div key={pin.id} className={`map-pin ${focus && pin.points.includes(focus) ? "focused" : ""} ${routeFrom && pin.points.includes(routeFrom) ? "route-start" : ""}`} style={{ left: `${pin.left}%`, top: `${pin.top}%` }}><span>{pin.id}</span><b>{pin.label}</b></div>)}</div></div><p className="map-caption">{routeFrom ? "점선은 다음 QR까지의 이동 방향입니다. 현장 리플렛 동선도 함께 확인해주세요." : "P1·P5는 마실카페 앞의 동일한 출발·완주 장소입니다."}</p></DialogContent></Dialog>;
}
