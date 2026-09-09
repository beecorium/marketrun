"use client";

import { useState } from "react";
import { Check, LockKeyhole, Plus, Save, Trash2 } from "lucide-react";

type Benefit = { shop: string; benefit: string };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState("");
  const [point3Answers, setPoint3Answers] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const request = async (method: "GET" | "PUT", body?: unknown) => {
    const response = await fetch("/api/admin/settings", {
      method,
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json() as { error?: string; surveyUrl?: string; point3Answers?: string[]; benefits?: Benefit[] };
    if (!response.ok) throw new Error(data.error ?? "요청을 처리하지 못했습니다.");
    return data;
  };

  const login = async () => {
    setBusy(true); setMessage("");
    try {
      const data = await request("GET");
      setSurveyUrl(data.surveyUrl ?? "");
      setPoint3Answers(data.point3Answers ?? []);
      setBenefits(data.benefits ?? []);
      setAuthenticated(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "로그인하지 못했습니다.");
    } finally { setBusy(false); }
  };

  const save = async () => {
    setBusy(true); setMessage("");
    try {
      await request("PUT", { surveyUrl, point3Answers, benefits });
      setMessage("설정이 저장되었습니다. 참여자 화면에 즉시 반영됩니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "저장하지 못했습니다.");
    } finally { setBusy(false); }
  };

  if (!authenticated) return <main className="admin-shell"><section className="admin-login">
    <div className="admin-lock"><LockKeyhole size={30}/></div>
    <p>마켓런 · 보령편</p><h1>관리자 설정</h1>
    <label>관리자 비밀번호<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === "Enter" && login()} autoComplete="current-password"/></label>
    {message && <p className="admin-message error">{message}</p>}
    <button className="admin-primary" onClick={login} disabled={busy || !password}>{busy ? "확인 중..." : "관리자 페이지 열기"}</button>
  </section></main>;

  return <main className="admin-shell"><header className="admin-header"><p>마켓런 · 보령편</p><h1>운영 설정</h1><span>저장하면 참여자 화면에 즉시 반영됩니다.</span></header>
    <section className="admin-panel"><h2>만족도 조사</h2><label>네이버폼 연결 URL<input type="url" value={surveyUrl} onChange={(event) => setSurveyUrl(event.target.value)} placeholder="https://form.naver.com/..."/></label></section>
    <section className="admin-panel"><div className="admin-panel-title"><div><h2>POINT 3 정답</h2><p>정답으로 인정할 상점명을 등록하세요.</p></div><button onClick={() => setPoint3Answers([...point3Answers, ""])}><Plus size={17}/> 추가</button></div>
      <div className="admin-list">{point3Answers.map((answer, index) => <div className="admin-row" key={index}><input value={answer} onChange={(event) => setPoint3Answers(point3Answers.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} placeholder="상점명"/><button aria-label="정답 삭제" onClick={() => setPoint3Answers(point3Answers.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={18}/></button></div>)}</div>
    </section>
    <section className="admin-panel"><div className="admin-panel-title"><div><h2>상점별 할인·사은품</h2><p>참여자에게 보여줄 상점명과 혜택을 입력하세요.</p></div><button onClick={() => setBenefits([...benefits, { shop: "", benefit: "" }])}><Plus size={17}/> 추가</button></div>
      <div className="admin-list">{benefits.map((item, index) => <div className="admin-benefit" key={index}><input value={item.shop} onChange={(event) => setBenefits(benefits.map((value, itemIndex) => itemIndex === index ? { ...value, shop: event.target.value } : value))} placeholder="상점명"/><textarea value={item.benefit} onChange={(event) => setBenefits(benefits.map((value, itemIndex) => itemIndex === index ? { ...value, benefit: event.target.value } : value))} placeholder="할인 또는 사은품 혜택"/><button aria-label="혜택 삭제" onClick={() => setBenefits(benefits.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={18}/> 삭제</button></div>)}</div>
    </section>
    {message && <p className={`admin-message ${message.includes("저장되었습니다") ? "success" : "error"}`}>{message.includes("저장되었습니다") && <Check size={18}/>} {message}</p>}
    <button className="admin-save" onClick={save} disabled={busy}><Save size={20}/>{busy ? "저장 중..." : "모든 설정 저장"}</button>
  </main>;
}
