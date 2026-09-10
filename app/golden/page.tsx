'use client';
import {useEffect,useRef,useState} from 'react';
import {Lamp,LockKeyhole,Check,MapPin,Stamp,Camera,ExternalLink,ShieldCheck} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {allowed,advance,fresh,key,normalize,type Journey} from './progress';
import './style.css';
import './enhancements.css';
import JourneyMap from './JourneyMap';
const places=['망루','한내시장 쉼터','보부상 조형물'];
const titles=['망루의 세 불빛을 밝혀라','보령 3미를 찾아라!','황금 봇짐의 보부상을 깨워라'];
const prizes=['갓끈','동백꽃 장식','황금 인장'];
const prizeImages=['/images/reward-gatstrap.png','/images/reward-camellia.png','/images/reward-golden-seal.png'];
export default function Golden(){
 const [s,S]=useState<Journey>(fresh());const [step,T]=useState(0);const [ready,R]=useState(false);const [input,I]=useState('');const [message,M]=useState('');const [awake,A]=useState(false);const [hint,H]=useState(0);const [map,D]=useState(false);const [photo,P]=useState(false);const [config,F]=useState<{surveyUrl:string;mission1Answers:string[];mission2Code:string;mission3Answers:string[];benefits:{shop:string;benefit:string}[]}|null>(null);const [configError,E]=useState(false);const [storageError,SE]=useState(false);const [surveyOpened,SO]=useState(false);const [rewardReady,RR]=useState(false);const [rewardTime,RT]=useState('');
 useEffect(()=>{document.title='황금 패랭이를 찾아라 | 2026 보령 꿀잼야행';const params=new URLSearchParams(location.search);const mission=params.get('mission');const n=mission===null?0:Number(mission);T([0,1,2,3,4].includes(n)?n:0);try{S(normalize(JSON.parse(localStorage.getItem(key)||'null')));}catch{SE(true);}R(true);const sync=()=>{try{S(normalize(JSON.parse(localStorage.getItem(key)||'null')));}catch{SE(true);}};window.addEventListener('storage',sync);fetch('/api/config',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(F).catch(()=>E(true));return()=>{window.removeEventListener('storage',sync);};},[]);
 const save=(next:Journey)=>{try{localStorage.setItem(key,JSON.stringify(next));S(next);M('');navigator.vibrate?.(100);return true;}catch{SE(true);M('진행 기록을 저장할 수 없습니다. 일반 브라우저에서 다시 열어주세요.');return false;}};
 const done=step===1?s.lanterns===3:step===2?s.goods===3:step===3?s.seal:false;
 function submit(e:React.FormEvent){e.preventDefault();if(!allowed(step,s))return;if(step===3){const accepted=(config?.mission3Answers?.length?config.mission3Answers:['소나무','황금소나무','황금송']).map(v=>v.replace(/\s/g,'').normalize('NFC'));if(accepted.includes(input.replace(/\s/g,'').normalize('NFC'))){A(true);M('그래, 바로 황금송이었네! 황금 인장을 눌러 마지막 징표를 완성하게.');}else M('아직 봉인이 풀리지 않았습니다. 포목거리의 황금빛 단서를 떠올려보세요.');}else{const next=advance(step,input,s,{mission1Answers:config?.mission1Answers,mission2Code:config?.mission2Code});if(next){save(next);M(step===1?'불빛이 깨어났습니다!':'보령 3미의 암호를 확인했습니다!');I('');}else M(step===1?'아직 깨어나지 않은 불빛입니다. 다음 등불의 글자를 확인해보세요.':'현장 보령 3미 카드의 숫자를 다시 확인하세요.');}}
 function confirmSurvey(){const now=new Date();RT(now.toLocaleString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}));RR(true);window.scrollTo({top:0,behavior:'smooth'});}
 const link=(n:number)=>`/golden/?mission=${n}`;
 return <main className="golden">
  <header><img src="/images/market-run-logo.png" alt="마켓런"/><span>2026 보령 꿀잼야행</span><button className="icon-btn" aria-label="여정 안내" onClick={()=>D(true)}><MapPin/></button></header>
  <div className="g-heading"><span className="g-eyebrow">밤길에 숨은 세 개의 징표</span><h1>황금 패랭이를 찾아라</h1></div>
  {step>0&&<nav className="g-steps" aria-label="미션 진행">{places.map((p,i)=><a href={link(i+1)} aria-current={step===i+1?'step':undefined} key={p}><span>{[s.lanterns===3,s.goods===3,s.seal][i]?<Check size={18}/>:i+1}</span>{p}{ready&&!allowed(i+1,s)&&<LockKeyhole size={14}/>}</a>)}</nav>}
  {!ready?<p role="status">여정을 불러오고 있습니다…</p>:step===0?<section className="g-card g-intro"><span className="g-eyebrow">새로운 여정의 시작</span><h2>지금부터 여러분은<br/>신입 야행 보부상입니다!</h2><p>망루에서 첫 번째 징표를 찾고,<br/>한내시장을 지나 두 번째 징표를 찾으세요.<br/>그리고 마지막 보부상을 만나<br/>황금 패랭이를 완성하세요!</p><a className="g-button" href={link(1)}>도전하기</a></section>:storageError?<section className="g-card"><h2>진행 기록 저장을 확인해주세요</h2><p>같은 휴대폰의 일반 브라우저에서 모든 QR을 열어주세요. 비공개 모드나 저장 차단 설정에서는 진행 기록을 이어갈 수 없습니다.</p><button onClick={()=>location.reload()}>다시 확인</button></section>:!allowed(step,s)?<section className="g-card g-locked"><LockKeyhole size={42}/><h2>아직 봉인된 미션입니다</h2><p>{s.lanterns<3?'망루에서 첫 번째 미션을 먼저 완료해주세요.':s.goods<3?'한내시장 쉼터에서 두 번째 미션을 먼저 완료해주세요.':'보부상 조형물에서 황금 인장을 찍어주세요.'}</p><a className="g-button" href={link(s.lanterns<3?1:s.goods<3?2:3)}>이전 미션으로 이동</a><p className="g-small">진행 기록은 같은 휴대폰·같은 브라우저에서 이어집니다.</p></section>:step===4?rewardReady?<section className="g-card g-reward-proof"><ShieldCheck size={62}/><span className="g-eyebrow">만족도 조사 참여 확인</span><h2>경품 교환<br/>완료 화면</h2><div className="g-proof-seal"><span>MISSION</span><strong>COMPLETE</strong><small>경품 증정 가능</small></div><p>이 화면을 현장 운영요원에게 보여주세요.<br/><strong>운영요원 확인 후 경품이 증정됩니다.</strong></p><time>{rewardTime}</time><p className="g-proof-warning">※ 경품 수령 전에는 이 화면을 닫지 마세요.</p></section>:<section className="g-card g-finish"><span className="g-eyebrow">세 개의 징표, 하나의 빛</span><img className="g-hat" src="/images/golden-paeraengi-camellia.png" alt="갓끈과 보령시 시화 동백꽃, 황금 인장으로 완성한 황금 패랭이"/><h2>수석 야행 보부상으로<br/>임명합니다!</h2><p>보령의 시장길을 따라 모든 징표를 찾았습니다.<br/>보령시 시화 동백꽃으로 장식된 황금 패랭이와 함께 오늘의 빛나는 순간을 남겨보세요.</p><div className="g-prizes">{prizes.map(p=><span key={p}>✓ {p}</span>)}</div><button onClick={()=>P(true)}><Camera size={20}/>황금 패랭이 인증사진</button><section className="g-survey-gate"><h3>경품 수령 전 필수</h3><p>만족도 조사를 제출한 뒤 이 페이지로 돌아와 완료 버튼을 눌러주세요.</p>{config?.surveyUrl?<><a className="g-button" href={config.surveyUrl} target="_blank" rel="noopener noreferrer" onClick={()=>SO(true)}><ExternalLink size={19}/>만족도 조사 새 창으로 열기</a><button className="secondary" disabled={!surveyOpened} onClick={confirmSurvey}><Check size={19}/>설문 제출을 완료했어요</button>{!surveyOpened&&<p className="g-small">설문 링크를 먼저 열어야 완료 버튼이 활성화됩니다.</p>}</>:<p className="g-small">{configError?'행사 안내를 불러오지 못했습니다. 새로고침하거나 운영 부스에 문의해주세요.':'네이버폼 링크 준비 중입니다. 운영 부스에 문의해주세요.'}</p>}<p className="g-survey-notice">완료 후 표시되는 경품 교환 화면을 현장에서 보여주셔야 경품을 받을 수 있습니다.</p></section><details><summary>상점별 할인·사은품 확인하기</summary>{config?.benefits.map((b,i)=><p key={i}><strong>{b.shop}</strong><br/>{b.benefit}</p>)}{!config&&<p>혜택 정보를 불러오지 못했습니다. 운영 부스에 문의해주세요.</p>}</details></section>:<section className={'g-card '+(done?'g-clear':'')}><h2>{titles[step-1]}</h2>
  {step===1?<><p>망루의 세 불빛이 사라졌습니다. 휴대폰 플래시를 켜고 현장 등불의 반사 글자를 찾아, 순서대로 한 글자씩 입력하세요.</p><div className="g-lanterns">{[0,1,2].map(i=><div className={s.lanterns>i?'lit':''} key={i}><Lamp size={62} strokeWidth={1.2}/><b>{s.lanterns>i?['패','랭','이'][i]:`${i+1}번째`}</b></div>)}</div><p className="g-small">등불 점등 {s.lanterns}/3 · 보행로에서 안전하게 찾아주세요.</p></>:step===2?<><p>현장 카드에서 보령 3미를 찾아, 아래 번호를 확인한 후 나온 순서대로 세 자리 암호를 입력하세요.</p><div className="g-tastes">{[0,1,2].map(i=><span className={s.goods>i?'found':''} key={i}><b>{s.goods>i?['🍇 포도','🐙 주꾸미','🦪 굴'][i]:`${i+1}번째 맛`}</b>{s.goods<=i&&<small>단서를 찾아주세요</small>}</span>)}</div></>:<><div className="g-statue"><img src={awake||done?'/images/peddler-awake.gif':'/images/peddler-sleeping-v2.png'} alt={awake||done?'바구니를 열어 포도·굴·주꾸미를 담는 깨어난 보부상':'닫힌 바구니를 끌어안고 잠든 보부상'}/><span>{awake||done?'보부상이 깨어나 보령 3미를 담고 있습니다':'보부상이 닫힌 바구니를 안고 잠들어 있습니다'}</span></div><p>신입 야행 보부상이여…<br/>포목거리에서 발견한 황금빛 물건의 이름을 말해보게.</p>{!done&&<><button className="secondary" disabled={hint===3} onClick={()=>H(Math.min(3,hint+1))}>힌트 보기 {hint}/3</button>{hint>0&&<p className="g-small">{['황금빛으로 빛나고 있었습니다.','가지와 잎이 있습니다.','보령시의 상징물인 소나무의 모습을 하고 있습니다.'][hint-1]}</p>}</>}</>}
  {!done&&!awake&&<form onSubmit={submit}><label htmlFor="g-answer">{step===1?`${s.lanterns+1}번째 등불의 글자`:step===2?'세 자리 암호 또는 다음 맛의 숫자':'포목거리의 황금빛 물건'}</label><div className="g-input"><input id="g-answer" value={input} onChange={e=>I(e.target.value)} autoComplete="off" inputMode={step===2?'numeric':'text'} maxLength={step===3?20:step===2?3:2} placeholder={step===3?'이름을 입력하세요':step===2?'세 자리 암호':'한 글자 입력'} required/><button type="submit">{step===1?'등불 밝히기':step===2?'암호 확인':'봉인 풀기'}</button></div></form>}
  <p className="g-feedback" role="status" aria-live="polite">{message}</p>{awake&&!done&&<button className="g-seal" onClick={()=>{if(save({...s,seal:true})){A(false);M('쾅! 대행수의 황금 인장이 찍혔습니다!');}}}><span className="g-seal-face"><Stamp size={42}/><b>大行首</b><small>황금 인장</small></span><strong>인장 찍기</strong></button>}
  {done&&<div className="g-success"><strong className="g-stamp">CLEAR</strong><div className="g-earned"><span className="g-earned-image"><img src={prizeImages[step-1]} alt={`${prizes[step-1]} 획득 아이콘`}/></span><small>MISSION {String(step).padStart(2,'0')} 징표 획득</small><h3>{step===1?'황금 「갓끈」 획득!':step===2?'황금 「동백꽃 장식」 획득!':'「황금 인장」 획득!'}</h3>{step===2&&<p className="g-small">보령시 시화 동백꽃을 황금 패랭이에 장식했습니다.</p>}</div>{step===2&&<p>포목거리를 지나며 황금빛 그림을 찾아 기억하세요. 마지막 QR은 보부상 조형물 옆에 있습니다.</p>}{step===3&&<p>황금 패랭이가 마침내 완전한 모습을 드러냈습니다.</p>}{step<3?<button onClick={()=>D(true)}>{step===1?'한내시장 쉼터로 이동하기':'포목거리 탐색 시작하기'}</button>:<a className="g-button" href={link(4)}>황금 패랭이 완성 · 인증사진</a>}</div>}</section>}
  <footer>진행 기록은 이 브라우저에 저장됩니다.<br/>다음 장소에서도 같은 브라우저로 QR을 열어주세요.<small>© 2026 JL PARTNER. All rights reserved.</small></footer>
  <JourneyMap open={map} onOpenChange={D}/>
  {photo&&s.seal&&<Photo onClose={()=>P(false)}/>}
  {ready&&new URLSearchParams(typeof location==='undefined'?'':location.search).get('test')==='1'&&<button className="g-reset" onClick={()=>{if(confirm('신규 황금 패랭이 진행 기록만 초기화할까요?')){if(save(fresh()))location.href=link(1);}}}>테스트 기록 초기화</button>}
 </main>;
}
function Photo({ onClose }: { onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const active = useRef(true);

  const [source, Source] = useState("");
  const [live, Live] = useState(false);
  const [facing, Facing] = useState<"user" | "environment">("user");
  const [busy, Busy] = useState(false);
  const [error, setError] = useState("");

  const [x, X] = useState(50);
  const [y, Y] = useState(24);
  const [scale, Scale] = useState(55);
  const [angle, Angle] = useState(0);

  const [result, Result] = useState("");
  const [blob, BlobState] = useState<Blob | null>(null);

  const stop = () => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  };

  useEffect(() => {
    active.current = true;

    return () => {
      active.current = false;
      stop();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (source) URL.revokeObjectURL(source);
    };
  }, [source]);

  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result);
    };
  }, [result]);

  const choose = (file?: File) => {
    if (!file) return;

    stop();
    Live(false);
    Source(URL.createObjectURL(file));
    Result("");
    BlobState(null);
    setError(
      "사진을 불러왔습니다. 패랭이를 움직이고 크기와 기울기를 조절해주세요."
    );
  };

  async function start(next: "user" | "environment" = facing) {
    Busy(true);
    setError("");
    stop();
    Live(false);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("camera-not-supported");
      }

      const media = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: next },
          width: { ideal: 1080 },
          height: { ideal: 1350 },
        },
        audio: false,
      });

      if (!active.current) {
        media.getTracks().forEach((track) => track.stop());
        return;
      }

      stream.current = media;
      Facing(next);
      Source("");
      Result("");

      if (video.current) {
        video.current.srcObject = media;
        video.current.setAttribute("playsinline", "true");
        await video.current.play();
      }

      Live(true);
    } catch {
      stop();
      setError(
        "실시간 카메라를 열 수 없습니다. 사진 촬영·앨범에서 선택을 이용해주세요."
      );
    } finally {
      Busy(false);
    }
  }

  async function load(src: string) {
    const image = new Image();
    image.src = src;
    await image.decode();
    return image;
  }

  async function freeze() {
    if (!video.current || !live) return;

    Busy(true);
    setError("");

    try {
      const currentVideo = video.current;

      if (!currentVideo.videoWidth || !currentVideo.videoHeight) {
        throw new Error("camera-not-ready");
      }

      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;

      const context = canvas.getContext("2d");
      if (!context) throw new Error("canvas-not-supported");

      const ratio = Math.max(
        1080 / currentVideo.videoWidth,
        1350 / currentVideo.videoHeight
      );

      context.save();

      if (facing === "user") {
        context.translate(1080, 0);
        context.scale(-1, 1);
      }

      context.drawImage(
        currentVideo,
        (1080 - currentVideo.videoWidth * ratio) / 2,
        (1350 - currentVideo.videoHeight * ratio) / 2,
        currentVideo.videoWidth * ratio,
        currentVideo.videoHeight * ratio
      );

      context.restore();

      const photoBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (value) =>
            value ? resolve(value) : reject(new Error("capture-failed")),
          "image/jpeg",
          0.94
        );
      });

      stop();
      Live(false);
      Source(URL.createObjectURL(photoBlob));

      setError(
        "사진을 촬영했습니다. 정지된 사진에서 패랭이 위치와 크기를 조절해주세요."
      );
    } catch {
      setError("사진 촬영에 실패했습니다. 카메라를 다시 켜주세요.");
    } finally {
      Busy(false);
    }
  }

  async function capture() {
    Busy(true);
    setError("");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;

      const context = canvas.getContext("2d");
      if (!context) throw new Error("canvas-not-supported");

      const base = source ? await load(source) : video.current;
      if (!base) throw new Error("photo-not-found");

      const width = source
        ? (base as HTMLImageElement).naturalWidth
        : (base as HTMLVideoElement).videoWidth;

      const height = source
        ? (base as HTMLImageElement).naturalHeight
        : (base as HTMLVideoElement).videoHeight;

      if (!width || !height) throw new Error("invalid-photo");

      const ratio = Math.max(1080 / width, 1350 / height);

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      context.save();

      if (!source && facing === "user") {
        context.translate(1080, 0);
        context.scale(-1, 1);
      }

      context.drawImage(
        base,
        (1080 - width * ratio) / 2,
        (1350 - height * ratio) / 2,
        width * ratio,
        height * ratio
      );

      context.restore();

      const hat = await load("/images/golden-paeraengi-camellia.png");

      context.save();
      context.translate(x * 10.8, y * 13.5);
      context.rotate((angle * Math.PI) / 180);

      const hatWidth = scale * 10.8;
      const hatHeight = (hatWidth * hat.height) / hat.width;

      context.drawImage(
        hat,
        -hatWidth / 2,
        -hatHeight / 2,
        hatWidth,
        hatHeight
      );

      context.restore();

      context.fillStyle = "rgba(14,25,39,.85)";
      context.fillRect(0, 1190, 1080, 160);

      context.strokeStyle = "#efc769";
      context.lineWidth = 8;
      context.strokeRect(20, 20, 1040, 1310);

      context.fillStyle = "#f5d58a";
      context.textAlign = "center";
      context.font = "bold 44px sans-serif";
      context.fillText("수석 야행 보부상 임명", 540, 1253);

      context.font = "30px sans-serif";
      context.fillText("2026 보령 꿀잼야행 · 마켓런", 540, 1300);

      const completedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (value) =>
            value ? resolve(value) : reject(new Error("merge-failed")),
          "image/jpeg",
          0.94
        );
      });

      BlobState(completedBlob);
      Result(URL.createObjectURL(completedBlob));

      stop();
      Live(false);
      setError("");
    } catch {
      setError(
        "사진 합성에 실패했습니다. 사진을 다시 촬영하거나 선택해주세요."
      );
    } finally {
      Busy(false);
    }
  }

  async function share() {
    if (!blob) return;

    const file = new File(
      [blob],
      "황금패랭이_인증사진.jpg",
      { type: "image/jpeg" }
    );

    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "수석 야행 보부상",
        });

        setError(
          "공유 메뉴에서 ‘이미지 저장’을 선택하면 사진 앱에 저장됩니다."
        );
      } else {
        window.open(result, "_blank");
        setError("새로 열린 완성 사진을 길게 눌러 저장해주세요.");
      }
    } catch (shareError) {
      if ((shareError as Error).name !== "AbortError") {
        setError("사진만 크게 연 뒤 길게 눌러 저장해주세요.");
      }
    }
  }

  const hasBase = Boolean(source || live);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          stop();
          onClose();
        }
      }}
    >
      <DialogContent className="g-dialog g-camera">
        <DialogTitle>황금 패랭이 인증사진</DialogTitle>

        <DialogDescription>
          셀카를 촬영한 뒤 정지된 사진에서 패랭이 위치를 조절하세요.
          사진은 서버로 전송되지 않습니다.
        </DialogDescription>

        {!result && (
          <div className="g-capture-options">
            <button
              type="button"
              className="g-upload g-upload-primary"
              disabled={busy}
              onClick={() => start("user")}
            >
              <Camera size={20} />
              {busy ? "카메라 연결 중…" : "셀카 카메라 켜기"}
            </button>

            <label className="g-upload">
              사진 촬영·앨범에서 선택
              <input
                type="file"
                accept="image/*"
                onChange={(event) => choose(event.target.files?.[0])}
              />
            </label>
          </div>
        )}

        <div className="g-camera-stage" ref={stage}>
          <video
            ref={video}
            muted
            playsInline
            style={{
              display: live && !result ? "block" : "none",
              transform: facing === "user" ? "scaleX(-1)" : "none",
            }}
          />

          {source && !result && (
            <img
              className="g-photo-base"
              src={source}
              alt="선택하거나 촬영한 사진"
            />
          )}

          {result ? (
            <img
              className="g-photo-base"
              src={result}
              alt="완성한 인증사진"
            />
          ) : hasBase ? (
            <>
              <img
                draggable={false}
                className="g-photo-hat"
                src="/images/golden-paeraengi-camellia.png"
                alt="이동 가능한 황금 패랭이"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${scale}%`,
                  transform: `translate(-50%,-50%) rotate(${angle}deg)`,
                }}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (
                    event.currentTarget.hasPointerCapture(event.pointerId) &&
                    stage.current
                  ) {
                    const rect = stage.current.getBoundingClientRect();

                    X(
                      Math.max(
                        0,
                        Math.min(
                          100,
                          ((event.clientX - rect.left) / rect.width) * 100
                        )
                      )
                    );

                    Y(
                      Math.max(
                        0,
                        Math.min(
                          100,
                          ((event.clientY - rect.top) / rect.height) * 100
                        )
                      )
                    );
                  }
                }}
              />

              <span className="g-photo-caption">
                수석 야행 보부상 임명
                <br />
                <small>2026 보령 꿀잼야행 · 마켓런</small>
              </span>
            </>
          ) : (
            <div className="g-camera-placeholder">
              <img
                className="g-placeholder-hat"
                src="/images/golden-paeraengi-camellia.png"
                alt="황금 패랭이"
              />

              <Camera size={36} />
              <strong>셀카 카메라를 켜주세요</strong>
              <small>
                촬영 후 정지된 사진에서 패랭이를 맞출 수 있습니다.
              </small>
            </div>
          )}
        </div>

        <p className="g-camera-status" role="status">
          {error}
        </p>

        {!result ? (
          <>
            <div className="g-camera-actions">
              {live && (
                <>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={freeze}
                  >
                    지금 모습 촬영하기
                  </button>

                  <button
                    type="button"
                    className="secondary"
                    disabled={busy}
                    onClick={() =>
                      start(facing === "user" ? "environment" : "user")
                    }
                  >
                    전·후면 전환
                  </button>
                </>
              )}

              {source && !live && (
                <button
                  type="button"
                  className="secondary"
                  disabled={busy}
                  onClick={() => start("user")}
                >
                  셀카 다시 촬영하기
                </button>
              )}
            </div>

            {source && !live && (
              <div className="g-hat-controls">
                <label>
                  <span>
                    패랭이 크기
                    <strong>{scale}%</strong>
                  </span>

                  <input
                    className="g-range"
                    type="range"
                    min="20"
                    max="100"
                    step="1"
                    value={scale}
                    onChange={(event) =>
                      Scale(Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  <span>
                    패랭이 기울기
                    <strong>{angle}°</strong>
                  </span>

                  <input
                    className="g-range"
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={angle}
                    onChange={(event) =>
                      Angle(Number(event.target.value))
                    }
                  />
                </label>

                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    X(50);
                    Y(25);
                    Scale(55);
                    Angle(0);
                  }}
                >
                  패랭이 위치 초기화
                </button>
              </div>
            )}

            {source && !live && (
              <button disabled={busy} onClick={capture}>
                {busy
                  ? "사진 만드는 중…"
                  : "패랭이 위치 확정 · 완성하기"}
              </button>
            )}
          </>
        ) : (
          <>
            <button onClick={share}>
              공유 메뉴로 사진 저장하기
            </button>

            <a
              className="g-button secondary"
              href={result}
              target="_blank"
              rel="noopener noreferrer"
            >
              완성 사진만 크게 열기
            </a>

            <p className="g-small">
              아이폰 공유 메뉴에서 ‘이미지 저장’을 선택하세요.
              인앱 브라우저에서 저장이 안 되면 사진을 크게 연 뒤
              길게 눌러 저장해주세요.
            </p>

            <button
              className="secondary"
              onClick={() => {
                Result("");
                BlobState(null);
                setError("");
              }}
            >
              다시 만들기
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
 const video=useRef<HTMLVideoElement>(null);const stream=useRef<MediaStream|null>(null);const stage=useRef<HTMLDivElement>(null);const [source,Source]=useState('');const [live,Live]=useState(false);const [facing,Facing]=useState<'user'|'environment'>('user');const [busy,Busy]=useState(false);const [error,setError]=useState('');const [x,X]=useState(50);const [y,Y]=useState(24);const [scale,Scale]=useState(55);const [angle,Angle]=useState(0);const [result,Result]=useState('');const [blob,BlobState]=useState<Blob|null>(null);const active=useRef(true);
 const stop=()=>{stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;};
 useEffect(()=>{active.current=true;return()=>{active.current=false;stop();};},[]);
 useEffect(()=>()=>{if(source)URL.revokeObjectURL(source);},[source]);useEffect(()=>()=>{if(result)URL.revokeObjectURL(result);},[result]);
 const choose=(file?:File)=>{if(!file)return;stop();Live(false);Source(URL.createObjectURL(file));Result('');BlobState(null);setError('사진을 불러왔습니다. 패랭이 위치를 맞춰주세요.');};
 async function start(next=facing){Busy(true);setError('');stop();Live(false);try{if(!navigator.mediaDevices?.getUserMedia)throw Error();const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:next},width:{ideal:1080},height:{ideal:1350}},audio:false});if(!active.current){media.getTracks().forEach(t=>t.stop());return;}stream.current=media;Facing(next);Source('');Result('');if(video.current){video.current.srcObject=media;video.current.setAttribute('playsinline','true');await video.current.play();}Live(true);}catch{stop();setError('실시간 카메라를 열 수 없습니다. 위의 “휴대폰 카메라로 촬영”을 이용해주세요.');}finally{Busy(false);}}
 async function load(src:string){const im=new Image();im.src=src;await im.decode();return im;}
 async function capture(){Busy(true);setError('');try{const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');if(!ctx)throw Error();const base=source?await load(source):video.current;if(!base)throw Error();const w=source?(base as HTMLImageElement).naturalWidth:(base as HTMLVideoElement).videoWidth;const h=source?(base as HTMLImageElement).naturalHeight:(base as HTMLVideoElement).videoHeight;if(!w||!h)throw Error();const ratio=Math.max(1080/w,1350/h);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.save();if(!source&&facing==='user'){ctx.translate(1080,0);ctx.scale(-1,1);}ctx.drawImage(base,(1080-w*ratio)/2,(1350-h*ratio)/2,w*ratio,h*ratio);ctx.restore();const hat=await load('/images/golden-paeraengi-camellia.png');ctx.save();ctx.translate(x*10.8,y*13.5);ctx.rotate(angle*Math.PI/180);const width=scale*10.8;ctx.drawImage(hat,-width/2,-width*hat.height/hat.width/2,width,width*hat.height/hat.width);ctx.restore();ctx.fillStyle='rgba(14,25,39,.85)';ctx.fillRect(0,1190,1080,160);ctx.strokeStyle='#efc769';ctx.lineWidth=8;ctx.strokeRect(20,20,1040,1310);ctx.fillStyle='#f5d58a';ctx.textAlign='center';ctx.font='bold 44px sans-serif';ctx.fillText('수석 야행 보부상 임명',540,1253);ctx.font='30px sans-serif';ctx.fillText('2026 보령 꿀잼야행 · 마켓런',540,1300);const b=await new Promise<Blob>((res,rej)=>canvas.toBlob(value=>value?res(value):rej(Error()),'image/jpeg',.94));BlobState(b);Result(URL.createObjectURL(b));stop();Live(false);}catch{setError('사진 합성에 실패했습니다. 사진을 다시 촬영하거나 선택해주세요.');}finally{Busy(false);}}
 async function share(){if(!blob)return;const file=new File([blob],'황금패랭이_인증사진.jpg',{type:'image/jpeg'});try{if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:'수석 야행 보부상'});else{const a=document.createElement('a');a.href=result;a.download=file.name;a.click();setError('저장이 시작되지 않으면 완성 사진을 길게 눌러 저장해주세요.');}}catch(e){if((e as Error).name!=='AbortError')setError('완성 사진을 길게 눌러 저장해주세요.');}}
 const hasBase=Boolean(source||live);
      </DialogContent>
    </Dialog>
  );
} 