'use client';
import { useRef, useState } from 'react';
import { Minus, Plus, RotateCcw, MapPin, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
const stops = [
 { name:'망루', task:'미션 1 · 세 불빛 밝히기', detail:'대천1동 행정복지센터 인근', x:1411,y:151 },
 { name:'한내시장 쉼터', task:'미션 2 · 보령 3미를 찾아라!', detail:'라디오방송국 옆 쉼터',x:971,y:808 },
 { name:'포목거리',task:'탐색 구간 · 별도 QR 없음',detail:'이동하며 황금빛 단서를 찾아 기억하세요.',x:515,y:500 },
 { name:'보부상 조형물',task:'미션 3 · 황금 인장 획득',detail:'마실카페 앞 · 보령시 중앙시장2길 9',x:320,y:385 },
];
export default function JourneyMap({open,onOpenChange}:{open:boolean;onOpenChange:(v:boolean)=>void}){
 const [zoom,Z]=useState(1);const [selected,S]=useState<number|null>(null);const view=useRef<HTMLDivElement>(null);const drag=useRef<{x:number;y:number;left:number;top:number}|null>(null);
 function focus(i:number){S(i);Z(2.5);requestAnimationFrame(()=>requestAnimationFrame(()=>{const v=view.current;if(!v)return;v.scrollTo({left:(stops[i].x-180)/1350*v.scrollWidth-v.clientWidth/2,top:(stops[i].y-65)/850*v.scrollHeight-v.clientHeight/2,behavior:'smooth'});}));}
 function resize(n:number){const v=view.current;const rx=v?(v.scrollLeft+v.clientWidth/2)/v.scrollWidth:.5;const ry=v?(v.scrollTop+v.clientHeight/2)/v.scrollHeight:.5;Z(n);requestAnimationFrame(()=>{if(v)v.scrollTo({left:rx*v.scrollWidth-v.clientWidth/2,top:ry*v.scrollHeight-v.clientHeight/2});});}
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="g-dialog g-route-dialog" showCloseButton={false}>
 <div className="g-route-header"><DialogTitle>황금 패랭이 미션 지도</DialogTitle><DialogClose aria-label="지도 닫기"><X size={20}/></DialogClose></div>
 <div className="g-route-body"><div className="g-map-frame">
 <div className="g-map-scroll" ref={view} tabIndex={0} aria-label="확대 가능한 이동 지도. 확대 후 손가락으로 이동하세요." onPointerDown={e=>{if(e.pointerType==='mouse'){e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,left:e.currentTarget.scrollLeft,top:e.currentTarget.scrollTop};}}} onPointerMove={e=>{if(drag.current){e.currentTarget.scrollLeft=drag.current.left-(e.clientX-drag.current.x);e.currentTarget.scrollTop=drag.current.top-(e.clientY-drag.current.y);}}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>
 <div style={{width:`${zoom*100}%`,minWidth:'100%'}} className="g-map-art"><svg viewBox="180 65 1350 850" role="img" aria-label="1번 망루에서 2번 한내시장 쉼터를 거쳐 3번 포목거리와 4번 보부상 조형물로 이동하는 경로"><defs><marker id="gold-route-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#086486"/></marker></defs><image href="/images/market-run-map.png" x="0" y="0" width="2048" height="1032"/>
 {/* SVG paints in document order: routes, numbered markers, then opaque place labels. */}
 <g className="g-map-routes" fill="none" stroke="#086486" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" pointerEvents="none">
  <path d="M1380 172 L1160 635 L1040 580 L968 790" markerEnd="url(#gold-route-arrow)"/>
  <path d="M950 775 L690 654 L720 548" markerEnd="url(#gold-route-arrow)"/>
  <path d="M700 542 L344 407" markerEnd="url(#gold-route-arrow)"/>
 </g>
 {stops.map((p,i)=><g key={p.name}><circle cx={p.x} cy={p.y} r={selected===i?37:31} fill="#050505"/><text x={p.x} y={p.y+11} textAnchor="middle" fontSize="32" fontWeight="800" fill="white">{i+1}</text></g>)}
 <text x="506" y="505" transform="rotate(12 506 505)" textAnchor="middle" fontFamily="sans-serif" fontSize="27" fontWeight="500" fill="#111">포목거리</text></svg></div></div>
 <div className="g-map-controls"><span aria-live="polite">{Math.round(zoom*100)}%</span><div><button aria-label="지도 축소" disabled={zoom<=1} onClick={()=>resize(Math.max(1,zoom-.5))}><Minus size={20}/></button><button aria-label="지도 확대" disabled={zoom>=4} onClick={()=>resize(Math.min(4,zoom+.5))}><Plus size={20}/></button><button onClick={()=>{Z(1);S(null);view.current?.scrollTo(0,0);}}><RotateCcw size={17}/>전체</button></div></div></div>
 <DialogDescription className="g-map-help">＋로 확대하고 손가락으로 밀어보세요. 아래 장소를 누르면 해당 위치가 확대됩니다.</DialogDescription>
 <ol className="g-route-stops">{stops.map((p,i)=><li key={p.name}><button onClick={()=>focus(i)} aria-pressed={selected===i}><span className={'g-stop-number '+(i===2?'explore':'')}>{i+1}</span><span><strong>{p.name}</strong><b>{p.task}</b><small>{p.detail}</small></span><MapPin size={19}/></button></li>)}</ol>
 </div></DialogContent></Dialog>;
}
