export type Journey = { lanterns:number; goods:number; seal:boolean };
export const key='boryeong-golden-2026-v2';
export const fresh=():Journey=>({lanterns:0,goods:0,seal:false});
export function normalize(v:Partial<Journey>|null):Journey { const lanterns=Number.isInteger(v?.lanterns)?Math.max(0,Math.min(3,v!.lanterns!)):0; const goods=lanterns===3&&Number.isInteger(v?.goods)?Math.max(0,Math.min(3,v!.goods!)):0;return {lanterns,goods,seal:goods===3&&v?.seal===true}; }
export function allowed(step:number,s:Journey){return step===1||(step===2&&s.lanterns===3)||(step>=3&&s.lanterns===3&&s.goods===3&&(step===3||s.seal));}
export function advance(step:number,input:string,s:Journey):Journey|null {if(!allowed(step,s))return null;const answer=input.replace(/\s/g,'').normalize('NFC');if(step===1&&s.lanterns<3&&answer===['패','랭','이'][s.lanterns])return {...s,lanterns:s.lanterns+1};if(step===2&&s.goods<3&&answer==='251')return {...s,goods:3};if(step===2&&s.goods<3&&answer===['2','5','1'][s.goods])return {...s,goods:s.goods+1};return null;}
