'use client';
import { useRef, useState } from 'react';
import { Minus, Plus, RotateCcw, MapPin, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
const stops = [
 { name:'망루', task:'미션 1 · 세 불빛 밝히기', detail:'대천1동 행정복지센터 인근', x:.862,y:.175 },
 { name:'한내시장 쉼터', task:'미션 2 · 보령 3미를 찾아라!', detail:'라디오방송국 옆 쉼터',x:.559,y:.808 },
 { name:'포목거리',task:'탐색 구간 · 별도 QR 없음',detail:'이동하며 황금빛 단서를 찾아 기억하세요.',x:.188,y:.536 },
 { name:'보부상 조형물',task:'미션 3 · 황금 인장 획득',detail:'마실카페 앞 · 보령시 중앙시장2길 9',x:.075,y:.440 },
];
export default function JourneyMap({open,onOpenChange}:{open:boolean;onOpenChange:(v:boolean)=>void}){
 const [zoom,Z]=useState(1);const [selected,S]=useState<number|null>(null);const view=useRef<HTMLDivElement>(null);const drag=useRef<{x:number;y:number;left:number;top:number}|null>(null);
 function focus(i:number){S(i);Z(2.5);requestAnimationFrame(()=>requestAnimationFrame(()=>{const v=view.current;if(!v)return;v.scrollTo({left:stops[i].x*v.scrollWidth-v.clientWidth/2,top:stops[i].y*v.scrollHeight-v.clientHeight/2,behavior:'smooth'});}));}
 function resize(n:number){const v=view.current;const rx=v?(v.scrollLeft+v.clientWidth/2)/v.scrollWidth:.5;const ry=v?(v.scrollTop+v.clientHeight/2)/v.scrollHeight:.5;Z(n);requestAnimationFrame(()=>{if(v)v.scrollTo({left:rx*v.scrollWidth-v.clientWidth/2,top:ry*v.scrollHeight-v.clientHeight/2});});}
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="g-dialog g-route-dialog" showCloseButton={false}>
 <div className="g-route-header"><DialogTitle>황금 패랭이 미션 지도</DialogTitle><DialogClose aria-label="지도 닫기"><X size={20}/></DialogClose></div>
 <div className="g-route-body"><div className="g-map-frame">
 <div className="g-map-scroll" ref={view} tabIndex={0} aria-label="확대 가능한 이동 지도. 확대 후 손가락으로 이동하세요." onPointerDown={e=>{if(e.pointerType==='mouse'){e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,left:e.currentTarget.scrollLeft,top:e.currentTarget.scrollTop};}}} onPointerMove={e=>{if(drag.current){e.currentTarget.scrollLeft=drag.current.left-(e.clientX-drag.current.x);e.currentTarget.scrollTop=drag.current.top-(e.clientY-drag.current.y);}}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>
 <div style={{width:`${zoom*100}%`,minWidth:'100%'}} className="g-map-art"><img src="/images/golden-route-map.png" width={2738} height={1984} draggable={false} alt="1번 망루에서 2번 한내시장 쉼터를 거쳐 3번 포목거리와 4번 보부상 조형물로 이동하는 경로"/>{stops.map(p=><span className="g-map-point" style={{left:`${p.x*100}%`,top:`${p.y*100}%`}} aria-hidden="true" key={p.name}><MapPin size={30}/></span>)}</div></div>
 <div className="g-map-controls"><span aria-live="polite">{Math.round(zoom*100)}%</span><div><button aria-label="지도 축소" disabled={zoom<=1} onClick={()=>resize(Math.max(1,zoom-.5))}><Minus size={20}/></button><button aria-label="지도 확대" disabled={zoom>=4} onClick={()=>resize(Math.min(4,zoom+.5))}><Plus size={20}/></button><button onClick={()=>{Z(1);S(null);view.current?.scrollTo(0,0);}}><RotateCcw size={17}/>전체</button></div></div></div>
 <DialogDescription className="g-map-help">＋로 확대하고 손가락으로 밀어보세요. 아래 장소를 누르면 해당 위치가 확대됩니다.</DialogDescription>
 <ol className="g-route-stops">{stops.map((p,i)=><li key={p.name}><button onClick={()=>focus(i)} aria-pressed={selected===i}><span className={'g-stop-number '+(i===2?'explore':'')}>{i+1}</span><span><strong>{p.name}</strong><b>{p.task}</b><small>{p.detail}</small></span><MapPin size={19}/></button></li>)}</ol>
 </div></DialogContent></Dialog>;
}
