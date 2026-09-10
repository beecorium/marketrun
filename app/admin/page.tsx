"use client";

import { useState } from "react";
import { Check, LockKeyhole, Plus, Save, Trash2 } from "lucide-react";

type Settings = { surveyUrl?:string; mission1Answers?:string[]; mission2Code?:string; mission3Answers?:string[]; error?:string };

export default function AdminPage() {
  const [password,setPassword]=useState(""); const [authenticated,setAuthenticated]=useState(false);
  const [surveyUrl,setSurveyUrl]=useState("https://naver.me/5T0ElUPI");
  const [mission1Answers,setMission1Answers]=useState(["패","랭","이"]); const [mission2Code,setMission2Code]=useState("251");
  const [mission3Answers,setMission3Answers]=useState(["황금송","황금소나무","소나무"]);
  const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);

  const request=async(method:"GET"|"PUT",body?:unknown)=>{
    const response=await fetch("/api/admin/settings",{method,headers:{"Content-Type":"application/json","x-admin-password":password},body:body?JSON.stringify(body):undefined});
    const data=await response.json() as Settings; if(!response.ok)throw new Error(data.error??"요청을 처리하지 못했습니다."); return data;
  };
  const login=async()=>{setBusy(true);setMessage("");try{const data=await request("GET");setSurveyUrl(data.surveyUrl||"https://naver.me/5T0ElUPI");setMission1Answers(data.mission1Answers?.length===3?data.mission1Answers:["패","랭","이"]);setMission2Code(data.mission2Code||"251");setMission3Answers(data.mission3Answers?.length?data.mission3Answers:["황금송","황금소나무","소나무"]);setAuthenticated(true);}catch(error){setMessage(error instanceof Error?error.message:"로그인하지 못했습니다.");}finally{setBusy(false);}};
  const save=async()=>{setBusy(true);setMessage("");try{await request("PUT",{surveyUrl,mission1Answers,mission2Code,mission3Answers});setMessage("황금 패랭이 미션 설정이 저장되었습니다.");}catch(error){setMessage(error instanceof Error?error.message:"저장하지 못했습니다.");}finally{setBusy(false);}};

  if(!authenticated)return <main className="admin-shell"><section className="admin-login"><div className="admin-lock"><LockKeyhole size={30}/></div><p>2026 보령 꿀잼야행</p><h1>황금 패랭이 관리자</h1><label>관리자 비밀번호<input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} autoComplete="current-password"/></label>{message&&<p className="admin-message error">{message}</p>}<button className="admin-primary" onClick={login} disabled={busy||!password}>{busy?"확인 중...":"관리자 페이지 열기"}</button></section></main>;

  return <main className="admin-shell"><header className="admin-header"><p>2026 보령 꿀잼야행</p><h1>황금 패랭이 운영 설정</h1><span>저장한 정답과 설문 링크는 참여자 화면에 바로 반영됩니다.</span></header>
    <section className="admin-panel"><h2>미션 1 · 망루</h2><p className="admin-help">등불에서 순서대로 찾는 세 글자</p><div className="admin-code-grid">{mission1Answers.map((answer,index)=><label key={index}>{index+1}번째 글자<input value={answer} maxLength={2} onChange={e=>setMission1Answers(mission1Answers.map((value,i)=>i===index?e.target.value:value))}/></label>)}</div></section>
    <section className="admin-panel"><h2>미션 2 · 보령 3미</h2><label>세 자리 암호<input inputMode="numeric" value={mission2Code} maxLength={3} onChange={e=>setMission2Code(e.target.value.replace(/\D/g,"").slice(0,3))}/></label><p className="admin-help">포도·주꾸미·굴 카드에서 확인하는 숫자 순서입니다.</p></section>
    <section className="admin-panel"><div className="admin-panel-title"><div><h2>미션 3 · 황금송</h2><p>정답으로 인정할 이름을 등록하세요.</p></div><button onClick={()=>setMission3Answers([...mission3Answers,""])}><Plus size={17}/>추가</button></div><div className="admin-list">{mission3Answers.map((answer,index)=><div className="admin-row" key={index}><input value={answer} onChange={e=>setMission3Answers(mission3Answers.map((value,i)=>i===index?e.target.value:value))} placeholder="인정 정답"/><button aria-label="정답 삭제" onClick={()=>setMission3Answers(mission3Answers.filter((_,i)=>i!==index))}><Trash2 size={18}/></button></div>)}</div></section>
    <section className="admin-panel"><h2>만족도 조사</h2><label>네이버폼 연결 URL<input type="url" value={surveyUrl} onChange={e=>setSurveyUrl(e.target.value)} placeholder="https://naver.me/..."/></label><p className="admin-help">참가자가 설문 제출 후 완료 화면을 현장 운영요원에게 제시합니다.</p></section>
    {message&&<p className={`admin-message ${message.includes("저장되었습니다")?"success":"error"}`}>{message.includes("저장되었습니다")&&<Check size={18}/>} {message}</p>}<button className="admin-save" onClick={save} disabled={busy}><Save size={20}/>{busy?"저장 중...":"황금 패랭이 설정 저장"}</button>
  </main>;
}
