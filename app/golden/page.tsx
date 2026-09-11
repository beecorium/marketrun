'use client';
import {useEffect,useRef,useState} from 'react';
import {Lamp,LockKeyhole,Check,MapPin,Stamp,Camera,ExternalLink,ShieldCheck,X as CloseIcon} from 'lucide-react';
import {Dialog,DialogClose,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {allowed,advance,fresh,key,normalize,lanternAnswers,type Journey} from './progress';
import './style.css';
import './enhancements.css';
import JourneyMap from './JourneyMap';
const places=['황금갓끈','황금동백꽃','황금인장'];
const titles=['망루의 세 불빛을 밝혀라','보령 3미를 찾아라!','황금 봇짐의 보부상을 깨워라'];
const prizes=['갓끈','동백꽃 장식','황금 인장'];
const hatImage='/images/golden-paeraengi-camellia.png';
const clueHints=['첫 번째 단서는 한 글자입니다.','두 번째 단서는 한 글자입니다.','마지막 단서는 두 글자입니다.'];
const prizeImages=['/images/reward-gatstrap.png','/images/reward-camellia.png','/images/reward-golden-seal.png'];
export default function Golden(){
 const [s,S]=useState<Journey>(fresh());const [step,T]=useState(0);const [ready,R]=useState(false);const [input,I]=useState('');const [message,M]=useState('');const [awake,A]=useState(false);const [hint,H]=useState(0);const [map,D]=useState(false);const [photo,P]=useState(false);const [config,F]=useState<{surveyUrl:string;mission2Code:string;mission3Answers:string[]}|null>(null);const [configError,E]=useState(false);const [storageError,SE]=useState(false);const [surveyOpened,SO]=useState(false);const [rewardReady,RR]=useState(false);const [rewardTime,RT]=useState('');
 useEffect(()=>{document.title='황금 패랭이를 찾아라 | 보령 꿀잼야행';const init=window.setTimeout(()=>{const params=new URLSearchParams(location.search);if(params.get('reset')==='1'){localStorage.removeItem(key);params.delete('reset');const query=params.toString();history.replaceState(null,'',location.pathname+(query?'?'+query:''));}const mission=params.get('mission');const n=mission===null?0:Number(mission);T([0,1,2,3,4].includes(n)?n:0);try{S(normalize(JSON.parse(localStorage.getItem(key)||'null')));}catch{SE(true);}R(true);},0);const sync=()=>{try{S(normalize(JSON.parse(localStorage.getItem(key)||'null')));}catch{SE(true);}};window.addEventListener('storage',sync);fetch('/api/config',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
   if(!data || typeof data!=='object' || !('surveyUrl' in data) || typeof data.surveyUrl!=='string') throw Error('invalid-config');
   const surveyUrl=data.surveyUrl.trim();
   if(surveyUrl && !['https:','http:'].includes(new URL(surveyUrl).protocol)) throw Error('invalid-survey-url');
   F({surveyUrl,
    mission2Code:'mission2Code' in data && typeof data.mission2Code==='string'?data.mission2Code:'',
    mission3Answers:'mission3Answers' in data && Array.isArray(data.mission3Answers)?data.mission3Answers.filter((v:unknown):v is string=>typeof v==='string'):[],
   });
  }).catch(()=>E(true));return()=>{window.clearTimeout(init);window.removeEventListener('storage',sync);};},[]);
 const save=(next:Journey)=>{try{localStorage.setItem(key,JSON.stringify(next));S(next);M('');navigator.vibrate?.(100);return true;}catch{SE(true);M('진행 기록을 저장할 수 없습니다. 일반 브라우저에서 다시 열어주세요.');return false;}};
 const done=step===1?s.lanterns===3:step===2?s.goods===3:step===3?s.seal:false;
 function submit(e:React.FormEvent){e.preventDefault();if(!allowed(step,s))return;if(step===3){const accepted=(config?.mission3Answers?.length?config.mission3Answers:['소나무','황금소나무','황금송']).map(v=>v.replace(/\s/g,'').normalize('NFC'));if(accepted.includes(input.replace(/\s/g,'').normalize('NFC'))){A(true);M('그래! 보령의 시목인 소나무를 찾았군! 황금 인장을 눌러 마지막 징표를 완성하게.');}else M('아직 봉인이 풀리지 않았습니다. 포목거리의 황금빛 단서를 떠올려보세요.');}else{const next=advance(step,input,s,{mission2Code:config?.mission2Code});if(next&&save(next)){M(step===1?'불빛이 깨어났습니다!':'보령 3미의 암호를 확인했습니다!');I('');}else if(!next) M(step===1?'아직 깨어나지 않은 불빛입니다. 다음 등불의 글자를 확인해보세요.':'현장 보령 3미 카드의 숫자를 다시 확인하세요.');}}
 function confirmSurvey(){const now=new Date();RT(now.toLocaleString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}));RR(true);window.scrollTo({top:0,behavior:'smooth'});}
 const link=(n:number)=>`/golden/?mission=${n}`;
 const surveyLink=config?.surveyUrl?<a className="g-button" href={config.surveyUrl} target="_blank" rel="noopener noreferrer" onClick={()=>SO(true)}><ExternalLink size={19}/>설문조사 참여하기</a>:<p className="g-small" role="status">{configError?'설문 링크를 불러오지 못했습니다':config?'설문 링크 준비 중입니다. 운영 부스에 문의해주세요.':'설문 링크를 불러오는 중입니다.'}</p>;
 return <main className={`golden ${step===0?'golden-intro':'golden-mission'}`}>
  {step===0?<img className="g-main-banner" src="/images/golden-share-preview.png" alt="황금 패랭이를 찾아라 – 보령 꿀잼야행"/>:<><header><img src="/images/market-run-logo.png" alt="마켓런"/><span>황금패랭이를 찾아라</span><button className="icon-btn" aria-label="여정 안내" onClick={()=>D(true)}><MapPin/></button></header>
  <div className="g-heading"><span className="g-eyebrow">보령 밤길에 숨은 세 개의 징표</span></div></>}
  {step>0&&<nav className="g-steps" aria-label="미션 진행">{places.map((p,i)=><a href={link(i+1)} aria-current={step===i+1?'step':undefined} key={p}><span>{[s.lanterns===3,s.goods===3,s.seal][i]?<Check size={18}/>:i+1}</span>{p}{ready&&!allowed(i+1,s)&&<LockKeyhole size={14}/>}</a>)}</nav>}
  {!ready?<p role="status">여정을 불러오고 있습니다…</p>:step===0?<section className="g-card g-intro"><h2>지금부터 여러분은<br/>신입 야행 보부상입니다!</h2><p>망루에서 첫 번째 징표를 찾고,<br/>한내시장을 지나 두 번째 징표를<br/>찾으세요.<br/>그리고 마지막 보부상을 만나<br/>황금 패랭이를 완성하세요!</p><a className="g-button" href={link(1)}>도전하기</a></section>:storageError?<section className="g-card"><h2>진행 기록 저장을 확인해주세요</h2><p>같은 휴대폰의 일반 브라우저에서 모든 QR을 열어주세요. 비공개 모드나 저장 차단 설정에서는 진행 기록을 이어갈 수 없습니다.</p><button onClick={()=>location.reload()}>다시 확인</button></section>:!allowed(step,s)?<section className="g-card g-locked"><LockKeyhole size={42}/><h2>아직 봉인된 미션입니다</h2><p>{s.lanterns<3?'망루에서 첫 번째 미션을 먼저 완료해주세요.':s.goods<3?'한내시장 쉼터에서 두 번째 미션을 먼저 완료해주세요.':'보부상 조형물에서 황금 인장을 찍어주세요.'}</p><a className="g-button" href={link(s.lanterns<3?1:s.goods<3?2:3)}>이전 미션으로 이동</a><p className="g-small">진행 기록은 같은 휴대폰·같은 브라우저에서 이어집니다.</p></section>:step===4?rewardReady?<section className="g-card g-reward-proof"><ShieldCheck size={62}/><span className="g-eyebrow">만족도 조사 참여 확인</span><h2>경품 교환<br/>완료 화면</h2><div className="g-proof-seal"><span>MISSION</span><strong>COMPLETE</strong><small>경품 증정 가능</small></div><p>이 화면을 현장 운영요원에게 보여주세요.<br/><strong>운영요원 확인 후 경품이 증정됩니다.</strong></p><time>{rewardTime}</time><p className="g-proof-warning">※ 경품 수령 전에는 이 화면을 닫지 마세요.</p></section>:<section className="g-card g-finish"><span className="g-eyebrow">세 개의 징표, 하나의 빛</span><img className="g-hat" src={hatImage} alt="갓끈과 보령시 시화 동백꽃, 황금 인장으로 완성한 황금 패랭이"/><h2>수석 야행 보부상으로<br/>임명합니다!</h2><p>보령의 시장길을 따라 모든 징표를 찾았습니다.<br/>보령시 시화 동백꽃으로 장식된 황금 패랭이와 함께 오늘의 빛나는 순간을 남겨보세요.</p><button onClick={()=>P(true)}><Camera size={20}/>황금패랭이 인증사진찍기</button><section className="g-survey-gate"><h3>경품 수령 전 필수</h3><p>만족도 조사를 제출한 뒤 이 페이지로 돌아와 완료 버튼을 눌러주세요.</p>{surveyLink}{config?.surveyUrl&&<><button className="secondary" disabled={!surveyOpened} onClick={confirmSurvey}><Check size={19}/>설문 제출을 완료했어요</button>{!surveyOpened&&<p className="g-small">설문 링크를 먼저 열어야 완료 버튼이 활성화됩니다.</p>}</>}<p className="g-survey-notice">완료 후 표시되는 경품 교환 화면을 현장에서 보여주셔야 경품을 받을 수 있습니다.</p></section></section>:<section className={'g-card '+(done?'g-clear':'')}><h2>{titles[step-1]}</h2>
  {step===1?<><p>망루의 세 불빛이 사라졌습니다. 휴대폰 플래시를 켜고 현장 등불의 반사 글자를 찾아, 등불마다 안내된 글자 수에 맞춰 순서대로 입력하세요.</p><div className="g-lanterns">{[0,1,2].map(i=><div className={s.lanterns>i?'lit':''} key={i}><Lamp size={62} strokeWidth={1.2}/><b>{s.lanterns>i?lanternAnswers[i]:`${i+1}번째`}</b></div>)}</div><p className="g-small">등불 점등 {s.lanterns}/3 · {clueHints[s.lanterns]??'세 등불을 모두 밝혔습니다.'}</p></>:step===2?<><p>현장 카드에서 보령 3미를 찾아, 아래 번호를 확인한 후 나온 순서대로 세 자리 암호를 입력하세요.</p><div className="g-tastes">{[0,1,2].map(i=><span className={s.goods>i?'found':''} key={i}><b>{s.goods>i?<><span className="g-taste-icon" aria-hidden="true">{['🍇','🐙','🦪'][i]}</span><span className="g-taste-name">{['포도','주꾸미','굴'][i]}</span></>:`${i+1}번째 맛`}</b>{s.goods<=i&&<small>단서를 찾아주세요</small>}</span>)}</div></>:<><div className="g-statue"><img src={awake||done?'/images/peddler-awake.gif':'/images/peddler-sleeping-golden.png'} alt={awake||done?'바구니를 열어 포도·굴·주꾸미를 담는 깨어난 보부상':'닫힌 바구니를 끌어안고 잠든 보부상'}/>{!awake&&!done&&<span>보부상이 닫힌 바구니를 안고 잠들어 있습니다</span>}</div><p>신입 야행 보부상이여…<br/>포목거리에서 발견한 황금빛 물건의 이름을 말해보게.</p>{!done&&<><button className="secondary" disabled={hint===3} onClick={()=>H(Math.min(3,hint+1))}>힌트 보기 {hint}/3</button>{hint>0&&<p className="g-small">{['황금빛으로 빛나고 있었습니다.','가지와 잎이 있습니다.','보령시의 상징물인 소나무의 모습을 하고 있습니다.'][hint-1]}</p>}</>}</>}
  {!done&&!awake&&<form onSubmit={submit}><label htmlFor="g-answer">{step===1?`${s.lanterns+1}번째 등불의 글자`:step===2?'세 자리 암호 또는 다음 맛의 숫자':'포목거리의 황금빛 물건'}</label><div className="g-input"><input id="g-answer" value={input} onChange={e=>I(e.target.value)} autoComplete="off" inputMode={step===2?'numeric':'text'} aria-describedby={step===1?'g-answer-hint':undefined} maxLength={step===3?20:step===2?3:s.lanterns===2?2:1} placeholder={step===3?'이름을 입력하세요':step===2?'세 자리 암호':s.lanterns===2?'두 글자를 입력하세요':'한 글자를 입력하세요'} required/><button type="submit">{step===1?'등불 밝히기':step===2?'암호 확인':'봉인 풀기'}</button></div>{step===1&&<p id="g-answer-hint" className="g-small">{s.lanterns===2?'두 글자 입력':'한 글자 입력'}</p>}</form>}
  <p className="g-feedback" role="status" aria-live="polite">{message}</p>{awake&&!done&&<button className="g-seal" onClick={()=>{if(save({...s,seal:true})){A(false);M('쾅! 대행수의 황금 인장이 찍혔습니다!');}}}><span className="g-seal-face"><Stamp size={42}/><b>大行首</b><small>황금 인장</small></span><strong>인장 찍기</strong></button>}
  {done&&<div className="g-success"><div className="g-earned"><span className="g-earned-image"><img src={prizeImages[step-1]} alt={`${prizes[step-1]} 획득 아이콘`}/></span><h3>{step===1?'「황금갓끈」 획득!':step===2?<>「황금 동백꽃 장식」<br/>획득!</>:'「황금 인장」 획득!'}</h3>{step===2&&<p className="g-small">보령시 시화 동백꽃을 황금 패랭이에 장식했습니다.</p>}</div>{step===2&&<p>포목거리를 지나며 황금빛 그림을 찾아 기억하세요. 마지막 QR은 보부상 <br/>조형물 옆에 있습니다.</p>}{step<3?<button onClick={()=>D(true)}>{step===1?'한내시장 쉼터로 이동하기':'포목거리 탐색 시작하기'}</button>:<a className="g-button" href={link(4)}>황금패랭이 완성하고<br/>임명장 받기</a>}</div>}</section>}
  <footer>진행 기록은 이 브라우저에 저장됩니다.<br/>다음 장소에서도 같은 브라우저로 QR을 열어주세요.<small>© 2026 JL PARTNER. All rights reserved.</small></footer>
  <JourneyMap open={map} onOpenChange={D}/>
  {photo&&s.seal&&<Photo onClose={()=>P(false)}/>}
  {ready&&new URLSearchParams(typeof location==='undefined'?'':location.search).get('test')==='1'&&<button className="g-reset" onClick={()=>{if(confirm('신규 황금 패랭이 진행 기록만 초기화할까요?')){if(save(fresh()))location.href=link(1);}}}>테스트 기록 초기화</button>}
 </main>;
}
function Photo({ onClose }: { onClose: () => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{id: number; clientX: number; clientY: number; x: number; y: number} | null>(null);
  const [source, Source] = useState('');
  const [x, X] = useState(50);
  const [y, Y] = useState(32);
  const [scale, Scale] = useState(80);
  const [error, setError] = useState('');
  const [sharing, Sharing] = useState(false);
  const [fallback, Fallback] = useState(false);
  const [prepared, Prepared] = useState<{key: string; url: string; file: File} | null>(null);
  const photoKey = JSON.stringify([source, x, y, scale]);
  const ready = Boolean(source && prepared?.key === photoKey);

  useEffect(() => () => { if (source) URL.revokeObjectURL(source); }, [source]);

  // Prepare the file before a tap so iOS sharing retains user activation.
  useEffect(() => {
    if (!source) return;
    let cancelled = false;
    let resultUrl = '';
    const timer = window.setTimeout(async () => {
      try {
        const load = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error('image-load-failed'));
          image.src = src;
          if (image.complete && image.naturalWidth) resolve(image);
        });
        const [base, hat] = await Promise.all([
          load(source), load(hatImage),
        ]);
        if (cancelled) return;
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1350;
        const context = canvas.getContext('2d');
        if (!context || !base.naturalWidth || !base.naturalHeight) throw new Error('invalid-photo');
        const ratio = Math.max(canvas.width / base.naturalWidth, canvas.height / base.naturalHeight);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(base, (1080 - base.naturalWidth * ratio) / 2,
          (1350 - base.naturalHeight * ratio) / 2, base.naturalWidth * ratio, base.naturalHeight * ratio);
        const hatWidth = scale * 10.8;
        const hatHeight = hatWidth * hat.naturalHeight / hat.naturalWidth;
        context.drawImage(hat, x * 10.8 - hatWidth / 2, y * 13.5 - hatHeight / 2, hatWidth, hatHeight);
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(value => value ? resolve(value) : reject(new Error('merge-failed')), 'image/jpeg', .94);
        });
        if (cancelled) return;
        resultUrl = URL.createObjectURL(blob);
        Prepared({key: photoKey, url: resultUrl, file: new File([blob], '황금패랭이_인증사진.jpg', {type: 'image/jpeg'})});
      } catch {
        if (!cancelled) setError('사진을 불러오지 못했습니다. 다른 사진을 선택해주세요.');
      }
    }, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [source, x, y, scale, photoKey]);

  async function exportPhoto(action: 'save' | 'share') {
    if (!ready || !prepared || sharing) return;
    setError('');
    Fallback(false);
    Sharing(true);
    try {
      if (navigator.share && navigator.canShare?.({files: [prepared.file]})) {
        await navigator.share({files: [prepared.file], title: '황금 패랭이 인증사진'});
      } else if (action === 'save') {
        const link = document.createElement('a');
        link.href = prepared.url;
        link.download = prepared.file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        Fallback(true);
        setError('저장이 안 되면 사진을 열어 길게 눌러 저장해주세요.');
      } else {
        Fallback(true);
        setError('이 브라우저에서는 공유를 지원하지 않습니다. 사진을 저장해 공유해주세요.');
      }
    } catch (cause) {
      if ((cause as Error).name !== 'AbortError') {
        Fallback(true);
        setError('사진을 열어 길게 눌러 저장해주세요.');
      }
    } finally {
      Sharing(false);
    }
  }

  return (
    <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
      {/* Override negative translate utilities directly; minification removes CSS-only resets. */}
      <DialogContent className="g-dialog g-camera translate-x-0 translate-y-0" showCloseButton={false}>
        <div className="g-camera-header">
          <DialogTitle>황금 패랭이 인증사진</DialogTitle>
          <DialogClose aria-label="인증사진 닫기"><CloseIcon size={16}/></DialogClose>
        </div>
        <DialogDescription>사진을 선택한 뒤 패랭이를 끌어 위치를 맞추세요.</DialogDescription>
        <label className="g-upload">
          <Camera size={20}/> 사진 촬영·앨범에서 선택
          <input type="file" accept="image/*" capture="environment" disabled={sharing} onChange={event => {
            const file = event.target.files?.[0];
            if (file) {
              Source(URL.createObjectURL(file));
              setError('');
              Fallback(false);
            }
            event.target.value = '';
          }}/>
        </label>
        <div className="g-camera-stage" ref={stage}>
          {source && <img className="g-photo-base" src={source} alt="선택한 사진"/>}
          <img draggable={false} className="g-photo-hat" src={hatImage}
            alt="이동 가능한 황금 패랭이"
            style={{left: `${x}%`, top: `${y}%`, width: `${scale}%`, transform: 'translate(-50%,-50%)'}}
            onPointerDown={event => {
              if (sharing || !event.isPrimary || event.button !== 0) return;
              event.preventDefault();
              drag.current = {id: event.pointerId, clientX: event.clientX, clientY: event.clientY, x, y};
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={event => {
              if (drag.current?.id !== event.pointerId || !event.currentTarget.hasPointerCapture(event.pointerId) || !stage.current) return;
              const rect = stage.current.getBoundingClientRect();
              X(Math.max(0, Math.min(100, drag.current.x + (event.clientX - drag.current.clientX) / rect.width * 100)));
              Y(Math.max(0, Math.min(100, drag.current.y + (event.clientY - drag.current.clientY) / rect.height * 100)));
            }}
            onPointerUp={event => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
              drag.current = null;
            }}
            onPointerCancel={() => { drag.current = null; }}
            onLostPointerCapture={() => { drag.current = null; }}/>
        </div>
        <fieldset className="g-hat-controls" disabled={sharing}>
          <label>
            <span>패랭이 크기 <strong>{scale}%</strong></span>
            <input className="g-range" type="range" min="20" max="160" step="1" value={scale}
              onChange={event => Scale(Number(event.target.value))}/>
          </label>
        </fieldset>
        <div className="g-camera-actions">
          <button disabled={!ready || sharing} onClick={() => exportPhoto('save')}>저장하기</button>
          <button className="secondary" disabled={!ready || sharing} onClick={() => exportPhoto('share')}>공유하기</button>
        </div>
        <p className="g-camera-status" role="status">{error || (source && !ready ? '사진 준비 중…' : '')}</p>
        {fallback && ready && <a className="g-button secondary" href={prepared!.url} target="_blank" rel="noopener noreferrer">사진 열기</a>}
        <p className="g-camera-survey-note">창을 닫고 만족도조사에 참여하셔야 미션이 완료됩니다.</p>
      </DialogContent>
    </Dialog>
  );
}
