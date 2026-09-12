export type Journey = { lanterns:number; goods:number; seal:boolean };
export const key='boryeong-golden-2026-v3';
export const qrMissions:Record<string,1|2|3>={
  'lantern-Q7m4K9v2R6':1,
  'three-tastes-N8c5W2p7H4':2,
  'golden-seal-T3x9B6k2M7':3,
};
export const fresh=():Journey=>({lanterns:0,goods:0,seal:false});
export function normalize(v:Partial<Journey>|null):Journey { const lanterns=Number.isInteger(v?.lanterns)?Math.max(0,Math.min(3,v!.lanterns!)):0; const goods=lanterns===3&&Number.isInteger(v?.goods)?Math.max(0,Math.min(3,v!.goods!)):0;return {lanterns,goods,seal:goods===3&&v?.seal===true}; }
export function allowed(step:number,s:Journey){return step===1||(step===2&&s.lanterns===3)||(step>=3&&s.lanterns===3&&s.goods===3&&(step===3||s.seal));}
export const lanternAnswers = ['만', '세', '보령'] as const;
export function advance(step:number,input:string,s:Journey,answers?:{mission1Answers?:string[];mission2Code?:string}):Journey|null {
  void answers;
  if (!allowed(step,s)) return null;
  // This journey uses fixed clues; legacy administrator answers must not unlock it.
  if (step === 1) {
    const answer = input.trim().normalize('NFC');
    return s.lanterns < 3 && answer === lanternAnswers[s.lanterns]
      ? {...s, lanterns:s.lanterns+1} : null;
  }
  const answer = input.replace(/\s/g,'').normalize('NFC');
  const mission2 = '125';
  if(step===2&&s.goods<3&&answer===mission2)return {...s,goods:3};
  if(step===2&&s.goods<3&&answer===mission2[s.goods])return {...s,goods:s.goods+1};
  return null;
}
